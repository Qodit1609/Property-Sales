import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardPenLine,
  FileText,
  Users,
  CalendarCheck2,
  CalendarDays,
  Bell,
  UserRound,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

type AgentSidebarProps = {
  collapsed?: boolean;
  onNavigate?: () => void;
};

const linkBase =
  "group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200 border-transparent text-[var(--b1)]/90 hover:border-[var(--b2)]/80 hover:bg-[var(--b2-soft)]/60";

const AgentSidebar: React.FC<AgentSidebarProps> = ({ collapsed = false, onNavigate }) => {
  return (
    <ul className="space-y-1">
        <li>
          <NavLink
            to="/agent/dashboard"
            onClick={onNavigate}
            className={({ isActive }) =>
              twMerge(linkBase, collapsed && "justify-center px-2", isActive && (
                isActive
                  ? "border-[var(--b2)] bg-gradient-to-r from-[var(--b2-soft)] to-[var(--white)] text-[var(--b1)] shadow-sm"
                  : ""
              ))
            }
            title={collapsed ? "Agent Dashboard" : undefined}
          >
            <LayoutDashboard className="h-[18px] w-[18px] shrink-0 opacity-90 transition group-hover:scale-[1.03]" />
            {!collapsed ? <span className="truncate">Agent Dashboard</span> : null}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/agent/field-entry"
            onClick={onNavigate}
            className={({ isActive }) =>
              twMerge(linkBase, collapsed && "justify-center px-2", isActive && (
                isActive
                  ? "border-[var(--b2)] bg-gradient-to-r from-[var(--b2-soft)] to-[var(--white)] text-[var(--b1)] shadow-sm"
                  : ""
              ))
            }
            title={collapsed ? "Field Entry" : undefined}
          >
            <ClipboardPenLine className="h-[18px] w-[18px] shrink-0 opacity-90 transition group-hover:scale-[1.03]" />
            {!collapsed ? <span className="truncate">Field Entry</span> : null}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/agent/detailed-entry"
            onClick={onNavigate}
            className={({ isActive }) =>
              twMerge(linkBase, collapsed && "justify-center px-2", isActive && (
                isActive
                  ? "border-[var(--b2)] bg-gradient-to-r from-[var(--b2-soft)] to-[var(--white)] text-[var(--b1)] shadow-sm"
                  : ""
              ))
            }
            title={collapsed ? "Detailed Entry" : undefined}
          >
            <FileText className="h-[18px] w-[18px] shrink-0 opacity-90 transition group-hover:scale-[1.03]" />
            {!collapsed ? <span className="truncate">Detailed Entry</span> : null}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/agent/leads"
            onClick={onNavigate}
            className={({ isActive }) =>
              twMerge(linkBase, collapsed && "justify-center px-2", isActive && (
                isActive
                  ? "border-[var(--b2)] bg-gradient-to-r from-[var(--b2-soft)] to-[var(--white)] text-[var(--b1)] shadow-sm"
                  : ""
              ))
            }
            title={collapsed ? "Leads Management" : undefined}
          >
            <Users className="h-[18px] w-[18px] shrink-0 opacity-90 transition group-hover:scale-[1.03]" />
            {!collapsed ? <span className="truncate">Leads Management</span> : null}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/agent/visits"
            onClick={onNavigate}
            className={({ isActive }) =>
              twMerge(linkBase, collapsed && "justify-center px-2", isActive && (
                isActive
                  ? "border-[var(--b2)] bg-gradient-to-r from-[var(--b2-soft)] to-[var(--white)] text-[var(--b1)] shadow-sm"
                  : ""
              ))
            }
            title={collapsed ? "Visit Scheduling" : undefined}
          >
            <CalendarCheck2 className="h-[18px] w-[18px] shrink-0 opacity-90 transition group-hover:scale-[1.03]" />
            {!collapsed ? <span className="truncate">Visit Scheduling</span> : null}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/agent/calendar"
            onClick={onNavigate}
            className={({ isActive }) =>
              twMerge(linkBase, collapsed && "justify-center px-2", isActive && (
                isActive
                  ? "border-[var(--b2)] bg-gradient-to-r from-[var(--b2-soft)] to-[var(--white)] text-[var(--b1)] shadow-sm"
                  : ""
              ))
            }
            title={collapsed ? "Calendar" : undefined}
          >
            <CalendarDays className="h-[18px] w-[18px] shrink-0 opacity-90 transition group-hover:scale-[1.03]" />
            {!collapsed ? <span className="truncate">Calendar</span> : null}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/agent/clients"
            onClick={onNavigate}
            className={({ isActive }) =>
              twMerge(linkBase, collapsed && "justify-center px-2", isActive && (
                isActive
                  ? "border-[var(--b2)] bg-gradient-to-r from-[var(--b2-soft)] to-[var(--white)] text-[var(--b1)] shadow-sm"
                  : ""
              ))
            }
            title={collapsed ? "Clients" : undefined}
          >
            <Users className="h-[18px] w-[18px] shrink-0 opacity-90 transition group-hover:scale-[1.03]" />
            {!collapsed ? <span className="truncate">Clients</span> : null}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/agent/notifications"
            onClick={onNavigate}
            className={({ isActive }) =>
              twMerge(linkBase, collapsed && "justify-center px-2", isActive && (
                isActive
                  ? "border-[var(--b2)] bg-gradient-to-r from-[var(--b2-soft)] to-[var(--white)] text-[var(--b1)] shadow-sm"
                  : ""
              ))
            }
            title={collapsed ? "Notifications" : undefined}
          >
            <Bell className="h-[18px] w-[18px] shrink-0 opacity-90 transition group-hover:scale-[1.03]" />
            {!collapsed ? <span className="truncate">Notifications</span> : null}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/agent/profile"
            onClick={onNavigate}
            className={({ isActive }) =>
              twMerge(linkBase, collapsed && "justify-center px-2", isActive && (
                isActive
                  ? "border-[var(--b2)] bg-gradient-to-r from-[var(--b2-soft)] to-[var(--white)] text-[var(--b1)] shadow-sm"
                  : ""
              ))
            }
            title={collapsed ? "Agent Profile" : undefined}
          >
            <UserRound className="h-[18px] w-[18px] shrink-0 opacity-90 transition group-hover:scale-[1.03]" />
            {!collapsed ? <span className="truncate">Agent Profile</span> : null}
          </NavLink>
        </li>
      </ul>
  );
};

export default AgentSidebar;
