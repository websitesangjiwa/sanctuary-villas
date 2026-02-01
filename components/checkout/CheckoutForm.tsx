"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import GuestInfoForm, { GuestInfoFormRef } from "./GuestInfoForm";
import PaymentForm, { PaymentFormRef } from "./PaymentForm";
import BillingAddressForm, { BillingAddressFormRef } from "./BillingAddressForm";
import ConsentCheckboxes, { ConsentCheckboxesRef } from "./ConsentCheckboxes";
import OrderSummary from "./OrderSummary";
import StripeProvider from "./StripeProvider";
import { GuestyQuoteWithRatePlan, GuestyListing } from "@/types/guesty";

// Check if test mode is enabled
const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

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
  const [error, setError] = useState<string | null>(null);
  const [guestInfoValid, setGuestInfoValid] = useState(false);
  const [paymentValid, setPaymentValid] = useState(false);
  const [consentValid, setConsentValid] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate guest info
    const guestData = guestInfoRef.current?.validate();
    if (!guestData) {
      setError("Please fill in all required guest information");
      return;
    }

    // Validate and get payment token
    if (!paymentFormRef.current?.isComplete()) {
      setError("Please enter valid card details");
      return;
    }

    // Validate consent (required by Guesty API)
    const consentData = consentRef.current?.validate();
    if (!consentData) {
      setError("Please accept the Privacy Policy and Terms and Conditions");
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create payment method token
      const ccToken = await paymentFormRef.current.createPaymentMethod();
      if (!ccToken) {
        setError("Failed to process card. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Get billing address data (optional)
      const billingData = billingAddressRef.current?.getData();

      let paymentIntentId: string | undefined;

      // Step 2: Charge via Stripe FIRST (only in production mode)
      // This ensures we don't create reservations for failed payments
      if (!isTestMode) {
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
            description: `Booking: ${listing.title} (${quote.checkIn} - ${quote.checkOut})`,
          }),
        });

        const chargeData = await chargeResponse.json();

        if (!chargeResponse.ok) {
          // Payment failed - show error and stop (no reservation created)
          throw new Error(chargeData.error || "Payment failed. Please try again.");
        }

        // Handle 3D Secure / additional authentication
        if (chargeData.requiresAction) {
          throw new Error("Additional authentication required. Please try a different card.");
        }

        paymentIntentId = chargeData.paymentIntentId;
        console.log("[Checkout] Payment successful:", paymentIntentId);
      }

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
          console.error("[Checkout] Reservation failed, initiating refund...");
          try {
            await fetch(`/api/checkout/charge?paymentIntentId=${paymentIntentId}`, {
              method: "DELETE",
            });
            console.log("[Checkout] Refund initiated successfully");
          } catch (refundError) {
            console.error("[Checkout] Refund failed:", refundError);
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

      router.push(`/booking-confirmed?${params.toString()}`);
    } catch (err) {
      console.error("Checkout error:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setIsSubmitting(false);
    }
  };

  const isFormValid = guestInfoValid && paymentValid && consentValid;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Test Mode Banner */}
      {isTestMode && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-amber-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-amber-900 font-semibold text-lg">TEST MODE</p>
              <p className="text-amber-700 text-sm">
                Booking will be created as &quot;Request to Book&quot; (inquiry).
                Your card will be validated but NOT charged.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Forms */}
        <div className="space-y-6">
          {/* Form Header */}
          <div className="bg-white/40 rounded-xl p-6 border border-[#cab797]/20">
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
          <div className="bg-white/40 rounded-xl p-6 border border-[#cab797]/20">
            <StripeProvider listingId={listing._id}>
              <PaymentForm
                ref={paymentFormRef}
                disabled={isSubmitting}
                onValidationChange={setPaymentValid}
              />
            </StripeProvider>
          </div>

          {/* Billing Address */}
          <div className="bg-white/40 rounded-xl p-6 border border-[#cab797]/20">
            <BillingAddressForm
              ref={billingAddressRef}
              disabled={isSubmitting}
            />
          </div>

          {/* Consent Checkboxes */}
          <div className="bg-white/40 rounded-xl p-6 border border-[#cab797]/20">
            <ConsentCheckboxes
              ref={consentRef}
              disabled={isSubmitting}
              onValidationChange={setConsentValid}
            />
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-500 mt-0.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-red-700 text-sm font-medium">
                    Booking Error
                  </p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
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
