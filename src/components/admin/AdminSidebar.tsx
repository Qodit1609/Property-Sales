import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  Users,
  FileClock,
  UserCircle,
  Bell,
  ClipboardList,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/account", label: "My Account", icon: UserCircle },
  { to: "/admin/properties", label: "Properties", icon: ListChecks },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/logs", label: "Activity logs", icon: FileClock },
  { to: "/admin/activity-logs", label: "Audit logs", icon: ClipboardList },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
];

interface AdminSidebarProps {
  onNavigate?: () => void;
  collapsed?: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onNavigate, collapsed }) => {
  return (
    <nav className="space-y-1">
      {items.map((item) => {
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
