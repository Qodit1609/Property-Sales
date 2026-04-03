/** Desktop buyer sidebar widths (px). Must match BuyerLayout spacer + sidebar. */
export const BUYER_SIDEBAR_WIDTH_EXPANDED = 280;
export const BUYER_SIDEBAR_WIDTH_COLLAPSED = 72;

const DEFAULT_SUB =
  "Track saved properties, enquiries, and activity at a glance.";

/**
 * Top overview strip title/subtitle from the current buyer route (pathname from react-router).
 */
export function buyerTopBarFromPath(pathname: string): {
  title: string;
  subtitle: string;
} {
  const p = pathname.replace(/\/$/, "") || "/";

  const map: Record<string, { title: string; subtitle: string }> = {
    "/buyer": { title: "Overview", subtitle: DEFAULT_SUB },
    "/buyer/dashboard": { title: "Overview", subtitle: DEFAULT_SUB },
    "/buyer/wishlist": {
      title: "Wishlist",
      subtitle: "Properties you saved for later.",
    },
    "/buyer/compare": {
      title: "Compare",
      subtitle: "Side-by-side listing comparison.",
    },
    "/buyer/cart": {
      title: "Cart",
      subtitle: "Listings you plan to enquire about.",
    },
    "/buyer/account": {
      title: "Account",
      subtitle: "Your profile and preferences.",
    },
    "/buyer/activity": {
      title: "Activity",
      subtitle: "Recent views and interactions.",
    },
    "/buyer/enquiries": {
      title: "Enquiries",
      subtitle: "Messages and requests you have sent.",
    },
    "/buyer/notifications": {
      title: "Notifications",
      subtitle: "Alerts and updates for your account.",
    },
  };

  return map[p] ?? { title: "Buyer overview", subtitle: DEFAULT_SUB };
}
