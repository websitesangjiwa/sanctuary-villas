import { NextRequest, NextResponse } from 'next/server';
import { getListingCalendar } from '@/lib/api/guesty';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: 'Listing ID is required' },
      { status: 400 }
    );
  }

  // Get date range from query params
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  if (!from || !to) {
    return NextResponse.json(
      { error: 'from and to date parameters are required (YYYY-MM-DD format)' },
      { status: 400 }
    );
  }

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(from) || !dateRegex.test(to)) {
    return NextResponse.json(
      { error: 'Invalid date format. Use YYYY-MM-DD' },
      { status: 400 }
    );
  }

  try {
    const calendar = await getListingCalendar(id, from, to);
    return NextResponse.json(calendar);
  } catch (error) {
    console.error('Guesty calendar error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch calendar',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
