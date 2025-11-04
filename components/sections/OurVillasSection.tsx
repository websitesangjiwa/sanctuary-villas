"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import { motion } from "framer-motion";
import VillaCard from "@/components/ui/VillaCard";
import { VILLAS } from "@/lib/data/villas";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";

export default function OurVillasSection() {
  return (
    <section id="villas" className="bg-surface py-20 lg:pt-20 lg:pb-36">
      <div className="container mx-auto px-8 md:px-8 lg:px-14">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-serif text-xl text-center text-primary-dark tracking-[4px] mb-12"
          >
            Our Villas
          </motion.h2>

          {/* Decorative Icon Circle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="flex justify-center mb-12"
          >
            <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary"
              >
                <path
                  d="M10 4V16M10 16L6 12M10 16L14 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="max-w-2xl mx-auto"
          >
            <p className="text-center text-primary text-base leading-6">
              Each villa is designed as a living space of quiet elegance, where
              contemporary architecture meets soulful simplicity of Bali for a
              truly restorative experience.
            </p>
          </motion.div>
        </div>

        {/* Villas Slider */}
        <div className="mb-12 lg:mb-14 -mx-4 lg:mx-0">
          <Swiper
            modules={[FreeMode, Mousewheel]}
            spaceBetween={16}
            slidesPerView={1.3}
            speed={600}
            freeMode={{
              enabled: true,
              momentum: true,
              momentumRatio: 0.5,
            }}
            mousewheel={{
              forceToAxis: true,
              sensitivity: 0.5,
              releaseOnEdges: true,
              thresholdDelta: 10,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1.5,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3.2,
                spaceBetween: 32,
              },
            }}
            className="!px-8 lg:!px-0"
          >
            {VILLAS.map((villa, index) => (
              <SwiperSlide key={villa.id}>
                <VillaCard villa={villa} index={index} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Book Your Stay Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary-light text-white text-sm font-medium leading-5 px-8 py-2 rounded-lg hover:bg-primary-light/90 transition-colors"
            aria-label="Book your stay at Sanctuary Villas"
          >
            Book Your Stay
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
