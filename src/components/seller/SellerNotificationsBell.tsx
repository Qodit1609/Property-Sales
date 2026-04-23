import { Bell } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { cn } from "./sellerUtils";
import { useAppSelector } from "../../hooks/reduxHooks";
import type { AppNotification } from "../../features/notifications/notificationTypes";

type SellerNotificationsBellProps = {
  /** Use `left` when the panel should align to the button's left edge; otherwise it aligns to the right. */
  dropdownAlign?: "left" | "right";
};

export function SellerNotificationsBell({ dropdownAlign = "right" }: SellerNotificationsBellProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const notifications = useAppSelector((state) => state.notifications.items);
  const user = useAppSelector((state) => state.auth.user);
  const userId = String(user?.id ?? user?._id ?? "");
  const settingsKey = useMemo(() => `sellerNotificationSettings:${userId || "guest"}`, [userId]);
  const [mutedSettings, setMutedSettings] = useState<{ leadAlerts: boolean; listingAlerts: boolean }>({
    leadAlerts: false,
    listingAlerts: false,
  });

  useEffect(() => {
    const readSettings = () => {
      try {
        const raw = localStorage.getItem(settingsKey);
        if (!raw) {
          setMutedSettings({ leadAlerts: false, listingAlerts: false });
          return;
        }
        const parsed = JSON.parse(raw) as Partial<{ leadAlerts: boolean; listingAlerts: boolean }>;
        setMutedSettings({
          leadAlerts: !!parsed.leadAlerts,
          listingAlerts: !!parsed.listingAlerts,
        });
      } catch {
        setMutedSettings({ leadAlerts: false, listingAlerts: false });
      }
    };

    readSettings();
    window.addEventListener("seller-notification-settings-changed", readSettings);
    window.addEventListener("storage", readSettings);
    return () => {
      window.removeEventListener("seller-notification-settings-changed", readSettings);
      window.removeEventListener("storage", readSettings);
    };
  }, [settingsKey]);

  const unread = useMemo(() => {
    const isLeadNotification = (notification: AppNotification) => {
      const content = `${notification.title} ${notification.message}`.toLowerCase();
      return notification.type === "property" || content.includes("lead");
    };

    const isListingNotification = (notification: AppNotification) => {
      const content = `${notification.title} ${notification.message}`.toLowerCase();
      return (
        notification.type === "approval" ||
        notification.type === "rejection" ||
        content.includes("listing") ||
        content.includes("update required")
      );
    };

    return notifications.filter((notification) => {
      if (notification.isRead) return false;
      if (mutedSettings.leadAlerts && isLeadNotification(notification)) return false;
      if (mutedSettings.listingAlerts && isListingNotification(notification)) return false;
      return true;
    }).length;
  }, [mutedSettings.leadAlerts, mutedSettings.listingAlerts, notifications]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => navigate("/seller/notifications")}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--b2)]/80 bg-[var(--white)] text-[var(--b1)] shadow-sm transition hover:bg-[var(--b2-soft)] hover:shadow-md"
        )}
        aria-haspopup="false"
        aria-label={t("sellerPanel.notifications.aria")}
      >
        <Bell className="h-5 w-5" strokeWidth={1.75} />
        {unread > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--b1)] px-1 text-[10px] font-semibold text-[var(--fg)]">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>
    </div>
  );
}
