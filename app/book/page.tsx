"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import BookingPanel from "@/components/booking/BookingPanel";
import BookingFlowHeader from "@/components/booking/BookingFlowHeader";
import VillaList from "@/components/booking/VillaList";
import { GuestyListing } from "@/types/guesty";
import { usePrefetchListings } from "@/lib/hooks/useGuesty";

function BookPageContent() {
  const searchParams = useSearchParams();
  const urlCheckIn = searchParams.get("checkIn");
  const urlCheckOut = searchParams.get("checkOut");
  const urlGuests = searchParams.get("guests");

  const [listings, setListings] = useState<GuestyListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentSearchParams, setCurrentSearchParams] = useState<{
    checkIn: string;
    checkOut: string;
    guests: number;
  } | null>(null);

  // Prefetch individual listings into cache for instant property page navigation
  const prefetchListings = usePrefetchListings();

  const handleSearch = useCallback(async (
    checkIn: string,
    checkOut: string,
    guests: number
  ) => {
    setIsLoading(true);
    setHasSearched(true);
    setCurrentSearchParams({ checkIn, checkOut, guests });

    try {
      const params = new URLSearchParams({
        checkIn,
        checkOut,
        guests: guests.toString(),
      });
      const res = await fetch(`/api/guesty/listings?${params}`);
      const data = await res.json();
      const results = data.results || [];
      setListings(results);

      // Cache each listing for instant property page navigation
      prefetchListings(results);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  }, [prefetchListings]);

  // Auto-trigger search if URL params are present
  useEffect(() => {
    if (urlCheckIn && urlCheckOut && !hasSearched) {
      handleSearch(urlCheckIn, urlCheckOut, parseInt(urlGuests || "1"));
    }
  }, [urlCheckIn, urlCheckOut, urlGuests, hasSearched, handleSearch]);

  return (
    <main className="min-h-screen bg-surface">
      {/* Booking Flow Header */}
      <div className="pt-20 lg:pt-24">
        <BookingFlowHeader
          currentStep={1}
          checkIn={currentSearchParams?.checkIn || urlCheckIn || undefined}
          checkOut={currentSearchParams?.checkOut || urlCheckOut || undefined}
          guests={currentSearchParams?.guests || (urlGuests ? parseInt(urlGuests) : undefined)}
        />
      </div>

      <div className="container mx-auto px-8 md:px-8 lg:px-14 py-8 lg:py-12">
        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Booking Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-[417px] shrink-0"
          >
            <BookingPanel
              onSearch={handleSearch}
              isLoading={isLoading}
              initialCheckIn={urlCheckIn || undefined}
              initialCheckOut={urlCheckOut || undefined}
              initialGuests={urlGuests ? parseInt(urlGuests) : undefined}
            />
          </motion.div>

          {/* Right Column - Villa List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex-1"
          >
            {!hasSearched ? (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center h-full flex items-center justify-center">
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
                    Choose your check-in and check-out dates to see available
                    villas
                  </p>
                </div>
              </div>
            ) : (
              <VillaList
                listings={listings}
                totalGuests={currentSearchParams?.guests}
                isLoading={isLoading}
                searchParams={currentSearchParams}
              />
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}

function BookPageLoading() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="pt-20 lg:pt-24">
        <BookingFlowHeader currentStep={1} />
      </div>
      <div className="container mx-auto px-8 md:px-8 lg:px-14 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[417px] shrink-0">
            <div className="bg-[#fffdf3] rounded-lg shadow-lg p-8 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-6" />
              <div className="h-64 bg-gray-200 rounded mb-6" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-lg p-12 h-full flex items-center justify-center">
              <div className="animate-pulse text-primary">Loading...</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<BookPageLoading />}>
      <BookPageContent />
    </Suspense>
  );
}
