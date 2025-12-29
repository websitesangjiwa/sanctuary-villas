import { GuestyTokenResponse, GuestyListing, GuestyListingsResponse, GuestyQuote, GuestyQuoteRequest } from '@/types/guesty';
import { Redis } from '@upstash/redis';

// Configuration
const GUESTY_CONFIG = {
  tokenUrl: 'https://booking.guesty.com/oauth2/token',
  apiUrl: 'https://booking.guesty.com/api',
  bookingUrl: 'https://sanctuaryvillas.guestybookings.com',
  cache: {
    // Token refresh buffer: 5 minutes before expiry (per Guesty docs)
    tokenRefreshBuffer: 300,
    listingsRevalidate: 60, // 1 minute
    listingRevalidate: 300, // 5 minutes
  },
} as const;

// Cached token structure (following Guesty official example)
interface CachedToken {
  access_token: string;
  expires_at: number; // timestamp in ms when token should be refreshed
}

// Redis client for token caching (persists across serverless invocations)
// Uses Vercel KV environment variable names
// Returns null if env vars are not configured (fallback to direct API calls)
function createRedisClient(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    console.warn('Redis env vars not configured (KV_REST_API_URL, KV_REST_API_TOKEN). Token caching disabled.');
    return null;
  }

  return new Redis({ url, token });
}

const redis = createRedisClient();
const TOKEN_KEY = 'guesty_token';
const TOKEN_LOCK_KEY = 'guesty_token_lock';
const LOCK_TTL = 10; // Lock expires in 10 seconds

// Helper for delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Token management with retry logic for rate limiting
// Returns both access_token and expires_in (per Guesty official example)
async function fetchGuestyTokenRaw(retries = 3): Promise<{ access_token: string; expires_in: number }> {
  const clientId = process.env.GUESTY_CLIENT_ID;
  const clientSecret = process.env.GUESTY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      `Missing Guesty API credentials. GUESTY_CLIENT_ID: ${clientId ? 'set' : 'NOT SET'}, GUESTY_CLIENT_SECRET: ${clientSecret ? 'set' : 'NOT SET'}`
    );
  }

  for (let attempt = 0; attempt < retries; attempt++) {
    const response = await fetch(GUESTY_CONFIG.tokenUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'booking_engine:api',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (response.ok) {
      const data: GuestyTokenResponse = await response.json();
      // Guesty returns expires_in in seconds (86400 = 24 hours)
      return {
        access_token: data.access_token,
        expires_in: data.expires_in || 86400 // Default to 24 hours if not provided
      };
    }

    // Handle rate limiting with exponential backoff
    if (response.status === 429 && attempt < retries - 1) {
      const waitTime = Math.pow(2, attempt + 1) * 1000; // 2s, 4s, 8s
      console.log(`Rate limited (429), waiting ${waitTime}ms before retry ${attempt + 1}/${retries - 1}`);
      await delay(waitTime);
      continue;
    }

    const errorText = await response.text();
    throw new Error(`Failed to get Guesty token: ${response.status} - ${errorText}`);
  }

  throw new Error('Failed to get Guesty token after all retries');
}

// Cached token getter with Redis storage and distributed lock
// Following Guesty official example: store expires_at and refresh 5 min before expiry
export async function getGuestyToken(): Promise<string> {
  if (redis) {
    try {
      // Try to get cached token
      const cached = await redis.get<CachedToken>(TOKEN_KEY);

      // Check if token exists AND is not expired (per Guesty official example)
      if (cached && Date.now() < cached.expires_at) {
        return cached.access_token;
      }
    } catch (error) {
      console.error('Redis get error:', error);
    }

    // Token missing or expired - try to acquire lock before fetching
    try {
      const lockAcquired = await redis.set(TOKEN_LOCK_KEY, '1', {
        ex: LOCK_TTL,
        nx: true // Only set if lock doesn't exist
      });

      if (lockAcquired === 'OK') {
        // We got the lock - fetch token from Guesty
        console.log('Lock acquired, fetching new token from Guesty API...');
        const { access_token, expires_in } = await fetchGuestyTokenRaw();

        // Store with expiration timestamp (5 min before actual expiry per Guesty docs)
        const tokenData: CachedToken = {
          access_token,
          expires_at: Date.now() + (expires_in - GUESTY_CONFIG.cache.tokenRefreshBuffer) * 1000
        };

        await redis.set(TOKEN_KEY, tokenData);
        console.log('Token cached, will refresh in', expires_in - GUESTY_CONFIG.cache.tokenRefreshBuffer, 'seconds');

        // Release lock
        await redis.del(TOKEN_LOCK_KEY);

        return access_token;
      } else {
        // Another process is fetching - wait and retry getting from cache
        console.log('Another process is fetching token, waiting...');
        for (let i = 0; i < 10; i++) {
          await delay(500); // Wait 500ms
          const cached = await redis.get<CachedToken>(TOKEN_KEY);
          if (cached && Date.now() < cached.expires_at) {
            console.log('Got token from cache after waiting');
            return cached.access_token;
          }
        }
        // Timeout - fetch anyway as fallback
        console.log('Timeout waiting for token, fetching directly');
      }
    } catch (error) {
      console.error('Redis lock error:', error);
    }
  }

  // Fallback: fetch directly (no Redis or lock failed)
  console.log('Fetching token directly (no cache)...');
  const { access_token } = await fetchGuestyTokenRaw();
  return access_token;
}

// API request helper
async function guestyFetch<T>(
  endpoint: string,
  options: { revalidate?: number } = {}
): Promise<T> {
  const token = await getGuestyToken();

  const response = await fetch(`${GUESTY_CONFIG.apiUrl}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    next: { revalidate: options.revalidate ?? GUESTY_CONFIG.cache.listingsRevalidate },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Guesty API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// Listings API
export interface SearchListingsParams {
  checkIn: string;
  checkOut: string;
  guests?: number;
}

export async function searchListings(params: SearchListingsParams): Promise<GuestyListingsResponse> {
  const queryParams = new URLSearchParams({
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    minOccupancy: (params.guests ?? 1).toString(),
  });

  return guestyFetch<GuestyListingsResponse>(
    `/listings?${queryParams.toString()}`,
    { revalidate: GUESTY_CONFIG.cache.listingsRevalidate }
  );
}

export async function getListingById(id: string): Promise<GuestyListing> {
  return guestyFetch<GuestyListing>(
    `/listings/${id}`,
    { revalidate: GUESTY_CONFIG.cache.listingRevalidate }
  );
}

// Booking URL helper
export function getBookingUrl(listingId: string, params: SearchListingsParams): string {
  const queryParams = new URLSearchParams({
    minOccupancy: (params.guests ?? 1).toString(),
    checkIn: params.checkIn,
    checkOut: params.checkOut,
  });

  return `${GUESTY_CONFIG.bookingUrl}/en/properties/${listingId}?${queryParams.toString()}`;
}

// Checkout URL helper
export function getCheckoutUrl(listingId: string, params: SearchListingsParams): string {
  const queryParams = new URLSearchParams({
    minOccupancy: (params.guests ?? 1).toString(),
    checkIn: params.checkIn,
    checkOut: params.checkOut,
  });

  return `${GUESTY_CONFIG.bookingUrl}/en/properties/${listingId}/checkout?${queryParams.toString()}`;
}

// POST request helper
async function guestyPost<T>(
  endpoint: string,
  body: object
): Promise<T> {
  const token = await getGuestyToken();

  const response = await fetch(`${GUESTY_CONFIG.apiUrl}${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Guesty API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// Guesty Quote API response type (matches actual API response structure)
interface GuestyQuoteInvoiceItem {
  title: string;
  amount: number;
  currency: string;
  type: string;
}

interface GuestyQuoteMoney {
  _id: string;
  currency: string;
  fareAccommodation: number;
  fareAccommodationAdjusted: number;
  fareCleaning: number;
  totalFees: number;
  subTotalPrice: number;
  hostPayout: number;
  totalTaxes: number;
  invoiceItems: GuestyQuoteInvoiceItem[];
}

interface GuestyQuoteDay {
  date: string;
  currency: string;
  price: number;
  basePrice: number;
}

interface GuestyQuoteRatePlanWrapper {
  ratePlan: {
    _id: string;
    name: string;
    money: GuestyQuoteMoney;
  };
  days: GuestyQuoteDay[];
}

interface GuestyQuoteRawResponse {
  _id: string;
  rates: {
    ratePlans: GuestyQuoteRatePlanWrapper[];
  };
}

// Quote API
export async function getQuote(params: GuestyQuoteRequest): Promise<GuestyQuote> {
  const response = await guestyPost<GuestyQuoteRawResponse>('/reservations/quotes', {
    listingId: params.listingId,
    checkInDateLocalized: params.checkIn,
    checkOutDateLocalized: params.checkOut,
    guestsCount: params.guests,
  });

  // Extract data from: rates.ratePlans[0].ratePlan.money
  const ratePlanWrapper = response.rates?.ratePlans?.[0];
  if (!ratePlanWrapper) {
    throw new Error('No rate plan available for these dates');
  }

  const money = ratePlanWrapper.ratePlan?.money;
  const invoiceItems = money?.invoiceItems || [];
  const nights = ratePlanWrapper.days?.length || 0;

  // Transform invoice items to fees and taxes
  const fees = invoiceItems
    .filter(item => item.type !== 'ACCOMMODATION_FARE' && item.type !== 'TAX')
    .map(item => ({
      name: item.title,
      amount: item.amount,
      type: item.type,
    }));

  const taxes = invoiceItems
    .filter(item => item.type === 'TAX')
    .map(item => ({
      name: item.title,
      amount: item.amount,
      type: item.type,
    }));

  return {
    _id: response._id,
    listingId: params.listingId,
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    guests: params.guests,
    nights,
    currency: money?.currency || 'USD',
    accommodationFare: money?.fareAccommodation || 0,
    fees,
    taxes,
    totalPrice: money?.subTotalPrice || 0,
  };
}
