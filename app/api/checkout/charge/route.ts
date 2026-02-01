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

// Comprehensive decline code to user message mapping
// Based on: https://docs.stripe.com/declines/codes
const DECLINE_CODE_MESSAGES: Record<string, { message: string; retryable: boolean }> = {
  // Card verification errors - NOT retryable, user must fix
  'incorrect_number': { message: 'The card number is incorrect. Please check and try again.', retryable: false },
  'invalid_number': { message: 'The card number is not valid. Please check and try again.', retryable: false },
  'incorrect_cvc': { message: 'The security code (CVC) is incorrect. Please check and try again.', retryable: false },
  'invalid_cvc': { message: 'The security code is not valid. Please check and try again.', retryable: false },
  'incorrect_zip': { message: 'The ZIP/postal code is incorrect. Please check and try again.', retryable: false },
  'invalid_expiry_month': { message: 'The expiration month is invalid.', retryable: false },
  'invalid_expiry_year': { message: 'The expiration year is invalid.', retryable: false },
  'expired_card': { message: 'Your card has expired. Please use a different card.', retryable: false },

  // Insufficient funds - NOT retryable with same card
  'insufficient_funds': { message: 'Your card has insufficient funds. Please use a different card.', retryable: false },
  'withdrawal_count_limit_exceeded': { message: 'Your card has exceeded its withdrawal limit. Please use a different card.', retryable: false },

  // Card restrictions - NOT retryable
  'card_declined': { message: 'Your card was declined. Please try a different card.', retryable: false },
  'generic_decline': { message: 'Your card was declined. Please contact your bank or try a different card.', retryable: false },
  'do_not_honor': { message: 'Your bank declined this transaction. Please contact your bank or try a different card.', retryable: false },
  'restricted_card': { message: 'This card is restricted and cannot be used. Please try a different card.', retryable: false },
  'card_not_supported': { message: 'This card is not supported. Please try a different card.', retryable: false },
  'currency_not_supported': { message: 'This card does not support the requested currency.', retryable: false },
  'card_velocity_exceeded': { message: 'Too many transactions on this card. Please wait and try again later.', retryable: true },

  // Security/fraud - Show generic message (don't reveal details)
  'fraudulent': { message: 'This payment cannot be processed. Please try a different card.', retryable: false },
  'lost_card': { message: 'This card cannot be used. Please try a different card.', retryable: false },
  'stolen_card': { message: 'This card cannot be used. Please try a different card.', retryable: false },
  'merchant_blacklist': { message: 'This payment cannot be processed. Please try a different card.', retryable: false },
  'pickup_card': { message: 'This card cannot be used. Please contact your bank.', retryable: false },
  'security_violation': { message: 'This payment cannot be processed. Please try a different card.', retryable: false },

  // Temporary/processing errors - RETRYABLE
  'issuer_not_available': { message: 'Your bank is temporarily unavailable. Please try again in a moment.', retryable: true },
  'processing_error': { message: 'A processing error occurred. Please try again.', retryable: true },
  'reenter_transaction': { message: 'Please try your payment again.', retryable: true },
  'try_again_later': { message: 'Your bank is temporarily unavailable. Please try again later.', retryable: true },
  'offline_pin_required': { message: 'This card requires in-person verification. Please try a different card.', retryable: false },
  'online_or_offline_pin_required': { message: 'This card requires PIN verification. Please try a different card.', retryable: false },

  // Transaction-specific issues
  'duplicate_transaction': { message: 'A similar payment was recently processed. Please wait a moment before trying again.', retryable: true },
  'transaction_not_allowed': { message: 'This transaction is not allowed on your card. Please try a different card.', retryable: false },
  'not_permitted': { message: 'This payment type is not permitted. Please try a different card.', retryable: false },
  'service_not_allowed': { message: 'This service is not available for your card. Please try a different card.', retryable: false },
  'revocation_of_all_authorizations': { message: 'Your card has been revoked. Please contact your bank.', retryable: false },
  'revocation_of_authorization': { message: 'This payment was revoked. Please try again or use a different card.', retryable: false },
  'stop_payment_order': { message: 'A stop payment order exists on this card. Please use a different card.', retryable: false },

  // Special cases
  'approve_with_id': { message: 'Please contact your bank to approve this transaction.', retryable: false },
  'call_issuer': { message: 'Please contact your bank to approve this transaction.', retryable: false },
  'new_account_information_available': { message: 'Your bank has updated your card details. Please use your new card.', retryable: false },
  'no_action_taken': { message: 'No action was taken on this payment. Please try again.', retryable: true },
  'testmode_decline': { message: 'This is a test decline.', retryable: false },
};

// Get user-friendly message and retry info from decline code
function getDeclineInfo(declineCode: string | null | undefined): { message: string; retryable: boolean } {
  if (!declineCode) {
    return { message: 'Your card was declined. Please try a different card.', retryable: false };
  }

  return DECLINE_CODE_MESSAGES[declineCode] || {
    message: 'Your card was declined. Please try a different card.',
    retryable: false,
  };
}

// Map Stripe error codes to user-friendly messages (for StripeError exceptions)
function getStripeErrorMessage(error: Stripe.errors.StripeError): string {
  const declineInfo = getDeclineInfo(error.code);
  return declineInfo.message;
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

    // Note: Stripe Connect transfer_data is disabled because:
    // 1. In test mode: connected accounts don't exist
    // 2. In live mode: Guesty returns our own Stripe account ID, which can't be a transfer destination
    // Payments go directly to the platform's Stripe account
    // If you need to transfer to a different connected account in the future, uncomment and configure:
    // if (stripeAccountId && stripeAccountId !== 'your_own_account_id') {
    //   paymentIntentParams.transfer_data = { destination: stripeAccountId };
    // }

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
      lastPaymentError: paymentIntent.last_payment_error ? {
        code: paymentIntent.last_payment_error.code,
        declineCode: paymentIntent.last_payment_error.decline_code,
        message: paymentIntent.last_payment_error.message,
      } : null,
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
      // Check if there's a last_payment_error with more details
      const lastError = paymentIntent.last_payment_error;

      // If there's a decline error, use the comprehensive message map
      if (lastError?.decline_code) {
        const declineInfo = getDeclineInfo(lastError.decline_code);
        return NextResponse.json(
          {
            error: declineInfo.message,
            retryable: declineInfo.retryable,
            declineCode: lastError.decline_code,
            status: paymentIntent.status,
          },
          { status: 402 }
        );
      }

      // No decline error - this is 3D Secure authentication required
      return NextResponse.json(
        {
          requiresAction: true,
          clientSecret: paymentIntent.client_secret,
        },
        { status: 402 }
      );
    }

    // Handle requires_payment_method (card was declined)
    if (paymentIntent.status === 'requires_payment_method') {
      const lastError = paymentIntent.last_payment_error;
      const declineInfo = getDeclineInfo(lastError?.decline_code);

      return NextResponse.json(
        {
          error: declineInfo.message,
          retryable: declineInfo.retryable,
          declineCode: lastError?.decline_code,
          status: paymentIntent.status,
        },
        { status: 402 }
      );
    }

    // Payment failed with other status
    return NextResponse.json(
      {
        error: 'Payment could not be completed. Please try again or use a different card.',
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
