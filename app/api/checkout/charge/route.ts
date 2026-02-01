import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getPaymentProvider } from '@/lib/api/guesty';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface ChargeRequest {
  paymentMethodId: string;
  amount: number;
  currency: string;
  listingId: string;
  description?: string;
}

// Validate the charge request
function validateChargeRequest(data: unknown): {
  valid: boolean;
  error?: string;
  request?: ChargeRequest;
} {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  const body = data as Record<string, unknown>;

  if (!body.paymentMethodId || typeof body.paymentMethodId !== 'string') {
    return { valid: false, error: 'paymentMethodId is required' };
  }

  // Validate it's a Stripe payment method ID
  if (!body.paymentMethodId.startsWith('pm_')) {
    return { valid: false, error: 'Invalid payment method format' };
  }

  if (typeof body.amount !== 'number' || body.amount <= 0) {
    return { valid: false, error: 'Valid amount is required' };
  }

  if (!body.currency || typeof body.currency !== 'string') {
    return { valid: false, error: 'currency is required' };
  }

  if (!body.listingId || typeof body.listingId !== 'string') {
    return { valid: false, error: 'listingId is required' };
  }

  return {
    valid: true,
    request: {
      paymentMethodId: body.paymentMethodId,
      amount: body.amount,
      currency: body.currency,
      listingId: body.listingId,
      description: typeof body.description === 'string' ? body.description : undefined,
    },
  };
}

// Map Stripe error codes to user-friendly messages
function getStripeErrorMessage(error: Stripe.errors.StripeError): string {
  switch (error.code) {
    case 'card_declined':
      return 'Your card was declined. Please try another card.';
    case 'insufficient_funds':
      return 'Insufficient funds. Please try another card.';
    case 'expired_card':
      return 'Your card has expired. Please use a valid card.';
    case 'incorrect_cvc':
      return 'Invalid security code. Please check and try again.';
    case 'incorrect_number':
      return 'Invalid card number. Please check and try again.';
    case 'processing_error':
      return 'An error occurred while processing your card. Please try again.';
    case 'rate_limit':
      return 'Too many requests. Please wait a moment and try again.';
    default:
      return error.message || 'Payment failed. Please try again.';
  }
}

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

    // Validate request
    const validation = validateChargeRequest(body);
    if (!validation.valid || !validation.request) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { paymentMethodId, amount, currency, listingId, description } = validation.request;

    // Get payment provider info for the listing (may include Stripe Connect account)
    let stripeAccountId: string | undefined;
    try {
      const paymentProvider = await getPaymentProvider(listingId);
      if (paymentProvider.accountId) {
        stripeAccountId = paymentProvider.accountId;
      }
    } catch (error) {
      console.warn('Could not get payment provider for listing:', error);
      // Continue without Stripe Connect - will charge to platform account
    }

    // Convert amount to cents (Stripe expects integer amounts in smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    // Create PaymentIntent and confirm immediately
    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: amountInCents,
      currency: currency.toLowerCase(),
      payment_method: paymentMethodId,
      confirm: true, // Charge immediately
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never', // Don't redirect, we need immediate result
      },
      description: description || `Booking for listing ${listingId}`,
      metadata: {
        listingId,
      },
    };

    // If using Stripe Connect, transfer to the connected account
    // Skip in test mode (test keys start with sk_test_) as the connected account won't exist
    const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_');
    if (stripeAccountId && !isTestMode) {
      paymentIntentParams.transfer_data = {
        destination: stripeAccountId,
      };
    }

    console.log('[Stripe] Creating PaymentIntent:', {
      amount: amountInCents,
      currency,
      listingId,
      hasConnectedAccount: !!stripeAccountId,
    });

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    console.log('[Stripe] PaymentIntent created:', {
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

    // Handle requires_action (3D Secure, etc.)
    if (paymentIntent.status === 'requires_action') {
      return NextResponse.json(
        {
          error: 'Additional authentication required',
          requiresAction: true,
          clientSecret: paymentIntent.client_secret,
        },
        { status: 402 }
      );
    }

    // Payment failed
    return NextResponse.json(
      {
        error: 'Payment failed',
        status: paymentIntent.status,
      },
      { status: 402 }
    );
  } catch (error) {
    console.error('[Stripe] Error creating charge:', error);

    // Handle Stripe-specific errors
    if (error instanceof Stripe.errors.StripeError) {
      const userMessage = getStripeErrorMessage(error);
      return NextResponse.json(
        { error: userMessage },
        { status: 402 }
      );
    }

    // Generic error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Payment processing error. Please try again.' },
      { status: 500 }
    );
  }
}

// Endpoint to refund a payment (used if reservation creation fails)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get('paymentIntentId');

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'paymentIntentId is required' },
        { status: 400 }
      );
    }

    console.log('[Stripe] Creating refund for:', paymentIntentId);

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    console.log('[Stripe] Refund created:', {
      id: refund.id,
      status: refund.status,
    });

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      status: refund.status,
    });
  } catch (error) {
    console.error('[Stripe] Error creating refund:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Refund failed' },
      { status: 500 }
    );
  }
}
