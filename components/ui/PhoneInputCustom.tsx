"use client";

import { useState, useRef, useEffect } from "react";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en";
import Flags from "react-phone-number-input/flags";
import type { CountryCode } from "libphonenumber-js";

interface Country {
  code: CountryCode;
  name: string;
  callingCode: string;
}

interface PhoneInputCustomProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder?: string;
  defaultCountry?: CountryCode;
  hasError?: boolean;
}

// Get all countries with calling codes and sort alphabetically
const COUNTRIES: Country[] = getCountries()
  .map((code) => ({
    code,
    name: (en[code] as string) || code,
    callingCode: getCountryCallingCode(code),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export default function PhoneInputCustom({
  value,
  onChange,
  onBlur,
  disabled = false,
  placeholder = "Enter phone number",
  defaultCountry = "ID",
  hasError = false,
}: PhoneInputCustomProps) {
  // Parse initial country from value or use default
  const getInitialCountry = () => {
    if (value) {
      // Try to find country by calling code from the value
      for (const country of COUNTRIES) {
        if (value.startsWith(`+${country.callingCode}`)) {
          return country;
        }
      }
    }
    return COUNTRIES.find((c) => c.code === defaultCountry) || COUNTRIES[0];
  };

  const [selectedCountry, setSelectedCountry] = useState<Country>(getInitialCountry);
  const [phoneNumber, setPhoneNumber] = useState(() => {
    // Extract phone number without country code
    if (value && value.startsWith(`+${selectedCountry.callingCode}`)) {
      return value.slice(selectedCountry.callingCode.length + 1);
    }
    return "";
  });
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter countries by search
  const filteredCountries = COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(search.toLowerCase()) ||
      country.callingCode.includes(search)
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

  // Update parent value when country or phone changes
  const updateValue = (country: Country, phone: string) => {
    if (phone) {
      onChange(`+${country.callingCode}${phone}`);
    } else {
      onChange("");
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearch("");
    updateValue(country, phoneNumber);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const cleaned = e.target.value.replace(/\D/g, "");
    setPhoneNumber(cleaned);
    updateValue(selectedCountry, cleaned);
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
    <div ref={containerRef} className="flex gap-2">
      {/* Country selector */}
      <div className="relative">
        <button
          type="button"
          onClick={toggleOpen}
          disabled={disabled}
          className={`
            px-2 py-2 border rounded-lg bg-white
            flex items-center gap-1.5
            focus:outline-none focus:ring-2 focus:ring-[#cab797]/50
            transition-colors text-sm border-[#cab797]/40
            ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "cursor-pointer hover:border-[#cab797]"}
            ${isOpen ? "ring-2 ring-[#cab797]/50" : ""}
          `}
        >
          {renderFlag(selectedCountry.code)}
          <span className="text-[#2e1b12] text-sm">
            +{selectedCountry.callingCode}
          </span>
          <svg
            className={`w-3 h-3 text-[#643c15] transition-transform shrink-0 ${
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
          <div className="absolute z-50 w-64 mt-1 bg-white border border-[#cab797]/40 rounded-lg shadow-lg overflow-hidden">
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
                      onClick={() => handleCountrySelect(country)}
                      className={`
                        w-full px-3 py-2 flex items-center gap-3 text-left text-sm
                        hover:bg-[#cab797]/10 transition-colors
                        ${selectedCountry.code === country.code ? "bg-[#cab797]/20" : ""}
                      `}
                    >
                      {renderFlag(country.code)}
                      <span className="text-[#2e1b12] flex-1">{country.name}</span>
                      <span className="text-[#717182]">+{country.callingCode}</span>
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

      {/* Phone number input */}
      <input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        className={`
          flex-1 px-3 py-2 border rounded-lg bg-white text-[#2e1b12]
          placeholder:text-[#717182] focus:outline-none focus:ring-2 focus:ring-[#cab797]/50
          transition-colors text-sm
          ${hasError ? "border-[#fb2c36]" : "border-[#cab797]/40"}
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}
        `}
        autoComplete="tel"
      />
    </div>
  );
}
