import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { paymentIntentId } = body;

    // Validate request
    if (!paymentIntentId || typeof paymentIntentId !== 'string') {
      return NextResponse.json(
        { error: 'paymentIntentId is required' },
        { status: 400 }
      );
    }

    // Validate it's a Stripe PaymentIntent ID
    if (!paymentIntentId.startsWith('pi_')) {
      return NextResponse.json(
        { error: 'Invalid PaymentIntent ID format' },
        { status: 400 }
      );
    }

    console.log('[Stripe] Confirming PaymentIntent after 3DS:', paymentIntentId);

    // Confirm the PaymentIntent after 3D Secure authentication
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

    console.log('[Stripe] PaymentIntent confirmation result:', {
      id: paymentIntent.id,
      status: paymentIntent.status,
    });

    // Check payment status
    if (paymentIntent.status === 'succeeded') {
      return NextResponse.json({
        success: true,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      });
    }

    // Handle other statuses
    if (paymentIntent.status === 'requires_payment_method') {
      return NextResponse.json(
        {
          error: 'Your card was declined after authentication. Please try a different card.',
          status: paymentIntent.status,
        },
        { status: 402 }
      );
    }

    if (paymentIntent.status === 'requires_action') {
      return NextResponse.json(
        {
          error: 'Additional authentication still required. Please try again.',
          status: paymentIntent.status,
        },
        { status: 402 }
      );
    }

    // Payment failed with unexpected status
    return NextResponse.json(
      {
        error: 'Payment could not be completed. Please try again.',
        status: paymentIntent.status,
      },
      { status: 402 }
    );
  } catch (error) {
    console.error('[Stripe] Error confirming PaymentIntent:', error);

    // Handle Stripe-specific errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message || 'Payment confirmation failed' },
        { status: 402 }
      );
    }

    // Generic error
    return NextResponse.json(
      { error: 'Payment confirmation error. Please try again.' },
      { status: 500 }
    );
  }
}
