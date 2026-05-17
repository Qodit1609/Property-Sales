import type { TFunction } from "i18next";

const normalizeUnitToken = (unit?: string) =>
  (unit || "sqft").trim().replace(/\s+/g, " ").toLowerCase();

/** Localized area line for PropertyCard only (safe fallback to raw unit). */
export const formatPropertyCardArea = (
  t: TFunction,
  area?: number | string,
  areaUnit?: string,
): string => {
  const safeArea =
    typeof area === "string" ? Number(area.replace(/[^0-9.]/g, "")) : area;

  if (!Number.isFinite(safeArea) || !safeArea || safeArea <= 0) {
    return t("propertyCard.areaNotSpecified");
  }

  const normalized = normalizeUnitToken(areaUnit);
  let unitKey = "sqft";
  if (
    normalized === "acre" ||
    normalized === "acres" ||
    normalized === "ac" ||
    normalized === "एकड़"
  ) {
    unitKey = normalized === "ac" ? "ac" : "acre";
  } else if (normalized === "bigha" || normalized === "बीघा") {
    unitKey = "bigha";
  }

  const unitLabel = t(`propertyCard.units.${unitKey}`, {
    defaultValue: unitKey === "ac" ? t("propertyCard.sizeUnitAc") : areaUnit || unitKey,
  });

  return `${safeArea.toLocaleString("en-IN")} ${unitLabel}`;
};

/** SVG placeholder with localized "image not available" text. */
export const buildPropertyCardFallbackImage = (label: string): string => {
  const escaped = label
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800' fill='none'><rect width='1200' height='800' fill='%23e5e7eb'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='34' fill='%236b7280'>${escaped}</text></svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};
