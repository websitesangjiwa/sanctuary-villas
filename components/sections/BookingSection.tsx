"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import DatePickerPopup from "@/components/ui/DatePickerPopup";

export default function BookingSection() {
  const router = useRouter();
  const [range, setRange] = useState<DateRange | undefined>();
  const [adults, setAdults] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeField, setActiveField] = useState<"checkin" | "checkout" | null>(
    null
  );
  const calendarRef = useRef<HTMLDivElement>(null);

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

  const handleAdultsChange = (delta: number) => {
    setAdults(Math.max(1, adults + delta));
  };

  const handleDateFieldClick = (field: "checkin" | "checkout") => {
    setActiveField(field);
    setShowCalendar(true);
  };

  const handleSearch = () => {
    if (!range?.from || !range?.to) return;

    // Format dates as YYYY-MM-DD
    const checkIn = format(range.from, "yyyy-MM-dd");
    const checkOut = format(range.to, "yyyy-MM-dd");

    // Build URL with parameters for our properties page
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests: adults.toString(),
    });

    // Navigate to book page with search params
    router.push(`/book?${params.toString()}`);
  };

  return (
    <section id="booking" className="bg-surface py-16 lg:py-20">
      <div className="container mx-auto px-8 md:px-8 lg:px-14">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="font-serif text-3xl lg:text-5xl text-center text-primary-dark tracking-[4px] mb-12 lg:mb-16"
        >
          Book Your Stay
        </motion.h2>

        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto bg-[#fffdf3] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] pt-8 pb-0 px-8"
        >
          <div className="flex flex-col gap-6 pb-8">
            {/* Three columns: Check-in, Check-out, Adults */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" ref={calendarRef}>
              {/* Check-in */}
              <div className="flex flex-col gap-2 relative">
                <label className="text-[#643c15] text-sm font-normal leading-5">
                  Check-in
                </label>
                <button
                  type="button"
                  onClick={() => handleDateFieldClick("checkin")}
                  className="h-12 border border-[#cab797] rounded flex items-center px-3 gap-2 hover:bg-surface/50 transition-colors text-left w-full"
                  aria-label="Select check-in date"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-primary shrink-0"
                  >
                    <rect
                      x="2"
                      y="3"
                      width="12"
                      height="11"
                      rx="1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M2 6H14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M5 2V4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M11 2V4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-primary-dark text-sm">
                    {range?.from ? format(range.from, "MMM d, yyyy") : "Select date"}
                  </span>
                </button>

                {/* Calendar Popup */}
                {showCalendar && activeField === "checkin" && (
                  <DatePickerPopup
                    range={range}
                    onSelect={setRange}
                    onClose={() => {
                      setShowCalendar(false);
                      setActiveField(null);
                    }}
                    activeField="checkin"
                    onOpenCheckout={() => {
                      setActiveField("checkout");
                      setShowCalendar(true);
                    }}
                  />
                )}
              </div>

              {/* Check-out */}
              <div className="flex flex-col gap-2 relative">
                <label className="text-[#643c15] text-sm font-normal leading-5">
                  Check-out
                </label>
                <button
                  type="button"
                  onClick={() => handleDateFieldClick("checkout")}
                  className="h-12 border border-[#cab797] rounded flex items-center px-3 gap-2 hover:bg-surface/50 transition-colors text-left w-full"
                  aria-label="Select check-out date"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-primary shrink-0"
                  >
                    <rect
                      x="2"
                      y="3"
                      width="12"
                      height="11"
                      rx="1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M2 6H14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M5 2V4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M11 2V4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-primary-dark text-sm">
                    {range?.to ? format(range.to, "MMM d, yyyy") : "Select date"}
                  </span>
                </button>

                {/* Calendar Popup */}
                {showCalendar && activeField === "checkout" && (
                  <DatePickerPopup
                    range={range}
                    onSelect={setRange}
                    onClose={() => {
                      setShowCalendar(false);
                      setActiveField(null);
                    }}
                    activeField="checkout"
                  />
                )}
              </div>

              {/* Adults */}
              <div className="flex flex-col gap-2">
                <label className="text-[#643c15] text-sm font-normal leading-5">
                  Adults
                </label>
                <div className="h-12 border border-[#cab797] rounded flex items-center justify-between px-4">
                  <button
                    onClick={() => handleAdultsChange(-1)}
                    disabled={adults <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Decrease number of adults"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-primary"
                    >
                      <path
                        d="M3 8H13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <span className="text-[#643c15] text-base font-normal">
                    {adults}
                  </span>
                  <button
                    onClick={() => handleAdultsChange(1)}
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-primary/10 transition-colors"
                    aria-label="Increase number of adults"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-primary"
                    >
                      <path
                        d="M8 3V13M3 8H13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <motion.button
              whileHover={!range?.from || !range?.to ? {} : { scale: 1.02 }}
              whileTap={!range?.from || !range?.to ? {} : { scale: 0.98 }}
              onClick={handleSearch}
              disabled={!range?.from || !range?.to}
              className="w-full h-14 bg-[#8b6630] text-white text-sm font-medium rounded-lg hover:bg-[#8b6630]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#8b6630]"
              aria-label="Search available rooms"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="7"
                  cy="7"
                  r="4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M10 10L13.5 13.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Search
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
