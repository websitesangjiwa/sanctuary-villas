import { z } from "zod";

// Guest info schema (required fields)
export const guestInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long")
    .regex(/^[a-zA-Z\s'-]+$/, "First name contains invalid characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long")
    .regex(/^[a-zA-Z\s'-]+$/, "Last name contains invalid characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number is too long")
    .regex(/^[+\d\s()-]+$/, "Invalid phone number format"),
  specialRequest: z
    .string()
    .max(500, "Special request is too long")
    .optional(),
});

// Billing address schema (optional fields)
export const billingAddressSchema = z.object({
  street: z.string().max(100, "Street is too long").optional().or(z.literal("")),
  city: z.string().max(50, "City is too long").optional().or(z.literal("")),
  state: z.string().max(50, "State is too long").optional().or(z.literal("")),
  zipCode: z.string().max(20, "Zip code is too long").optional().or(z.literal("")),
  country: z.string().max(50, "Country is too long").optional().or(z.literal("")),
  countryCode: z.string().length(2, "Invalid country code").optional().or(z.literal("")),
});

// Consent schema (required fields for Guesty API)
export const consentSchema = z.object({
  privacyAccepted: z.literal(true, {
    message: "You must accept the Privacy Policy",
  }),
  termsAccepted: z.literal(true, {
    message: "You must accept the Terms and Conditions",
  }),
  marketingAccepted: z.boolean().optional().default(false),
});

// Complete checkout form schema
export const checkoutSchema = z.object({
  guest: guestInfoSchema,
  billing: billingAddressSchema,
  consent: consentSchema,
});

export type GuestInfoFormData = z.infer<typeof guestInfoSchema>;
export type BillingAddressFormData = z.infer<typeof billingAddressSchema>;
export type ConsentFormData = z.infer<typeof consentSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Helper function to validate guest info
export function validateGuestInfo(data: unknown): {
  success: boolean;
  data?: GuestInfoFormData;
  errors?: Record<string, string>;
} {
  const result = guestInfoSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join(".");
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }

  return { success: false, errors };
}

// Helper function to validate billing address
export function validateBillingAddress(data: unknown): {
  success: boolean;
  data?: BillingAddressFormData;
  errors?: Record<string, string>;
} {
  const result = billingAddressSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join(".");
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }

  return { success: false, errors };
}

// Helper function to validate consent
export function validateConsent(data: unknown): {
  success: boolean;
  data?: ConsentFormData;
  errors?: Record<string, string>;
} {
  const result = consentSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join(".");
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }

  return { success: false, errors };
}
