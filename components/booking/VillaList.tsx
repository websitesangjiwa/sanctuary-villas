"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BoomListing } from "@/types/booking";

interface VillaListProps {
  villas: BoomListing[];
  totalGuests?: number;
}

export default function VillaList({ villas, totalGuests = 0 }: VillaListProps) {
  // Filter villas that can accommodate the number of guests
  const availableVillas = villas.filter(
    (villa) => !totalGuests || villa.maxGuests >= totalGuests
  );

  return (
    <div className="space-y-6">
      {availableVillas.map((villa, index) => {
        // Get the first image from the array or use a fallback
        const villaImage =
          villa.image ||
          (villa.images && villa.images.length > 0 ? villa.images[0] : null);

        return (
          <motion.div
            key={villa.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col sm:flex-row gap-6 p-6">
              {/* Villa Image */}
              {villaImage ? (
                <div className="relative w-full sm:w-[261px] h-[160px] shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={villaImage}
                    alt={villa.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 261px"
                  />
                </div>
              ) : (
                <div className="relative w-full sm:w-[261px] h-[160px] shrink-0 bg-primary/10 flex items-center justify-center rounded-lg">
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

              {/* Villa Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl lg:text-2xl text-primary-dark mb-2 tracking-wide">
                    {villa.name}
                  </h3>
                  <p className="text-primary text-base mb-3">
                    {villa.maxGuests} Guests | {villa.bedrooms} Bedroom
                    {villa.bedrooms > 1 ? "s" : ""} | {villa.bathrooms} Bathroom
                    {villa.bathrooms > 1 ? "s" : ""}
                  </p>
                  {villa.description && (
                    <p className="text-primary-dark text-sm leading-relaxed line-clamp-2">
                      {villa.description}
                    </p>
                  )}
                </div>
                {villa.price && (
                  <div className="mt-4">
                    <p className="text-primary-dark text-lg font-medium">
                      {villa.currency || "$"}
                      {villa.price}
                      <span className="text-sm font-normal text-primary">
                        {" "}
                        / night
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}

      {availableVillas.length === 0 && (
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
