import { normalizeLanguage } from "../i18n";

export type LocalizedValue = string | number | null | undefined | Record<string, unknown>;

export const translateDynamic = (value: LocalizedValue, language: string): string => {
  if (value === null || value === undefined) return "";

  const normalizedLanguage = normalizeLanguage(language);

  if (typeof value === "object" && !Array.isArray(value)) {
    const localizedRecord = value as Record<string, unknown>;
    const translatedValue = localizedRecord[normalizedLanguage] ?? localizedRecord.en;
    return translatedValue === null || translatedValue === undefined
      ? ""
      : String(translatedValue);
  }

  return String(value);
};

export const formatINRCurrency = (price: number, language: string): string =>
  new Intl.NumberFormat(normalizeLanguage(language) === "hi" ? "hi-IN" : "en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);

const statusMap: Record<string, { en: string; hi: string }> = {
  available: { en: "Available", hi: "उपलब्ध" },
  sold: { en: "Sold", hi: "बिक गया" },
  approved: { en: "Approved", hi: "स्वीकृत" },
  rejected: { en: "Rejected", hi: "अस्वीकृत" },
  pending: { en: "Pending", hi: "लंबित" },
};

export const translateStatus = (status: string | null | undefined, language: string): string => {
  const normalizedLanguage = normalizeLanguage(language);
  if (!status) return statusMap.pending[normalizedLanguage];

  const normalizedStatus = status.toLowerCase();
  const mappedStatus = statusMap[normalizedStatus];

  if (mappedStatus) {
    return mappedStatus[normalizedLanguage];
  }

  return status;
};
