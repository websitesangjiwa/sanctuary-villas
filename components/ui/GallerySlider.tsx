"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import { motion } from "framer-motion";
import { GalleryImage } from "@/types/gallery";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";

interface GallerySliderProps {
  images: GalleryImage[];
}

export default function GallerySlider({ images }: GallerySliderProps) {
  return (
    <div>
      <Swiper
        modules={[FreeMode, Mousewheel]}
        spaceBetween={16}
        slidesPerView="auto"
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
        className="!pl-4 lg:!pl-14"
      >
        {images.map((image, index) => (
          <SwiperSlide
            key={image.id}
            style={{ width: "auto" }}
            className="!h-[500px]"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{ y: -5 }}
              className="overflow-hidden shadow-lg group h-full"
            >
              <Image
                src={image.image}
                alt={image.alt}
                width={0}
                height={500}
                loading="lazy"
                placeholder={image.blurDataURL ? "blur" : "empty"}
                blurDataURL={image.blurDataURL}
                className="w-auto h-full object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 400px"
              />
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
