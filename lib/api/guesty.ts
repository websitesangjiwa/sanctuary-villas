import { GuestyTokenResponse } from '@/types/guesty';
import { unstable_cache } from 'next/cache';

const GUESTY_TOKEN_URL = 'https://booking.guesty.com/oauth2/token';

async function fetchGuestyToken(): Promise<string> {
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

// Cache token for 1 hour (3600 seconds)
export const getGuestyToken = unstable_cache(
  fetchGuestyToken,
  ['guesty-token'],
  { revalidate: 3600 }
);
