import { NextRequest, NextResponse } from 'next/server';
import { getListingById } from '@/lib/api/guesty';

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
    const data = await getListingById(id);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Guesty listing error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch listing',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
