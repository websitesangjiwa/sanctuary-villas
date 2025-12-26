import { NextRequest, NextResponse } from 'next/server';
import { getGuestyToken } from '@/lib/api/guesty';

const GUESTY_API_URL = 'https://booking.guesty.com/api/listings';

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

  try {
    const token = await getGuestyToken();

    const response = await fetch(`${GUESTY_API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Guesty API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to fetch listing from Guesty' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Guesty listing error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch listing',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
