import { NextRequest, NextResponse } from 'next/server';
import { getQuoteWithRatePlan } from '@/lib/api/guesty';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listingId, checkIn, checkOut, guests } = body;

    if (!listingId || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: 'listingId, checkIn, and checkOut are required' },
        { status: 400 }
      );
    }

    // Use getQuoteWithRatePlan to include ratePlanId (required for reservations)
    const quote = await getQuoteWithRatePlan({
      listingId,
      checkIn,
      checkOut,
      guests: guests || 1,
    });

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Guesty quote error:', error);
    return NextResponse.json(
      {
        error: 'Failed to get quote',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
