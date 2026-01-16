"use client";

import Link from "next/link";
import { useQuote } from "@/lib/hooks/useGuesty";
import CheckoutForm from "./CheckoutForm";
import { GuestyListing } from "@/types/guesty";

interface CheckoutContentProps {
  listing: GuestyListing;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export default function CheckoutContent({
  listing,
  checkIn,
  checkOut,
  guests,
}: CheckoutContentProps) {
  const {
    data: quote,
    isLoading,
    error,
  } = useQuote({
    listingId: listing._id,
    checkIn,
    checkOut,
    guests,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="mx-auto">
        <div className="mb-8">
          <h1 className="font-serif text-2xl lg:text-3xl text-primary-dark mb-2">
            Complete Your Booking
          </h1>
          <p className="text-primary">You&apos;re booking {listing.title}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white/40 rounded-xl p-6 border border-[#cab797]/20 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="space-y-3">
                  <div className="h-10 bg-gray-200 rounded" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="bg-white/40 rounded-xl p-6 border border-[#cab797]/20 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
              <div className="h-12 bg-gray-200 rounded mt-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !quote) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="font-serif text-2xl text-primary-dark mb-2">
            Unable to Load Checkout
          </h1>
          <p className="text-primary mb-6">
            {error?.message ||
              "The selected dates may no longer be available or the quote has expired."}
          </p>
          <Link
            href={`/properties/${listing._id}?checkIn=${checkIn}&checkOut=${checkOut}&minOccupancy=${guests}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Property
          </Link>
        </div>
      </div>
    );
  }

  // Success state - render checkout form
  return (
    <div className="mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-2xl lg:text-3xl text-primary-dark mb-2">
          Complete Your Booking
        </h1>
        <p className="text-primary">You&apos;re booking {listing.title}</p>
      </div>

      <CheckoutForm listing={listing} quote={quote} />
    </div>
  );
}
