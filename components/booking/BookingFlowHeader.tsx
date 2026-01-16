"use client";

import Link from "next/link";

interface BookingFlowHeaderProps {
  currentStep: 1 | 2 | 3;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  listingId?: string;
}

const steps = [
  { number: 1, label: "Select Dates" },
  { number: 2, label: "Choose Villa" },
  { number: 3, label: "Confirm Booking" },
];

export default function BookingFlowHeader({
  currentStep,
  checkIn,
  checkOut,
  guests,
  listingId,
}: BookingFlowHeaderProps) {
  // Build URL params string
  const buildParams = () => {
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests.toString());
    return params.toString();
  };

  // Get the href for a step (only for previous steps)
  const getStepHref = (stepNumber: number): string | null => {
    if (stepNumber >= currentStep) return null; // Can't click current or future steps

    const params = buildParams();

    if (stepNumber === 1) {
      return `/book${params ? `?${params}` : ""}`;
    }

    if (stepNumber === 2 && listingId) {
      const propertyParams = new URLSearchParams();
      if (checkIn) propertyParams.set("checkIn", checkIn);
      if (checkOut) propertyParams.set("checkOut", checkOut);
      if (guests) propertyParams.set("minOccupancy", guests.toString());
      return `/properties/${listingId}${propertyParams.toString() ? `?${propertyParams.toString()}` : ""}`;
    }

    return null;
  };

  return (
    <section className="bg-[#eae7d9] pt-12 pb-8 px-4 sm:px-10">
      <h1 className="font-['Ovo'] text-3xl sm:text-4xl lg:text-5xl text-[#2e1b12] text-center tracking-[0.2em] mb-8">
        Book Your Stay
      </h1>

      <div className="flex items-center justify-center gap-4 sm:gap-8">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isClickable = step.number < currentStep;
          const href = getStepHref(step.number);

          const stepContent = (
            <>
              {/* Circle with number */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center shrink-0
                  ${isActive ? "bg-[#8b6630]" : "bg-[#cab797]"}
                  ${isClickable ? "group-hover:bg-[#8b6630] transition-colors" : ""}
                `}
              >
                <span className="text-white text-base font-normal">
                  {step.number}
                </span>
              </div>
              {/* Label - hidden on very small screens */}
              <span
                className={`
                  hidden sm:block text-base text-[#643c15] whitespace-nowrap
                  ${isClickable ? "group-hover:text-[#8b6630] transition-colors" : ""}
                `}
              >
                {step.label}
              </span>
            </>
          );

          return (
            <div key={step.number} className="flex items-center gap-4 sm:gap-8">
              {/* Step */}
              {isClickable && href ? (
                <Link
                  href={href}
                  className="group flex items-center gap-3 cursor-pointer"
                >
                  {stepContent}
                </Link>
              ) : (
                <div className="flex items-center gap-3">{stepContent}</div>
              )}

              {/* Connector line (not after last step) */}
              {index < steps.length - 1 && (
                <div className="w-8 sm:w-16 h-px bg-[#cab797]" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
