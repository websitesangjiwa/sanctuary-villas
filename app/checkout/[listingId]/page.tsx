import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getListingByIdCached } from "@/lib/api/guesty";
import CheckoutContent from "@/components/checkout/CheckoutContent";
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

  // Fetch only listing server-side (cached from generateMetadata)
  // Quote will be fetched client-side via useQuote (uses React Query cache)
  let listing;
  try {
    listing = await getListingByIdCached(listingId);
  } catch (error) {
    console.error("Checkout page error:", error);

    if (
      error instanceof Error &&
      (error.message.includes("404") || error.message.includes("not found"))
    ) {
      notFound();
    }

    // Re-throw for other errors
    throw error;
  }

  return (
    <main className="min-h-screen bg-surface">
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

      {/* Content - Quote is fetched client-side via useQuote (cached!) */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <CheckoutContent
          listing={listing}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guestCount}
        />
      </div>
    </main>
  );
}
