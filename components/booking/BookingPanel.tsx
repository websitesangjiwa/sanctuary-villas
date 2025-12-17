"use client";

import { useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { format, differenceInDays } from "date-fns";
import { motion } from "framer-motion";
import "react-day-picker/style.css";
import "@/app/booking-calendar.css";

interface BookingPanelProps {
  onDateChange?: (range: DateRange | undefined) => void;
  onGuestsChange?: (adults: number, children: number) => void;
  onFindDate?: () => void;
  onSearch?: (checkIn: string, checkOut: string, guests: number) => void;
  isLoading?: boolean;
}

export default function BookingPanel({
  onDateChange,
  onGuestsChange,
  onFindDate,
  onSearch,
  isLoading = false,
}: BookingPanelProps) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const handleSelect = (newRange: DateRange | undefined) => {
    setRange(newRange);
    onDateChange?.(newRange);
  };

  const handleAdultsChange = (delta: number) => {
    const newAdults = Math.max(1, adults + delta);
    setAdults(newAdults);
    onGuestsChange?.(newAdults, children);
  };

  const handleChildrenChange = (delta: number) => {
    const newChildren = Math.max(0, children + delta);
    setChildren(newChildren);
    onGuestsChange?.(adults, newChildren);
  };

  const nights =
    range?.from && range?.to ? differenceInDays(range.to, range.from) : 0;

  return (
    <div className="bg-[#fffdf3] rounded-lg shadow-lg p-8">
      {/* Header */}
      <h3 className="text-primary-dark text-base font-normal mb-6">
        Select Dates
      </h3>

      {/* Calendar */}
      <div className="mb-6 booking-calendar">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={handleSelect}
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
                    xmlns="http://www.w3.org/2000/svg"
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
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
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

      {/* Date Information Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <div className="text-primary text-sm font-normal mb-1">Check-in</div>
          <div className="text-primary-dark text-base">
            {range?.from ? format(range.from, "MMM d") : "-"}
          </div>
        </div>
        <div>
          <div className="text-primary text-sm font-normal mb-1">
            Check-out
          </div>
          <div className="text-primary-dark text-base">
            {range?.to ? format(range.to, "MMM d") : "-"}
          </div>
        </div>
        <div>
          <div className="text-primary text-sm font-normal mb-1">Nights</div>
          <div className="text-primary-dark text-base">
            {nights > 0 ? nights : "-"}
          </div>
        </div>
      </div>

      {/* Guest Selectors */}
      <div className="space-y-4 mb-6">
        {/* Adults */}
        <div className="flex items-center justify-between">
          <span className="text-primary text-base font-normal">Adults</span>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAdultsChange(-1)}
              disabled={adults <= 1}
              className="w-8 h-8 flex items-center justify-center border border-primary-light rounded-md hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
            <span className="text-primary text-base font-normal w-8 text-center">
              {adults}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAdultsChange(1)}
              className="w-8 h-8 flex items-center justify-center border border-primary-light rounded-md hover:bg-primary/10 transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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

        {/* Children */}
        <div className="flex items-center justify-between">
          <span className="text-primary-dark text-base font-normal">
            Children
          </span>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleChildrenChange(-1)}
              disabled={children <= 0}
              className="w-8 h-8 flex items-center justify-center border border-primary-light rounded-md hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
            <span className="text-primary text-base font-normal w-8 text-center">
              {children}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleChildrenChange(1)}
              className="w-8 h-8 flex items-center justify-center border border-primary-light rounded-md hover:bg-primary/10 transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
      </div>

      {/* Find Date Button */}
      <motion.button
        whileHover={!range?.from || !range?.to || isLoading ? {} : { scale: 1.02 }}
        whileTap={!range?.from || !range?.to || isLoading ? {} : { scale: 0.98 }}
        onClick={() => {
          if (onFindDate) {
            onFindDate();
          }
          if (onSearch && range?.from && range?.to) {
            const checkIn = format(range.from, "yyyy-MM-dd");
            const checkOut = format(range.to, "yyyy-MM-dd");
            onSearch(checkIn, checkOut, adults + children);
          }
        }}
        disabled={!range?.from || !range?.to || isLoading}
        className="w-full bg-primary text-surface text-sm font-medium leading-5 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
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
            Searching...
          </>
        ) : (
          "Find Date"
        )}
      </motion.button>
    </div>
  );
}
