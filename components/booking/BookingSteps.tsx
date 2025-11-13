"use client";

interface BookingStepsProps {
  currentStep?: 1 | 2 | 3;
}

export default function BookingSteps({ currentStep = 1 }: BookingStepsProps) {
  const steps = [
    { number: 1, label: "Select Dates" },
    { number: 2, label: "Choose Villa" },
    { number: 3, label: "Confirm Booking" },
  ];

  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          {/* Step */}
          <div className="flex items-center gap-3">
            {/* Circle with number */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-normal ${
                step.number === currentStep
                  ? "bg-[#8b6630] text-white"
                  : step.number < currentStep
                  ? "bg-[#8b6630] text-white"
                  : "bg-[#cab797] text-white"
              }`}
            >
              {step.number}
            </div>
            {/* Label */}
            <span
              className={`text-base font-normal whitespace-nowrap ${
                step.number === currentStep
                  ? "text-[#643c15]"
                  : "text-[#8b6630]"
              }`}
            >
              {step.label}
            </span>
          </div>

          {/* Connector line */}
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-px mx-4 ${
                step.number < currentStep ? "bg-[#8b6630]" : "bg-[#cab797]"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
