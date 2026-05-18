import i18n from "../i18n";
import { normalizeLanguage } from "../i18n";
import {
  translateApiValue,
  translatePropertyType,
  translateStatus,
} from "./i18nHelpers";

const normalizeToken = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();

const SELLER_NAV_BY_ROUTE: Record<string, string> = {
  "/seller/dashboard": "sellerPanel.nav.dashboard",
  "/seller/properties": "sellerPanel.nav.myProperties",
  "/seller/leads": "sellerPanel.nav.leads",
  "/seller/analytics": "sellerPanel.nav.analytics",
  "/seller/messages": "sellerPanel.nav.messages",
  "/seller/testimonial": "sellerPanel.nav.testimonial",
  "/seller/notifications": "sellerPanel.nav.notifications",
  "/seller/promotions": "sellerPanel.nav.promotions",
  "/seller/profile": "sellerPanel.nav.profile",
  "/seller/settings": "sellerPanel.nav.settings",
  "/post-property/basic": "sellerPanel.nav.addProperty",
};

const SELLER_NAV_BY_LABEL: Record<string, string> = {
  dashboard: "sellerPanel.nav.dashboard",
  "my properties": "sellerPanel.nav.myProperties",
  properties: "sellerPanel.nav.myProperties",
  "add property": "sellerPanel.nav.addProperty",
  leads: "sellerPanel.nav.leads",
  analytics: "sellerPanel.nav.analytics",
  messages: "sellerPanel.nav.messages",
  testimonial: "sellerPanel.nav.testimonial",
  testimonials: "sellerPanel.nav.testimonial",
  notifications: "sellerPanel.nav.notifications",
  promotions: "sellerPanel.nav.promotions",
  profile: "sellerPanel.nav.profile",
  settings: "sellerPanel.nav.settings",
  workspace: "sellerPanel.sidebar.workspace",
  account: "sellerPanel.sidebar.account",
};

const NOTIFICATION_MESSAGE_PATTERNS: Array<{
  re: RegExp;
  key: string;
  groups?: ("target" | "name")[];
}> = [
  {
    re: /^(.+) was approved by admin\.$/i,
    key: "sellerPanel.notifications.messages.approvedByAdmin",
    groups: ["target"],
  },
  {
    re: /^(.+) was rejected by admin\.$/i,
    key: "sellerPanel.notifications.messages.rejectedByAdmin",
    groups: ["target"],
  },
  {
    re: /^your property (.+) has been approved\.$/i,
    key: "sellerPanel.notifications.messages.propertyApproved",
    groups: ["target"],
  },
  {
    re: /^your property (.+) was rejected\.$/i,
    key: "sellerPanel.notifications.messages.propertyRejected",
    groups: ["target"],
  },
];

export const translateSellerNavLabel = (label: string, route?: string): string => {
  const trimmedRoute = route?.trim().toLowerCase();
  if (trimmedRoute) {
    const routeKey = SELLER_NAV_BY_ROUTE[trimmedRoute];
    if (routeKey && i18n.exists(routeKey)) return i18n.t(routeKey);
  }

  const normalized = normalizeToken(label);
  const labelKey = SELLER_NAV_BY_LABEL[normalized];
  if (labelKey && i18n.exists(labelKey)) return i18n.t(labelKey);

  return translateApiValue("sellerPanel.nav", label, label);
};

export const translateSellerListingStatus = (status?: string | null): string => {
  if (!status?.trim()) return "";
  const normalized = normalizeToken(status);
  const key = `sellerPanel.status.${normalized}`;
  if (i18n.exists(key)) return i18n.t(key);
  return translateStatus(status);
};

export const translateSellerNotificationTitle = (title: string): string =>
  translateApiValue("sellerPanel.notifications.titles", title, title);

export const translateSellerNotificationMessage = (message: string): string => {
  const trimmed = message.trim();
  if (!trimmed) return message;

  for (const { re, key, groups } of NOTIFICATION_MESSAGE_PATTERNS) {
    const match = trimmed.match(re);
    if (!match || !i18n.exists(key)) continue;
    const target = match[1]?.trim() || "";
    if (groups?.includes("target")) {
      return i18n.t(key, { target });
    }
    if (groups?.includes("name")) {
      return i18n.t(key, { name: target });
    }
    return i18n.t(key);
  }

  return translateApiValue("sellerPanel.notifications.messages", trimmed, trimmed);
};

export const translateSellerLeadActivityType = (type?: string | null): string => {
  if (!type?.trim()) return "";
  const normalized = normalizeToken(type).replace(/\s+/g, "");
  const key = `sellerPanel.leadsTable.activityTypes.${normalized}`;
  if (i18n.exists(key)) return i18n.t(key);
  return translateApiValue("sellerPanel.leadsTable.activityTypes", type, type);
};

export const formatSellerRelativeTime = (timestamp: string): string => {
  const time = new Date(timestamp).getTime();
  if (Number.isNaN(time)) return "";
  const diffMs = Date.now() - time;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diffMs < hour) {
    const n = Math.max(1, Math.floor(diffMs / minute));
    return i18n.t("sellerPanel.time.minutesAgo", { count: n });
  }
  if (diffMs < day) {
    const n = Math.floor(diffMs / hour);
    return i18n.t("sellerPanel.time.hoursAgo", { count: n });
  }
  const n = Math.floor(diffMs / day);
  return i18n.t("sellerPanel.time.daysAgo", { count: n });
};

export const formatSellerDateTime = (value?: string, language?: string): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const locale = normalizeLanguage(language ?? i18n.language) === "hi" ? "hi-IN" : "en-IN";
  return date.toLocaleString(locale);
};

export const formatSellerDate = (value?: string, language?: string): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const locale = normalizeLanguage(language ?? i18n.language) === "hi" ? "hi-IN" : "en-IN";
  return date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatSellerCurrency = (price: number, language?: string): string => {
  if (!Number.isFinite(price)) return "";
  const locale = normalizeLanguage(language ?? i18n.language) === "hi" ? "hi-IN" : "en-IN";
  return `₹ ${price.toLocaleString(locale)}`;
};

export const formatSellerNumber = (value: number, language?: string): string => {
  const locale = normalizeLanguage(language ?? i18n.language) === "hi" ? "hi-IN" : "en-IN";
  return value.toLocaleString(locale);
};

export const translateSellerChartWeekLabel = (weekIndex: number): string =>
  i18n.t("sellerPanel.charts.weekLabel", { week: weekIndex + 1 });

export const translateSellerAnalyticsFallback = (kind: "listing" | "other"): string =>
  i18n.t(`sellerPanel.analytics.fallback.${kind}`);

export const translateSellerError = (message?: string | null): string => {
  if (!message?.trim()) return "";
  return translateApiValue("sellerPanel.errors", message, message);
};

export { translatePropertyType };
