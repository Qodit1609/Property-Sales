import React from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";

const AdminUsersPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const role = (searchParams.get("role") ?? "").toLowerCase();
  const roleFilter =
    role === "buyer" ||
    role === "seller" ||
    role === "agent" ||
    role === "user"
      ? role
      : "all";
  return (
    <AdminDashboard
      initialTab="users"
      layoutTitle={t("adminPanel.accessManagement")}
      initialUserRoleFilter={roleFilter}
    />
  );
};

export default AdminUsersPage;

