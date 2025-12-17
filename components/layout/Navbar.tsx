"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/", scrollTo: null },
    { name: "Villas", href: "/", scrollTo: "villa-styles" },
    { name: "About Us", href: "/", scrollTo: "gallery" },
    { name: "Book Now", href: "/book", scrollTo: null },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, scrollTo: string | null, href: string) => {
    // Only handle scroll behavior for same-page navigation
    if (pathname === "/" && (scrollTo || href === "/")) {
      e.preventDefault();
      setIsMenuOpen(false);

      setTimeout(() => {
        if (scrollTo) {
          const element = document.getElementById(scrollTo);
          if (element) {
            const navbarHeight = 80;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - navbarHeight;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 100);
    }
  };

  const isActiveLink = (link: typeof navLinks[0]) => {
    if (link.href !== "/") {
      return pathname === link.href;
    }
    return pathname === "/" && link.name === "Home";
  };

  return (
    <nav className="bg-[#2e1b12] fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-8 md:px-8 lg:px-14">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="relative h-[53px] w-[155px] shrink-0">
            <Image
              src="/logo.png"
              alt="Sanctuary Villas"
              fill
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleScroll(e, link.scrollTo, link.href)}
                className={`text-base transition-colors ${
                  isActiveLink(link)
                    ? "text-surface"
                    : "text-[#cab797] hover:text-surface"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-surface p-2"
            aria-label="Toggle menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <>
                  <path
                    d="M3 12H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 6H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 18H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-[#2e1b12] border-t border-[#cab797]/20 overflow-hidden"
          >
            <div className="container mx-auto px-8 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.scrollTo, link.href)}
                  className={`text-base transition-colors py-2 ${
                    isActiveLink(link)
                      ? "text-surface"
                      : "text-[#cab797] hover:text-surface"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
