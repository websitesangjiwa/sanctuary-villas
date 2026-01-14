import { NextResponse } from 'next/server';
import { getPaymentProvider } from '@/lib/api/guesty';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Listing ID is required' },
        { status: 400 }
      );
    }

    const paymentProvider = await getPaymentProvider(id);

    return NextResponse.json(paymentProvider);
  } catch (error) {
    console.error('Error fetching payment provider:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Check if it's a "not found" or "not configured" error
    if (errorMessage.includes('404') || errorMessage.includes('not found')) {
      return NextResponse.json(
        { error: 'Payment provider not configured for this listing' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch payment provider' },
      { status: 500 }
    );
  }
}
