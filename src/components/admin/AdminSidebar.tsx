import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  Users,
  FileClock,
  UserCircle,
  Bell,
  ClipboardList,
  MessageCircleMore,
  Megaphone,
  Images,
  Inbox,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import api from "@/lib/apiClient";

type SidebarItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const ADMIN_ROUTE_BY_LABEL: Record<string, string> = {
  dashboard: "/admin",
  "access management": "/admin/users",
  "activity logs": "/admin/activity-logs",
  "leads management": "/admin/leads-management",
  testimonial: "/admin/testimonial",
  "promotion requests": "/admin/promotions",
  images: "/admin/images",
};

const ADMIN_ROUTE_ALIASES: Record<string, string> = {
  "/admin/dashboard": "/admin",
  "/admin/access-management": "/admin/users",
  "/admin/accessmanagement": "/admin/users",
  "/admin/activitylogs": "/admin/activity-logs",
  "/admin/testimonials": "/admin/testimonial",
  "/admin/promotion-requests": "/admin/promotions",
  "/admin/promotionrequests": "/admin/promotions",
  "/admin/image": "/admin/images",
  "/admin/leadsmanagement": "/admin/leads-management",
  "/admin/leads": "/admin/leads-management",
};

const REMOVED_ADMIN_ROUTES = new Set<string>([
  "/admin/logs",
  "/admin/audit-logs",
  "/admin/auditlogs",
]);

const REMOVED_ADMIN_LABELS = new Set<string>(["audit logs", "audit log"]);

const ICON_MAP = {
  layoutdashboard: LayoutDashboard,
  dashboard: LayoutDashboard,
  listchecks: ListChecks,
  properties: ListChecks,
  users: Users,
  fileclock: FileClock,
  logs: FileClock,
  usercircle: UserCircle,
  account: UserCircle,
  bell: Bell,
  notifications: Bell,
  clipboardlist: ClipboardList,
  audit: ClipboardList,
  messagecirclemore: MessageCircleMore,
  testimonial: MessageCircleMore,
  megaphone: Megaphone,
  promotions: Megaphone,
  images: Images,
  inbox: Inbox,
  leads: Inbox,
  leadsmanagement: Inbox,
} as const;

interface AdminSidebarProps {
  onNavigate?: () => void;
  collapsed?: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onNavigate, collapsed }) => {
  const { t } = useTranslation();
  const [dynamicItems, setDynamicItems] = useState<SidebarItem[]>([]);
  const [sectionTitle, setSectionTitle] = useState<string>("");
  const imagesFallbackItem = useMemo<SidebarItem>(
    () => ({
      to: "/admin/images",
      label: t("adminPanel.nav.images"),
      icon: Images,
    }),
    [t]
  );
  const leadsManagementFallbackItem = useMemo<SidebarItem>(
    () => ({
      to: "/admin/leads-management",
      label: t("adminPanel.nav.leadsManagement"),
      icon: Inbox,
    }),
    [t]
  );
  const normalizeAdminRoute = (rawTo: string, rawLabel: string) => {
    const labelKey = rawLabel.trim().toLowerCase();
    const byLabel = ADMIN_ROUTE_BY_LABEL[labelKey];
    if (byLabel) return byLabel;

    const cleaned = rawTo.trim();
    if (!cleaned) return "";
    const withSlash = cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
    const compact = withSlash.replace(/\s+/g, "-");
    return ADMIN_ROUTE_ALIASES[compact] ?? compact;
  };

  const mapItem = (item: {
    title?: string;
    label?: string;
    name?: string;
    icon?: string;
    route?: string;
    path?: string;
    to?: string;
    href?: string;
    url?: string;
  }) => {
    const iconKey = (item.icon ?? "").replace(/[\s_-]/g, "").toLowerCase();
    const icon = ICON_MAP[iconKey as keyof typeof ICON_MAP] ?? LayoutDashboard;
    const label = item.title ?? item.label ?? item.name ?? "";
    const rawTo = item.route ?? item.path ?? item.to ?? item.href ?? item.url ?? "";
    return { to: normalizeAdminRoute(rawTo, label), label, icon };
  };

  useEffect(() => {
    let active = true;

    const loadSidebar = async () => {
      try {
        const response = await api.get("/sidebar/admin");
        const payload = response.data?.data ?? response.data;
        if (!payload || !active) return;

        const sections =
          payload?.sidebar?.sections ??
          payload?.sections ??
          [];

        const sectionItems = (Array.isArray(sections) ? sections : []).flatMap(
          (section: { items?: unknown[] }) => (Array.isArray(section?.items) ? section.items : [])
        );

        const rawItems =
          sectionItems.length
            ? sectionItems
            : payload?.items ??
          payload?.menuItems ??
          payload?.menu_items ??
          payload?.sidebarItems ??
          payload?.sidebar_items ??
          payload?.links ??
          (Array.isArray(payload) ? payload : []);

        const mapped = (Array.isArray(rawItems) ? rawItems : [])
          .map(mapItem)
          .filter((item: { to: string; label: string }) => item.to && item.label)
          .filter((item: { to: string; label: string }) => {
            const normalizedLabel = item.label.trim().toLowerCase();
            const normalizedRoute = item.to.trim().toLowerCase();
            if (REMOVED_ADMIN_LABELS.has(normalizedLabel)) return false;
            if (REMOVED_ADMIN_ROUTES.has(normalizedRoute)) return false;
            return true;
          });

        setDynamicItems(mapped);
        const title =
          (Array.isArray(sections) ? sections[0]?.sectionTitle : undefined) ??
          payload?.sectionTitle ??
          payload?.title ??
          payload?.section_title;
        if (typeof title === "string") {
          setSectionTitle(title);
        }
      } catch (error) {
        console.error("Failed to load admin sidebar:", error);
      }
    };

    loadSidebar();
    return () => {
      active = false;
    };
  }, []);

  const withImages = dynamicItems.some((item) => item.to === "/admin/images")
    ? dynamicItems
    : [...dynamicItems, imagesFallbackItem];

  const sidebarItems = withImages.some(
    (item) => item.to === "/admin/leads-management"
  )
    ? withImages
    : (() => {
        const accountIndex = withImages.findIndex(
          (item) => item.to === "/admin/users"
        );
        if (accountIndex === -1) return [...withImages, leadsManagementFallbackItem];
        const next = [...withImages];
        next.splice(accountIndex + 1, 0, leadsManagementFallbackItem);
        return next;
      })();

  return (
    <nav className="space-y-1" aria-label={sectionTitle || undefined}>
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/admin"}
            onClick={() => onNavigate?.()}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              twMerge(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                "hover:bg-[var(--b2-soft)] hover:text-[var(--b1)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b1-mid)] focus-visible:ring-offset-2",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-[var(--b2-soft)] font-semibold text-[var(--b1)] shadow-sm ring-1 ring-[var(--b2)]"
                  : "text-[var(--muted)]"
              )
            }
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--b2-soft)] text-[var(--b1-mid)] group-hover:bg-[var(--b2)] group-hover:text-[var(--b1)]">
              <Icon className="h-4 w-4" />
            </span>
            <span className={twMerge("font-medium", collapsed && "sr-only")}>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default AdminSidebar;
