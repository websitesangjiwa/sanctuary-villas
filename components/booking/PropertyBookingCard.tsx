"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, differenceInDays } from "date-fns";
import { motion } from "framer-motion";
import { useQuote } from "@/lib/hooks/useGuesty";

interface PropertyBookingCardProps {
  listingId: string;
  maxGuests: number;
  minNights?: number;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
}

// Format price with currency
const formatPrice = (amount: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function PropertyBookingCard({
  listingId,
  maxGuests,
  minNights = 1,
  initialCheckIn,
  initialCheckOut,
  initialGuests = 1,
}: PropertyBookingCardProps) {
  const router = useRouter();
  const [guests] = useState(initialGuests);

  // Parse dates without timezone shift
  const checkInDate = initialCheckIn ? new Date(initialCheckIn + "T12:00:00") : null;
  const checkOutDate = initialCheckOut ? new Date(initialCheckOut + "T12:00:00") : null;
  const nights = checkInDate && checkOutDate ? differenceInDays(checkOutDate, checkInDate) : 0;

  // Use React Query for cached quote fetching
  const { data: quote, isLoading: quoteLoading } = useQuote({
    listingId,
    checkIn: initialCheckIn,
    checkOut: initialCheckOut,
    guests,
  });

  const handleBook = () => {
    if (!initialCheckIn || !initialCheckOut) return;
    // Navigate to our internal checkout page
    router.push(`/checkout/${listingId}?checkIn=${initialCheckIn}&checkOut=${initialCheckOut}&guests=${guests}`);
  };

  const isBookDisabled = !initialCheckIn || !initialCheckOut || (minNights > 1 && nights < minNights);

  // Calculate price per night from quote
  const pricePerNight = quote && quote.nights > 0 ? quote.totalPrice / quote.nights : null;

  return (
    <div className="bg-[#fffdf3] rounded-lg shadow-lg p-6">
      {/* Price per night from quote */}
      {pricePerNight && !quoteLoading && (
        <div className="mb-4 pb-4 border-b border-primary/20">
          <span className="text-primary-dark text-xl font-semibold">
            {formatPrice(pricePerNight, quote?.currency)}
          </span>
          <span className="text-primary text-sm"> / night</span>
        </div>
      )}

      {/* Date info */}
      {checkInDate && checkOutDate && (
        <div className="space-y-3 mb-4 pb-4 border-b border-primary/20">
          <div className="flex items-center justify-between">
            <span className="text-primary text-sm">Check-in</span>
            <span className="text-primary-dark text-sm font-medium">
              {format(checkInDate, "MMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-primary text-sm">Check-out</span>
            <span className="text-primary-dark text-sm font-medium">
              {format(checkOutDate, "MMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-primary text-sm">Nights</span>
            <span className="text-primary-dark text-sm font-medium">{nights}</span>
          </div>
        </div>
      )}

      {/* Guests display */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-primary/20">
        <span className="text-primary text-sm">Guests</span>
        <span className="text-primary-dark text-sm font-medium">{guests}</span>
      </div>

      {/* Total Price from quote */}
      {checkInDate && checkOutDate && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-primary/20">
          <span className="text-primary text-sm">Total</span>
          {quoteLoading ? (
            <span className="text-primary text-sm">Loading...</span>
          ) : quote ? (
            <span className="text-primary-dark text-base font-semibold">
              {formatPrice(quote.totalPrice, quote.currency)}
            </span>
          ) : (
            <span className="text-primary text-sm">-</span>
          )}
        </div>
      )}

      {/* Min nights notice */}
      {minNights > 1 && nights > 0 && nights < minNights && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-700 text-sm">
            Minimum stay: {minNights} nights
          </p>
        </div>
      )}

      {/* Book button */}
      <motion.button
        whileHover={isBookDisabled ? {} : { scale: 1.02 }}
        whileTap={isBookDisabled ? {} : { scale: 0.98 }}
        onClick={handleBook}
        disabled={isBookDisabled}
        className="w-full bg-primary text-white text-base font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Book
      </motion.button>
    </div>
  );
}
