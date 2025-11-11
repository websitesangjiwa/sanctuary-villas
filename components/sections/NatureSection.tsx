"use client";

import Image from "next/image";
import {motion} from "framer-motion";
import GallerySlider from "@/components/ui/GallerySlider";
import {GALLERY_IMAGES} from "@/lib/data/gallery";
import blurData from "@/lib/data/blur-data.json";

export default function NatureSection() {
  return (
    <section id="gallery" className="bg-surface py-20 lg:py-28">
      {/* Header */}
      <div className="container mx-auto px-8 md:px-8 lg:px-14">
        <div className="mb-16 lg:mb-24">
          {/* Subtitle */}
          <motion.p
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: "-100px"}}
            transition={{duration: 0.6, ease: "easeOut"}}
            className="text-center text-primary-light text-sm font-medium tracking-[2px] text-[14px]  mb-6"
          >
            Discover a Serene Escape
          </motion.p>

          {/* Main Title */}
          <motion.h2
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: "-100px"}}
            transition={{duration: 0.6, delay: 0.2, ease: "easeOut"}}
            className="font-serif text-4xl lg:text-5xl text-center text-primary-dark mb-6"
          >
            <span className="block">Where Nature</span>
            <span className="block">Embraces Luxury</span>
          </motion.h2>

          {/* Decorative Icon */}
          <motion.div
            initial={{opacity: 0, scale: 0.8}}
            whileInView={{opacity: 1, scale: 1}}
            viewport={{once: true, margin: "-100px"}}
            transition={{duration: 0.5, delay: 0.4}}
            className="flex justify-center my-16"
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
                  d="M8 4L14 10L8 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Gallery Slider - Full Width */}
      <motion.div
        initial={{opacity: 0}}
        whileInView={{opacity: 1}}
        viewport={{once: true, margin: "-100px"}}
        transition={{duration: 0.8, delay: 0.3}}
        className="mb-16 lg:mb-28"
      >
        <GallerySlider images={GALLERY_IMAGES}/>
      </motion.div>

      {/* Description Text and About Us */}
      <div className="container mx-auto px-8 md:px-8 lg:px-14">
        {/* Description Text */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, margin: "-100px"}}
          transition={{duration: 0.6, delay: 0.4}}
          className="max-w-3xl mx-auto mb-32 lg:mb-40"
        >
          <p className="text-center text-primary font-serif text-lg md:text-xl lg:text-[28px] leading-relaxed md:leading-relaxed lg:leading-[44.8px]">
            Sanctuary Villas is a serene haven nestled amidst Ubud&apos;s majestic forrest, offering a harmonious blend of
            minimalist luxury and the pristine beauty of nature&apos;s oasis.
          </p>
        </motion.div>

        {/* Grid Layout with Images and About Us */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Overlapping Images */}
          <motion.div
            initial={{opacity: 0, x: -30}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true, margin: "-100px"}}
            transition={{duration: 0.7, delay: 0.2}}
            className="relative h-[400px] md:h-[450px] lg:h-[527px]"
          >
            {/* Left Image */}
            <motion.div
              initial={{opacity: 0, scale: 0.9}}
              whileInView={{opacity: 1, scale: 1}}
              viewport={{once: true, margin: "-50px"}}
              transition={{duration: 0.6, delay: 0.3}}
              className="absolute bottom-0 left-0 w-[60%] h-[70%] md:w-[380px] md:h-[380px] lg:w-[377px] lg:h-[527px] overflow-hidden shadow-xl"
            >
              <Image
                src="/images/CE4A6100.webp"
                alt="Sanctuary Villas Ubud exterior surrounded by tropical forest and lush greenery in Bali"
                fill
                priority
                placeholder="blur"
                blurDataURL={blurData["/images/CE4A6100.webp"]}
                className="object-cover"
                sizes="(max-width: 768px) 60vw, (max-width: 1024px) 280px, 377px"
              />
            </motion.div>

            {/* Right Image (overlapping) */}
            <motion.div
              initial={{opacity: 0, scale: 0.9}}
              whileInView={{opacity: 1, scale: 1}}
              viewport={{once: true, margin: "-50px"}}
              transition={{duration: 0.6, delay: 0.5}}
              className="absolute top-[-73px] right-0 w-[55%] h-[65%] md:top-[-50px] md:right-0 md:w-[360px] lg:left-20 md:h-[360px] lg:top-[-73px] lg:w-[377px] lg:h-[527px] overflow-hidden shadow-xl"
            >
              <Image
                src="/images/583292270.webp"
                alt="Luxury villa interior with minimalist design and natural materials at Sanctuary Villas Ubud"
                fill
                priority
                placeholder="blur"
                blurDataURL={blurData["/images/583292270.webp"]}
                className="object-cover"
                sizes="(max-width: 768px) 55vw, (max-width: 1024px) 280px, 377px"
              />
            </motion.div>
          </motion.div>

          {/* Right: About Us Content */}
          <motion.div
            initial={{opacity: 0, x: 30}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true, margin: "-100px"}}
            transition={{duration: 0.7, delay: 0.3}}
            className="flex flex-col gap-6"
          >

            {/* Heading */}
            <motion.h3
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, margin: "-50px"}}
              transition={{duration: 0.5, delay: 0.5}}
              className="font-serif text-2xl lg:text-3xl text-primary-dark leading-tight"
            >
              Immerse Yourself in the Embrace of Nature
            </motion.h3>

            {/* Description */}
            <motion.p
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, margin: "-50px"}}
              transition={{duration: 0.5, delay: 0.6}}
              className="text-primary text-base leading-7"
            >
              Sanctuary Villas is set along the iconic Jalan Bisma in Ubud, Bali,
              a charming lane lined with cafés, boutiques, and artful spaces.
            </motion.p>

            <motion.p
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, margin: "-50px"}}
              transition={{duration: 0.5, delay: 0.7}}
              className="text-primary text-base leading-7"
            >
              Just moments from Ubud Palace, Monkey Forest, and the lively market,
              it offers the rare balance of central convenience and quiet retreat.
            </motion.p>

            <motion.p
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, margin: "-50px"}}
              transition={{duration: 0.5, delay: 0.8}}
              className="text-primary text-base leading-7"
            >
              Designed for the modern traveler, it&apos;s a space where architecture and
              atmosphere converge; light, air, and texture working together to
              restore your sense of calm.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
