"use client";

import { GuestyListing } from "@/types/guesty";
import PropertyCard from "./PropertyCard";
import { motion } from "framer-motion";

interface PropertyListProps {
  listings: GuestyListing[];
  checkIn: string;
  checkOut: string;
  guests: number;
  onBook: (listingId: string) => void;
  isLoading?: boolean;
}

export default function PropertyList({
  listings,
  checkIn,
  checkOut,
  guests,
  onBook,
  isLoading = false,
}: PropertyListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-300 h-64 rounded-t-lg" />
            <div className="bg-white p-4 rounded-b-lg space-y-3">
              <div className="h-6 bg-gray-300 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="flex justify-between pt-4 border-t">
                <div className="h-6 bg-gray-300 rounded w-20" />
                <div className="h-10 bg-gray-300 rounded w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <svg
          className="w-16 h-16 mx-auto text-primary-light mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <h3 className="text-xl font-serif text-primary-dark mb-2">
          No properties available
        </h3>
        <p className="text-primary-light">
          No villas are available for the selected dates. Please try different dates.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing, index) => (
        <PropertyCard
          key={listing._id}
          listing={listing}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          index={index}
          onBook={onBook}
        />
      ))}
    </div>
  );
}
