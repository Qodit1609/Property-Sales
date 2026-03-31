import React from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminNotificationPanel from "../../components/admin/AdminNotificationPanel";

const AdminNotificationsPage: React.FC = () => {
  return (
    <AdminLayout title="Notifications">
      <AdminNotificationPanel />
    </AdminLayout>
  );
};

export default AdminNotificationsPage;
