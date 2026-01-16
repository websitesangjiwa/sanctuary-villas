import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getListingByIdCached, getQuoteWithRatePlan } from "@/lib/api/guesty";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import BookingFlowHeader from "@/components/booking/BookingFlowHeader";

interface CheckoutPageProps {
  params: Promise<{ listingId: string }>;
  searchParams: Promise<{
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  }>;
}

export async function generateMetadata({
  params,
}: CheckoutPageProps): Promise<Metadata> {
  const { listingId } = await params;

  try {
    const listing = await getListingByIdCached(listingId);
    return {
      title: `Checkout - ${listing.title} | Sanctuary Villas`,
      description: `Complete your booking for ${listing.title}`,
    };
  } catch {
    return {
      title: "Checkout | Sanctuary Villas",
    };
  }
}

export default async function CheckoutPage({
  params,
  searchParams,
}: CheckoutPageProps) {
  const { listingId } = await params;
  const { checkIn, checkOut, guests } = await searchParams;

  // Validate required parameters
  if (!checkIn || !checkOut) {
    redirect(`/properties/${listingId}`);
  }

  const guestCount = parseInt(guests || "1", 10);

  try {
    // Fetch listing (cached from generateMetadata) and quote in parallel
    const [listing, quote] = await Promise.all([
      getListingByIdCached(listingId),
      getQuoteWithRatePlan({
        listingId,
        checkIn,
        checkOut,
        guests: guestCount,
      }),
    ]);

    return (
      <main className="min-h-screen bg-[#f5f3e8]">
        {/* Booking Flow Header */}
        <div className="pt-20 lg:pt-24">
          <BookingFlowHeader
            currentStep={3}
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guestCount}
            listingId={listingId}
          />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="mx-auto">
            {/* Title */}
            <div className="mb-8">
              <h1 className="font-serif text-2xl lg:text-3xl text-primary-dark mb-2">
                Complete Your Booking
              </h1>
              <p className="text-primary">
                You&apos;re booking {listing.title}
              </p>
            </div>

            {/* Checkout Form */}
            <CheckoutForm listing={listing} quote={quote} />
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Checkout page error:", error);

    // Check if listing not found
    if (
      error instanceof Error &&
      (error.message.includes("404") || error.message.includes("not found"))
    ) {
      notFound();
    }

    // Show error state for other errors (quote expired, etc.)
    return (
      <main className="min-h-screen bg-[#f5f3e8]">
        {/* Booking Flow Header */}
        <div className="pt-20 lg:pt-24">
          <BookingFlowHeader
            currentStep={3}
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guestCount}
            listingId={listingId}
          />
        </div>

        <div className="flex items-center justify-center py-16">
          <div className="text-center px-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="font-serif text-2xl text-primary-dark mb-2">
              Unable to Load Checkout
            </h1>
            <p className="text-primary mb-6">
              The selected dates may no longer be available or the quote has
              expired.
            </p>
            <Link
              href={`/properties/${listingId}?checkIn=${checkIn}&checkOut=${checkOut}&minOccupancy=${guestCount}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Property
            </Link>
          </div>
        </div>
      </main>
    );
  }
}
