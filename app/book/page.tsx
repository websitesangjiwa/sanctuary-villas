"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import BookingPanel from "@/components/booking/BookingPanel";
import VillaList from "@/components/booking/VillaList";
import { GuestyListing } from "@/types/guesty";

export default function BookPage() {
  const [listings, setListings] = useState<GuestyListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchParams, setSearchParams] = useState<{
    checkIn: string;
    checkOut: string;
    guests: number;
  } | null>(null);

  const handleSearch = async (
    checkIn: string,
    checkOut: string,
    guests: number
  ) => {
    setIsLoading(true);
    setHasSearched(true);
    setSearchParams({ checkIn, checkOut, guests });

    try {
      const params = new URLSearchParams({
        checkIn,
        checkOut,
        guests: guests.toString(),
      });
      const res = await fetch(`/api/guesty/listings?${params}`);
      const data = await res.json();
      setListings(data.results || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBook = (listingId: string) => {
    if (!searchParams) return;

    const bookingUrl = `https://sanctuaryvillas.guestybookings.com/en/properties/${listingId}?minOccupancy=${searchParams.guests}&checkIn=${searchParams.checkIn}&checkOut=${searchParams.checkOut}`;

    window.open(bookingUrl, "_blank");
  };

  return (
    <main className="min-h-screen bg-surface pt-28 lg:pt-32 pb-16 lg:pb-20">
      <div className="container mx-auto px-8 md:px-8 lg:px-14">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-serif text-3xl lg:text-5xl text-center text-primary-dark tracking-[4px] mb-12 lg:mb-16"
        >
          Book Your Stay
        </motion.h1>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Booking Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-[417px] shrink-0"
          >
            <BookingPanel onSearch={handleSearch} isLoading={isLoading} />
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
                totalGuests={searchParams?.guests}
                isLoading={isLoading}
                onBook={handleBook}
              />
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
