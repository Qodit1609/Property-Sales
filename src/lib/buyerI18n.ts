import i18n from "../i18n";
import { normalizeLanguage } from "../i18n";
import {
  translateApiValue,
  translateCategory,
  translateListingType,
  translateOwnershipType,
  translatePropertyType,
  translateSoilType,
  translateStatus,
  translateSuitableFor,
} from "./i18nHelpers";

const normalizeToken = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();

const BUYER_NAV_BY_ROUTE: Record<string, string> = {
  "/buyer/dashboard": "buyerPanel.nav.overview",
  "/buyer/overview": "buyerPanel.nav.overview",
  "/buyer/wishlist": "buyerPanel.nav.wishlist",
  "/buyer/compare": "buyerPanel.nav.compare",
  "/buyer/cart": "buyerPanel.nav.cart",
  "/buyer/enquiries": "buyerPanel.nav.enquiries",
  "/buyer/activity": "buyerPanel.nav.activity",
  "/buyer/notifications": "buyerPanel.nav.notifications",
  "/buyer/account": "buyerPanel.nav.account",
  "/buyer/testimonial": "buyerPanel.nav.testimonial",
};

const BUYER_NAV_BY_LABEL: Record<string, string> = {
  overview: "buyerPanel.nav.overview",
  dashboard: "buyerPanel.nav.overview",
  wishlist: "buyerPanel.nav.wishlist",
  compare: "buyerPanel.nav.compare",
  cart: "buyerPanel.nav.cart",
  enquiries: "buyerPanel.nav.enquiries",
  inquiry: "buyerPanel.nav.enquiries",
  inquiries: "buyerPanel.nav.enquiries",
  activity: "buyerPanel.nav.activity",
  notifications: "buyerPanel.nav.notifications",
  account: "buyerPanel.nav.account",
  profile: "buyerPanel.nav.account",
  testimonial: "buyerPanel.nav.testimonial",
  testimonials: "buyerPanel.nav.testimonial",
};

const NOTIFICATION_MESSAGE_PATTERNS: Array<{
  re: RegExp;
  key: string;
  groups?: ("target" | "buyer" | "property")[];
}> = [
  {
    re: /^(.+) added (.+) to cart\.$/i,
    key: "buyerPanel.notifications.messages.addedToCart",
    groups: ["buyer", "property"],
  },
  {
    re: /^(.+) ने (.+) कार्ट में जोड़ी।$/i,
    key: "buyerPanel.notifications.messages.addedToCart",
    groups: ["buyer", "property"],
  },
  {
    re: /^price drop on (.+)$/i,
    key: "buyerPanel.notifications.messages.priceDrop",
    groups: ["target"],
  },
  {
    re: /^new listing match: (.+)$/i,
    key: "buyerPanel.notifications.messages.newListingMatch",
    groups: ["target"],
  },
  {
    re: /^seller replied to your enquiry on (.+)$/i,
    key: "buyerPanel.notifications.messages.sellerReply",
    groups: ["target"],
  },
];

const COMPARE_ROW_TRANSLATORS: Partial<Record<string, (value: string) => string>> = {
  "core-propertyType": translatePropertyType,
  "core-listingType": translateListingType,
  "core-status": translateStatus,
  "farm-soilType": translateSoilType,
  "legal-landUseType": (v) => translateApiValue("buyerPanel.compare.values.landUseType", v, v),
  "core-facing": (v) => translateApiValue("buyerPanel.compare.values.facing", v, v),
};

const PROPERTY_FALLBACK_TOKENS = new Set(
  ["property", "untitled property", "your property"].map(normalizeToken)
);

export const translateBuyerNavLabel = (label: string, route?: string): string => {
  const trimmedRoute = route?.trim().toLowerCase();
  if (trimmedRoute) {
    const routeKey = BUYER_NAV_BY_ROUTE[trimmedRoute];
    if (routeKey && i18n.exists(routeKey)) return i18n.t(routeKey);
  }

  const normalized = normalizeToken(label);
  const labelKey = BUYER_NAV_BY_LABEL[normalized];
  if (labelKey && i18n.exists(labelKey)) return i18n.t(labelKey);

  return translateApiValue("buyerPanel.nav", label, label);
};

export const translateBuyerSectionTitle = (title: string): string =>
  translateApiValue("buyerPanel.sidebarSections", title, title);

export const translateBuyerNotificationTitle = (title: string): string =>
  translateApiValue("buyerPanel.notifications.titles", title, title);

export const translateBuyerNotificationMessage = (message: string): string => {
  const trimmed = message.trim();
  if (!trimmed) return message;

  for (const { re, key, groups } of NOTIFICATION_MESSAGE_PATTERNS) {
    const match = trimmed.match(re);
    if (!match || !i18n.exists(key)) continue;
    if (groups?.includes("buyer") && groups?.includes("property")) {
      return i18n.t(key, { buyer: match[1]?.trim() || "", property: match[2]?.trim() || "" });
    }
    if (groups?.includes("target")) {
      return i18n.t(key, { target: match[1]?.trim() || "" });
    }
    return i18n.t(key);
  }

  return translateApiValue("buyerPanel.notifications.messages", trimmed, trimmed);
};

export const translateBuyerActivityType = (type: string): string => {
  const key = `buyerPanel.activity.types.${type}`;
  if (i18n.exists(key)) return i18n.t(key);
  return translateApiValue("buyerPanel.activity.types", type, type);
};

export const translateBuyerActivityTitle = (title?: string | null): string => {
  const trimmed = title?.trim();
  if (!trimmed || PROPERTY_FALLBACK_TOKENS.has(normalizeToken(trimmed))) {
    return i18n.t("buyerPanel.fallbacks.property");
  }
  return trimmed;
};

export const translateBuyerCompareSection = (sectionId: string, fallback: string): string => {
  const key = `buyerPanel.compare.sections.${sectionId}`;
  if (i18n.exists(key)) return i18n.t(key);
  return fallback;
};

export const translateBuyerCompareRowLabel = (rowKey: string, fallback: string): string => {
  const key = `buyerPanel.compare.fields.${rowKey}`;
  if (i18n.exists(key)) return i18n.t(key);
  return fallback;
};

export const translateBuyerCompareValue = (rowKey: string, raw: string): string => {
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "\u2014") return trimmed || "\u2014";

  if (trimmed === "Yes") return i18n.t("common.yes");
  if (trimmed === "No") return i18n.t("common.no");

  const rowTranslator = COMPARE_ROW_TRANSLATORS[rowKey];
  if (rowTranslator) {
    const translated = rowTranslator(trimmed);
    if (translated && translated !== trimmed) return translated;
  }

  if (rowKey === "core-price" || rowKey === "core-pricePerSqft") {
    const numeric = Number(trimmed.replace(/[^\d.-]/g, ""));
    if (Number.isFinite(numeric) && numeric > 0) {
      return formatBuyerCurrency(numeric);
    }
  }

  const category = translateCategory(trimmed);
  if (category !== trimmed) return category;

  const ownership = translateOwnershipType(trimmed);
  if (ownership !== trimmed) return ownership;

  const suitable = translateSuitableFor(trimmed);
  if (suitable !== trimmed) return suitable;

  const amenity = translateApiValue("buyerPanel.compare.values.amenities", trimmed, trimmed);
  if (amenity !== trimmed) return amenity;

  const infra = translateApiValue("buyerPanel.compare.values.infrastructure", trimmed, trimmed);
  if (infra !== trimmed) return infra;

  return trimmed;
};

export const formatBuyerDateTime = (value?: string | null, language?: string): string => {
  if (!value) return "\u2014";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "\u2014";
  const locale = normalizeLanguage(language ?? i18n.language) === "hi" ? "hi-IN" : "en-IN";
  return date.toLocaleString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const formatBuyerCurrency = (price: number, language?: string): string => {
  if (!Number.isFinite(price)) return "";
  const locale = normalizeLanguage(language ?? i18n.language) === "hi" ? "hi-IN" : "en-IN";
  return `\u20B9 ${price.toLocaleString(locale)}`;
};

export const formatBuyerNumber = (value: number, language?: string): string => {
  const locale = normalizeLanguage(language ?? i18n.language) === "hi" ? "hi-IN" : "en-IN";
  return value.toLocaleString(locale);
};
