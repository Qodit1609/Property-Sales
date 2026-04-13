import React from "react";
import { Bell } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { markNotificationRead } from "../../features/notifications/notificationSlice";
import { Button } from "@/components/common";

const NotificationPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notifications.items);

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--b2-soft)] text-[var(--b1-mid)]">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--b1)]">
              Buyer notifications
            </h2>
            <p className="text-[11px] text-[var(--muted)]">
              Price drops, new launches and seller responses.
            </p>
          </div>
        </div>

      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--b2)] bg-[var(--b2-soft)] px-6 py-10 text-center">
          <p className="text-sm font-medium text-[var(--b1)]">
            You’re all caught up
          </p>
          <p className="mt-1 text-[11px] text-[var(--muted)]">
            Alerts for price drops, new matching listings and seller replies
            will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-1 space-y-2 text-xs text-[var(--b1)]">
          {notifications.map((n) => (
            <Button
              key={n.id}
              type="button"
              onClick={() => dispatch(markNotificationRead(n.id))}
              variant="ghost"
              className={[
                "w-full items-start gap-3 rounded-xl border px-3 py-2 text-left",
                n.isRead
                  ? "border-[var(--b2-soft)] bg-[var(--b2-soft)]"
                  : "border-[var(--b2)] bg-[var(--white)] shadow-sm",
              ].join(" ")}
            >
              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
              <div className="flex-1">
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
  );
};

export default NotificationPanel;