import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  const items = [
    { to: "/agent/dashboard", icon: LayoutDashboard, labelKey: "agentPanel.nav.dashboard" },
    { to: "/agent/field-entry", icon: ClipboardPenLine, labelKey: "agentPanel.nav.fieldEntry" },
    { to: "/agent/detailed-entry", icon: FileText, labelKey: "agentPanel.nav.detailedEntry" },
    { to: "/agent/leads", icon: Users, labelKey: "agentPanel.nav.leads" },
    { to: "/agent/visits", icon: CalendarCheck2, labelKey: "agentPanel.nav.visits" },
    { to: "/agent/calendar", icon: CalendarDays, labelKey: "agentPanel.nav.calendar" },
    { to: "/agent/clients", icon: Users, labelKey: "agentPanel.nav.clients" },
    { to: "/agent/notifications", icon: Bell, labelKey: "agentPanel.nav.notifications" },
    { to: "/agent/profile", icon: UserRound, labelKey: "agentPanel.nav.profile" },
  ] as const;

  return (
    <ul className="space-y-1">
      {items.map(({ to, icon: Icon, labelKey }) => {
        const label = t(labelKey);
        return (
          <li key={to}>
            <NavLink
              to={to}
              onClick={onNavigate}
              className={({ isActive }) =>
                twMerge(
                  linkBase,
                  collapsed && "justify-center px-2",
                  isActive &&
                    "border-[var(--b2)] bg-gradient-to-r from-[var(--b2-soft)] to-[var(--white)] text-[var(--b1)] shadow-sm"
                )
              }
              title={collapsed ? label : undefined}
            >
              <Icon className="h-[18px] w-[18px] shrink-0 opacity-90 transition group-hover:scale-[1.03]" />
              {!collapsed ? <span className="truncate">{label}</span> : null}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
};

export default AgentSidebar;
