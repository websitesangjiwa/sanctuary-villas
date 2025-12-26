"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { GuestyListing } from "@/types/guesty";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

// Icons for Property Features
const BedroomIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 18V12C3 10.3431 4.34315 9 6 9H18C19.6569 9 21 10.3431 21 12V18" stroke="#8b6630" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M3 18V20M21 18V20" stroke="#8b6630" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M2 18H22" stroke="#8b6630" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 9V7C6 5.34315 7.34315 4 9 4H15C16.6569 4 18 5.34315 18 7V9" stroke="#8b6630" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const BathroomIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 12H20V16C20 18.2091 18.2091 20 16 20H8C5.79086 20 4 18.2091 4 16V12Z" stroke="#8b6630" strokeWidth="1.5"/>
    <path d="M6 20V22M18 20V22" stroke="#8b6630" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M4 12V6C4 4.89543 4.89543 4 6 4H7C8.10457 4 9 4.89543 9 6V12" stroke="#8b6630" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const GuestsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="7" r="3" stroke="#8b6630" strokeWidth="1.5"/>
    <path d="M15 21V18C15 15.7909 13.2091 14 11 14H7C4.79086 14 3 15.7909 3 18V21" stroke="#8b6630" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="17" cy="8" r="2" stroke="#8b6630" strokeWidth="1.5"/>
    <path d="M21 21V19C21 17.3431 19.6569 16 18 16H17" stroke="#8b6630" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const AreaIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 8V5C3 3.89543 3.89543 3 5 3H8" stroke="#8b6630" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16 3H19C20.1046 3 21 3.89543 21 5V8" stroke="#8b6630" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M21 16V19C21 20.1046 20.1046 21 19 21H16" stroke="#8b6630" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 21H5C3.89543 21 3 20.1046 3 19V16" stroke="#8b6630" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Amenity icon mapping
const getAmenityIcon = (amenity: string) => {
  const lowerAmenity = amenity.toLowerCase();

  // WiFi / Internet
  if (lowerAmenity.includes('wifi') || lowerAmenity.includes('internet') || lowerAmenity.includes('wireless')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
        <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
        <circle cx="12" cy="20" r="1"/>
      </svg>
    );
  }

  // Air Conditioning
  if (lowerAmenity.includes('air condition') || lowerAmenity.includes('ac') || lowerAmenity.includes('a/c')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 16a4 4 0 1 1 8 0"/>
        <path d="M12 4v4"/>
        <path d="M4.93 7.93l2.83 2.83"/>
        <path d="M19.07 7.93l-2.83 2.83"/>
        <path d="M12 12v8"/>
      </svg>
    );
  }

  // Pool / Swimming
  if (lowerAmenity.includes('pool') || lowerAmenity.includes('swimming')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0 3.5 1.5 5 0"/>
        <path d="M2 16c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0 3.5 1.5 5 0"/>
        <path d="M12 4v4"/>
        <circle cx="12" cy="11" r="3"/>
      </svg>
    );
  }

  // Kitchen
  if (lowerAmenity.includes('kitchen')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
        <path d="M7 2v20"/>
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
      </svg>
    );
  }

  // Stove / Cookware / Cooking
  if (lowerAmenity.includes('stove') || lowerAmenity.includes('cookware') || lowerAmenity.includes('cooking')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="8" width="20" height="14" rx="2"/>
        <circle cx="8" cy="15" r="2"/>
        <circle cx="16" cy="15" r="2"/>
        <path d="M8 4v4"/>
        <path d="M16 4v4"/>
      </svg>
    );
  }

  // Kettle
  if (lowerAmenity.includes('kettle')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 10h12a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-2a4 4 0 0 1 4-4Z"/>
        <path d="M6 10V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/>
        <path d="M18 14h2"/>
      </svg>
    );
  }

  // Dishes / Silverware
  if (lowerAmenity.includes('dishes') || lowerAmenity.includes('silverware') || lowerAmenity.includes('utensil')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
        <path d="M7 2v20"/>
        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
      </svg>
    );
  }

  // Wine glasses
  if (lowerAmenity.includes('wine') || lowerAmenity.includes('glass')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 22h8"/>
        <path d="M12 11v11"/>
        <path d="M5.3 3h13.4a1 1 0 0 1 1 1.1l-1.5 6a4 4 0 0 1-3.9 3.1h-4.6a4 4 0 0 1-3.9-3.1l-1.5-6a1 1 0 0 1 1-1.1Z"/>
      </svg>
    );
  }

  // Parking / Garage
  if (lowerAmenity.includes('parking') || lowerAmenity.includes('garage')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>
      </svg>
    );
  }

  // TV / Television
  if (lowerAmenity.includes('tv') || lowerAmenity.includes('television')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
        <polyline points="17 2 12 7 7 2"/>
      </svg>
    );
  }

  // Bed / Bedroom / Linens / Pillows / Blankets
  if (lowerAmenity.includes('bed') || lowerAmenity.includes('king') || lowerAmenity.includes('queen') || lowerAmenity.includes('pillow') || lowerAmenity.includes('blanket')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 18v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4"/>
        <path d="M2 18v2M22 18v2"/>
        <path d="M6 12V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5"/>
      </svg>
    );
  }

  // Shampoo / Shower gel / Body soap / Conditioner (Toiletries)
  if (lowerAmenity.includes('shampoo') || lowerAmenity.includes('shower gel') || lowerAmenity.includes('body soap') || lowerAmenity.includes('conditioner') || lowerAmenity.includes('soap')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 5h4v14a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V5Z"/>
        <path d="M10 5a2 2 0 0 1 2-2v0a2 2 0 0 1 2 2"/>
        <path d="M8 10h8"/>
      </svg>
    );
  }

  // Towels / Linen
  if (lowerAmenity.includes('towel') || lowerAmenity.includes('linen')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2"/>
        <path d="M3 10h18"/>
        <path d="M8 4v6"/>
        <path d="M16 4v6"/>
      </svg>
    );
  }

  // Coffee / Tea / Coffee maker
  if (lowerAmenity.includes('coffee') || lowerAmenity.includes('tea')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
        <line x1="6" y1="2" x2="6" y2="4"/>
        <line x1="10" y1="2" x2="10" y2="4"/>
        <line x1="14" y1="2" x2="14" y2="4"/>
      </svg>
    );
  }

  // Fridge / Refrigerator
  if (lowerAmenity.includes('fridge') || lowerAmenity.includes('refrigerator') || lowerAmenity.includes('mini bar')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2"/>
        <path d="M4 10h16"/>
        <path d="M8 6v2"/>
        <path d="M8 14v4"/>
      </svg>
    );
  }

  // Safe
  if (lowerAmenity.includes('safe')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 9v6"/>
      </svg>
    );
  }

  // Desk / Workspace / Laptop friendly
  if (lowerAmenity.includes('desk') || lowerAmenity.includes('workspace') || lowerAmenity.includes('laptop')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="12" rx="2"/>
        <path d="M6 20h12"/>
        <path d="M12 16v4"/>
      </svg>
    );
  }

  // Iron
  if (lowerAmenity.includes('iron')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17h18l-3-8H6l-3 8Z"/>
        <path d="M6 9V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"/>
        <path d="M8 17v3"/>
        <path d="M16 17v3"/>
      </svg>
    );
  }

  // Hangers / Clothing storage / Closet
  if (lowerAmenity.includes('hanger') || lowerAmenity.includes('clothing') || lowerAmenity.includes('closet') || lowerAmenity.includes('wardrobe')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a2 2 0 0 0-2 2c0 1 .5 1.5 1 2l-8 6h18l-8-6c.5-.5 1-1 1-2a2 2 0 0 0-2-2Z"/>
        <path d="M3 13v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6"/>
      </svg>
    );
  }

  // First aid kit
  if (lowerAmenity.includes('first aid') || lowerAmenity.includes('medical')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2"/>
        <path d="M12 9v6"/>
        <path d="M9 12h6"/>
      </svg>
    );
  }

  // Essentials
  if (lowerAmenity.includes('essential')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
        <path d="M12 6v7"/>
        <path d="M8 13h8"/>
      </svg>
    );
  }

  // Breakfast
  if (lowerAmenity.includes('breakfast')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8Z"/>
        <path d="M6 1v3"/>
        <path d="M10 1v3"/>
        <path d="M14 1v3"/>
      </svg>
    );
  }

  // Hot water
  if (lowerAmenity.includes('hot water')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4"/>
        <path d="M8 4c0 2 4 4 4 8 0 4-4 6-4 8"/>
        <path d="M16 4c0 2-4 4-4 8 0 4 4 6 4 8"/>
        <circle cx="12" cy="19" r="3"/>
      </svg>
    );
  }

  // Mosquito net
  if (lowerAmenity.includes('mosquito')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2v4"/>
        <path d="M12 18v4"/>
        <path d="M4.93 4.93l2.83 2.83"/>
        <path d="M16.24 16.24l2.83 2.83"/>
        <path d="M2 12h4"/>
        <path d="M18 12h4"/>
        <path d="M4.93 19.07l2.83-2.83"/>
        <path d="M16.24 7.76l2.83-2.83"/>
      </svg>
    );
  }

  // Children / Kids / Infants
  if (lowerAmenity.includes('children') || lowerAmenity.includes('infant') || lowerAmenity.includes('kid') || lowerAmenity.includes('baby')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="4" r="2"/>
        <path d="M12 6v2"/>
        <path d="M8 8h8"/>
        <path d="M9 8l-3 6h2l2 6"/>
        <path d="M15 8l3 6h-2l-2 6"/>
      </svg>
    );
  }

  // Luggage / Bags
  if (lowerAmenity.includes('luggage') || lowerAmenity.includes('baggage')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="6" width="12" height="14" rx="2"/>
        <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
        <path d="M6 14h12"/>
        <circle cx="8" cy="22" r="1"/>
        <circle cx="16" cy="22" r="1"/>
      </svg>
    );
  }

  // Garden / Outdoor / Backyard
  if (lowerAmenity.includes('garden') || lowerAmenity.includes('outdoor') || lowerAmenity.includes('terrace') || lowerAmenity.includes('patio') || lowerAmenity.includes('backyard')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 10a6 6 0 0 0 6-6H6a6 6 0 0 0 6 6Z"/>
        <path d="M12 10v12"/>
        <path d="M8 22h8"/>
      </svg>
    );
  }

  // Non-smoking
  if (lowerAmenity.includes('non-smoking') || lowerAmenity.includes('no smoking')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
      </svg>
    );
  }

  // Views
  if (lowerAmenity.includes('view')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    );
  }

  // Room Service / Service / Cleaning
  if (lowerAmenity.includes('service') || lowerAmenity.includes('cleaning') || lowerAmenity.includes('daily') || lowerAmenity.includes('checkout')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18"/>
        <path d="M5 21V7l8-4 8 4v14"/>
        <path d="M9 21v-6h6v6"/>
      </svg>
    );
  }

  // Default checkmark icon
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
};

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
  const [showAllAmenities, setShowAllAmenities] = useState(false);

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
                sizes="100vw"
              />
            </div>
          )}

          {/* Thumbnail Slider */}
          {listing.pictures && listing.pictures.length > 1 && (
            <div className="property-thumbnails">
              <Swiper
                modules={[Navigation, FreeMode]}
                spaceBetween={8}
                slidesPerView={4}
                navigation
                freeMode={true}
                breakpoints={{
                  640: { slidesPerView: 5 },
                  1024: { slidesPerView: 6 },
                }}
                className="thumbnails-slider"
              >
                {listing.pictures.map((pic, index) => (
                  <SwiperSlide key={index}>
                    <button
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-full aspect-square rounded-lg overflow-hidden transition-all ${
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
                        loading="lazy"
                        sizes="(max-width: 640px) 25vw, (max-width: 1024px) 16vw, 100px"
                      />
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </motion.div>

        {/* Mobile Booking Card - показывается только на мобильных */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:hidden mb-8"
        >
          <div className="bg-white rounded-lg shadow-lg p-6">
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

            {/* Property Features Cards */}
            <div className="mb-8">
              <h2 className="font-serif text-xl text-primary-dark mb-4">
                Property Features
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#fffdf3] border border-[#cab797] rounded-[14px] p-5 flex flex-col items-center">
                  <BedroomIcon />
                  <p className="text-sm text-primary mt-3 mb-1">Bedrooms</p>
                  <p className="text-base text-primary-dark font-medium">{listing.bedrooms}</p>
                </div>
                <div className="bg-[#fffdf3] border border-[#cab797] rounded-[14px] p-5 flex flex-col items-center">
                  <BathroomIcon />
                  <p className="text-sm text-primary mt-3 mb-1">Bathrooms</p>
                  <p className="text-base text-primary-dark font-medium">{listing.bathrooms}</p>
                </div>
                <div className="bg-[#fffdf3] border border-[#cab797] rounded-[14px] p-5 flex flex-col items-center">
                  <GuestsIcon />
                  <p className="text-sm text-primary mt-3 mb-1">Max Guests</p>
                  <p className="text-base text-primary-dark font-medium">{listing.accommodates}</p>
                </div>
                <div className="bg-[#fffdf3] border border-[#cab797] rounded-[14px] p-5 flex flex-col items-center">
                  <AreaIcon />
                  <p className="text-sm text-primary mt-3 mb-1">Area</p>
                  <p className="text-base text-primary-dark font-medium">180m²</p>
                </div>
              </div>
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
                <h2 className="font-serif text-xl text-primary-dark mb-4">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {(showAllAmenities
                    ? listing.amenities
                    : listing.amenities.slice(0, 8)
                  ).map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-primary"
                    >
                      <span className="shrink-0">
                        {getAmenityIcon(amenity)}
                      </span>
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
                {listing.amenities.length > 8 && (
                  <button
                    onClick={() => setShowAllAmenities(!showAllAmenities)}
                    className="mt-4 flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-medium"
                  >
                    <span>
                      {showAllAmenities
                        ? "Show less"
                        : `Show all ${listing.amenities.length} amenities`}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform ${showAllAmenities ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
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

            {/* Google Map */}
            {listing.address?.lat && listing.address?.lng && (
              <div className="mb-8">
                <h2 className="font-serif text-xl text-primary-dark mb-4">
                  Map
                </h2>
                <div className="rounded-lg overflow-hidden h-[350px] border border-gray-200">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${listing.address.lat},${listing.address.lng}&zoom=15`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Villa location map"
                  />
                </div>
                <a
                  href={`https://www.google.com/maps?q=${listing.address.lat},${listing.address.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors mt-3 text-sm"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Open in Google Maps
                </a>
              </div>
            )}
          </motion.div>

          {/* Right Column - Booking Card (desktop only) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:block"
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
