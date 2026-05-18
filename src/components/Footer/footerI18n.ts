import i18n from "../../i18n";
import {
  translateApiValue,
  translateCategory,
  translateHeaderLabel,
  translatePropertyType,
} from "../../lib/i18nHelpers";

const normalizeToken = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();

/** API label variants → canonical footer.links keys. */
const FOOTER_LINK_ALIASES: Record<string, string> = {
  blogs: "Blogs",
  blog: "Blog",
  "buy land": "Buy Land",
  "farm land": "Farm Land",
  "agricultural land": "Agricultural Land",
  "agriculture land": "Agricultural Land",
  "investment land": "Investment Land",
  "rent properties": "Rent Properties",
  "rent property": "Rent Property",
};

const resolveFooterLinkKey = (label: string): string =>
  FOOTER_LINK_ALIASES[normalizeToken(label)] ?? label;

/** Footer navigation / link label from API → translated string with safe fallback. */
export const translateFooterLink = (label?: string | null): string => {
  if (!label?.trim()) return label ?? "";

  const trimmed = resolveFooterLinkKey(label.trim());
  const fromHeader = translateHeaderLabel(trimmed);
  if (fromHeader !== trimmed) return fromHeader;

  const fromCategory = translateCategory(trimmed);
  if (fromCategory !== trimmed) return fromCategory;

  const fromPropertyType = translatePropertyType(trimmed);
  if (fromPropertyType !== trimmed) return fromPropertyType;

  return translateApiValue("footer.links", trimmed, trimmed);
};

/** Trust badge text from API. */
export const translateFooterBadge = (text?: string | null): string =>
  translateApiValue("footer.badges", text, text ?? "");

/** Social platform label for aria-label. */
export const translateFooterSocial = (label?: string | null): string =>
  translateApiValue("footer.social", label, label ?? "");

/** Brand name — proper nouns and known variants map to header.brand. */
export const translateFooterBrandName = (name?: string | null): string => {
  if (!name?.trim()) return name ?? "";
  const trimmed = name.trim();
  const token = normalizeToken(trimmed);
  if (token === "bhoomiwala" || token === "bhoomi wala" || token === "bhoomi wala.com") {
    return i18n.t("header.brand");
  }
  return translateApiValue("footer.brand.names", trimmed, trimmed);
};

const FOOTER_DESCRIPTION_ALIASES: Record<string, string> = {
  "your trusted partner in finding the perfect land investment. explore verified farm lands, farmhouses, and agricultural properties across india.":
    "Your trusted partner in finding the perfect land investment. Explore verified farm lands, farmhouses, and agricultural properties across India.",
};

/** Brand tagline / description from API. */
export const translateFooterBrandDescription = (description?: string | null): string => {
  if (!description?.trim()) return description ?? "";
  const trimmed = description.trim();
  const canonical =
    FOOTER_DESCRIPTION_ALIASES[normalizeToken(trimmed)] ?? trimmed;
  return translateApiValue("footer.brand.descriptions", canonical, trimmed);
};

/** Office address from API (known addresses only; others pass through). */
export const translateFooterAddress = (address?: string | null): string =>
  translateApiValue("footer.addresses", address, address ?? "");
