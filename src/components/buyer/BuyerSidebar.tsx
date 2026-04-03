import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Heart,
  Scale,
  ShoppingCart,
  UserCircle2,
  Bell,
  Clock3,
  MessagesSquare,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

const navItems = [
  { to: "/buyer/dashboard", icon: LayoutGrid, label: "Overview" },
  { to: "/buyer/wishlist", icon: Heart, label: "Wishlist" },
  { to: "/buyer/compare", icon: Scale, label: "Compare" },
  { to: "/buyer/cart", icon: ShoppingCart, label: "Cart" },
  { to: "/buyer/account", icon: UserCircle2, label: "Account" },
  { to: "/buyer/activity", icon: Clock3, label: "Activity" },
  { to: "/buyer/enquiries", icon: MessagesSquare, label: "Enquiries" },
  { to: "/buyer/notifications", icon: Bell, label: "Notifications" },
];

interface BuyerSidebarProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

const BuyerSidebar: React.FC<BuyerSidebarProps> = ({
  collapsed,
  onNavigate,
}) => {
  return (
    <nav className="space-y-1 text-sm">
      {navItems.map((item) => {
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
