"use client";

import Image from "next/image";
import { format } from "date-fns";
import { GuestyQuoteWithRatePlan, GuestyListing } from "@/types/guesty";

interface OrderSummaryProps {
  listing: GuestyListing;
  quote: GuestyQuoteWithRatePlan;
  isSubmitting?: boolean;
  onSubmit?: () => void;
}

// Format price with currency and decimals
const formatPrice = (amount: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export default function OrderSummary({ listing, quote, isSubmitting = false, onSubmit }: OrderSummaryProps) {
  // Get first image (prefer larger sizes for full-width display)
  const listingImage =
    listing.pictures?.[0]?.large ||
    listing.pictures?.[0]?.regular ||
    listing.pictures?.[0]?.original ||
    listing.pictures?.[0]?.thumbnail ||
    null;

  // Parse dates without timezone shift
  const checkInDate = new Date(quote.checkIn + "T12:00:00");
  const checkOutDate = new Date(quote.checkOut + "T12:00:00");

  // Calculate totals for display
  const totalFees = quote.fees.reduce((sum, fee) => sum + fee.amount, 0);
  const totalTaxes = quote.taxes?.reduce((sum, tax) => sum + tax.amount, 0) || 0;

  return (
    <div className="bg-white/40 rounded-xl p-6 space-y-4 border border-[#cab797]/20">
      {/* Full-width Property Image */}
      <div className="relative w-full h-48 rounded-lg overflow-hidden -mt-2">
        {listingImage ? (
          <Image
            src={listingImage}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className="w-full h-full bg-[#cab797]/20 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-[#cab797]/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Villa Title */}
      <h3 className="font-['Ovo'] text-base text-[#2e1b12] leading-6">
        {listing.title}
      </h3>

      {/* Dates Grid - 2 columns */}
      <div className="grid grid-cols-2 gap-4 pb-3 border-b border-[#cab797]/30">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-[#643c15]">Check in</span>
          <span className="text-sm text-[#2e1b12]">
            {format(checkInDate, "MMM d, yyyy")}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-[#643c15]">Check Out</span>
          <span className="text-sm text-[#2e1b12]">
            {format(checkOutDate, "MMM d, yyyy")}
          </span>
        </div>
      </div>

      {/* Nights & Guests Grid - 2 columns */}
      <div className="grid grid-cols-2 gap-4 pb-3 border-b border-[#cab797]/30">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-[#643c15]">Nights</span>
          <span className="text-sm text-[#2e1b12]">
            {quote.nights} Night{quote.nights > 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-[#643c15]">Guest</span>
          <span className="text-sm text-[#2e1b12]">{quote.guests}</span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-2 pb-3 border-b border-[#cab797]/30">
        <div className="flex justify-between text-sm">
          <span className="text-[#643c15]">Subtotal</span>
          <span className="text-[#2e1b12]">
            {formatPrice(quote.accommodationFare, quote.currency)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#643c15]">Fees</span>
          <span className="text-[#2e1b12]">
            {formatPrice(totalFees, quote.currency)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#643c15]">Taxes</span>
          <span className="text-[#2e1b12]">
            {formatPrice(totalTaxes, quote.currency)}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-base text-[#2e1b12]">Total</span>
        <span className="text-base text-[#2e1b12]">
          {formatPrice(quote.totalPrice, quote.currency)}
        </span>
      </div>

      {/* Submit Button */}
      {onSubmit && (
        <button
          type="submit"
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`
            w-full py-3 rounded-lg font-medium text-sm
            transition-all duration-200
            ${
              isSubmitting
                ? "bg-[#8b6630]/50 cursor-not-allowed"
                : "bg-[#8b6630] hover:bg-[#8b6630]/90"
            }
            text-white
          `}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </span>
          ) : (
            "Book now"
          )}
        </button>
      )}
    </div>
  );
}
