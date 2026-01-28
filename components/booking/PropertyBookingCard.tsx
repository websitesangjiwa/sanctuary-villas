"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, differenceInDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { motion } from "framer-motion";
import { useQuote } from "@/lib/hooks/useGuesty";
import PropertyDatePickerPopup from "./PropertyDatePickerPopup";

interface PropertyBookingCardProps {
  listingId: string;
  maxGuests: number;
  minNights?: number;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  pointOfSale?: string;
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

// Parse date string to Date object without timezone shift
const parseDate = (dateStr: string) => new Date(dateStr + "T12:00:00");

export default function PropertyBookingCard({
  listingId,
  maxGuests,
  minNights = 1,
  initialCheckIn,
  initialCheckOut,
  initialGuests = 1,
  pointOfSale,
}: PropertyBookingCardProps) {
  const router = useRouter();
  const calendarRef = useRef<HTMLDivElement>(null);

  // State for date selection
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    () => {
      if (initialCheckIn && initialCheckOut) {
        return {
          from: parseDate(initialCheckIn),
          to: parseDate(initialCheckOut),
        };
      }
      return undefined;
    }
  );

  // State for showing calendar and which field is active
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeField, setActiveField] = useState<"checkin" | "checkout" | null>(null);

  // State for guests
  const [guests, setGuests] = useState(initialGuests);

  // Handle date field click
  const handleDateFieldClick = (field: "checkin" | "checkout") => {
    setActiveField(field);
    setShowCalendar(true);
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
        setActiveField(null);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  // Calculate derived values
  const checkInDate = selectedRange?.from;
  const checkOutDate = selectedRange?.to;
  const nights =
    checkInDate && checkOutDate
      ? differenceInDays(checkOutDate, checkInDate)
      : 0;

  // Format dates for API calls
  const checkInStr = checkInDate ? format(checkInDate, "yyyy-MM-dd") : undefined;
  const checkOutStr = checkOutDate
    ? format(checkOutDate, "yyyy-MM-dd")
    : undefined;

  // Use React Query for cached quote fetching
  const { data: quote, isLoading: quoteLoading } = useQuote({
    listingId,
    checkIn: checkInStr,
    checkOut: checkOutStr,
    guests,
  });

  const handleBook = () => {
    if (!checkInStr || !checkOutStr) return;
    // Navigate to our internal checkout page
    let url = `/checkout/${listingId}?checkIn=${checkInStr}&checkOut=${checkOutStr}&guests=${guests}`;
    // Preserve pointofsale for Google VR tracking
    if (pointOfSale) {
      url += `&pointofsale=${pointOfSale}`;
    }
    router.push(url);
  };

  const handleGuestsChange = (delta: number) => {
    const newGuests = Math.max(1, Math.min(maxGuests, guests + delta));
    setGuests(newGuests);
  };

  const isBookDisabled =
    !checkInDate ||
    !checkOutDate ||
    (minNights > 1 && nights < minNights) ||
    quoteLoading;

  // Calculate price per night from quote
  const pricePerNight =
    quote && quote.nights > 0 ? quote.totalPrice / quote.nights : null;

  return (
    <div className="bg-[#fffdf3] rounded-lg shadow-lg p-6 relative">
      {/* Price per night from quote - always show section to prevent layout jump */}
      <div className="mb-4 pb-4 border-b border-primary/20">
        {quoteLoading ? (
          <div className="flex items-center gap-1">
            <div className="h-7 w-28 bg-primary/10 rounded animate-pulse" />
            <span className="text-primary text-sm">/ night</span>
          </div>
        ) : pricePerNight ? (
          <>
            <span className="text-primary-dark text-xl font-semibold">
              {formatPrice(pricePerNight, quote?.currency)}
            </span>
            <span className="text-primary text-sm"> / night</span>
          </>
        ) : (
          <span className="text-primary text-sm">Select dates to see price</span>
        )}
      </div>

      {/* Date Selection */}
      <div className="mb-4 pb-4 border-b border-primary/20 relative" ref={calendarRef}>
        <div className="space-y-3">
          {/* Check-in / Check-out Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <button
                onClick={() => handleDateFieldClick("checkin")}
                className="w-full text-left p-3 border border-primary/20 rounded-lg hover:border-primary/40 transition-colors bg-white"
              >
                <div className="text-primary text-xs font-normal mb-1">
                  Check-in
                </div>
                <div className="text-primary-dark text-sm font-medium">
                  {checkInDate ? format(checkInDate, "MMM d, yyyy") : "Select"}
                </div>
              </button>

              {/* Check-in Calendar Popup */}
              {showCalendar && activeField === "checkin" && (
                <PropertyDatePickerPopup
                  listingId={listingId}
                  range={selectedRange}
                  onSelect={setSelectedRange}
                  onClose={() => {
                    setShowCalendar(false);
                    setActiveField(null);
                  }}
                  activeField="checkin"
                  minNights={minNights}
                  onOpenCheckout={() => {
                    setActiveField("checkout");
                    setShowCalendar(true);
                  }}
                />
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => handleDateFieldClick("checkout")}
                className="w-full text-left p-3 border border-primary/20 rounded-lg hover:border-primary/40 transition-colors bg-white"
              >
                <div className="text-primary text-xs font-normal mb-1">
                  Check-out
                </div>
                <div className="text-primary-dark text-sm font-medium">
                  {checkOutDate ? format(checkOutDate, "MMM d, yyyy") : "Select"}
                </div>
              </button>

              {/* Check-out Calendar Popup */}
              {showCalendar && activeField === "checkout" && (
                <PropertyDatePickerPopup
                  listingId={listingId}
                  range={selectedRange}
                  onSelect={setSelectedRange}
                  onClose={() => {
                    setShowCalendar(false);
                    setActiveField(null);
                  }}
                  activeField="checkout"
                  minNights={minNights}
                />
              )}
            </div>
          </div>

          {/* Nights display */}
          {nights > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-primary">Nights</span>
              <span className="text-primary-dark font-medium">{nights}</span>
            </div>
          )}
        </div>
      </div>

      {/* Guest Selector */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-primary/20">
        <span className="text-primary text-sm">Guests</span>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleGuestsChange(-1)}
            disabled={guests <= 1}
            className="w-8 h-8 flex items-center justify-center border border-primary/30 rounded-md hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-primary"
            >
              <path
                d="M3 8H13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </motion.button>
          <span className="text-primary-dark text-sm font-medium w-6 text-center">
            {guests}
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleGuestsChange(1)}
            disabled={guests >= maxGuests}
            className="w-8 h-8 flex items-center justify-center border border-primary/30 rounded-md hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-primary"
            >
              <path
                d="M8 3V13M3 8H13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Total Price from quote */}
      {checkInDate && checkOutDate && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-primary/20">
          <span className="text-primary text-sm">Total</span>
          {quoteLoading ? (
            <div className="flex items-center gap-2 text-primary text-sm">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Loading...</span>
            </div>
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
        className="w-full bg-primary text-white text-base font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {quoteLoading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Calculating...
          </>
        ) : !checkInDate || !checkOutDate ? (
          "Select dates"
        ) : (
          "Book"
        )}
      </motion.button>

      {/* No dates selected hint */}
      {!checkInDate && (
        <p className="text-center text-primary text-xs mt-3">
          Click on dates above to check availability
        </p>
      )}
    </div>
  );
}
