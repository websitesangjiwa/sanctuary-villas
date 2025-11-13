"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#2e1b12] pt-16 pb-8">
      <div className="container mx-auto px-8 md:px-8 lg:px-14">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 mb-16">
          {/* Left Column - Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-serif text-lg text-surface tracking-[5.4px] uppercase mb-4">
              sanctuary villas
            </h3>
            <p className="text-[#cab797] text-base leading-6 mb-6">
              A place of quiet design and gentle rhythm.
              <br />
              Where every stay feels like coming home.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <Link
                href="https://www.instagram.com/sanctuaryvillas/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#cab797] hover:text-surface transition-colors"
                aria-label="Instagram"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 0C7.284 0 6.944.012 5.878.06 4.813.11 4.086.278 3.45.525a4.917 4.917 0 00-1.772 1.153A4.917 4.917 0 00.525 3.45C.278 4.086.11 4.813.06 5.878.012 6.944 0 7.284 0 10s.012 3.056.06 4.122c.05 1.065.218 1.792.465 2.428a4.917 4.917 0 001.153 1.772 4.917 4.917 0 001.772 1.153c.636.247 1.363.415 2.428.465C6.944 19.988 7.284 20 10 20s3.056-.012 4.122-.06c1.065-.05 1.792-.218 2.428-.465a4.917 4.917 0 001.772-1.153 4.917 4.917 0 001.153-1.772c.247-.636.415-1.363.465-2.428C19.988 13.056 20 12.716 20 10s-.012-3.056-.06-4.122c-.05-1.065-.218-1.792-.465-2.428a4.917 4.917 0 00-1.153-1.772A4.917 4.917 0 0016.55.525C15.914.278 15.187.11 14.122.06 13.056.012 12.716 0 10 0zm0 1.802c2.67 0 2.986.01 4.04.058.976.045 1.505.207 1.858.344.467.182.8.398 1.15.748.35.35.566.683.748 1.15.137.353.299.882.344 1.858.048 1.054.058 1.37.058 4.04s-.01 2.986-.058 4.04c-.045.976-.207 1.505-.344 1.858a3.097 3.097 0 01-.748 1.15c-.35.35-.683.566-1.15.748-.353.137-.882.299-1.858.344-1.054.048-1.37.058-4.04.058s-2.986-.01-4.04-.058c-.976-.045-1.505-.207-1.858-.344a3.097 3.097 0 01-1.15-.748 3.097 3.097 0 01-.748-1.15c-.137-.353-.299-.882-.344-1.858-.048-1.054-.058-1.37-.058-4.04s.01-2.986.058-4.04c.045-.976.207-1.505.344-1.858.182-.467.398-.8.748-1.15.35-.35.683-.566 1.15-.748.353-.137.882-.299 1.858-.344 1.054-.048 1.37-.058 4.04-.058zM10 4.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm6.538-8.671a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z"
                    fill="currentColor"
                  />
                </svg>
              </Link>
              <Link
                href="https://www.tripadvisor.com/Hotel_Review-g26444064-d27103316-Reviews-Sanctuary_Villas-Padangtegal_Ubud_Gianyar_Regency_Bali.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#cab797] hover:text-surface transition-colors"
                aria-label="TripAdvisor"
              >
                <svg
                  width="24"
                  height="16"
                  viewBox="0 0 24 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23.9999 7.70605C23.9999 5.96605 23.3399 4.38605 22.2599 3.19605L23.9999 0.706055L21.0599 0.706055C18.9799 -0.493945 16.5799 -0.173945 14.7399 1.22605C13.8799 0.946055 12.9599 0.786055 11.9999 0.786055C11.0399 0.786055 10.1199 0.946055 9.25995 1.22605C7.41995 -0.173945 5.01995 -0.493945 2.93995 0.686055L-6.10352e-05 0.686055L1.73995 3.17605C0.659952 4.36605 -6.10352e-05 5.94605 -6.10352e-05 7.68605C-6.10352e-05 11.1661 2.77995 13.9461 6.25995 13.9461C8.35995 13.9461 10.2599 13.0061 11.4799 11.5261L11.9999 12.2261L12.5199 11.5261C13.7399 13.0061 15.6399 13.9461 17.7399 13.9461C21.2199 13.9461 23.9999 11.1661 23.9999 7.68605V7.70605ZM6.25995 12.2061C3.75995 12.2061 1.73995 10.1861 1.73995 7.68605C1.73995 5.18605 3.75995 3.16605 6.25995 3.16605C8.75995 3.16605 10.7799 5.18605 10.7799 7.68605C10.7799 10.1861 8.75995 12.2061 6.25995 12.2061ZM17.7399 12.2061C15.2399 12.2061 13.2199 10.1861 13.2199 7.68605C13.2199 5.18605 15.2399 3.16605 17.7399 3.16605C20.2399 3.16605 22.2599 5.18605 22.2599 7.68605C22.2599 10.1861 20.2399 12.2061 17.7399 12.2061ZM6.25995 9.42605C7.21995 9.42605 7.99995 8.64605 7.99995 7.68605C7.99995 6.72605 7.21995 5.94605 6.25995 5.94605C5.29995 5.94605 4.51995 6.72605 4.51995 7.68605C4.51995 8.64605 5.29995 9.42605 6.25995 9.42605ZM17.7399 9.42605C18.6999 9.42605 19.4799 8.64605 19.4799 7.68605C19.4799 6.72605 18.6999 5.94605 17.7399 5.94605C16.7799 5.94605 15.9999 6.72605 15.9999 7.68605C15.9999 8.64605 16.7799 9.42605 17.7399 9.42605Z"
                    fill="currentColor"
                  />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Middle Column - Discover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-serif text-base text-surface mb-4">Discover</h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={handleScrollToTop}
                className="text-[#cab797] text-base font-medium hover:text-surface transition-colors"
              >
                Home
              </Link>
              <Link
                href="/"
                onClick={(e) => handleScrollToSection(e, "villa-styles")}
                className="text-[#cab797] text-base font-medium hover:text-surface transition-colors"
              >
                Villas
              </Link>
              <Link
                href="/"
                onClick={(e) => handleScrollToSection(e, "gallery")}
                className="text-[#cab797] text-base font-medium hover:text-surface transition-colors"
              >
                Gallery
              </Link>
              <Link
                href="/"
                onClick={(e) => handleScrollToSection(e, "booking")}
                className="text-[#cab797] text-base font-medium hover:text-surface transition-colors"
              >
                Promotion
              </Link>
              <Link
                href="/"
                onClick={(e) => handleScrollToSection(e, "contact")}
                className="text-[#cab797] text-base font-medium hover:text-surface transition-colors"
              >
                Contact
              </Link>
            </nav>
          </motion.div>

          {/* Right Column - Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="font-serif text-base text-surface mb-4">Contact</h4>
            <div className="flex flex-col gap-3">
              {/* Address */}
              <div className="flex gap-2">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0 mt-1 text-[#cab797]"
                >
                  <path
                    d="M7.5 0C5.01472 0 3 2.01472 3 4.5C3 7.98528 7.5 13.5 7.5 13.5C7.5 13.5 12 7.98528 12 4.5C12 2.01472 9.98528 0 7.5 0ZM7.5 6.375C6.67157 6.375 6 5.70343 6 4.875C6 4.04657 6.67157 3.375 7.5 3.375C8.32843 3.375 9 4.04657 9 4.875C9 5.70343 8.32843 6.375 7.5 6.375Z"
                    fill="currentColor"
                  />
                </svg>
                <p className="text-[#cab797] text-base leading-6">
                  Jalan Bisma, Ubud, Bali 80571, Indonesia
                </p>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0 text-[#cab797]"
                >
                  <path
                    d="M13.5 10.5V12.75C13.5 13.1642 13.1642 13.5 12.75 13.5C6.12258 13.5 0.75 8.12742 0.75 1.5C0.75 1.08579 1.08579 0.75 1.5 0.75H3.75C4.16421 0.75 4.5 1.08579 4.5 1.5V4.125C4.5 4.53921 4.16421 4.875 3.75 4.875H2.625C3.30964 8.24036 6.00964 10.9404 9.375 11.625V10.5C9.375 10.0858 9.71079 9.75 10.125 9.75H12.75C13.1642 9.75 13.5 10.0858 13.5 10.5Z"
                    fill="currentColor"
                  />
                </svg>
                <Link
                  href="tel:+6287817274325"
                  className="text-[#cab797] text-base hover:text-surface transition-colors"
                >
                  +62 878 1727 4325
                </Link>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0 text-[#cab797]"
                >
                  <path
                    d="M1.5 3.75C1.5 3.33579 1.83579 3 2.25 3H12.75C13.1642 3 13.5 3.33579 13.5 3.75V11.25C13.5 11.6642 13.1642 12 12.75 12H2.25C1.83579 12 1.5 11.6642 1.5 11.25V3.75ZM3 5.25V10.5H12V5.25L7.5 8.25L3 5.25ZM3.375 4.5L7.5 7.25L11.625 4.5H3.375Z"
                    fill="currentColor"
                  />
                </svg>
                <Link
                  href="mailto:sanctuaryubudvillas@gmail.com"
                  className="text-[#cab797] text-base hover:text-surface transition-colors"
                >
                  sanctuaryubudvillas@gmail.com
                </Link>
              </div>

              {/* Google Maps Link */}
              <div className="mt-4">
                <p className="text-[#cab797] text-base">
                  Find us on{" "}
                  <Link
                    href="https://maps.app.goo.gl/HYWGF82iSLMXtaZXA?g_st=ipc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#cab797] hover:text-surface transition-colors underline decoration-[#cab797] hover:decoration-surface underline-offset-4"
                  >
                    Google Maps
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="border-t border-[#cab797]/30 pt-12 pb-8"
        >
          <h4 className="font-serif text-base text-surface mb-8">
            Frequently Asked Questions
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* FAQ 1 */}
            <div>
              <h5 className="font-serif text-base text-surface mb-3">
                Do I get a better rate if I book directly?
              </h5>
              <p className="text-[#cab797] text-base leading-6">
                Yes. You will always receive the best available rate and
                complimentary à la carte breakfast when booking directly through
                our official website.
              </p>
            </div>

            {/* FAQ 2 */}
            <div>
              <h5 className="font-serif text-base text-surface mb-3">
                Is breakfast included?
              </h5>
              <p className="text-[#cab797] text-base leading-6">
                Yes. Breakfast is included for all direct bookings. Guests
                booking through OTA platforms may have different inclusions
                depending on their rate plan.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="border-t border-[#cab797]/30 pt-8"
        >
          <p className="text-[#cab797] text-base text-center">
            © {currentYear} Sanctuary Villas. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
