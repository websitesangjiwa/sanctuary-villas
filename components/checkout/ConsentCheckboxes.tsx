"use client";

import { useState, useImperativeHandle, forwardRef } from "react";
import { ConsentFormData, validateConsent } from "@/lib/validators/checkout";

export interface ConsentCheckboxesRef {
  validate: () => ConsentFormData | null;
  getData: () => ConsentFormData;
}

interface ConsentCheckboxesProps {
  disabled?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

const ConsentCheckboxes = forwardRef<ConsentCheckboxesRef, ConsentCheckboxesProps>(
  function ConsentCheckboxes({ disabled = false, onValidationChange }, ref) {
    const [formData, setFormData] = useState({
      privacyAccepted: false,
      termsAccepted: false,
      marketingAccepted: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const handleChange = (field: keyof typeof formData, checked: boolean) => {
      setFormData((prev) => {
        const newData = { ...prev, [field]: checked };
        // Check if required consents are given
        const isValid = newData.privacyAccepted && newData.termsAccepted;
        onValidationChange?.(isValid);
        return newData;
      });

      // Clear error when checked
      if (checked && errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    };

    // Handle combined Terms and Privacy checkbox
    const handleTermsPrivacyChange = (checked: boolean) => {
      setFormData((prev) => ({
        ...prev,
        privacyAccepted: checked,
        termsAccepted: checked,
      }));

      // Clear errors when checked
      if (checked) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.privacyAccepted;
          delete newErrors.termsAccepted;
          return newErrors;
        });
      }

      onValidationChange?.(checked);
    };

    useImperativeHandle(ref, () => ({
      validate: () => {
        // Both privacyAccepted and termsAccepted must be true
        const dataToValidate = {
          privacyAccepted: formData.privacyAccepted ? true : false,
          termsAccepted: formData.termsAccepted ? true : false,
          marketingAccepted: formData.marketingAccepted,
        };

        const result = validateConsent(dataToValidate);
        if (result.success && result.data) {
          setErrors({});
          return result.data;
        }

        setErrors(result.errors || {});
        setTouched({
          privacyAccepted: true,
          termsAccepted: true,
        });
        return null;
      },
      getData: () => ({
        privacyAccepted: formData.privacyAccepted as true,
        termsAccepted: formData.termsAccepted as true,
        marketingAccepted: formData.marketingAccepted,
      }),
    }));

    const checkboxClasses = `
      w-4 h-4 rounded border-[#cab797] text-[#8b6630]
      focus:ring-[#cab797]/50 focus:ring-2 cursor-pointer
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    `;

    return (
      <div className="space-y-3 border-t border-[#cab797]/30 pt-4">
        {/* Terms and Privacy - Combined checkbox (required) */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="termsPrivacy"
            checked={formData.privacyAccepted && formData.termsAccepted}
            onChange={(e) => handleTermsPrivacyChange(e.target.checked)}
            disabled={disabled}
            className={checkboxClasses}
          />
          <label
            htmlFor="termsPrivacy"
            className="text-sm font-medium text-[#643c15] cursor-pointer select-none"
          >
            I have read and accept the{" "}
            <a
              href="/privacy"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="text-[#8b6630] hover:underline"
            >
              Privacy Policy
            </a>{" "}
            |{" "}
            <a
              href="/terms"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="text-[#8b6630] hover:underline"
            >
              Sanctuary Villas Terms and Conditions
            </a>
          </label>
        </div>
        {(errors.privacyAccepted || errors.termsAccepted) && (touched.privacyAccepted || touched.termsAccepted) && (
          <p className="text-[#fb2c36] text-sm ml-7">
            {errors.privacyAccepted || errors.termsAccepted}
          </p>
        )}

        {/* Marketing opt-in (optional) */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="marketing"
            checked={formData.marketingAccepted}
            onChange={(e) => handleChange("marketingAccepted", e.target.checked)}
            disabled={disabled}
            className={checkboxClasses}
          />
          <label
            htmlFor="marketing"
            className="text-sm font-medium text-[#643c15] cursor-pointer select-none"
          >
            I am interested in receiving discounts, promotions and news about Sanctuary Villas
          </label>
        </div>
      </div>
    );
  }
);

export default ConsentCheckboxes;
