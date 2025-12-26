"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { GuestyListing } from "@/types/guesty";

export default function PropertyPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;

  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const minOccupancy = searchParams.get("minOccupancy") || "1";

  const [listing, setListing] = useState<GuestyListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    async function fetchListing() {
      try {
        const res = await fetch(`/api/guesty/listings/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch listing");
        }
        const data = await res.json();
        setListing(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchListing();
    }
  }, [id]);

  const handleBookNow = () => {
    const bookingUrl = `https://sanctuaryvillas.guestybookings.com/en/properties/${id}?minOccupancy=${minOccupancy}&checkIn=${checkIn}&checkOut=${checkOut}`;
    window.open(bookingUrl, "_blank");
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-surface pt-28 lg:pt-32 pb-16 lg:pb-20">
        <div className="container mx-auto px-8 lg:px-14">
          <div className="animate-pulse">
            <div className="h-[400px] lg:h-[500px] bg-gray-300 rounded-lg mb-8" />
            <div className="h-10 bg-gray-300 rounded w-2/3 mb-4" />
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !listing) {
    return (
      <main className="min-h-screen bg-surface pt-28 lg:pt-32 pb-16 lg:pb-20">
        <div className="container mx-auto px-8 lg:px-14 text-center">
          <h1 className="font-serif text-3xl text-primary-dark mb-4">
            Villa Not Found
          </h1>
          <p className="text-primary mb-8">
            {error || "The villa you're looking for doesn't exist."}
          </p>
          <Link
            href="/book"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Search
          </Link>
        </div>
      </main>
    );
  }

  const mainImage =
    listing.pictures?.[selectedImageIndex]?.original ||
    listing.pictures?.[selectedImageIndex]?.large ||
    null;

  return (
    <main className="min-h-screen bg-surface pt-28 lg:pt-32 pb-16 lg:pb-20">
      <div className="container mx-auto px-8 lg:px-14">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            href="/book"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Search
          </Link>
        </motion.div>

        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          {/* Main Image */}
          {mainImage && (
            <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-lg overflow-hidden mb-4">
              <Image
                src={mainImage}
                alt={listing.title}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          )}

          {/* Thumbnails */}
          {listing.pictures && listing.pictures.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {listing.pictures.slice(0, 8).map((pic, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden transition-all ${
                    selectedImageIndex === index
                      ? "ring-2 ring-primary"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={pic.thumbnail || pic.original}
                    alt={`${listing.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            {/* Title & Basic Info */}
            <h1 className="font-serif text-3xl lg:text-4xl text-primary-dark tracking-wide mb-4">
              {listing.title}
            </h1>

            <div className="flex flex-wrap gap-4 text-primary mb-6">
              <span className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M17 18C17 14.134 13.866 11 10 11C6.13401 11 3 14.134 3 18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                {listing.accommodates} Guests
              </span>
              <span className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M2 10H18M2 10V16M2 10V7C2 5.89543 2.89543 5 4 5H16C17.1046 5 18 5.89543 18 7V10M18 10V16M2 16H18M2 16V17C2 17.5523 2.44772 18 3 18H4C4.55228 18 5 17.5523 5 17V16M18 16V17C18 17.5523 17.5523 18 17 18H16C15.4477 18 15 17.5523 15 17V16M5 16H15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                {listing.bedrooms} Bedroom{listing.bedrooms > 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M3 8V16C3 17.1046 3.89543 18 5 18H15C16.1046 18 17 17.1046 17 16V8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M2 8H18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6 8V5C6 3.34315 7.34315 2 9 2H11C12.6569 2 14 3.34315 14 5V8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                {listing.bathrooms} Bathroom{listing.bathrooms > 1 ? "s" : ""}
              </span>
            </div>

            {/* Description */}
            {listing.publicDescription?.summary && (
              <div className="mb-8">
                <h2 className="font-serif text-xl text-primary-dark mb-3">
                  About this villa
                </h2>
                <p className="text-primary-dark leading-relaxed whitespace-pre-line">
                  {listing.publicDescription.summary}
                </p>
              </div>
            )}

            {/* Space Description */}
            {listing.publicDescription?.space && (
              <div className="mb-8">
                <h2 className="font-serif text-xl text-primary-dark mb-3">
                  The Space
                </h2>
                <p className="text-primary-dark leading-relaxed whitespace-pre-line">
                  {listing.publicDescription.space}
                </p>
              </div>
            )}

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="font-serif text-xl text-primary-dark mb-3">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {listing.amenities.slice(0, 12).map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-primary-dark"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="text-primary shrink-0"
                      >
                        <path
                          d="M13.3337 4L6.00033 11.3333L2.66699 8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
                {listing.amenities.length > 12 && (
                  <p className="text-primary text-sm mt-3">
                    +{listing.amenities.length - 12} more amenities
                  </p>
                )}
              </div>
            )}

            {/* House Rules */}
            {listing.publicDescription?.houseRules && (
              <div className="mb-8">
                <h2 className="font-serif text-xl text-primary-dark mb-3">
                  House Rules
                </h2>
                <p className="text-primary-dark leading-relaxed whitespace-pre-line">
                  {listing.publicDescription.houseRules}
                </p>
              </div>
            )}

            {/* Location */}
            {listing.address && (
              <div className="mb-8">
                <h2 className="font-serif text-xl text-primary-dark mb-3">
                  Location
                </h2>
                <p className="text-primary-dark">
                  {listing.address.city}, {listing.address.country}
                </p>
              </div>
            )}
          </motion.div>

          {/* Right Column - Booking Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-28">
              {/* Price */}
              {listing.prices?.basePrice > 0 && (
                <div className="mb-6">
                  <p className="text-2xl font-semibold text-primary-dark">
                    {formatPrice(
                      listing.prices.basePrice,
                      listing.prices.currency || "USD"
                    )}
                    <span className="text-base font-normal text-primary">
                      {" "}
                      / night
                    </span>
                  </p>
                </div>
              )}

              {/* Dates Summary */}
              {checkIn && checkOut && (
                <div className="border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-primary uppercase mb-1">
                        Check-in
                      </p>
                      <p className="text-primary-dark font-medium">{checkIn}</p>
                    </div>
                    <div>
                      <p className="text-xs text-primary uppercase mb-1">
                        Check-out
                      </p>
                      <p className="text-primary-dark font-medium">
                        {checkOut}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-primary uppercase mb-1">
                      Guests
                    </p>
                    <p className="text-primary-dark font-medium">
                      {minOccupancy} Guest{parseInt(minOccupancy) > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              )}

              {/* Book Now Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBookNow}
                className="w-full bg-primary text-white text-lg font-medium py-4 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Book Now
              </motion.button>

              {/* Min Nights */}
              {listing.terms?.minNights && listing.terms.minNights > 1 && (
                <p className="text-center text-sm text-primary mt-4">
                  Minimum {listing.terms.minNights} nights
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
