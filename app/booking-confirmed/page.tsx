import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { formatPrice, parseDate } from "@/lib/utils/formatters";

interface BookingConfirmedPageProps {
  searchParams: Promise<{
    code?: string;
    listingId?: string;
    listingTitle?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    total?: string;
    currency?: string;
    email?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Booking Confirmed | Sanctuary Villas",
  description: "Your booking has been confirmed",
};

export default async function BookingConfirmedPage({
  searchParams,
}: BookingConfirmedPageProps) {
  const params = await searchParams;
  const {
    code,
    listingId,
    listingTitle,
    checkIn,
    checkOut,
    guests,
    total,
    currency,
    email,
  } = params;

  // Redirect if no confirmation code
  if (!code) {
    redirect("/");
  }

  // Parse dates
  const checkInDate = checkIn ? parseDate(checkIn) : null;
  const checkOutDate = checkOut ? parseDate(checkOut) : null;

  return (
    <main className="min-h-screen bg-[#f5f3e8] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-primary/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <Link href="/" className="font-serif text-xl text-primary-dark">
              Sanctuary Villas
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          {/* Success Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Success Icon */}
            <div className="bg-green-50 p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="font-serif text-2xl lg:text-3xl text-primary-dark mb-2">
                Booking Confirmed!
              </h1>
              <p className="text-green-700 text-lg font-medium">
                Confirmation Code: {code}
              </p>
            </div>

            {/* Booking Details */}
            <div className="p-6 space-y-4">
              {/* Property */}
              {listingTitle && (
                <div>
                  <h2 className="font-serif text-lg text-primary-dark">
                    {listingTitle}
                  </h2>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-primary/10">
                {checkInDate && (
                  <div>
                    <p className="text-primary text-sm">Check-in</p>
                    <p className="text-primary-dark font-medium">
                      {format(checkInDate, "EEE, MMM d, yyyy")}
                    </p>
                    <p className="text-primary text-sm">3:00 PM</p>
                  </div>
                )}
                {checkOutDate && (
                  <div>
                    <p className="text-primary text-sm">Check-out</p>
                    <p className="text-primary-dark font-medium">
                      {format(checkOutDate, "EEE, MMM d, yyyy")}
                    </p>
                    <p className="text-primary text-sm">11:00 AM</p>
                  </div>
                )}
              </div>

              {/* Guests & Total */}
              <div className="space-y-2">
                {guests && (
                  <div className="flex justify-between">
                    <span className="text-primary">Guests</span>
                    <span className="text-primary-dark font-medium">
                      {guests}
                    </span>
                  </div>
                )}
                {total && currency && (
                  <div className="flex justify-between">
                    <span className="text-primary">Total Paid</span>
                    <span className="text-primary-dark font-semibold text-lg">
                      {formatPrice(total, currency)}
                    </span>
                  </div>
                )}
              </div>

              {/* Email Confirmation */}
              {email && (
                <div className="bg-blue-50 rounded-lg p-4 mt-4">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-blue-500 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <p className="text-blue-700 text-sm font-medium">
                        Confirmation Email Sent
                      </p>
                      <p className="text-blue-600 text-sm">
                        A confirmation email has been sent to{" "}
                        <span className="font-medium">{email}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 space-y-3">
              {listingId && (
                <Link
                  href={`/properties/${listingId}`}
                  className="block w-full py-3 px-4 border border-primary text-primary rounded-lg text-center font-medium hover:bg-primary/5 transition-colors"
                >
                  View Property Details
                </Link>
              )}
              <Link
                href="/"
                className="block w-full py-3 px-4 bg-primary text-white rounded-lg text-center font-medium hover:bg-primary/90 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-center text-primary/60 text-sm mt-6">
            Need help? Contact us at{" "}
            <a
              href="mailto:support@sanctuaryvillas.com"
              className="underline hover:text-primary"
            >
              support@sanctuaryvillas.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
