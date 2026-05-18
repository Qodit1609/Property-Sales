import { z } from "zod";
import i18n from "../../i18n";

export function getSellerProfileFormSchema() {
  return z.object({
    displayName: z
      .string()
      .min(2, i18n.t("sellerPanel.profile.validation.nameRequired"))
      .max(120),
    company: z.string().max(200).optional(),
    phone: z
      .string()
      .trim()
      .min(1, i18n.t("sellerPanel.profile.validation.phoneRequired"))
      .max(20),
    pan: z.string().trim().min(1, i18n.t("sellerPanel.profile.validation.panRequired")).max(20),
    aadhaar: z
      .string()
      .trim()
      .min(1, i18n.t("sellerPanel.profile.validation.aadhaarRequired"))
      .max(20),
  city: z.string().max(80).optional(),
  gstin: z.string().max(20).optional(),
  bio: z.string().max(2000).optional(),
  /** Data URL or HTTPS URL from seller upload (persisted locally until API exists). */
    profilePhotoUrl: z.string().max(3_000_000).nullable().optional(),
  });
}

/** @deprecated Use getSellerProfileFormSchema — kept for type inference */
export const sellerProfileFormSchema = getSellerProfileFormSchema();

export type SellerProfileFormValues = z.infer<ReturnType<typeof getSellerProfileFormSchema>>;

export const sellerSettingsFormSchema = z.object({
  leadAlerts: z.boolean(),
  listingAlerts: z.boolean(),
});

export type SellerSettingsFormValues = z.infer<typeof sellerSettingsFormSchema>;
