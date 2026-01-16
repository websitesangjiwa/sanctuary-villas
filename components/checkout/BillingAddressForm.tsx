"use client";

import { useState, useImperativeHandle, forwardRef } from "react";
import { BillingAddressFormData } from "@/lib/validators/checkout";
import CountrySelect from "@/components/ui/CountrySelect";

export interface BillingAddressFormRef {
  getData: () => BillingAddressFormData;
}

interface BillingAddressFormProps {
  disabled?: boolean;
  initialData?: Partial<BillingAddressFormData>;
}

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
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleCountryChange = (country: { name: string; code: string }) => {
      setFormData((prev) => ({
        ...prev,
        country: country.name,
        countryCode: country.code,
      }));
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
            <CountrySelect
              value={formData.country || ""}
              onChange={handleCountryChange}
              disabled={disabled}
              placeholder="Select a country"
            />
          </div>
        </div>
      </div>
    );
  }
);

export default BillingAddressForm;
