import i18n from "../i18n";
import { translateApiValue, translatePropertyType, translateRole, translateStatus } from "./i18nHelpers";

const normalizeToken = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();

const ADMIN_NAV_BY_ROUTE: Record<string, string> = {
  "/admin": "adminPanel.nav.dashboard",
  "/admin/users": "adminPanel.nav.users",
  "/admin/sellers": "adminPanel.nav.sellers",
  "/admin/properties": "adminPanel.nav.properties",
  "/admin/activity-logs": "adminPanel.nav.activityLogs",
  "/admin/leads-management": "adminPanel.nav.leadsManagement",
  "/admin/testimonial": "adminPanel.nav.testimonial",
  "/admin/promotions": "adminPanel.nav.promotions",
  "/admin/images": "adminPanel.nav.images",
  "/admin/notifications": "adminPanel.nav.notifications",
  "/admin/account": "adminPanel.nav.account",
};

const ADMIN_NAV_BY_LABEL: Record<string, string> = {
  dashboard: "adminPanel.nav.dashboard",
  properties: "adminPanel.nav.properties",
  users: "adminPanel.nav.users",
  sellers: "adminPanel.nav.sellers",
  "access management": "adminPanel.accessManagement",
  "activity logs": "adminPanel.nav.activityLogs",
  "leads management": "adminPanel.nav.leadsManagement",
  testimonial: "adminPanel.nav.testimonial",
  testimonials: "adminPanel.nav.testimonial",
  "promotion requests": "adminPanel.nav.promotions",
  promotions: "adminPanel.nav.promotions",
  images: "adminPanel.nav.images",
  notifications: "adminPanel.nav.notifications",
  account: "adminPanel.nav.account",
  "my account": "adminPanel.nav.account",
};

const NOTIFICATION_MESSAGE_PATTERNS: Array<{
  re: RegExp;
  key: string;
  groups?: ("target" | "name")[];
}> = [
  {
    re: /^(.+) was approved by admin\.$/i,
    key: "adminPanel.notifications.messages.approvedByAdmin",
    groups: ["target"],
  },
  {
    re: /^(.+) was rejected by admin\.$/i,
    key: "adminPanel.notifications.messages.rejectedByAdmin",
    groups: ["target"],
  },
  {
    re: /^(.+) joined the platform\.$/i,
    key: "adminPanel.notifications.messages.userJoined",
    groups: ["name"],
  },
  {
    re: /^(.+) is waiting for review\.$/i,
    key: "adminPanel.notifications.messages.waitingForReview",
    groups: ["target"],
  },
  {
    re: /^(.+) has been added\.$/i,
    key: "adminPanel.notifications.messages.hasBeenAdded",
    groups: ["target"],
  },
];

export const translateAdminNavLabel = (label: string, route?: string): string => {
  const trimmedRoute = route?.trim().toLowerCase();
  if (trimmedRoute) {
    const routeKey = ADMIN_NAV_BY_ROUTE[trimmedRoute];
    if (routeKey && i18n.exists(routeKey)) return i18n.t(routeKey);
  }

  const normalized = normalizeToken(label);
  const labelKey = ADMIN_NAV_BY_LABEL[normalized];
  if (labelKey && i18n.exists(labelKey)) return i18n.t(labelKey);

  return translateApiValue("adminPanel.nav", label, label);
};

export const translateLeadType = (type?: string | null): string => {
  if (!type?.trim()) return "";
  const normalized = type.trim().toLowerCase();
  const key = `adminPanel.leads.leadTypes.${normalized}`;
  if (i18n.exists(key)) return i18n.t(key);
  return translateApiValue("adminPanel.leads.leadTypes", type, type);
};

export const translateLeadStatus = (status?: string | null): string => {
  if (!status?.trim()) return "";
  const normalized = status.trim().toLowerCase();
  const key = `adminPanel.leads.statusOptions.${normalized}`;
  if (i18n.exists(key)) return i18n.t(key);
  return translateStatus(status);
};

export const translatePromotionStatus = (status?: string | null): string => {
  if (!status?.trim()) return "";
  return translateApiValue("adminPanel.promotions.statuses", status, status);
};

export const translateAdminNotificationTitle = (title: string): string =>
  translateApiValue("adminPanel.notifications.titles", title, title);

export const translateAdminNotificationMessage = (message: string): string => {
  const trimmed = message.trim();
  if (!trimmed) return message;

  for (const { re, key, groups } of NOTIFICATION_MESSAGE_PATTERNS) {
    const match = trimmed.match(re);
    if (!match || !i18n.exists(key)) continue;
    const target = match[1]?.trim() || "";
    const displayTarget =
      normalizeToken(target) === "a listing" || normalizeToken(target) === "property"
        ? i18n.t("adminPanel.notifications.fallbackListing")
        : target;
    if (groups?.includes("target")) {
      return i18n.t(key, { target: displayTarget });
    }
    if (groups?.includes("name")) {
      return i18n.t(key, { name: displayTarget });
    }
    return i18n.t(key);
  }

  return translateApiValue("adminPanel.notifications.messages", trimmed, trimmed);
};

export const translateVisitType = (value?: string | null): string => {
  if (!value?.trim()) return "";
  return translateApiValue("adminPanel.leads.visitTypes", value, value);
};

export { translatePropertyType, translateRole, translateStatus };
