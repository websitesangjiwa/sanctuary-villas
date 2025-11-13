"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import BookingPanel from "@/components/booking/BookingPanel";
import BookingSteps from "@/components/booking/BookingSteps";
import VillaList from "@/components/booking/VillaList";
import { useListings } from "@/lib/hooks/useListings";
import { BoomListing } from "@/types/booking";

export default function BookPage() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Prepare search parameters
  const searchParams = {
    check_in: range?.from ? format(range.from, "yyyy-MM-dd") : undefined,
    check_out: range?.to ? format(range.to, "yyyy-MM-dd") : undefined,
    adults,
    children,
  };

  // Use Boom API hook - only fetch when search is triggered
  const { data, isLoading, isError, error, refetch } = useListings(
    searchParams,
    searchTriggered && !!range?.from && !!range?.to
  );

  const handleDateChange = (newRange: DateRange | undefined) => {
    setRange(newRange);
  };

  const handleGuestsChange = (newAdults: number, newChildren: number) => {
    setAdults(newAdults);
    setChildren(newChildren);
  };

  const handleFindDate = () => {
    if (!range?.from || !range?.to) return;

    setSearchTriggered(true);
    refetch();
  };

  const totalGuests = adults + children;

  // Get villas data from API response
  const villasData: BoomListing[] = data?.data || [];

  return (
    <main className="min-h-screen bg-surface">
      {/* Page Header with Steps */}
      <section className="bg-surface py-12 lg:py-16">
        <div className="container mx-auto px-8 md:px-8 lg:px-14">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-serif text-4xl lg:text-5xl text-center text-primary-dark tracking-[4px] mb-10 lg:mb-12"
          >
            Book Your Stay
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <BookingSteps currentStep={1} />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-8 md:px-8 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-[417px_1fr] gap-8 lg:gap-12">
            {/* Left Column - Booking Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:sticky lg:top-8 lg:self-start"
            >
              <BookingPanel
                onDateChange={handleDateChange}
                onGuestsChange={handleGuestsChange}
                onFindDate={handleFindDate}
              />
            </motion.div>

            {/* Right Column - Villa List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-primary text-lg">Searching for available villas...</p>
                  </div>
                </div>
              ) : isError ? (
                <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-red-600"
                      >
                        <path
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h3 className="font-serif text-xl text-primary-dark mb-2">
                      Error Loading Villas
                    </h3>
                    <p className="text-primary text-base mb-4">
                      {error instanceof Error ? error.message : "Unable to fetch villa listings. Please try again."}
                    </p>
                    <button
                      onClick={() => refetch()}
                      className="bg-primary text-surface px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : !searchTriggered ? (
                <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-primary"
                      >
                        <path
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h3 className="font-serif text-xl text-primary-dark mb-2">
                      Select Your Dates
                    </h3>
                    <p className="text-primary text-base">
                      Choose your check-in and check-out dates, then click &quot;Find Date&quot; to see available villas.
                    </p>
                  </div>
                </div>
              ) : (
                <VillaList villas={villasData} totalGuests={totalGuests} />
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
