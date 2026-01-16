"use client";

import { useState, useImperativeHandle, forwardRef } from "react";
import PhoneInputCustom from "@/components/ui/PhoneInputCustom";
import { GuestInfoFormData, validateGuestInfo } from "@/lib/validators/checkout";

export interface GuestInfoFormRef {
  validate: () => GuestInfoFormData | null;
  getData: () => GuestInfoFormData;
}

interface GuestInfoFormProps {
  disabled?: boolean;
  initialData?: Partial<GuestInfoFormData>;
  onValidationChange?: (isValid: boolean) => void;
}

const GuestInfoForm = forwardRef<GuestInfoFormRef, GuestInfoFormProps>(
  function GuestInfoForm(
    { disabled = false, initialData, onValidationChange },
    ref
  ) {
    const [formData, setFormData] = useState<GuestInfoFormData>({
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      specialRequest: initialData?.specialRequest || "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const handleChange = (field: keyof GuestInfoFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }

      // Validate on change for touched fields
      if (touched[field]) {
        const result = validateGuestInfo({ ...formData, [field]: value });
        if (!result.success && result.errors?.[field]) {
          setErrors((prev) => ({ ...prev, [field]: result.errors![field] }));
        }
      }

      // Check if required form fields are complete
      const updatedData = { ...formData, [field]: value };
      const requiredFields = ["firstName", "lastName", "email", "phone"] as const;
      const isComplete = requiredFields.every((f) => updatedData[f] && updatedData[f].length > 0);
      onValidationChange?.(isComplete);
    };

    const handleBlur = (field: keyof GuestInfoFormData) => {
      setTouched((prev) => ({ ...prev, [field]: true }));

      // Validate on blur
      const result = validateGuestInfo(formData);
      if (!result.success && result.errors?.[field]) {
        setErrors((prev) => ({ ...prev, [field]: result.errors![field] }));
      }
    };

    useImperativeHandle(ref, () => ({
      validate: () => {
        const result = validateGuestInfo(formData);
        if (result.success && result.data) {
          setErrors({});
          return result.data;
        }
        setErrors(result.errors || {});
        // Mark required fields as touched
        setTouched({
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        });
        return null;
      },
      getData: () => formData,
    }));

    const inputClasses = (field: keyof GuestInfoFormData) => `
      w-full px-3 py-2 border rounded-lg bg-white text-[#2e1b12]
      placeholder:text-[#717182] focus:outline-none focus:ring-2 focus:ring-[#cab797]/50
      transition-colors text-sm
      ${errors[field] ? "border-[#fb2c36]" : "border-[#cab797]/40"}
      ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}
    `;

    return (
      <div className="space-y-4">
        <h3 className="text-base font-normal text-[#2e1b12]">
          Guest information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-[#643c15] mb-1"
            >
              First name
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              onBlur={() => handleBlur("firstName")}
              disabled={disabled}
              placeholder="Guest first name *"
              className={inputClasses("firstName")}
              autoComplete="given-name"
            />
            {errors.firstName && touched.firstName && (
              <p className="text-[#fb2c36] text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-[#643c15] mb-1"
            >
              Last name
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              onBlur={() => handleBlur("lastName")}
              disabled={disabled}
              placeholder="Guest last name *"
              className={inputClasses("lastName")}
              autoComplete="family-name"
            />
            {errors.lastName && touched.lastName && (
              <p className="text-[#fb2c36] text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#643c15] mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              disabled={disabled}
              placeholder="Email address *"
              className={inputClasses("email")}
              autoComplete="email"
            />
            {errors.email && touched.email && (
              <p className="text-[#fb2c36] text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone with country code */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-[#643c15] mb-1"
            >
              Phone number
            </label>
            <PhoneInputCustom
              value={formData.phone}
              onChange={(value) => handleChange("phone", value)}
              onBlur={() => handleBlur("phone")}
              disabled={disabled}
              placeholder="Enter phone number *"
              defaultCountry="ID"
              hasError={!!errors.phone && touched.phone}
            />
            {errors.phone && touched.phone && (
              <p className="text-[#fb2c36] text-sm mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Special Request */}
        <div>
          <label
            htmlFor="specialRequest"
            className="block text-sm font-medium text-[#643c15] mb-1"
          >
            Add a special request
          </label>
          <textarea
            id="specialRequest"
            value={formData.specialRequest || ""}
            onChange={(e) => handleChange("specialRequest", e.target.value)}
            disabled={disabled}
            placeholder="Add a special request"
            rows={3}
            className={`
              w-full px-3 py-2 border rounded-lg bg-white text-[#2e1b12]
              placeholder:text-[#717182] focus:outline-none focus:ring-2 focus:ring-[#cab797]/50
              transition-colors text-sm border-[#cab797]/40 resize-none
              ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}
            `}
          />
        </div>
      </div>
    );
  }
);

export default GuestInfoForm;
