import { Villa, VillaStyle } from "@/types/villa";

// Villa data from Figma design
// Images from Figma API (valid for 7 days from generation)

export const VILLAS: Villa[] = [
  {
    id: "villa-satu",
    name: "Villa Satu",
    description: "Where luxury meets tranquility",
    bedrooms: 2,
    maxGuests: 4,
    image: "/images/CE4A0786(1).webp",
    slug: "villa-satu",
  },
  {
    id: "villa-dua",
    name: "Villa Dua",
    description: "Your private paradise",
    bedrooms: 3,
    maxGuests: 6,
    image: "/images/CE4A0900.webp",
    slug: "villa-dua",
  },
  {
    id: "villa-tiga",
    name: "Villa Tiga",
    description: "Elevated luxury living",
    bedrooms: 4,
    maxGuests: 8,
    image: "/images/CE4A0910.webp",
    slug: "villa-tiga",
  },
  {
    id: "villa-empat",
    name: "Villa Empat",
    description: "Tropical bliss awaits",
    bedrooms: 2,
    maxGuests: 4,
    image: "/images/CE4A0930.webp",
    slug: "villa-empat",
  },
  {
    id: "tranquil-pavilion",
    name: "Tranquil Pavilion",
    description: "Peace in paradise",
    bedrooms: 1,
    maxGuests: 2,
    image: "/images/CE4A0961.webp",
    slug: "tranquil-pavilion",
  },
  {
    id: "golden-sanctuary",
    name: "Golden Sanctuary",
    description: "Where elegance resides",
    bedrooms: 3,
    maxGuests: 6,
    image: "/images/CE4A0964.webp",
    slug: "golden-sanctuary",
  },
  {
    id: "ocean-whisper",
    name: "Ocean Whisper",
    description: "Coastal luxury living",
    bedrooms: 4,
    maxGuests: 8,
    image: "/images/CE4A0972.webp",
    slug: "ocean-whisper",
  },
  {
    id: "mountain-mist",
    name: "Mountain Mist",
    description: "Highland hideaway",
    bedrooms: 2,
    maxGuests: 4,
    image: "/images/CE4A1064.webp",
    slug: "mountain-mist",
  },
  {
    id: "tropical-dream",
    name: "Tropical Dream",
    description: "Island paradise found",
    bedrooms: 3,
    maxGuests: 6,
    image: "/images/CE4A1091.webp",
    slug: "tropical-dream",
  },
  {
    id: "bamboo-bliss",
    name: "Bamboo Bliss",
    description: "Eco-luxury retreat",
    bedrooms: 2,
    maxGuests: 4,
    image: "/images/CE4A6041.webp",
    slug: "bamboo-bliss",
  },
  {
    id: "royal-residence",
    name: "Royal Residence",
    description: "Palatial perfection",
    bedrooms: 5,
    maxGuests: 10,
    image: "/images/CE4A6111.webp",
    slug: "royal-residence",
  },
];

export const VILLA_STYLES: VillaStyle[] = [
  {
    id: "joglo",
    name: "Villa Joglo",
    description:
      "Traditional Javanese architecture meets modern luxury. These villas feature the iconic Joglo wooden structure with soaring ceilings and open-air living spaces.",
    images: [
      "/images/villas/joglo/cover.webp",
      "/images/villas/joglo/Sanctury Bisma day Four-003.webp",
      "/images/villas/joglo/Sanctury Bisma day Four-025.webp",
      "/images/villas/joglo/villa 101 pool pink to blue-151.webp",
      "/images/villas/joglo/Sanctury Bisma day one-103.webp",
      "/images/villas/joglo/Sanctury Bisma day one-104.webp",
      "/images/villas/joglo/Sanctury Bisma day two-17.webp",
      "/images/villas/joglo/Sanctury Bisma day two-20.webp",
    ],
    roomTypes: [
      {
        count: 3,
        description: "One bedroom with private pool",
      },
      {
        count: 3,
        description: "One bedroom superior with private pool and outdoor bathtub",
      },
    ],
  },
  {
    id: "minang",
    name: "Villa Minang",
    description:
      "Inspired by the distinctive Minangkabau architecture with its dramatic curved roof. These spacious villas offer contemporary comfort with traditional elegance.",
    images: [
      "/images/villas/minang/cover.webp",
      "/images/villas/minang/CE4A1832.webp",
      "/images/villas/minang/CE4A1825.webp",
      "/images/villas/minang/CE4A1777.webp",
      "/images/villas/minang/CE4A1809.webp",
      "/images/villas/minang/CE4A1813.webp",
      "/images/villas/minang/CE4A5577.webp",
      "/images/villas/minang/CE4A5561.webp",
    ],
    roomTypes: [
      {
        count: 1,
        description: "Two bedroom villa with private pool and outdoor tub",
      },
      {
        count: 2,
        description: "Three bedroom villas with private pool and outdoor tub",
      },
      {
        count: 1,
        description:
          "Signature villa with 3 bedrooms, private spa, gym, treehouse yoga shala",
      },
    ],
  },
];
