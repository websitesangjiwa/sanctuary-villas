"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import GuestInfoForm, { GuestInfoFormRef } from "./GuestInfoForm";
import PaymentForm, { PaymentFormRef } from "./PaymentForm";
import BillingAddressForm, { BillingAddressFormRef } from "./BillingAddressForm";
import ConsentCheckboxes, { ConsentCheckboxesRef } from "./ConsentCheckboxes";
import OrderSummary from "./OrderSummary";
import StripeProvider from "./StripeProvider";
import { GuestyQuoteWithRatePlan, GuestyListing } from "@/types/guesty";

interface CheckoutFormProps {
  listing: GuestyListing;
  quote: GuestyQuoteWithRatePlan;
}

export default function CheckoutForm({ listing, quote }: CheckoutFormProps) {
  const router = useRouter();
  const guestInfoRef = useRef<GuestInfoFormRef>(null);
  const paymentFormRef = useRef<PaymentFormRef>(null);
  const billingAddressRef = useRef<BillingAddressFormRef>(null);
  const consentRef = useRef<ConsentCheckboxesRef>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestInfoValid, setGuestInfoValid] = useState(false);
  const [paymentValid, setPaymentValid] = useState(false);
  const [consentValid, setConsentValid] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate guest info
    const guestData = guestInfoRef.current?.validate();
    if (!guestData) {
      toast.error("Please fill in all required guest information");
      return;
    }

    // Validate and get payment token
    if (!paymentFormRef.current?.isComplete()) {
      toast.error("Please enter valid card details");
      return;
    }

    // Validate consent (required by Guesty API)
    const consentData = consentRef.current?.validate();
    if (!consentData) {
      toast.error("Please accept the Privacy Policy and Terms and Conditions");
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create payment method token
      const ccToken = await paymentFormRef.current.createPaymentMethod();
      if (!ccToken) {
        toast.error("Failed to process card. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Get billing address data (optional)
      const billingData = billingAddressRef.current?.getData();

      let paymentIntentId: string | undefined;

      // Step 2: Charge via Stripe FIRST
      // This ensures we don't create reservations for failed payments
      // Helper function to attempt charge with retry logic
      const attemptCharge = async (attempt: number): Promise<string> => {
        setRetryCount(attempt);

        const chargeResponse = await fetch("/api/checkout/charge", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethodId: ccToken,
            amount: quote.totalPrice,
            currency: quote.currency,
            listingId: listing._id,
            // Include booking details for server-side price verification
            checkIn: quote.checkIn,
            checkOut: quote.checkOut,
            guests: quote.guests,
            description: `Booking: ${listing.title} (${quote.checkIn} - ${quote.checkOut})`,
          }),
        });

        const chargeData = await chargeResponse.json();

        // Handle 3D Secure / additional authentication first
        if (chargeData.requiresAction && chargeData.clientSecret) {
          if (!paymentFormRef.current) {
            throw new Error("Payment form not available. Please refresh and try again.");
          }

          // Show 3D Secure authentication modal via Stripe.js
          // confirmCardPayment handles 3DS and completes the payment in one step
          const authResult = await paymentFormRef.current.handleCardAction(
            chargeData.clientSecret
          );

          if (!authResult.success) {
            throw new Error(
              authResult.error || "Card authentication failed. Please try again."
            );
          }

          return authResult.paymentIntentId!;
        }

        // Check for payment failure
        if (!chargeResponse.ok) {
          // If retryable and haven't exceeded max retries, wait and retry
          if (chargeData.retryable && attempt < MAX_RETRIES) {
            // Wait 1 second before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
            return attemptCharge(attempt + 1);
          }

          // Not retryable or max retries exceeded
          throw new Error(chargeData.error || "Payment failed. Please try again.");
        }

        return chargeData.paymentIntentId;
      };

      // Start charge attempt
      paymentIntentId = await attemptCharge(0);
      setRetryCount(0); // Reset retry count on success

      // Step 3: Create reservation with Guesty (payment already collected)
      const response = await fetch("/api/guesty/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteId: quote._id,
          ratePlanId: quote.ratePlanId,
          guest: {
            ...guestData,
            // Include billing address fields if provided
            street: billingData?.street,
            city: billingData?.city,
            state: billingData?.state,
            zipCode: billingData?.zipCode,
            country: billingData?.country,
            countryCode: billingData?.countryCode,
          },
          ccToken,
          consent: consentData,
          // Payment info for recording in Guesty (Stripe-first flow)
          paymentIntentId,
          amount: quote.totalPrice,
          currency: quote.currency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Reservation creation failed AFTER payment succeeded
        // We need to refund the payment
        if (paymentIntentId) {
          try {
            await fetch(`/api/checkout/charge?paymentIntentId=${paymentIntentId}`, {
              method: "DELETE",
            });
          } catch {
            // Still show the original error, but mention the refund issue
            throw new Error(
              `${data.error || "Failed to create reservation"}. Your payment will be refunded.`
            );
          }
        }
        throw new Error(data.error || "Failed to create reservation");
      }

      // Success! Redirect to confirmation page
      const params = new URLSearchParams({
        code: data.confirmationCode,
        listingId: listing._id,
        listingTitle: listing.title,
        checkIn: quote.checkIn,
        checkOut: quote.checkOut,
        guests: quote.guests.toString(),
        total: quote.totalPrice.toString(),
        currency: quote.currency,
        email: guestData.email,
      });

      toast.success("Booking confirmed! Redirecting...");
      router.push(`/booking-confirmed?${params.toString()}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  const isFormValid = guestInfoValid && paymentValid && consentValid;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Forms */}
        <div className="space-y-6">
          {/* Form Header */}
          <div className="bg-[#fffdf3] rounded-xl p-6 border border-[#cab797]/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-['Ovo'] text-xl text-[#2e1b12]">
                Fill in your details
              </h2>
              <div className="flex items-center gap-1 text-xs text-[#643c15]/70">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>PCI compliant secure payment</span>
              </div>
            </div>

            {/* Guest Information */}
            <GuestInfoForm
              ref={guestInfoRef}
              disabled={isSubmitting}
              onValidationChange={setGuestInfoValid}
            />
          </div>

          {/* Payment Details */}
          <div className="bg-[#fffdf3] rounded-xl p-6 border border-[#cab797]/20">
            <StripeProvider listingId={listing._id}>
              <PaymentForm
                ref={paymentFormRef}
                disabled={isSubmitting}
                onValidationChange={setPaymentValid}
              />
            </StripeProvider>
          </div>

          {/* Billing Address */}
          <div className="bg-[#fffdf3] rounded-xl p-6 border border-[#cab797]/20">
            <BillingAddressForm
              ref={billingAddressRef}
              disabled={isSubmitting}
            />
          </div>

          {/* Consent Checkboxes */}
          <div className="bg-[#fffdf3] rounded-xl p-6 border border-[#cab797]/20">
            <ConsentCheckboxes
              ref={consentRef}
              disabled={isSubmitting}
              onValidationChange={setConsentValid}
            />
          </div>

          {/* Retry Notice */}
          {retryCount > 0 && isSubmitting && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-amber-50 border border-amber-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="animate-spin h-5 w-5 border-2 border-amber-500 border-t-transparent rounded-full shrink-0" />
                <div>
                  <p className="text-amber-700 text-sm font-medium">
                    Retrying payment...
                  </p>
                  <p className="text-amber-600 text-sm">
                    Attempt {retryCount + 1} of {MAX_RETRIES + 1}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          </div>

        {/* Right Column - Order Summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary
            listing={listing}
            quote={quote}
            isSubmitting={isSubmitting}
            onSubmit={() => {
              // Trigger form submit programmatically
              const form = document.querySelector('form');
              if (form) {
                form.requestSubmit();
              }
            }}
          />
        </div>
      </div>
    </form>
  );
}
