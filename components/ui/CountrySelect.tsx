"use client";

import { useState, useRef, useEffect } from "react";
import { getCountries } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en";
import Flags from "react-phone-number-input/flags";
import type { CountryCode } from "libphonenumber-js";

interface Country {
  code: CountryCode;
  name: string;
}

interface CountrySelectProps {
  value: string;
  onChange: (country: { name: string; code: string }) => void;
  disabled?: boolean;
  placeholder?: string;
}

// Get all countries and sort alphabetically
const COUNTRIES: Country[] = getCountries()
  .map((code) => ({
    code,
    name: (en[code] as string) || code,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export default function CountrySelect({
  value,
  onChange,
  disabled = false,
  placeholder = "Select a country",
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find selected country
  const selectedCountry = COUNTRIES.find((c) => c.name === value);

  // Filter countries by search
  const filteredCountries = COUNTRIES.filter((country) =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (country: Country) => {
    onChange({ name: country.name, code: country.code });
    setIsOpen(false);
    setSearch("");
  };

  const toggleOpen = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearch("");
      }
    }
  };

  // Render flag component
  const renderFlag = (code: CountryCode) => {
    const FlagComponent = Flags[code];
    if (FlagComponent) {
      return (
        <span className="inline-block w-5 h-4 overflow-hidden rounded-sm shrink-0">
          <FlagComponent title={code} />
        </span>
      );
    }
    return null;
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={toggleOpen}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border rounded-lg bg-white text-left
          flex items-center justify-between gap-2
          focus:outline-none focus:ring-2 focus:ring-[#cab797]/50
          transition-colors text-sm border-[#cab797]/40
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "cursor-pointer hover:border-[#cab797]"}
          ${isOpen ? "ring-2 ring-[#cab797]/50" : ""}
        `}
      >
        <span className="flex items-center gap-2 min-w-0">
          {selectedCountry ? (
            <>
              {renderFlag(selectedCountry.code)}
              <span className="text-[#2e1b12] truncate">
                {selectedCountry.name}
              </span>
            </>
          ) : (
            <span className="text-[#717182]">{placeholder}</span>
          )}
        </span>

        {/* Chevron icon */}
        <svg
          className={`w-4 h-4 text-[#643c15] transition-transform shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#cab797]/40 rounded-lg shadow-lg overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-[#cab797]/20">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717182]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search countries..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-[#cab797]/40 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-[#cab797]/50
                  placeholder:text-[#717182] text-[#2e1b12]"
              />
            </div>
          </div>

          {/* Country list */}
          <ul className="max-h-60 overflow-y-auto py-1">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <li key={country.code}>
                  <button
                    type="button"
                    onClick={() => handleSelect(country)}
                    className={`
                      w-full px-3 py-2 flex items-center gap-3 text-left text-sm
                      hover:bg-[#cab797]/10 transition-colors
                      ${selectedCountry?.code === country.code ? "bg-[#cab797]/20" : ""}
                    `}
                  >
                    {renderFlag(country.code)}
                    <span className="text-[#2e1b12]">{country.name}</span>
                  </button>
                </li>
              ))
            ) : (
              <li className="px-3 py-4 text-sm text-[#717182] text-center">
                No countries found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
