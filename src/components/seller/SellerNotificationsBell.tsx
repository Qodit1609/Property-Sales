import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { cn } from "./sellerUtils";
import { useAppSelector } from "../../hooks/reduxHooks";

type SellerNotificationsBellProps = {
  /** Use `left` when the panel should align to the button's left edge; otherwise it aligns to the right. */
  dropdownAlign?: "left" | "right";
};

export function SellerNotificationsBell({ dropdownAlign = "right" }: SellerNotificationsBellProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const unread = useAppSelector((state) => state.notifications.unreadCount);

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
