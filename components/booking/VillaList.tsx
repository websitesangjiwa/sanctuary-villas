"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GuestyListing } from "@/types/guesty";

interface VillaListProps {
  listings: GuestyListing[];
  totalGuests?: number;
  isLoading?: boolean;
  searchParams?: {
    checkIn: string;
    checkOut: string;
    guests: number;
  } | null;
}

export default function VillaList({
  listings,
  totalGuests = 0,
  isLoading = false,
  searchParams,
}: VillaListProps) {
  const router = useRouter();

  const handleMoreInfo = (listingId: string) => {
    if (!searchParams) return;

    const url = `/properties/${listingId}?minOccupancy=${searchParams.guests}&checkIn=${searchParams.checkIn}&checkOut=${searchParams.checkOut}`;
    router.push(url);
  };
  // Filter listings that can accommodate the number of guests
  const availableListings = listings.filter(
    (listing) => !totalGuests || listing.accommodates >= totalGuests
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-lg p-6">
            <div className="flex flex-col xl:flex-row gap-6">
              <div className="w-full xl:w-[261px] h-[160px] bg-gray-300 rounded-lg" />
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-300 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-6 bg-gray-300 rounded w-24 mt-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {availableListings.map((listing, index) => {
        // Get the first image from the array or use a fallback
        const listingImage =
          listing.pictures?.[0]?.thumbnail ||
          listing.pictures?.[0]?.regular ||
          listing.pictures?.[0]?.large ||
          null;

        const price = listing.prices?.basePrice || 0;
        const currency = listing.prices?.currency || "USD";

        const formatPrice = (amount: number, curr: string) => {
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: curr,
            minimumFractionDigits: 0,
          }).format(amount);
        };

        return (
          <motion.div
            key={listing._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col xl:flex-row gap-6 p-6">
              {/* Listing Image */}
              {listingImage ? (
                <div className="relative w-full xl:w-[261px] h-[160px] shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={listingImage}
                    alt={listing.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 261px"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="relative w-full xl:w-[261px] h-[160px] shrink-0 bg-primary/10 flex items-center justify-center rounded-lg">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-primary/30"
                  >
                    <path
                      d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 22V12h6v10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}

              {/* Listing Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl lg:text-2xl text-primary-dark mb-2 tracking-wide">
                    {listing.title}
                  </h3>
                  <p className="text-primary text-base mb-3">
                    {listing.accommodates} Guests | {listing.bedrooms} Bedroom
                    {listing.bedrooms > 1 ? "s" : ""} | {listing.bathrooms}{" "}
                    Bathroom
                    {listing.bathrooms > 1 ? "s" : ""}
                  </p>
                  {listing.publicDescription?.summary && (
                    <p className="text-primary-dark text-sm leading-relaxed line-clamp-2">
                      {listing.publicDescription.summary}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  {price > 0 && (
                    <p className="text-primary-dark text-lg font-medium">
                      {formatPrice(price, currency)}
                      <span className="text-sm font-normal text-primary">
                        {" "}
                        / night
                      </span>
                    </p>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMoreInfo(listing._id)}
                    className="bg-primary text-white text-sm font-medium py-2 px-6 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                    aria-label={`More info about ${listing.title}`}
                  >
                    <span>More info</span>
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
            </div>
          </motion.div>
        );
      })}

      {availableListings.length === 0 && !isLoading && (
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
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="font-serif text-xl text-primary-dark mb-2">
              No Villas Available
            </h3>
            <p className="text-primary text-base">
              {totalGuests > 0
                ? `No villas available for ${totalGuests} guests. Please adjust your search criteria.`
                : "No villas found matching your search criteria."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
