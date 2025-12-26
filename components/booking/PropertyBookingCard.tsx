"use client";

import { useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { format, differenceInDays } from "date-fns";
import { motion } from "framer-motion";
import { GuestyQuote } from "@/types/guesty";
import "react-day-picker/style.css";
import "@/app/booking-calendar.css";

interface PropertyBookingCardProps {
  listingId: string;
  listingTitle: string;
  maxGuests: number;
  minNights?: number;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
}

export default function PropertyBookingCard({
  listingId,
  listingTitle,
  maxGuests,
  minNights = 1,
  initialCheckIn,
  initialCheckOut,
  initialGuests = 1,
}: PropertyBookingCardProps) {
  // Date state
  const [range, setRange] = useState<DateRange | undefined>(() => {
    if (initialCheckIn && initialCheckOut) {
      return {
        from: new Date(initialCheckIn),
        to: new Date(initialCheckOut),
      };
    }
    return undefined;
  });

  // Guest state
  const [guests, setGuests] = useState(initialGuests);

  // Quote state
  const [quote, setQuote] = useState<GuestyQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nights =
    range?.from && range?.to ? differenceInDays(range.to, range.from) : 0;

  const handleGuestsChange = (delta: number) => {
    const newGuests = Math.max(1, Math.min(maxGuests, guests + delta));
    setGuests(newGuests);
    // Reset quote when guests change
    if (quote) {
      setQuote(null);
      setError(null);
    }
  };

  const handleDateSelect = (newRange: DateRange | undefined) => {
    setRange(newRange);
    // Reset quote when dates change
    if (quote) {
      setQuote(null);
      setError(null);
    }
  };

  const handleSearch = async () => {
    if (!range?.from || !range?.to) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/guesty/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId,
          checkIn: format(range.from, "yyyy-MM-dd"),
          checkOut: format(range.to, "yyyy-MM-dd"),
          guests,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Parse error for user-friendly message
        const errorDetails = data.details || "";
        if (errorDetails.includes("LISTING_IS_NOT_AVAILABLE")) {
          throw new Error("These dates are not available. Please try different dates.");
        }
        throw new Error(data.error || "Failed to get quote");
      }

      setQuote(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to check availability"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!range?.from || !range?.to) return;

    const checkIn = format(range.from, "yyyy-MM-dd");
    const checkOut = format(range.to, "yyyy-MM-dd");
    const checkoutUrl = `https://sanctuaryvillas.guestybookings.com/en/properties/${listingId}/checkout?minOccupancy=${guests}&checkIn=${checkIn}&checkOut=${checkOut}`;

    window.open(checkoutUrl, "_blank");
  };

  const handleBack = () => {
    setQuote(null);
    setError(null);
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Quote details view
  if (quote) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Title */}
        <h3 className="font-serif text-lg text-primary-dark mb-4">
          {listingTitle}
        </h3>

        {/* Dates summary */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-primary uppercase mb-1">Check In</p>
            <p className="text-primary-dark font-medium text-sm">
              {format(new Date(quote.checkIn), "MMM d, yyyy")}
            </p>
          </div>
          <div>
            <p className="text-xs text-primary uppercase mb-1">Check Out</p>
            <p className="text-primary-dark font-medium text-sm">
              {format(new Date(quote.checkOut), "MMM d, yyyy")}
            </p>
          </div>
          <div>
            <p className="text-xs text-primary uppercase mb-1">Nights</p>
            <p className="text-primary-dark font-medium text-sm">
              {quote.nights} Night{quote.nights > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Guests */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="text-xs text-primary uppercase mb-1">Guest</p>
          <p className="text-primary-dark font-medium text-sm">{quote.guests}</p>
        </div>

        {/* Price breakdown */}
        <div className="space-y-3 mb-4">
          {/* Subtotal (accommodation) */}
          <div className="flex justify-between">
            <span className="text-primary-dark">Subtotal</span>
            <span className="text-primary-dark font-medium">
              {formatPrice(quote.accommodationFare, quote.currency)}
            </span>
          </div>

          {/* Fees */}
          {quote.fees.length > 0 && (
            <div className="flex justify-between">
              <span className="text-primary">Fees</span>
              <span className="text-primary">
                {formatPrice(
                  quote.fees.reduce((sum, fee) => sum + fee.amount, 0),
                  quote.currency
                )}
              </span>
            </div>
          )}

          {/* Taxes */}
          {quote.taxes && quote.taxes.length > 0 && (
            <div className="flex justify-between">
              <span className="text-primary">Taxes</span>
              <span className="text-primary">
                {formatPrice(
                  quote.taxes.reduce((sum, tax) => sum + tax.amount, 0),
                  quote.currency
                )}
              </span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="flex justify-between pt-4 border-t border-gray-200 mb-6">
          <span className="text-primary-dark font-semibold">Total</span>
          <span className="text-primary-dark font-semibold text-lg">
            {formatPrice(quote.totalPrice, quote.currency)}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBack}
            className="w-12 h-12 flex items-center justify-center border border-primary rounded-lg hover:bg-primary/5 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-primary"
            >
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBookNow}
            className="flex-1 bg-primary text-white text-base font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Book now
          </motion.button>
        </div>
      </div>
    );
  }

  // Search form view
  return (
    <div className="bg-[#fffdf3] rounded-lg shadow-lg p-6">
      {/* Header */}
      <h3 className="text-primary-dark text-base font-medium mb-4">
        Search for available dates
      </h3>

      {/* Calendar */}
      <div className="mb-4 booking-calendar">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={handleDateSelect}
          disabled={{ before: new Date() }}
          numberOfMonths={1}
          showOutsideDays={false}
          captionLayout="dropdown"
          fromYear={new Date().getFullYear()}
          toYear={new Date().getFullYear() + 2}
          components={{
            Chevron: ({ orientation }) => {
              if (orientation === "left") {
                return (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M10 12L6 8L10 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                );
              }
              return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              );
            },
          }}
          classNames={{
            root: "rdp-custom",
            months: "rdp-months",
            month: "rdp-month",
            month_caption: "rdp-caption",
            caption_label: "rdp-caption_label",
            nav: "rdp-nav",
            button_previous: "rdp-nav-button rdp-nav-button-previous",
            button_next: "rdp-nav-button rdp-nav-button-next",
            month_grid: "rdp-table",
            weekdays: "rdp-head",
            weekday: "text-primary text-sm font-normal",
            weeks: "rdp-tbody",
            week: "rdp-week",
            day: "rdp-day text-primary-dark",
            day_button:
              "rdp-day-button w-10 h-10 rounded-full hover:bg-primary/10 transition-colors",
            selected: "bg-primary text-surface hover:bg-primary/90",
            range_start: "bg-primary text-surface",
            range_end: "bg-primary text-surface",
            range_middle: "bg-primary/20 text-primary-dark",
            disabled: "text-gray-300 cursor-not-allowed hover:bg-transparent",
            outside: "text-gray-400 opacity-50",
            today: "font-bold",
            dropdowns: "rdp-dropdowns",
            dropdown_root: "rdp-dropdown-root",
            dropdown: "rdp-dropdown",
          }}
        />
      </div>

      {/* Date info row */}
      {range?.from && range?.to && (
        <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-primary/20">
          <div>
            <p className="text-primary text-xs mb-1">Check-in</p>
            <p className="text-primary-dark text-sm font-medium">
              {format(range.from, "MMM d")}
            </p>
          </div>
          <div>
            <p className="text-primary text-xs mb-1">Check-out</p>
            <p className="text-primary-dark text-sm font-medium">
              {format(range.to, "MMM d")}
            </p>
          </div>
          <div>
            <p className="text-primary text-xs mb-1">Nights</p>
            <p className="text-primary-dark text-sm font-medium">{nights}</p>
          </div>
        </div>
      )}

      {/* Guest selector */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-primary/20">
        <span className="text-primary text-sm">Guests</span>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleGuestsChange(-1)}
            disabled={guests <= 1}
            className="w-8 h-8 flex items-center justify-center border border-primary-light rounded-md hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-primary-light"
            >
              <path
                d="M3 8H13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </motion.button>
          <span className="text-primary text-sm font-normal w-8 text-center">
            {guests}
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleGuestsChange(1)}
            disabled={guests >= maxGuests}
            className="w-8 h-8 flex items-center justify-center border border-primary-light rounded-md hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-primary-light"
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

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
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

      {/* Search button */}
      <motion.button
        whileHover={
          !range?.from || !range?.to || isLoading || (minNights > 1 && nights < minNights)
            ? {}
            : { scale: 1.02 }
        }
        whileTap={
          !range?.from || !range?.to || isLoading || (minNights > 1 && nights < minNights)
            ? {}
            : { scale: 0.98 }
        }
        onClick={handleSearch}
        disabled={!range?.from || !range?.to || isLoading || (minNights > 1 && nights < minNights)}
        className="w-full bg-primary text-white text-base font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
            Searching...
          </>
        ) : (
          "Search"
        )}
      </motion.button>
    </div>
  );
}
