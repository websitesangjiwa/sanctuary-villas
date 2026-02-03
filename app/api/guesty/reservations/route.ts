import { NextResponse } from 'next/server';
import { createReservation, recordPaymentInGuesty } from '@/lib/api/guesty';
import { GuestyReservationRequest } from '@/types/guesty';
import { checkRateLimit, reservationRateLimiter } from '@/lib/utils/rateLimit';

// Validation helper
function validateReservationRequest(data: unknown): {
  valid: boolean;
  error?: string;
  request?: GuestyReservationRequest;
} {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  const body = data as Record<string, unknown>;

  // Validate required fields
  if (!body.quoteId || typeof body.quoteId !== 'string') {
    return { valid: false, error: 'quoteId is required' };
  }

  if (!body.ratePlanId || typeof body.ratePlanId !== 'string') {
    return { valid: false, error: 'ratePlanId is required' };
  }

  if (!body.ccToken || typeof body.ccToken !== 'string') {
    return { valid: false, error: 'ccToken is required' };
  }

  // Validate guest object
  if (!body.guest || typeof body.guest !== 'object') {
    return { valid: false, error: 'guest information is required' };
  }

  const guest = body.guest as Record<string, unknown>;

  if (!guest.firstName || typeof guest.firstName !== 'string' || guest.firstName.trim().length === 0) {
    return { valid: false, error: 'guest.firstName is required' };
  }

  if (!guest.lastName || typeof guest.lastName !== 'string' || guest.lastName.trim().length === 0) {
    return { valid: false, error: 'guest.lastName is required' };
  }

  if (!guest.email || typeof guest.email !== 'string') {
    return { valid: false, error: 'guest.email is required' };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(guest.email)) {
    return { valid: false, error: 'Invalid email address' };
  }

  if (!guest.phone || typeof guest.phone !== 'string' || guest.phone.trim().length < 10) {
    return { valid: false, error: 'Valid phone number is required' };
  }

  // Validate consent object (required by Guesty API)
  if (!body.consent || typeof body.consent !== 'object') {
    return { valid: false, error: 'Consent information is required' };
  }

  const consent = body.consent as Record<string, unknown>;

  if (consent.privacyAccepted !== true) {
    return { valid: false, error: 'You must accept the Privacy Policy' };
  }

  if (consent.termsAccepted !== true) {
    return { valid: false, error: 'You must accept the Terms and Conditions' };
  }

  // Build guest data with optional billing address fields
  const guestData: GuestyReservationRequest['guest'] = {
    firstName: (guest.firstName as string).trim(),
    lastName: (guest.lastName as string).trim(),
    email: (guest.email as string).trim().toLowerCase(),
    phone: (guest.phone as string).trim(),
  };

  // Add optional billing address fields if provided
  if (guest.street && typeof guest.street === 'string' && guest.street.trim()) {
    guestData.street = guest.street.trim();
  }
  if (guest.city && typeof guest.city === 'string' && guest.city.trim()) {
    guestData.city = guest.city.trim();
  }
  if (guest.state && typeof guest.state === 'string' && guest.state.trim()) {
    guestData.state = guest.state.trim();
  }
  if (guest.zipCode && typeof guest.zipCode === 'string' && guest.zipCode.trim()) {
    guestData.zipCode = guest.zipCode.trim();
  }
  if (guest.country && typeof guest.country === 'string' && guest.country.trim()) {
    guestData.country = guest.country.trim();
  }
  if (guest.countryCode && typeof guest.countryCode === 'string' && guest.countryCode.trim()) {
    guestData.countryCode = guest.countryCode.trim();
  }

  // Build request object
  const request: GuestyReservationRequest = {
    quoteId: body.quoteId as string,
    ratePlanId: body.ratePlanId as string,
    ccToken: body.ccToken as string,
    guest: guestData,
    consent: {
      privacyAccepted: consent.privacyAccepted === true,
      termsAccepted: consent.termsAccepted === true,
      marketingAccepted: consent.marketingAccepted === true,
    },
  };

  // Add special request if provided (from guest.specialRequest)
  if (guest.specialRequest && typeof guest.specialRequest === 'string' && guest.specialRequest.trim()) {
    request.specialRequest = guest.specialRequest.trim();
  }

  return {
    valid: true,
    request,
  };
}

// Map Guesty/Stripe error messages to user-friendly messages
function getUserFriendlyError(error: string): string {
  const errorLower = error.toLowerCase();

  if (errorLower.includes('card_declined') || errorLower.includes('declined')) {
    return 'Your card was declined. Please try another card.';
  }

  if (errorLower.includes('insufficient_funds') || errorLower.includes('insufficient funds')) {
    return 'Insufficient funds. Please try another card.';
  }

  if (errorLower.includes('expired_card') || errorLower.includes('expired')) {
    return 'Your card has expired. Please use a valid card.';
  }

  if (errorLower.includes('invalid_cvc') || errorLower.includes('cvc') || errorLower.includes('cvv')) {
    return 'Invalid security code. Please check and try again.';
  }

  if (errorLower.includes('invalid_number') || errorLower.includes('card number')) {
    return 'Invalid card number. Please check and try again.';
  }

  if (errorLower.includes('rate_limit') || errorLower.includes('too many')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }

  if (errorLower.includes('quote') && (errorLower.includes('expired') || errorLower.includes('invalid'))) {
    return 'Your quote has expired. Please refresh the page and try again.';
  }

  if (errorLower.includes('unavailable') || errorLower.includes('not available')) {
    return 'This property is no longer available for the selected dates.';
  }

  // Generic error
  return 'Payment processing error. Please try again.';
}

export async function POST(request: Request) {
  try {
    // Rate limiting check (strict for reservations)
    const rateLimitResult = await checkRateLimit(request, reservationRateLimiter);
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    const body = await request.json();

    // Validate request
    const validation = validateReservationRequest(body);
    if (!validation.valid || !validation.request) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Extract payment info for recording (only in production mode with Stripe-first payment)
    const paymentIntentId = typeof body.paymentIntentId === 'string' ? body.paymentIntentId : undefined;
    const paymentAmount = typeof body.amount === 'number' ? body.amount : undefined;
    const paymentCurrency = typeof body.currency === 'string' ? body.currency : 'USD';

    console.log('[Reservations API] Payment info from request:', {
      paymentIntentId: paymentIntentId || 'NOT PROVIDED',
      paymentAmount: paymentAmount || 'NOT PROVIDED',
      paymentCurrency,
    });

    // Create instant reservation with payment
    const reservation = await createReservation(validation.request);

    console.log('[Reservations API] Reservation created:', {
      reservationId: reservation._id,
      confirmationCode: reservation.confirmationCode,
    });

    // Record the Stripe payment in Guesty (only if payment was collected via Stripe-first flow)
    // This ensures Guesty Dashboard shows "Paid" status for reservations
    if (paymentIntentId && reservation._id && paymentAmount) {
      console.log('[Reservations API] Calling recordPaymentInGuesty...');
      try {
        // Wait 2 seconds for Guesty to sync the reservation between Booking Engine API and Open API
        // Without this delay, the Open API may return "Reservation not found"
        console.log('[Reservations API] Waiting 2s for Guesty internal sync...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        await recordPaymentInGuesty({
          reservationId: reservation._id,
          amount: paymentAmount,
          currency: paymentCurrency,
          paymentIntentId,
        });
        console.log('[Reservations API] recordPaymentInGuesty completed');
      } catch (paymentError) {
        // Non-fatal error - the reservation and Stripe payment are already successful
        // Guesty will just show as "unpaid" but the guest has been charged
        console.error('[Reservations API] recordPaymentInGuesty failed:', paymentError);
      }
    } else {
      console.warn('[Reservations API] Skipping payment recording - missing required data:', {
        hasPaymentIntentId: !!paymentIntentId,
        hasReservationId: !!reservation._id,
        hasPaymentAmount: !!paymentAmount,
      });
    }

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const userFriendlyError = getUserFriendlyError(errorMessage);

    // Determine status code based on error type
    let statusCode = 500;

    if (errorMessage.includes('400') || errorMessage.includes('validation')) {
      statusCode = 400;
    } else if (errorMessage.includes('402') || errorMessage.includes('payment')) {
      statusCode = 402;
    } else if (errorMessage.includes('404') || errorMessage.includes('not found')) {
      statusCode = 404;
    } else if (errorMessage.includes('429') || errorMessage.includes('rate')) {
      statusCode = 429;
    }

    return NextResponse.json(
      { error: userFriendlyError },
      { status: statusCode }
    );
  }
}
