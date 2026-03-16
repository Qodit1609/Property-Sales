import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import DashboardLayout from "../../layout/DashboardLayout";

const linkBase =
  "block rounded-lg px-4 py-2 text-sm font-medium transition border border-transparent";

const AgentLayout: React.FC = () => {
  const sidebar = (
    <ul className="space-y-2">
      <li>
        <NavLink
          to="/agent/dashboard"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-[var(--b2-soft)] text-[var(--b1)] border-[var(--b2)]"
                : "text-[var(--b1)] hover:bg-[var(--b2-soft)]"
            }`
          }
        >
          Agent Dashboard
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/agent/properties"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-[var(--b2-soft)] text-[var(--b1)] border-[var(--b2)]"
                : "text-[var(--b1)] hover:bg-[var(--b2-soft)]"
            }`
          }
        >
          My Properties
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/agent/add-property"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-[var(--b2-soft)] text-[var(--b1)] border-[var(--b2)]"
                : "text-[var(--b1)] hover:bg-[var(--b2-soft)]"
            }`
          }
        >
          Add Property
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/agent/leads"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-[var(--b2-soft)] text-[var(--b1)] border-[var(--b2)]"
                : "text-[var(--b1)] hover:bg-[var(--b2-soft)]"
            }`
          }
        >
          Leads Management
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/agent/visits"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-[var(--b2-soft)] text-[var(--b1)] border-[var(--b2)]"
                : "text-[var(--b1)] hover:bg-[var(--b2-soft)]"
            }`
          }
        >
          Visit Scheduling
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/agent/clients"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-[var(--b2-soft)] text-[var(--b1)] border-[var(--b2)]"
                : "text-[var(--b1)] hover:bg-[var(--b2-soft)]"
            }`
          }
        >
          Clients
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/agent/profile"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-[var(--b2-soft)] text-[var(--b1)] border-[var(--b2)]"
                : "text-[var(--b1)] hover:bg-[var(--b2-soft)]"
            }`
          }
        >
          Agent Profile
        </NavLink>
      </li>
    </ul>
  );

  return (
    <DashboardLayout title="Agent Panel" sidebar={sidebar}>
      <Outlet />
    </DashboardLayout>
  );
};

export default AgentLayout;

