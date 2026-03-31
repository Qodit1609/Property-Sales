import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../../layout/DashboardLayout";

const linkBase =
  "block rounded-lg border border-transparent px-4 py-2 text-sm font-medium transition";

interface SellerLayoutProps {
  children: React.ReactNode;
}

const SellerLayout: React.FC<SellerLayoutProps> = ({ children }) => {
  const { t } = useTranslation();

  const sidebar = (
    <ul className="space-y-2">
      <li>
        <NavLink
          to="/seller/dashboard"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "border-[var(--b2)] bg-[var(--b2-soft)] text-[var(--b1)]"
                : "text-[var(--b1)] hover:bg-[var(--b2-soft)]"
            }`
          }
        >
          {t("header.dashboard")}
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/seller/properties"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "border-[var(--b2)] bg-[var(--b2-soft)] text-[var(--b1)]"
                : "text-[var(--b1)] hover:bg-[var(--b2-soft)]"
            }`
          }
        >
          {t("sellerDashboard.myProperties")}
        </NavLink>
      </li>
    </ul>
  );

  return (
    <DashboardLayout title={t("sellerDashboard.sellerPanel")} sidebar={sidebar}>
      {children}
    </DashboardLayout>
  );
};

export default SellerLayout;
