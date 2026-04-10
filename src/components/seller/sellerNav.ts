import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  LineChart,
  Megaphone,
  MessageSquare,
  Bell,
  Settings,
  UserRound,
  Building2,
  Users,
} from "lucide-react";

export type SellerNavItem = {
  key: string;
  to: string;
  icon: LucideIcon;
  labelKey: string;
  /** Opens in same app but outside /seller */
  external?: boolean;
};

export const SELLER_NAV_MAIN: SellerNavItem[] = [
  { key: "dash", to: "/seller/dashboard", icon: LayoutDashboard, labelKey: "sellerPanel.nav.dashboard" },
  { key: "props", to: "/seller/properties", icon: Building2, labelKey: "sellerPanel.nav.myProperties" },
  { key: "leads", to: "/seller/leads", icon: Users, labelKey: "sellerPanel.nav.leads" },
  { key: "analytics", to: "/seller/analytics", icon: LineChart, labelKey: "sellerPanel.nav.analytics" },
  { key: "messages", to: "/seller/messages", icon: MessageSquare, labelKey: "sellerPanel.nav.messages" },
  { key: "notifications", to: "/seller/notifications", icon: Bell, labelKey: "sellerPanel.nav.notifications" },
  { key: "promo", to: "/seller/promotions", icon: Megaphone, labelKey: "sellerPanel.nav.promotions" },
];

export const SELLER_NAV_ACCOUNT: SellerNavItem[] = [
  { key: "profile", to: "/seller/profile", icon: UserRound, labelKey: "sellerPanel.nav.profile" },
  { key: "settings", to: "/seller/settings", icon: Settings, labelKey: "sellerPanel.nav.settings" },
];

export const SELLER_CHART_WEEKS = 8;
