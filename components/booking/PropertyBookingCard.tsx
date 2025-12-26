"use client";

import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { motion } from "framer-motion";

interface PropertyBookingCardProps {
  listingId: string;
  maxGuests: number;
  minNights?: number;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
}

export default function PropertyBookingCard({
  listingId,
  maxGuests,
  minNights = 1,
  initialCheckIn,
  initialCheckOut,
  initialGuests = 1,
}: PropertyBookingCardProps) {
  const [guests, setGuests] = useState(initialGuests);

  // Parse dates without timezone shift (add T12:00:00 to avoid UTC midnight issues)
  const checkInDate = initialCheckIn ? new Date(initialCheckIn + "T12:00:00") : null;
  const checkOutDate = initialCheckOut ? new Date(initialCheckOut + "T12:00:00") : null;
  const nights =
    checkInDate && checkOutDate ? differenceInDays(checkOutDate, checkInDate) : 0;

  const handleGuestsChange = (delta: number) => {
    const newGuests = Math.max(1, Math.min(maxGuests, guests + delta));
    setGuests(newGuests);
  };

  const handleBook = () => {
    if (!initialCheckIn || !initialCheckOut) return;

    const bookingUrl = `https://sanctuaryvillas.guestybookings.com/en/properties/${listingId}/checkout?minOccupancy=${guests}&checkIn=${initialCheckIn}&checkOut=${initialCheckOut}`;
    window.open(bookingUrl, "_blank");
  };

  const isBookDisabled = !initialCheckIn || !initialCheckOut || (minNights > 1 && nights < minNights);

  return (
    <div className="bg-[#fffdf3] rounded-lg shadow-lg p-6">
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
