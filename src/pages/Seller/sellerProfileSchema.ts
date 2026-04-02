import { z } from "zod";

export const sellerProfileFormSchema = z.object({
  displayName: z.string().min(2, "Name is required").max(120),
  company: z.string().max(200).optional(),
  phone: z.string().max(20).optional(),
  city: z.string().max(80).optional(),
  gstin: z.string().max(20).optional(),
  bio: z.string().max(2000).optional(),
  /** Data URL or HTTPS URL from seller upload (persisted locally until API exists). */
  profilePhotoUrl: z.string().max(3_000_000).nullable().optional(),
});

export type SellerProfileFormValues = z.infer<typeof sellerProfileFormSchema>;

export const sellerSettingsFormSchema = z.object({
  emailDigest: z.boolean(),
  leadAlerts: z.boolean(),
  listingAlerts: z.boolean(),
  marketingTips: z.boolean(),
});

export type SellerSettingsFormValues = z.infer<typeof sellerSettingsFormSchema>;
