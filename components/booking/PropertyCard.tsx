"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GuestyListing } from "@/types/guesty";

interface PropertyCardProps {
  listing: GuestyListing;
  checkIn: string;
  checkOut: string;
  guests: number;
  index?: number;
  onBook?: (listingId: string) => void;
}

export default function PropertyCard({
  listing,
  checkIn,
  checkOut,
  guests,
  index = 0,
  onBook,
}: PropertyCardProps) {
  const mainImage = listing.pictures?.[0]?.original || listing.pictures?.[0]?.large || '/placeholder-villa.jpg';
  const price = listing.prices?.basePrice || 0;
  const currency = listing.prices?.currency || 'USD';

  const formatPrice = (amount: number, curr: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleBookClick = () => {
    if (onBook) {
      onBook(listing._id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      className="flex flex-col gap-4 h-full bg-surface-white rounded-lg overflow-hidden shadow-md"
    >
      {/* Image Container */}
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.3 }}
        className="relative w-full h-64 overflow-hidden group"
      >
        <Image
          src={mainImage}
          alt={`${listing.title} - Luxury villa`}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
        />
      </motion.div>

      {/* Content Container */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Property Title */}
        <h3 className="font-serif text-xl leading-tight text-primary-dark line-clamp-2">
          {listing.title}
        </h3>

        {/* Location */}
        <p className="text-sm text-primary-light">
          {listing.address?.city}, {listing.address?.country}
        </p>

        {/* Description */}
        {listing.publicDescription?.summary && (
          <p className="text-sm text-primary leading-5 line-clamp-2">
            {listing.publicDescription.summary}
          </p>
        )}

        {/* Details */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-primary-light">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {listing.bedrooms} Bedrooms
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Up to {listing.accommodates} Guests
          </span>
        </div>

        {/* Price & Book Button */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-primary-dark">
              {formatPrice(price, currency)}
            </span>
            <span className="text-xs text-primary-light">per night</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBookClick}
            className="bg-primary text-white text-sm font-medium py-2 px-6 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            aria-label={`Book ${listing.title}`}
          >
            <span>Book Now</span>
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
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
