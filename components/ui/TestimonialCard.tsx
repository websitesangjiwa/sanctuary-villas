"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Testimonial } from "@/types/testimonial";

interface TestimonialCardProps {
  testimonial: Testimonial;
  isActive?: boolean;
}

const TestimonialCard = memo(function TestimonialCard({
  testimonial,
  isActive = false,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={`
        rounded-lg shadow-xl p-6 lg:p-10 flex flex-col gap-4
        transition-all duration-300
        ${isActive ? "bg-[#fffdf3] opacity-100 h-auto md:min-h-[400px]" : "bg-[#eae7d9] opacity-40 h-auto md:min-h-[320px] mt-12"}
      `}
    >
      {/* Stars Rating */}
      <div className="flex items-center justify-center gap-0">
        {[...Array(testimonial.rating)].map((_, index) => (
          <svg
            key={index}
            width={isActive ? "20" : "18"}
            height={isActive ? "20" : "18"}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary-light"
          >
            <path
              d="M10 2L12.1 7.9L18.5 8.3L13.8 12.4L15.2 18.5L10 15.4L4.8 18.5L6.2 12.4L1.5 8.3L7.9 7.9L10 2Z"
              fill="currentColor"
            />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <div className="flex-1 flex items-center overflow-hidden">
        <p
          className={`
            text-primary text-center italic leading-relaxed
            ${isActive ? "text-base md:text-lg line-clamp-8 md:line-clamp-none" : "text-sm md:text-base line-clamp-6 md:line-clamp-none"}
          `}
        >
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </div>

      {/* Author Info */}
      <div className="flex flex-col gap-1 text-center">
        <p
          className={`
            font-serif text-primary-dark
            ${isActive ? "text-lg" : "text-base"}
          `}
        >
          {testimonial.name}
        </p>
        <p
          className={`
            text-primary-light
            ${isActive ? "text-sm" : "text-xs"}
          `}
        >
          {testimonial.location}
        </p>
        <p className="text-[#cab797] text-xs">{testimonial.date}</p>
      </div>
    </motion.div>
  );
});

export default TestimonialCard;
