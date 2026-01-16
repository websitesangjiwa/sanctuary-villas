"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  GuestyListing,
  GuestyListingsResponse,
  GuestyQuoteWithRatePlan,
} from "@/types/guesty";

// ============================================
// Cache Helpers
// ============================================

/**
 * Prefetch listings into individual cache entries
 * Call this after fetching listings to enable instant property page navigation
 */
export function usePrefetchListings() {
  const queryClient = useQueryClient();

  return (listings: GuestyListing[]) => {
    listings.forEach((listing) => {
      queryClient.setQueryData(["listing", listing._id], listing);
    });
  };
}

// ============================================
// Fetch Functions
// ============================================

async function fetchListingById(id: string): Promise<GuestyListing> {
  const res = await fetch(`/api/guesty/listings/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch listing: ${res.status}`);
  }
  return res.json();
}

async function fetchListings(params: {
  checkIn: string;
  checkOut: string;
  guests: number;
}): Promise<GuestyListingsResponse> {
  const searchParams = new URLSearchParams({
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    guests: params.guests.toString(),
  });
  const res = await fetch(`/api/guesty/listings?${searchParams}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch listings: ${res.status}`);
  }
  return res.json();
}

async function fetchQuote(params: {
  listingId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}): Promise<GuestyQuoteWithRatePlan> {
  const res = await fetch("/api/guesty/quotes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || `Failed to fetch quote: ${res.status}`);
  }
  return res.json();
}

// ============================================
// React Query Hooks
// ============================================

/**
 * Fetch a single listing by ID with caching
 * - staleTime: 5 minutes (won't refetch if navigating back within 5 min)
 * - gcTime: 10 minutes (keeps data in cache for 10 min after last use)
 */
export function useListingById(id: string | undefined) {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () => fetchListingById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Search listings with caching + prefetch individual listings
 * - staleTime: 1 minute (search results can change more frequently)
 * - Only enabled when all required params are present
 * - Prefetches each listing into cache for instant navigation
 */
export function useListings(params: {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}) {
  const { checkIn, checkOut, guests } = params;
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["listings", checkIn, checkOut, guests],
    queryFn: async () => {
      const data = await fetchListings({
        checkIn: checkIn!,
        checkOut: checkOut!,
        guests: guests || 1,
      });

      // Prefetch each listing into cache for instant property page navigation
      data.results?.forEach((listing) => {
        queryClient.setQueryData(["listing", listing._id], listing);
      });

      return data;
    },
    enabled: !!(checkIn && checkOut),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch a quote for booking with caching
 * - staleTime: 2 minutes (quotes/prices can change)
 * - Only enabled when all required params are present
 */
export function useQuote(params: {
  listingId?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}) {
  const { listingId, checkIn, checkOut, guests } = params;

  return useQuery({
    queryKey: ["quote", listingId, checkIn, checkOut, guests],
    queryFn: () =>
      fetchQuote({
        listingId: listingId!,
        checkIn: checkIn!,
        checkOut: checkOut!,
        guests: guests || 1,
      }),
    enabled: !!(listingId && checkIn && checkOut),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once for quotes (they might legitimately fail)
  });
}
