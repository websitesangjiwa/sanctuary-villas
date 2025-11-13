"use client";

import { useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { format, differenceInDays, addDays } from "date-fns";
import "react-day-picker/style.css";

interface DatePickerPopupProps {
  range: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  onClose: () => void;
  activeField: "checkin" | "checkout";
  onOpenCheckout?: () => void;
}

export default function DatePickerPopup({
  range,
  onSelect,
  onClose,
  activeField,
  onOpenCheckout,
}: DatePickerPopupProps) {
  const [month, setMonth] = useState<Date>(new Date());

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
      onSelect(newRange);
      // Close after selecting check-in
      setTimeout(() => {
        onClose();
        // Auto-open check-out if it's the first selection (no previous range)
        if (!range?.from && onOpenCheckout) {
          setTimeout(() => onOpenCheckout(), 300);
        }
      }, 300);
    } else {
      // Update check-out date
      // Validate: check-out must be after check-in
      if (range?.from && selectedDate < range.from) {
        // If selected date is before check-in, reset range
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
          setTimeout(() => onClose(), 300);
        }
      }
    }
  };

  return (
    <div
      className="absolute top-full mt-2 z-50 bg-white rounded-lg shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-3"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Calendar */}
      <div className="mb-6">
        <DayPicker
          mode="single"
          selected={activeField === "checkin" ? range?.from : range?.to}
          month={month}
          onMonthChange={setMonth}
          onSelect={handleDateSelect}
          disabled={{ before: new Date() }}
          numberOfMonths={1}
          showOutsideDays={true}
          classNames={{
            root: "rdp-custom-booking",
            month_caption: "flex justify-center items-center h-[38px] mb-2 relative",
            caption_label: "text-sm font-medium text-neutral-950",
            nav: "flex gap-2 absolute left-0 right-0 top-0 justify-between pointer-events-auto z-10",
            button_previous:
              "border border-[rgba(0,0,0,0.1)] opacity-50 rounded-lg w-7 h-7 flex items-center justify-center hover:opacity-100 transition-opacity cursor-pointer",
            button_next:
              "border border-[rgba(0,0,0,0.1)] opacity-50 rounded-lg w-7 h-7 flex items-center justify-center hover:opacity-100 transition-opacity cursor-pointer",
            chevron: "w-4 h-4",
            month_grid: "w-full",
            weekdays: "flex",
            weekday: "text-[#643c15] text-sm font-normal w-[47px] text-center",
            week: "flex",
            day: "w-[47px] h-10 flex items-center justify-center",
            day_button:
              "w-10 h-10 rounded-full hover:bg-primary/10 transition-colors flex items-center justify-center text-base text-[#0A0A0A]",
            selected: "bg-[#eae7d9] text-[#0A0A0A] hover:bg-[#eae7d9]/80",
            range_start: "bg-[#eae7d9] text-[#0A0A0A]",
            range_end: "bg-[#eae7d9] text-[#0A0A0A]",
            range_middle: "bg-[#eae7d9] text-[#0A0A0A]",
            disabled: "opacity-50 text-[#717182] cursor-not-allowed hover:bg-transparent",
            outside: "opacity-50 text-[#717182]",
            today: "bg-[#eae7d9] font-normal",
          }}
        />
      </div>

      {/* Date Information Row */}
      <div className="grid grid-cols-3 gap-4 px-3">
        <div>
          <div className="text-[#643c15] text-sm font-normal mb-1">
            Check-in
          </div>
          <div className="text-[#2e1b12] text-base">
            {range?.from ? format(range.from, "MMM d") : "-"}
          </div>
        </div>
        <div>
          <div className="text-[#643c15] text-sm font-normal mb-1">
            Check-out
          </div>
          <div className="text-[#2e1b12] text-base">
            {range?.to ? format(range.to, "MMM d") : "-"}
          </div>
        </div>
        <div>
          <div className="text-[#643c15] text-sm font-normal mb-1">Nights</div>
          <div className="text-[#2e1b12] text-base">
            {nights > 0 ? nights : "-"}
          </div>
        </div>
      </div>
    </div>
  );
}
