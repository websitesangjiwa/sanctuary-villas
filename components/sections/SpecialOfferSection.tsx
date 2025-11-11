"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function SpecialOfferSection() {
  return (
    <section id="promotion" className="bg-primary relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px] lg:min-h-[500px]">
        {/* Left: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-6 justify-center px-6 py-16 lg:pl-20 lg:pr-16 lg:py-20"
        >
            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-serif text-xl text-surface tracking-[4px]"
            >
              SPECIAL OFFER
            </motion.h2>

            {/* Main Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-[#cab797] text-base font-semibold leading-6"
            >
              Book directly through our website and enjoy exclusive benefits
              including complimentary breakfast and the best available rates.
            </motion.p>

            {/* Additional Info */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-[#cab797] text-base leading-6"
            >
              Experience luxury in the heart of Ubud with special perks for direct bookings
            </motion.p>

            {/* Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="self-start bg-surface text-primary text-sm font-medium leading-5 px-6 py-2 rounded-lg hover:bg-surface/90 transition-colors"
            >
              Book Now & Save
            </motion.button>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative h-[300px] lg:h-auto shadow-2xl"
          >
            <Image
              src="/images/CE4A6347.webp"
              alt="Luxury villa bedroom"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </div>
    </section>
  );
}
