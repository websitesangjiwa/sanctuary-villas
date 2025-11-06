import type { Metadata } from "next";
import { Ovo, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StructuredData from "@/components/StructuredData";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const ovo = Ovo({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-ovo",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sanctuaryvillas.com'),
  title: {
    default: 'Sanctuary Villas Ubud - Luxury Private Villas in Bali',
    template: '%s | Sanctuary Villas Ubud'
  },
  description: 'Experience serene luxury at Sanctuary Villas, nestled in Ubud\'s majestic forest. Book direct for best price guarantee and complimentary breakfast at our exclusive private villas in Bali.',
  keywords: [
    'Ubud villas', 'Bali accommodation', 'luxury villas Bali',
    'Ubud hotels', 'private villas Ubud', 'Sanctuary Villas',
    'Bisma Ubud', 'villa rental Bali', 'Joglo villa', 'Minang villa',
    'Ubud luxury accommodation', 'Bali boutique hotels'
  ],
  authors: [{ name: 'Sanctuary Villas Ubud' }],
  creator: 'Sanctuary Villas',
  publisher: 'Sanctuary Villas',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sanctuaryvillas.com',
    siteName: 'Sanctuary Villas Ubud',
    title: 'Sanctuary Villas Ubud - Luxury Private Villas in Bali',
    description: 'Private luxury villas in the heart of Ubud, Bali. Book direct for best rates and complimentary breakfast.',
    images: [{
      url: '/images/CE4A0786(1).jpg',
      width: 1200,
      height: 630,
      alt: 'Sanctuary Villas Ubud - Luxury accommodation in Bali',
    }],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Sanctuary Villas Ubud - Luxury Private Villas in Bali',
    description: 'Private luxury villas in the heart of Ubud, Bali',
    images: ['/images/CE4A0786(1).jpg'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ovo.variable} ${nunitoSans.variable}`}>
      <head>
        <StructuredData />
      </head>
      <body className="font-sans">
        <GoogleAnalytics />
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
