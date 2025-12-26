import { NextRequest, NextResponse } from 'next/server';
import { searchListings } from '@/lib/api/guesty';

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
    const data = await searchListings({
      checkIn,
      checkOut,
      guests: parseInt(guests, 10),
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Guesty listings error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch listings',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
