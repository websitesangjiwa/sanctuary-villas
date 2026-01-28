"use client";

import { useState, useMemo } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { format, addMonths, startOfMonth, differenceInDays } from "date-fns";
import { useCalendar } from "@/lib/hooks/useGuesty";
import { GuestyCalendarDay } from "@/types/guesty";
import "react-day-picker/style.css";

const POPUP_TRANSITION_MS = 300;

interface PropertyDatePickerPopupProps {
  listingId: string;
  range: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  onClose: () => void;
  activeField: "checkin" | "checkout";
  minNights?: number;
  onOpenCheckout?: () => void;
}

export default function PropertyDatePickerPopup({
  listingId,
  range,
  onSelect,
  onClose,
  activeField,
  minNights = 1,
  onOpenCheckout,
}: PropertyDatePickerPopupProps) {
  const [month, setMonth] = useState<Date>(() => {
    if (activeField === "checkout" && range?.from) {
      return startOfMonth(range.from);
    }
    if (range?.from) {
      return startOfMonth(range.from);
    }
    return startOfMonth(new Date());
  });

  // Calculate date range to fetch (current month + 3 months ahead)
  const fromDate = format(month, "yyyy-MM-dd");
  const toDate = format(addMonths(month, 3), "yyyy-MM-dd");

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

  // Memoize modifiers to prevent re-renders
  const modifiers = useMemo(() => ({
    booked: (date: Date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const dayData = calendarMap.get(dateStr);
      return dayData?.status === "booked" || dayData?.status === "reserved";
    },
    unavailable: (date: Date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const dayData = calendarMap.get(dateStr);
      return dayData?.status === "unavailable";
    },
  }), [calendarMap]);

  const nights =
    range?.from && range?.to ? differenceInDays(range.to, range.from) : 0;

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    if (activeField === "checkin") {
      // Update check-in date
      const newRange: DateRange = {
        from: selectedDate,
        to: range?.to,
      };
      // Clear checkout if it's before the new checkin
      if (range?.to && selectedDate >= range.to) {
        newRange.to = undefined;
      }
      onSelect(newRange);
      // Close after selecting check-in
      setTimeout(() => {
        onClose();
        // Auto-open check-out popup
        if (onOpenCheckout) {
          setTimeout(() => onOpenCheckout(), POPUP_TRANSITION_MS);
        }
      }, POPUP_TRANSITION_MS);
    } else {
      // Update check-out date
      // Validate: check-out must be after check-in
      if (range?.from && selectedDate <= range.from) {
        // If selected date is before or equal to check-in, reset range
        const newRange: DateRange = {
          from: selectedDate,
          to: undefined,
        };
        onSelect(newRange);
      } else {
        const newRange: DateRange = {
          from: range?.from,
          to: selectedDate,
        };
        onSelect(newRange);
        // Auto-close when both dates are selected
        if (range?.from) {
          setTimeout(() => onClose(), POPUP_TRANSITION_MS);
        }
      }
    }
  };

  // Disabled logic with availability and minNights enforcement
  const isDateDisabled = (date: Date): boolean => {
    // Past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // For checkout, enforce minNights
    if (activeField === "checkout" && range?.from) {
      const minCheckoutDate = new Date(range.from);
      minCheckoutDate.setDate(minCheckoutDate.getDate() + minNights);
      if (date < minCheckoutDate) return true;
    }

    // If data not loaded yet, allow all future dates
    if (!calendarData || calendarData.length === 0) return false;

    // Check availability status
    const dateStr = format(date, "yyyy-MM-dd");
    const dayData = calendarMap.get(dateStr);

    // If date is in range but not in map, allow it
    if (!dayData) return false;

    return dayData.status !== "available";
  };

  return (
    <div
      className={`absolute top-full mt-2 z-50 bg-white rounded-lg shadow-lg p-4 min-w-[320px] ${
        activeField === "checkin" ? "left-0" : "right-0"
      }`}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}

      {/* Calendar */}
      <DayPicker
        mode="single"
        required
        selected={activeField === "checkin" ? range?.from : range?.to}
        month={month}
        onMonthChange={setMonth}
        onSelect={handleDateSelect}
        disabled={isDateDisabled}
        numberOfMonths={1}
        showOutsideDays={false}
        modifiers={modifiers}
        modifiersClassNames={{
          booked: "calendar-day-booked",
          unavailable: "calendar-day-unavailable",
        }}
        classNames={{
          root: "rdp-custom-booking",
          month_caption: "flex justify-center items-center h-[38px] mb-2 relative",
          caption_label: "text-sm font-medium text-primary-dark",
          nav: "flex gap-2 absolute left-0 right-0 top-0 justify-between pointer-events-auto z-10",
          button_previous:
            "border border-primary/20 rounded-lg w-7 h-7 flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer",
          button_next:
            "border border-primary/20 rounded-lg w-7 h-7 flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer",
          chevron: "w-4 h-4 text-primary",
          month_grid: "w-full",
          weekdays: "flex",
          weekday: "text-primary text-sm font-normal w-[42px] text-center",
          week: "flex",
          day: "w-[42px] h-10 flex items-center justify-center",
          day_button:
            "w-9 h-9 rounded-full hover:bg-primary/10 transition-colors flex items-center justify-center text-sm text-primary-dark",
          selected: "!bg-primary !text-white hover:bg-primary/90 [&>button]:text-white",
          disabled:
            "opacity-50 text-gray-400 cursor-not-allowed hover:bg-transparent",
          outside: "opacity-50 text-gray-400",
          today: "font-bold",
        }}
      />

      {/* Date Information Row */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
        <div>
          <div className="text-primary text-sm font-normal mb-1">Check-in</div>
          <div className="text-primary-dark text-base">
            {range?.from ? format(range.from, "MMM d") : "-"}
          </div>
        </div>
        <div>
          <div className="text-primary text-sm font-normal mb-1">Check-out</div>
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

      {/* Min nights notice */}
      {activeField === "checkout" && minNights > 1 && (
        <div className="mt-3 text-xs text-primary">
          Minimum stay: {minNights} nights
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-xs text-primary">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-200" />
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
}
