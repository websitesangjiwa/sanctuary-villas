"use client";

import { useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { format, differenceInDays } from "date-fns";
import { motion } from "framer-motion";
import "react-day-picker/style.css";
import "@/app/booking-calendar.css";

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

  const nights =
    range?.from && range?.to ? differenceInDays(range.to, range.from) : 0;

  const handleGuestsChange = (delta: number) => {
    const newGuests = Math.max(1, Math.min(maxGuests, guests + delta));
    setGuests(newGuests);
  };

  const handleDateSelect = (newRange: DateRange | undefined) => {
    setRange(newRange);
  };

  const handleBook = () => {
    if (!range?.from || !range?.to) return;

    const checkIn = format(range.from, "yyyy-MM-dd");
    const checkOut = format(range.to, "yyyy-MM-dd");
    const bookingUrl = `https://sanctuaryvillas.guestybookings.com/en/properties/${listingId}?minOccupancy=${guests}&checkIn=${checkIn}&checkOut=${checkOut}`;

    window.open(bookingUrl, "_blank");
  };

  const isBookDisabled = !range?.from || !range?.to || (minNights > 1 && nights < minNights);

  return (
    <div className="bg-[#fffdf3] rounded-lg shadow-lg p-6">
      {/* Header */}
      <h3 className="text-primary-dark text-base font-medium mb-4">
        Select your dates
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
