import React from "react";
import AdminNotificationPanel from "@/components/admin/AdminNotificationPanel";

const AgentNotificationsPage: React.FC = () => {
  return (
    <section className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[var(--b1)]">
          Notifications
        </h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Alerts related to leads, visits, and assigned activity.
        </p>
      </div>
      <AdminNotificationPanel />
    </section>
  );
};

export default AgentNotificationsPage;
