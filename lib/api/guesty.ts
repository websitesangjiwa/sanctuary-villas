import { GuestyTokenResponse, GuestyListing, GuestyListingsResponse, GuestyQuote, GuestyQuoteRequest } from '@/types/guesty';
import { unstable_cache } from 'next/cache';

// Configuration
const GUESTY_CONFIG = {
  tokenUrl: 'https://booking.guesty.com/oauth2/token',
  apiUrl: 'https://booking.guesty.com/api',
  bookingUrl: 'https://sanctuaryvillas.guestybookings.com',
  cache: {
    tokenRevalidate: 3600, // 1 hour
    listingsRevalidate: 60, // 1 minute
    listingRevalidate: 300, // 5 minutes
  },
} as const;

// Token management
async function fetchGuestyToken(): Promise<string> {
  const clientId = process.env.GUESTY_CLIENT_ID;
  const clientSecret = process.env.GUESTY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      `Missing Guesty API credentials. GUESTY_CLIENT_ID: ${clientId ? 'set' : 'NOT SET'}, GUESTY_CLIENT_SECRET: ${clientSecret ? 'set' : 'NOT SET'}`
    );
  }

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

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get Guesty token: ${response.status} - ${errorText}`);
  }

  const data: GuestyTokenResponse = await response.json();
  return data.access_token;
}

// Cached token getter
export const getGuestyToken = unstable_cache(
  fetchGuestyToken,
  ['guesty-token'],
  { revalidate: GUESTY_CONFIG.cache.tokenRevalidate }
);

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
