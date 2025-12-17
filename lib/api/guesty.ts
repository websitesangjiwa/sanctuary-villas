import { GuestyTokenResponse } from '@/types/guesty';

const GUESTY_TOKEN_URL = 'https://booking.guesty.com/oauth2/token';

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export async function getGuestyToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const clientId = process.env.GUESTY_CLIENT_ID;
  const clientSecret = process.env.GUESTY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(`Missing Guesty API credentials. GUESTY_CLIENT_ID: ${clientId ? 'set' : 'NOT SET'}, GUESTY_CLIENT_SECRET: ${clientSecret ? 'set' : 'NOT SET'}`);
  }

  const response = await fetch(GUESTY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache',
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

  cachedToken = data.access_token;
  // Cache for expires_in minus 1 minute buffer
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

  return cachedToken;
}

export function clearGuestyTokenCache(): void {
  cachedToken = null;
  tokenExpiry = null;
}
