export const FALLBACK_PROPERTY_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800' fill='none'%3E%3Crect width='1200' height='800' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='34' fill='%236b7280'%3EImage Not Available%3C/text%3E%3C/svg%3E";

export const formatPrice = (price: number, listingType?: string): string => {
  if (!Number.isFinite(price) || price <= 0) {
    return "Price on request";
  }

  const amount = `\u20B9 ${price.toLocaleString("en-IN")}`;
  return listingType?.toLowerCase() === "rent" ? `${amount} / month` : amount;
};

export const truncateText = (value: string | undefined, max = 110): string => {
  if (!value) {
    return "";
  }

  if (value.length <= max) {
    return value;
  }

  return `${value.slice(0, max).trimEnd()}...`;
};

export const formatArea = (area?: number | string, areaUnit?: string): string => {
  const safeArea =
    typeof area === "string" ? Number(area.replace(/[^0-9.]/g, "")) : area;

  if (!Number.isFinite(safeArea) || !safeArea || safeArea <= 0) {
    return "Area not specified";
  }

  const normalizedUnit = (areaUnit || "sqft").toLowerCase();
  const safeUnit =
    normalizedUnit === "acre" || normalizedUnit === "bigha" ? normalizedUnit : "sqft";
  return `${safeArea.toLocaleString("en-IN")} ${safeUnit}`;
};

export const formatPostedDate = (value?: string): string => {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
