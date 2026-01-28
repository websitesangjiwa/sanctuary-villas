"use client";

import { useMemo, useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { format, addMonths, startOfMonth, differenceInDays } from "date-fns";
import { useCalendar } from "@/lib/hooks/useGuesty";
import { GuestyCalendarDay } from "@/types/guesty";
import "react-day-picker/style.css";
import "@/app/booking-calendar.css";

interface AvailabilityCalendarProps {
  listingId: string;
  selectedRange: DateRange | undefined;
  onRangeSelect: (range: DateRange | undefined) => void;
  minNights?: number;
  onClose?: () => void;
}

export default function AvailabilityCalendar({
  listingId,
  selectedRange,
  onRangeSelect,
  minNights = 1,
  onClose,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    if (selectedRange?.from) {
      return startOfMonth(selectedRange.from);
    }
    return startOfMonth(new Date());
  });

  // Calculate date range to fetch (current month + 2 months ahead)
  const fromDate = format(currentMonth, "yyyy-MM-dd");
  const toDate = format(addMonths(currentMonth, 3), "yyyy-MM-dd");

  // Fetch calendar data
  const { data: calendarData, isLoading } = useCalendar({
    listingId,
    from: fromDate,
    to: toDate,
  });

  // Create a map for quick date lookup
  const calendarMap = useMemo(() => {
    const map = new Map<string, GuestyCalendarDay>();
    calendarData?.forEach((day) => {
      map.set(day.date, day);
    });
    return map;
  }, [calendarData]);

  // Simple handleSelect - same pattern as BookingPanel
  const handleSelect = (newRange: DateRange | undefined) => {
    onRangeSelect(newRange);
    // Auto-close after both dates selected
    if (newRange?.from && newRange?.to && onClose) {
      setTimeout(() => onClose(), 300);
    }
  };

  // Simple disabled logic - only unavailable dates and past dates
  const disabledDays = (date: Date): boolean => {
    // Past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // Check availability status
    const dateStr = format(date, "yyyy-MM-dd");
    const dayData = calendarMap.get(dateStr);

    // No data or not available = disabled
    if (!dayData || dayData.status !== "available") return true;

    return false;
  };

  const nights =
    selectedRange?.from && selectedRange?.to
      ? differenceInDays(selectedRange.to, selectedRange.from)
      : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      {/* Calendar Header */}
      <div className="mb-4">
        <h3 className="text-primary-dark text-base font-medium">
          Select Dates
        </h3>
        {minNights > 1 && (
          <p className="text-primary text-sm mt-1">
            Minimum stay: {minNights} nights
          </p>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}

      {/* Calendar */}
      <div className="booking-calendar relative">
        <DayPicker
          mode="range"
          selected={selectedRange}
          onSelect={handleSelect}
          disabled={disabledDays}
          numberOfMonths={1}
          showOutsideDays={false}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          fromYear={new Date().getFullYear()}
          toYear={new Date().getFullYear() + 2}
          modifiers={{
            booked: (date) => {
              const dateStr = format(date, "yyyy-MM-dd");
              const dayData = calendarMap.get(dateStr);
              return (
                dayData?.status === "booked" || dayData?.status === "reserved"
              );
            },
            unavailable: (date) => {
              const dateStr = format(date, "yyyy-MM-dd");
              const dayData = calendarMap.get(dateStr);
              return dayData?.status === "unavailable";
            },
            checkInOnly: (date) => {
              const dateStr = format(date, "yyyy-MM-dd");
              const dayData = calendarMap.get(dateStr);
              return dayData?.cta === true && dayData?.ctd === false;
            },
          }}
          modifiersClassNames={{
            booked: "calendar-day-booked",
            unavailable: "calendar-day-unavailable",
            checkInOnly: "calendar-day-checkin-only",
          }}
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
            disabled:
              "text-gray-300 cursor-not-allowed hover:bg-transparent opacity-50",
            outside: "text-gray-400 opacity-50",
            today: "font-bold",
          }}
        />
      </div>

      {/* Date Summary */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
        <div>
          <div className="text-primary text-sm font-normal mb-1">Check-in</div>
          <div className="text-primary-dark text-base">
            {selectedRange?.from ? format(selectedRange.from, "MMM d") : "-"}
          </div>
        </div>
        <div>
          <div className="text-primary text-sm font-normal mb-1">Check-out</div>
          <div className="text-primary-dark text-base">
            {selectedRange?.to ? format(selectedRange.to, "MMM d") : "-"}
          </div>
        </div>
        <div>
          <div className="text-primary text-sm font-normal mb-1">Nights</div>
          <div className="text-primary-dark text-base">
            {nights > 0 ? nights : "-"}
          </div>
        </div>
      </div>

      {/* Min nights warning */}
      {selectedRange?.from &&
        selectedRange?.to &&
        nights > 0 &&
        nights < minNights && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-700 text-sm">
              Minimum stay is {minNights} nights. Please select a longer stay.
            </p>
          </div>
        )}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-xs text-primary">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-200 line-through" />
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
}
