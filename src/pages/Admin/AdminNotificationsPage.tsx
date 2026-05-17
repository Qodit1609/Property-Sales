import React from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminNotificationPanel from "../../components/admin/AdminNotificationPanel";

const AdminNotificationsPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <AdminLayout title={t("adminPanel.nav.notifications")}>
      <AdminNotificationPanel />
    </AdminLayout>
  );
};

export default AdminNotificationsPage;
