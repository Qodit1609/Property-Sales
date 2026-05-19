import type { TFunction } from "i18next";

/** Desktop buyer sidebar widths (px). Must match BuyerLayout spacer + sidebar. */
export const BUYER_SIDEBAR_WIDTH_EXPANDED = 280;
export const BUYER_SIDEBAR_WIDTH_COLLAPSED = 72;

const ROUTE_TOP_BAR_KEY: Record<string, string> = {
  "/buyer": "overview",
  "/buyer/dashboard": "overview",
  "/buyer/overview": "overview",
  "/buyer/wishlist": "wishlist",
  "/buyer/compare": "compare",
  "/buyer/cart": "cart",
  "/buyer/account": "account",
  "/buyer/activity": "activity",
  "/buyer/enquiries": "enquiries",
  "/buyer/testimonial": "testimonial",
  "/buyer/notifications": "notifications",
};

/**
 * Top overview strip title/subtitle from the current buyer route (pathname from react-router).
 */
export function buyerTopBarFromPath(
  pathname: string,
  t: TFunction
): { title: string; subtitle: string } {
  const p = pathname.replace(/\/$/, "") || "/";
  const key = ROUTE_TOP_BAR_KEY[p] ?? "fallback";
  return {
    title: t(`buyerPanel.topBar.${key}.title`),
    subtitle: t(`buyerPanel.topBar.${key}.subtitle`),
  };
}
