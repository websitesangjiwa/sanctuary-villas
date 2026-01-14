"use client";

import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useState, useEffect, ReactNode } from "react";

interface StripeProviderProps {
  listingId: string;
  children: ReactNode;
}

export default function StripeProvider({
  listingId,
  children,
}: StripeProviderProps) {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initStripe() {
      try {
        const response = await fetch(
          `/api/guesty/listings/${listingId}/payment-provider`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || "Failed to load payment provider"
          );
        }

        const { publishableKey } = await response.json();

        if (!publishableKey) {
          throw new Error("Payment provider not configured");
        }

        // Load Stripe with the publishable key
        // Guesty handles the payment provider association on their end
        const stripeInstance = await loadStripe(publishableKey);
        setStripe(stripeInstance);
      } catch (err) {
        console.error("Stripe initialization error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to initialize payment"
        );
      } finally {
        setLoading(false);
      }
    }

    initStripe();
  }, [listingId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-primary text-sm">Loading payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-sm">{error}</p>
        <p className="text-red-500 text-xs mt-1">
          Please try again later or contact support.
        </p>
      </div>
    );
  }

  if (!stripe) {
    return null;
  }

  return (
    <Elements
      stripe={stripe}
      options={{
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#1a3c34",
            colorBackground: "#fffdf3",
            colorText: "#1a3c34",
            colorDanger: "#dc2626",
            fontFamily: "system-ui, sans-serif",
            borderRadius: "8px",
          },
        },
      }}
    >
      {children}
    </Elements>
  );
}
