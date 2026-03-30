import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  Users,
  FileClock,
  UserCircle,
  Store,
} from "lucide-react";

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/account", label: "My Account", icon: UserCircle },
  { to: "/admin/properties", label: "Properties", icon: ListChecks },
  { to: "/admin/sellers", label: "Sellers", icon: Store },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/logs", label: "Activity logs", icon: FileClock },
];

const AdminSidebar: React.FC = () => {
  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/admin"}
            className={({ isActive }) =>
              [
                "group flex items-center gap-2 rounded-lg px-3 py-2 transition-all",
                "hover:bg-[var(--b2-soft)] hover:text-[var(--b1)]",
                isActive
                  ? "bg-[var(--b2-soft)] text-[var(--b1)] shadow-sm"
                  : "text-[var(--muted)]",
              ].join(" ")
            }
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--b2-soft)] text-[var(--b1-mid)] group-hover:bg-[var(--b2)] group-hover:text-[var(--b1)]">
              <Icon className="h-4 w-4" />
            </span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default AdminSidebar;

