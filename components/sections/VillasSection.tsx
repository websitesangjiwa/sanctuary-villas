"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

// Example villa data (will be from API later)
const villas = [
  {
    id: 1,
    title: "Ocean View Villa",
    location: "Бали, Индонезия",
    price: 500,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
    bedrooms: 4,
  },
  {
    id: 2,
    title: "Mountain Retreat",
    location: "Швейцария",
    price: 800,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    bedrooms: 5,
  },
  {
    id: 3,
    title: "Beach Paradise",
    location: "Мальдивы",
    price: 1200,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    bedrooms: 3,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function VillasSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 px-8 bg-gray-50" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Наши виллы
          </h2>
          <p className="text-xl text-gray-600">
            Эксклюзивная коллекция роскошных вилл
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {villas.map((villa) => (
            <motion.div
              key={villa.id}
              variants={item}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
            >
              <div className="relative h-64">
                <Image
                  src={villa.image}
                  alt={villa.title}
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {villa.title}
                </h3>
                <p className="text-gray-600 mb-4">📍 {villa.location}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">
                    🛏️ {villa.bedrooms} спальни
                  </span>
                  <span className="text-2xl font-bold text-indigo-600">
                    ${villa.price}
                    <span className="text-sm text-gray-500">/ночь</span>
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Подробнее
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
