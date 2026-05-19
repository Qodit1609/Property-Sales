import React from "react";
import { useTranslation } from "react-i18next";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  clearReadNotifications,
  markNotificationRead,
} from "../../features/notifications/notificationSlice";
import { Button } from "@/components/common";
import {
  translateAdminNotificationMessage,
  translateAdminNotificationTitle,
} from "@/lib/adminI18n";

const AdminNotificationPanel: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notifications = useAppSelector((state) => state.notifications.items);
  const user = useAppSelector((state) => state.auth.user);
  const userId = String(user?.id ?? user?._id ?? "");
  const hasReadNotifications = notifications.some((n) => n.isRead);

  const handleNotificationClick = (notification: {
    id: string;
    title: string;
    message: string;
    type?: string;
  }) => {
    dispatch(markNotificationRead(notification.id));

    const normalizedType = (notification.type ?? "").trim().toLowerCase();
    const normalizedTitle = notification.title.trim().toLowerCase();
    const normalizedMessage = notification.message.trim().toLowerCase();

    if (
      normalizedType === "approval" ||
      normalizedType === "property" ||
      normalizedTitle.includes("new property submitted") ||
      normalizedTitle.includes("property approved")
    ) {
      navigate("/admin/properties");
      return;
    }

    if (
      normalizedType === "testimonial" ||
      normalizedTitle.includes("new testimonial submitted")
    ) {
      navigate("/admin/testimonial");
      return;
    }

    if (
      normalizedType === "promotion_request" ||
      normalizedTitle.includes("new promotion request")
    ) {
      navigate("/admin/promotions");
      return;
    }

    if (
      normalizedType === "cart" ||
      normalizedTitle.includes("property added to cart") ||
      normalizedMessage.includes("added") && normalizedMessage.includes("to cart")
    ) {
      navigate("/admin/activity-logs");
    }
  };

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--b2-soft)] text-[var(--b1-mid)]">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--b1)]">
              {t("adminPanel.notificationsPanel.heading")}
            </h2>
            <p className="text-[11px] text-[var(--muted)]">
              {t("adminPanel.notificationsPanel.subtitle")}
            </p>
          </div>
        </div>
        {hasReadNotifications && userId ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => dispatch(clearReadNotifications(userId))}
            className="shrink-0 text-xs"
          >
            {t("common.clearAll")}
          </Button>
        ) : null}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--b2)] bg-[var(--b2-soft)] px-6 py-10 text-center">
          <p className="text-sm font-medium text-[var(--b1)]">
            {t("adminPanel.notificationsPanel.emptyTitle")}
          </p>
          <p className="mt-1 text-[11px] text-[var(--muted)]">
            {t("adminPanel.notificationsPanel.emptySub")}
          </p>
        </div>
      ) : (
        <div className="mt-1 space-y-2 text-xs text-[var(--b1)]">
          {notifications.map((n) => (
            <Button
              key={n.id}
              type="button"
              onClick={() =>
                handleNotificationClick({
                  id: n.id,
                  title: n.title,
                  message: n.message,
                  type: n.type,
                })
              }
              variant="ghost"
              className={[
                "w-full items-start gap-3 rounded-xl border px-3 py-2 text-left",
                n.isRead
                  ? "border-[var(--b2-soft)] bg-[var(--b2-soft)]"
                  : "border-[var(--b2)] bg-[var(--white)] shadow-sm",
              ].join(" ")}
            >
              <span
                className={[
                  "mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full",
                  n.isRead ? "bg-[var(--b2)]" : "bg-amber-400",
                ].join(" ")}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-[var(--b1)]">
                  {translateAdminNotificationTitle(n.title)}
                </p>
                <p className="mt-0.5 text-[11px] text-[var(--muted)]">
                  {translateAdminNotificationMessage(n.message)}
                </p>
                <p className="mt-0.5 text-[10px] text-[var(--muted)]/80">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNotificationPanel;
