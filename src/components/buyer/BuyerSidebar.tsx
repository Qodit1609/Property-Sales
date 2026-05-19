import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Heart,
  Scale,
  ShoppingCart,
  UserCircle2,
  Bell,
  Clock3,
  MessageCircleMore,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import api from "@/lib/apiClient";
import { translateBuyerNavLabel, translateBuyerSectionTitle } from "../../lib/buyerI18n";

type SidebarItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const ICON_MAP = {
  layoutgrid: LayoutGrid,
  overview: LayoutGrid,
  heart: Heart,
  wishlist: Heart,
  scale: Scale,
  compare: Scale,
  shoppingcart: ShoppingCart,
  cart: ShoppingCart,
  usercircle2: UserCircle2,
  account: UserCircle2,
  bell: Bell,
  notifications: Bell,
  clock3: Clock3,
  activity: Clock3,
  messagecirclemore: MessageCircleMore,
  testimonial: MessageCircleMore,
  enquiries: MessageCircleMore,
} as const;

interface BuyerSidebarProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

const BuyerSidebar: React.FC<BuyerSidebarProps> = ({
  collapsed,
  onNavigate,
}) => {
  const { t } = useTranslation();
  const defaultItems = useMemo<SidebarItem[]>(
    () => [
      { to: "/buyer/overview", label: t("buyerPanel.nav.overview"), icon: LayoutGrid },
      { to: "/buyer/wishlist", label: t("buyerPanel.nav.wishlist"), icon: Heart },
      { to: "/buyer/compare", label: t("buyerPanel.nav.compare"), icon: Scale },
      { to: "/buyer/cart", label: t("buyerPanel.nav.cart"), icon: ShoppingCart },
      { to: "/buyer/enquiries", label: t("buyerPanel.nav.enquiries"), icon: MessageCircleMore },
      { to: "/buyer/activity", label: t("buyerPanel.nav.activity"), icon: Clock3 },
      { to: "/buyer/notifications", label: t("buyerPanel.nav.notifications"), icon: Bell },
      { to: "/buyer/account", label: t("buyerPanel.nav.account"), icon: UserCircle2 },
    ],
    [t]
  );
  const [dynamicItems, setDynamicItems] = useState<SidebarItem[]>([]);
  const [sectionTitle, setSectionTitle] = useState<string>("");
  const normalizeRoute = (route: string) => {
    const raw = route.trim();
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return "";
    if (raw.startsWith("/buyer/")) return raw;
    if (raw === "/buyer") return "/buyer/overview";
    if (raw.startsWith("/")) return `/buyer${raw}`;
    return `/buyer/${raw}`;
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
    const icon = ICON_MAP[iconKey as keyof typeof ICON_MAP] ?? LayoutGrid;
    const rawLabel = item.title ?? item.label ?? item.name ?? "";
    const route = normalizeRoute(
      item.route ?? item.path ?? item.to ?? item.href ?? item.url ?? ""
    );
    return {
      to: route,
      label: rawLabel ? translateBuyerNavLabel(rawLabel, route) : "",
      icon,
    };
  };

  useEffect(() => {
    let active = true;

    const loadSidebar = async () => {
      try {
        const response = await api.get("/sidebar/buyer");
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
          .filter((item: { to: string; label: string }) => item.to && item.label);

        setDynamicItems(mapped.length ? mapped : defaultItems);
        const title =
          (Array.isArray(sections) ? sections[0]?.sectionTitle : undefined) ??
          payload?.sectionTitle ??
          payload?.title ??
          payload?.section_title;
        if (typeof title === "string") {
          setSectionTitle(title);
        }
      } catch (error) {
        console.error("Failed to load buyer sidebar:", error);
        if (active) {
          setDynamicItems(defaultItems);
        }
      }
    };

    loadSidebar();
    return () => {
      active = false;
    };
  }, [defaultItems]);

  const resolvedSectionTitle = sectionTitle
    ? translateBuyerSectionTitle(sectionTitle)
    : undefined;

  return (
    <nav className="space-y-1 text-sm" aria-label={resolvedSectionTitle || undefined}>
      {dynamicItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            title={collapsed ? item.label : undefined}
            onClick={() => onNavigate?.()}
            className={({ isActive }) =>
              twMerge(
                "group flex items-center gap-2 rounded-lg px-3 py-2 transition-all",
                "hover:bg-[var(--b2-soft)] hover:text-[var(--b1)]",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-[var(--b2-soft)] text-[var(--b1)] shadow-sm"
                  : "text-[var(--muted)]"
              )
            }
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--b2-soft)] text-[var(--b1-mid)] group-hover:bg-[var(--b2)] group-hover:text-[var(--b1)]">
              <Icon className="h-4 w-4" />
            </span>
            <span
              className={twMerge("font-medium", collapsed && "sr-only")}
            >
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default BuyerSidebar;
