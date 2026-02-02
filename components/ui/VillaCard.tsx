"use client";

import { memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Villa } from "@/types/villa";

interface VillaCardProps {
  villa: Villa;
  index?: number;
}

const VillaCard = memo(function VillaCard({ villa, index = 0 }: VillaCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      className="flex flex-col gap-4 h-full"
    >
      {/* Image Container */}
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className="relative w-full h-96 overflow-hidden shadow-lg group"
      >
        <Image
          src={villa.image}
          alt={`${villa.name} - Luxury villa at Sanctuary Villas Ubud with ${villa.bedrooms} bedrooms`}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
        />
      </motion.div>

      {/* Content Container */}
      <div className="flex flex-col gap-2 px-2">
        {/* Villa Name */}
        <h3 className="font-serif text-[25px] leading-[37.5px] text-primary-dark">
          {villa.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-primary leading-5">
          {villa.description}
        </p>

        {/* Details (Bedrooms & Guests) */}
        <div className="flex items-center gap-4 text-sm text-primary-light">
          <span>{villa.bedrooms} Bedrooms</span>
          <span>•</span>
          <span>Up to {villa.maxGuests} Guests</span>
        </div>

        {/* View Details Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-primary text-white text-sm font-medium leading-5 py-2 px-8 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-2"
          aria-label={`View details for ${villa.name}`}
        >
          <span>View Details</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 12L10 8L6 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
});

export default VillaCard;
