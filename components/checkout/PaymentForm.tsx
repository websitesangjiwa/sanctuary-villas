"use client";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState, useImperativeHandle, forwardRef } from "react";
import { StripeCardElementChangeEvent } from "@stripe/stripe-js";
import Image from "next/image";

export interface PaymentFormRef {
  createPaymentMethod: () => Promise<string | null>;
  isComplete: () => boolean;
  handleCardAction: (clientSecret: string) => Promise<{
    success: boolean;
    paymentIntentId?: string;
    error?: string;
  }>;
}

interface PaymentFormProps {
  disabled?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

// Card brand badges
const CARD_BRANDS = [
  { name: "Visa", src: "/images/cards/visa.svg" },
  { name: "Mastercard", src: "/images/cards/mastercard.svg" },
  { name: "American Express", src: "/images/cards/amex.svg" },
  { name: "JCB", src: "/images/cards/jcb.svg" },
];

const PaymentForm = forwardRef<PaymentFormRef, PaymentFormProps>(
  function PaymentForm({ disabled = false, onValidationChange }, ref) {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [cardComplete, setCardComplete] = useState(false);

    const handleChange = (event: StripeCardElementChangeEvent) => {
      setError(event.error ? event.error.message : null);
      setCardComplete(event.complete);
      onValidationChange?.(event.complete && !event.error);
    };

    useImperativeHandle(ref, () => ({
      createPaymentMethod: async () => {
        if (!stripe || !elements) {
          setError("Payment system not ready. Please wait.");
          return null;
        }

        const card = elements.getElement(CardElement);
        if (!card) {
          setError("Card element not found");
          return null;
        }

        const { paymentMethod, error: stripeError } =
          await stripe.createPaymentMethod({
            type: "card",
            card,
          });

        if (stripeError) {
          setError(stripeError.message || "Card error");
          return null;
        }

        return paymentMethod?.id || null;
      },
      isComplete: () => cardComplete && !error,
      handleCardAction: async (clientSecret: string) => {
        if (!stripe) {
          return { success: false, error: "Payment system not ready" };
        }

        try {
          // Use confirmCardPayment since we created PaymentIntent with confirm: true
          // This triggers the 3D Secure authentication modal and completes the payment
          const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret);

          if (confirmError) {
            return {
              success: false,
              error: confirmError.message || "Card authentication failed",
            };
          }

          // Payment succeeded after 3DS authentication
          if (paymentIntent?.status === "succeeded") {
            return {
              success: true,
              paymentIntentId: paymentIntent.id,
            };
          }

          // Payment still requires action (user cancelled or failed 3DS)
          if (paymentIntent?.status === "requires_action") {
            return {
              success: false,
              error: "Authentication was not completed. Please try again.",
            };
          }

          // Payment requires new payment method (card declined after 3DS)
          if (paymentIntent?.status === "requires_payment_method") {
            return {
              success: false,
              error: "Your card was declined. Please try a different card.",
            };
          }

          return {
            success: false,
            error: "Payment could not be completed. Please try again.",
          };
        } catch (err) {
          console.error("confirmCardPayment error:", err);
          return {
            success: false,
            error: err instanceof Error ? err.message : "Authentication failed",
          };
        }
      },
    }));

    return (
      <div className="space-y-4">
        <h3 className="text-base font-normal text-[#2e1b12]">Payment details</h3>

        {/* Card brand badges */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#643c15]">Cards accepted:</span>
          <div className="flex items-center gap-1">
            {CARD_BRANDS.map((brand) => (
              <div
                key={brand.name}
                className="w-10 h-6 bg-white/60 border border-[#cab797]/30 rounded flex items-center justify-center"
                title={brand.name}
              >
                <Image
                  src={brand.src}
                  alt={brand.name}
                  width={28}
                  height={18}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Card input */}
        <div>
          <label
            htmlFor="card"
            className="block text-sm font-medium text-[#643c15] mb-1"
          >
            Credit card
          </label>
          <div
            className={`
              p-3 border rounded-lg bg-white/60 transition-colors
              ${error ? "border-[#fb2c36]" : "border-[#cab797]/40"}
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "14px",
                    color: "#2e1b12",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSmoothing: "antialiased",
                    "::placeholder": {
                      color: "#717182",
                    },
                  },
                  invalid: {
                    color: "#fb2c36",
                    iconColor: "#fb2c36",
                  },
                },
                disabled,
                hidePostalCode: true,
              }}
              onChange={handleChange}
            />
          </div>
        </div>

        {error && (
          <p className="text-[#fb2c36] text-sm flex items-center gap-1">
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </p>
        )}

        <div className="flex items-center gap-2 text-xs text-[#643c15]/70">
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
          <span>Secured by Stripe. We never see your card details.</span>
        </div>
      </div>
    );
  }
);

export default PaymentForm;
