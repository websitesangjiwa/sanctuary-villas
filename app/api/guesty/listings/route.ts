import { NextRequest, NextResponse } from 'next/server';
import { getGuestyToken } from '@/lib/api/guesty';

const GUESTY_API_URL = 'https://booking.guesty.com/api/listings';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests') || '1';

  if (!checkIn || !checkOut) {
    return NextResponse.json(
      { error: 'checkIn and checkOut are required' },
      { status: 400 }
    );
  }

  try {
    const token = await getGuestyToken();

    const guestyParams = new URLSearchParams({
      checkIn,
      checkOut,
      minOccupancy: guests,
    });

    const response = await fetch(`${GUESTY_API_URL}?${guestyParams.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Guesty API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to fetch listings from Guesty' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Guesty listings error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch listings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
