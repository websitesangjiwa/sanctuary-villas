import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getPaymentProvider, getQuote } from '@/lib/api/guesty';
import { checkRateLimit, checkoutRateLimiter } from '@/lib/utils/rateLimit';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Maximum allowed amount (prevent unreasonably high charges)
const MAX_CHARGE_AMOUNT = 100000; // $100,000 USD

interface ChargeRequest {
  paymentMethodId: string;
  amount: number;
  currency: string;
  listingId: string;
  // Booking details for server-side validation
  checkIn: string;
  checkOut: string;
  guests: number;
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

  // Prevent unreasonably high charges
  if (body.amount > MAX_CHARGE_AMOUNT) {
    return { valid: false, error: 'Amount exceeds maximum allowed' };
  }

  if (!body.currency || typeof body.currency !== 'string') {
    return { valid: false, error: 'currency is required' };
  }

  if (!body.listingId || typeof body.listingId !== 'string') {
    return { valid: false, error: 'listingId is required' };
  }

  // Validate booking parameters (required for server-side amount verification)
  if (!body.checkIn || typeof body.checkIn !== 'string') {
    return { valid: false, error: 'checkIn is required' };
  }

  if (!body.checkOut || typeof body.checkOut !== 'string') {
    return { valid: false, error: 'checkOut is required' };
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(body.checkIn) || !dateRegex.test(body.checkOut)) {
    return { valid: false, error: 'Invalid date format' };
  }

  if (typeof body.guests !== 'number' || body.guests < 1 || body.guests > 50) {
    return { valid: false, error: 'Valid guest count is required (1-50)' };
  }

  return {
    valid: true,
    request: {
      paymentMethodId: body.paymentMethodId,
      amount: body.amount,
      currency: body.currency,
      listingId: body.listingId,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      guests: Math.floor(body.guests),
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
    // Rate limiting check
    const rateLimitResult = await checkRateLimit(request, checkoutRateLimiter);
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
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

    const { paymentMethodId, amount, currency, listingId, checkIn, checkOut, guests, description } = validation.request;

    // Server-side quote verification: re-fetch the quote and verify the amount
    try {
      const serverQuote = await getQuote({
        listingId,
        checkIn,
        checkOut,
        guests,
      });

      // Allow small tolerance for rounding (0.01 = 1 cent)
      const amountDifference = Math.abs(serverQuote.totalPrice - amount);
      if (amountDifference > 0.01) {
        return NextResponse.json(
          { error: 'Quote has changed. Please refresh and try again.' },
          { status: 400 }
        );
      }

      // Verify currency matches
      if (serverQuote.currency.toLowerCase() !== currency.toLowerCase()) {
        return NextResponse.json(
          { error: 'Currency mismatch. Please refresh and try again.' },
          { status: 400 }
        );
      }
    } catch (quoteError) {
      // If we can't verify the quote, reject the payment for safety
      return NextResponse.json(
        { error: 'Unable to verify booking price. Please try again.' },
        { status: 400 }
      );
    }

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

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

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
    // Handle Stripe-specific errors
    if (error instanceof Stripe.errors.StripeError) {
      const userMessage = getStripeErrorMessage(error);
      return NextResponse.json(
        { error: userMessage },
        { status: 402 }
      );
    }

    // Generic error - don't expose internal details
    return NextResponse.json(
      { error: 'Payment processing error. Please try again.' },
      { status: 500 }
    );
  }
}

// Endpoint to refund a payment (used if reservation creation fails)
// Security: Only allows refunds for payments made in the last 5 minutes
export async function DELETE(request: Request) {
  try {
    // Rate limiting check (use strict checkout limiter)
    const rateLimitResult = await checkRateLimit(request, checkoutRateLimiter);
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get('paymentIntentId');

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'paymentIntentId is required' },
        { status: 400 }
      );
    }

    // Validate payment intent ID format
    if (!paymentIntentId.startsWith('pi_')) {
      return NextResponse.json(
        { error: 'Invalid payment intent format' },
        { status: 400 }
      );
    }

    // Retrieve the payment intent to verify it's recent and owned by us
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Security check: Only allow refunds for payments made in the last 5 minutes
    // This prevents abuse of the refund endpoint
    const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 300;
    if (paymentIntent.created < fiveMinutesAgo) {
      return NextResponse.json(
        { error: 'Refund window has expired. Please contact support.' },
        { status: 400 }
      );
    }

    // Only allow refunds for succeeded payments
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment cannot be refunded in its current state' },
        { status: 400 }
      );
    }

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      status: refund.status,
    });
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      // Don't expose internal error details
      return NextResponse.json(
        { error: 'Refund could not be processed' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Refund failed' },
      { status: 500 }
    );
  }
}
