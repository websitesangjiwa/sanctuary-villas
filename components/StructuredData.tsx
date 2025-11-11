export default function StructuredData() {
  const hotelSchema = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": "Sanctuary Villas Ubud",
    "description": "Luxury private villas nestled in Ubud's majestic forest, offering a harmonious blend of minimalist luxury and pristine natural beauty.",
    "image": "https://sanctuaryvillas.co/images/CE4A0786(1).jpg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jalan Bisma",
      "addressLocality": "Ubud",
      "addressRegion": "Bali",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -8.5069,
      "longitude": 115.2625
    },
    "url": "https://sanctuaryvillas.co",
    "telephone": "+62-878-1727-4325",
    "priceRange": "$$$",
    "starRating": {
      "@type": "Rating",
      "ratingValue": "5"
    },
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Private Pool"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Free WiFi"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Breakfast Included"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Air Conditioning"
      }
    ],
    "checkinTime": "14:00",
    "checkoutTime": "12:00"
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Sanctuary Villas Ubud",
    "url": "https://sanctuaryvillas.co",
    "logo": "https://sanctuaryvillas.co/logo.png",
    "description": "Luxury villa accommodation in Ubud, Bali",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jalan Bisma",
      "addressLocality": "Ubud",
      "addressRegion": "Bali",
      "postalCode": "80571",
      "addressCountry": "ID"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+62-878-1727-4325",
      "contactType": "customer service",
      "availableLanguage": ["English", "Indonesian"]
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": "Sanctuary Villas Ubud",
    "image": "https://sanctuaryvillas.co/images/CE4A0786(1).jpg",
    "url": "https://sanctuaryvillas.co",
    "telephone": "+62-878-1727-4325",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jalan Bisma",
      "addressLocality": "Ubud",
      "addressRegion": "Bali",
      "postalCode": "80571",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -8.5069,
      "longitude": 115.2625
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "priceRange": "$$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "3",
      "bestRating": "5",
      "worstRating": "5"
    }
  };

  const reviewsSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Hotel",
      "name": "Sanctuary Villas Ubud"
    },
    "author": {
      "@type": "Person",
      "name": "Amit Neuman"
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "5",
      "bestRating": "5"
    },
    "datePublished": "2024-12-01",
    "reviewBody": "This is my third time visiting Bali (Ubud) & I don't think I'll stay anywhere else after my experience here. Top notch service & staff, available 24/7 via WhatsApp, gorgeous architecture & high end finished, and they have created a sense of privacy and tranquility while still being right in the action of central Ubud."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
      />
    </>
  );
}
