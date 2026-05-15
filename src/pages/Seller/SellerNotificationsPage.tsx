import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  clearReadNotifications,
  markNotificationRead,
} from "../../features/notifications/notificationSlice";
import { Button } from "@/components/common";

const SellerNotificationsPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notifications = useAppSelector((state) => state.notifications.items);
  const user = useAppSelector((state) => state.auth.user);
  const userId = String(user?.id ?? user?._id ?? "");
  const hasReadNotifications = notifications.some((n) => n.isRead);

  const navigatesToMyProperties = (notificationTitle: string) => {
    const normalizedTitle = notificationTitle.trim().toLowerCase();
    return (
      normalizedTitle === "property approved" || normalizedTitle === "property rejected"
    );
  };

  const handleNotificationClick = (notificationId: string, notificationTitle: string) => {
    dispatch(markNotificationRead(notificationId));

    const normalizedTitle = notificationTitle.trim().toLowerCase();
    if (normalizedTitle === "property approved" || normalizedTitle === "property rejected") {
      navigate("/seller/properties");
      return;
    }

    if (normalizedTitle === "promotion approved") {
      navigate("/seller/promotions");
      return;
    }

    if (normalizedTitle === "property added to cart") {
      navigate("/seller/leads");
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] px-4 py-4 shadow-sm sm:px-5 sm:py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--b2)]/80 bg-[var(--b2-soft)] text-[var(--b1-mid)]">
              <Bell className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold text-[var(--b1)] sm:text-xl">
                {t("sellerPanel.notifications.pageTitle")}
              </h1>
              <p className="mt-0.5 text-xs text-[var(--muted)] sm:text-sm">
                {t("sellerPanel.notifications.pageSub")}
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
              Clear all
            </Button>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-3 shadow-sm sm:p-4">
        {notifications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--b2)] bg-[var(--b2-soft)] px-4 py-10 text-center sm:px-6 sm:py-12">
            <p className="text-sm font-medium text-[var(--b1)] sm:text-base">
              {t("sellerPanel.notifications.emptyTitle")}
            </p>
            <p className="mx-auto mt-1 max-w-xl text-[11px] text-[var(--muted)] sm:text-xs">
              {t("sellerPanel.notifications.emptySub")}
            </p>
          </div>
        ) : (
          <div className="space-y-2 text-xs text-[var(--b1)]">
            {notifications.map((n) => (
              <Button
                key={n.id}
                type="button"
                onClick={() => handleNotificationClick(n.id, n.title)}
                variant="ghost"
                className={[
                  "w-full items-start gap-3 rounded-xl border px-3 py-2 text-left",
                  navigatesToMyProperties(n.title) ? "cursor-pointer" : "cursor-default",
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
                    {n.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[var(--muted)]">
                    {n.message}
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
    </section>
  );
};

export default SellerNotificationsPage;
