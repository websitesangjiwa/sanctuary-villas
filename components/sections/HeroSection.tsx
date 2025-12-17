"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import BackgroundVideo from "@/components/ui/BackgroundVideo";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen pt-20 flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <BackgroundVideo
        desktopSrc="/videos/hero-desktop.mp4"
        mobileSrc="/videos/hero-mobile.mp4"
        poster="/images/CE4A0786(1).webp"
        overlay={true}
        overlayOpacity={0.35}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-8 md:px-8 lg:px-14">
        <div className="flex flex-col items-center justify-center gap-6 lg:gap-7 max-w-[667px] mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-[280px] h-[96px] lg:w-[403px] lg:h-[138px]"
          >
            <Image
              src="/logo.png"
              alt="Sanctuary Villas Ubud - Luxury Private Villas in Bali"
              fill
              className="object-contain"
              priority
            />
          </motion.div>

          {/* H1 Heading - Hidden but SEO friendly */}
          <h1 className="sr-only">
            Sanctuary Villas Ubud - Luxury Private Villas in Bali
          </h1>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-center"
          >
            <p className="text-surface text-base leading-6">
              Book direct, best price guarantee and breakfast included
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center"
          >
            {/* WhatsApp Button */}
            <motion.a
              href="https://wa.me/6287817274325"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-surface text-sm font-medium leading-5 px-8 py-2 rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap w-full sm:w-auto text-center"
            >
              Message us on WhatsApp
            </motion.a>

            {/* Book Now Button */}
            <Link href="/book" className="w-full sm:w-auto">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-surface border border-surface text-primary-dark text-sm font-medium leading-5 px-8 py-2 rounded-lg hover:bg-surface/90 transition-colors w-full sm:w-auto inline-block text-center"
              >
                Book Now
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
