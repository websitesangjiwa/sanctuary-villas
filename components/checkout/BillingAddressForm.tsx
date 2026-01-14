"use client";

import { useState, useImperativeHandle, forwardRef } from "react";
import { getCountries } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en";
import { BillingAddressFormData } from "@/lib/validators/checkout";

export interface BillingAddressFormRef {
  getData: () => BillingAddressFormData;
}

interface BillingAddressFormProps {
  disabled?: boolean;
  initialData?: Partial<BillingAddressFormData>;
}

// Get all countries from react-phone-number-input and sort alphabetically
const COUNTRIES = getCountries()
  .map((code) => ({
    code,
    name: en[code] || code,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const BillingAddressForm = forwardRef<BillingAddressFormRef, BillingAddressFormProps>(
  function BillingAddressForm({ disabled = false, initialData }, ref) {
    const [formData, setFormData] = useState<BillingAddressFormData>({
      street: initialData?.street || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      zipCode: initialData?.zipCode || "",
      country: initialData?.country || "",
      countryCode: initialData?.countryCode || "",
    });

    const handleChange = (field: keyof BillingAddressFormData, value: string) => {
      if (field === "country") {
        // When country changes, also update country code
        const selectedCountry = COUNTRIES.find((c) => c.name === value);
        setFormData((prev) => ({
          ...prev,
          country: value,
          countryCode: selectedCountry?.code || "",
        }));
      } else {
        setFormData((prev) => ({ ...prev, [field]: value }));
      }
    };

    useImperativeHandle(ref, () => ({
      getData: () => formData,
    }));

    const inputClasses = `
      w-full px-3 py-2 border rounded-lg bg-white text-[#2e1b12]
      placeholder:text-[#717182] focus:outline-none focus:ring-2 focus:ring-[#cab797]/50
      transition-colors text-sm border-[#cab797]/40
      ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}
    `;

    return (
      <div className="space-y-4">
        <h3 className="text-base font-normal text-[#2e1b12]">
          Billing address
        </h3>

        {/* Street */}
        <div>
          <label
            htmlFor="street"
            className="block text-sm font-medium text-[#643c15] mb-1"
          >
            Street
          </label>
          <input
            type="text"
            id="street"
            value={formData.street}
            onChange={(e) => handleChange("street", e.target.value)}
            disabled={disabled}
            placeholder="Street name and number"
            className={inputClasses}
            autoComplete="street-address"
          />
        </div>

        {/* City + State */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-[#643c15] mb-1"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              disabled={disabled}
              placeholder="City"
              className={inputClasses}
              autoComplete="address-level2"
            />
          </div>

          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-[#643c15] mb-1"
            >
              State
            </label>
            <input
              type="text"
              id="state"
              value={formData.state}
              onChange={(e) => handleChange("state", e.target.value)}
              disabled={disabled}
              placeholder="State"
              className={inputClasses}
              autoComplete="address-level1"
            />
          </div>
        </div>

        {/* Zip + Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="zipCode"
              className="block text-sm font-medium text-[#643c15] mb-1"
            >
              Zip code
            </label>
            <input
              type="text"
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => handleChange("zipCode", e.target.value)}
              disabled={disabled}
              placeholder="Zip code"
              className={inputClasses}
              autoComplete="postal-code"
            />
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-[#643c15] mb-1"
            >
              Country
            </label>
            <select
              id="country"
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
              disabled={disabled}
              className={`
                ${inputClasses}
                appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23643c15%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]
                bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.25rem_1.25rem] pr-10
              `}
              autoComplete="country-name"
            >
              <option value="">Select an option</option>
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }
);

export default BillingAddressForm;
