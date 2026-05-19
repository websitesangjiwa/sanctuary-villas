import HeroSection from "@/components/sections/HeroSection";
import BookingSection from "@/components/sections/BookingSection";
import OurVillasSection from "@/components/sections/OurVillasSection";
import NatureSection from "@/components/sections/NatureSection";
import SpecialOfferSection from "@/components/sections/SpecialOfferSection";
import VillaStylesSection from "@/components/sections/VillaStylesSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import VideoSection from "@/components/sections/VideoSection";
import ContactCTASection from "@/components/sections/ContactCTASection";
import MapSection from "@/components/sections/MapSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Booking Section */}
      {/*<BookingSection />*/}

      {/* Our Villas Section */}
      {/*<OurVillasSection />*/}

      {/* Where Nature Embraces Luxury Section */}
      <NatureSection />

      {/* Special Offer Section */}
      {/*<SpecialOfferSection />*/}

      {/* Villa Styles Section */}
      <VillaStylesSection />

      {/* Guest Experiences Section */}
      <TestimonialsSection />

      {/* Experience Sanctuary Video Section */}
      {/*<VideoSection />*/}

      {/* Contact CTA Section */}
      {/*<ContactCTASection />*/}

      {/* Find Us Map Section */}
      <MapSection />
    </main>
  );
}
