import React from "react";
import { useTranslation } from "react-i18next";
import AdminNotificationPanel from "@/components/admin/AdminNotificationPanel";

const AgentNotificationsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[var(--b1)]">
          {t("agentPanel.notificationsPage.title")}
        </h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          {t("agentPanel.notificationsPage.subtitle")}
        </p>
      </div>
      <AdminNotificationPanel />
    </section>
  );
};

export default AgentNotificationsPage;
