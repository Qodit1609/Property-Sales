import i18n from "../i18n";
import { normalizeLanguage } from "../i18n";

export type LocalizedValue = string | number | null | undefined | Record<string, unknown>;

const normalizeToken = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();

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

/** Generic API value → t(key, fallback) with normalized key lookup. */
export const translateApiValue = (
  namespace: string,
  value?: string | null,
  fallback?: string,
): string => {
  if (!value?.trim()) return fallback ?? "";
  const trimmed = value.trim();
  const directKey = `${namespace}.${trimmed}`;
  if (i18n.exists(directKey)) {
    return i18n.t(directKey);
  }

  const normalized = normalizeToken(trimmed);
  const enOptions =
    (i18n.getResource("en", "translation", namespace) as Record<string, unknown> | undefined) ??
    {};
  const hiOptions =
    (i18n.getResource("hi", "translation", namespace) as Record<string, unknown> | undefined) ??
    {};

  const candidate = Object.keys(enOptions).find((item) => {
    const enValue = typeof enOptions[item] === "string" ? enOptions[item] : item;
    const hiValue = typeof hiOptions[item] === "string" ? hiOptions[item] : undefined;
    return (
      normalizeToken(item) === normalized ||
      normalizeToken(String(enValue)) === normalized ||
      (hiValue ? normalizeToken(String(hiValue)) === normalized : false)
    );
  });

  if (candidate) {
    return i18n.t(`${namespace}.${candidate}`);
  }

  return fallback ?? trimmed;
};

export const translatePostPropertyOption = (
  group: "propertyType" | "category" | "ownership" | "soil" | "suitableFor",
  value?: string,
): string => translateApiValue(`postProperty.options.${group}`, value, value);

export const translatePropertyType = (value?: string): string =>
  translatePostPropertyOption("propertyType", value);

export const translateCategory = (value?: string): string =>
  translatePostPropertyOption("category", value);

export const translateOwnershipType = (value?: string): string =>
  translatePostPropertyOption("ownership", value);

export const translateSoilType = (value?: string): string =>
  translatePostPropertyOption("soil", value);

export const translateSuitableFor = (value?: string): string =>
  translatePostPropertyOption("suitableFor", value);

export const translateListingType = (value?: string): string => {
  if (!value?.trim()) return value ?? "";
  const normalized = normalizeToken(value);
  if (
    normalized.includes("rent") ||
    normalized.includes("lease") ||
    normalized.includes("किराया") ||
    normalized.includes("लीज")
  ) {
    return i18n.t("postProperty.basic.rentLease");
  }
  if (
    normalized.includes("sell") ||
    normalized.includes("sale") ||
    normalized.includes("बेच") ||
    normalized.includes("बिक्री")
  ) {
    return i18n.t("postProperty.basic.sell");
  }
  return translateApiValue("listingType", value, value);
};

export const translateStatus = (status?: string | null): string =>
  translateApiValue("status", status, status ?? "");

export const translateRole = (role?: string | null): string =>
  translateApiValue("roles", role, role ?? "");

export const translateActivityType = (code?: string | null): string =>
  translateApiValue("adminPanel.activityLogsPage.activityTypes", code, code ?? "");

export const translateActivityStatus = (status?: string | null): string =>
  translateApiValue("adminPanel.activityLogsPage.statuses", status, status ?? "");

const cityKeyFromName = (city: string): string =>
  city
    .trim()
    .toLowerCase()
    .replace(/\s+city$/i, "")
    .replace(/\s+/g, "")
    .replace(/[^a-z]/g, "");

/** City name from API / mega menu → localized label (homePage.cities). */
export const translateCity = (city?: string | null): string => {
  if (!city?.trim()) return city ?? "";
  const trimmed = city.trim();
  const key = cityKeyFromName(trimmed);
  const directKey = `homePage.cities.${key}`;
  if (key && i18n.exists(directKey)) {
    return i18n.t(directKey);
  }
  const fromNamespace = translateApiValue("homePage.cities", trimmed, trimmed);
  if (fromNamespace !== trimmed) return fromNamespace;
  return trimmed;
};

export const translateHeaderLabel = (value?: string | null): string => {
  if (!value?.trim()) return value ?? "";
  const trimmed = value.trim();
  const directKey = `header.${trimmed}`;
  if (i18n.exists(directKey)) {
    return i18n.t(directKey);
  }

  const headerLabels: Record<string, string> = {
    home: "header.home",
    "farmhouse / farmland": "header.farmhouseFarmland",
    "agriculture land": "header.agricultureLand",
    "resort properties": "header.resortProperties",
    "rent farmhouse": "header.rentFarmhouse",
    "owner offerings": "header.ownerOfferings",
    "articles & news": "header.articlesNews",
    locations: "header.locations",
    "popular locations": "header.popularLocations",
    "property type": "header.propertyType",
    budget: "header.budget",
    explore: "header.explore",
    "land types": "header.landTypes",
    investment: "header.investment",
    guides: "header.guides",
    "resort type": "header.resortType",
    insights: "header.insights",
    occasion: "header.occasion",
    tags: "header.tags",
    featured: "header.featured",
    trending: "header.trending",
    "post property": "header.postProperty",
    free: "header.freeTag",
  };

  const mapped = headerLabels[normalizeToken(trimmed)];
  if (mapped) return i18n.t(mapped);

  const propertyType = translatePropertyType(trimmed);
  if (propertyType !== trimmed) return propertyType;

  const city = translateCity(trimmed);
  if (city !== trimmed) return city;

  const budget = translateBudgetLabel(trimmed);
  if (budget !== trimmed) return budget;

  return translateApiValue("header", trimmed, trimmed);
};

export const translateBudgetLabel = (label?: string | null): string => {
  if (!label?.trim()) return label ?? "";
  const trimmed = label.trim();
  const match = /^under\s+([\d.]+)\s*(cr|l|k)$/i.exec(trimmed);
  if (!match) return trimmed;

  const amount = match[1];
  const unit = match[2].toLowerCase();
  const unitKey =
    unit === "cr" ? "header.budgetUnderCr" : unit === "l" ? "header.budgetUnderL" : "header.budgetUnderK";
  if (i18n.exists(unitKey)) {
    return i18n.t(unitKey, { amount });
  }
  return trimmed;
};

/** @deprecated Use translateStatus — kept for callers passing language explicitly. */
export const translateStatusWithLanguage = (
  status: string | null | undefined,
  _language: string,
): string => translateStatus(status);
