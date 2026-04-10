import { useMemo } from "react";
import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { cn } from "./sellerUtils";

type Item = { id: string; titleKey: string; descKey: string; time: string; unread?: boolean };

const MOCK_ITEMS: Item[] = [
  { id: "1", titleKey: "sellerPanel.notifications.approvedTitle", descKey: "sellerPanel.notifications.approvedDesc", time: "2h", unread: true },
  { id: "2", titleKey: "sellerPanel.notifications.leadTitle", descKey: "sellerPanel.notifications.leadDesc", time: "1d", unread: true },
  { id: "3", titleKey: "sellerPanel.notifications.rejectedTitle", descKey: "sellerPanel.notifications.rejectedDesc", time: "3d", unread: false },
];

type SellerNotificationsBellProps = {
  /** Use `left` when the panel should align to the button's left edge; otherwise it aligns to the right. */
  dropdownAlign?: "left" | "right";
};

export function SellerNotificationsBell({ dropdownAlign = "right" }: SellerNotificationsBellProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const items = useMemo(
    () =>
      MOCK_ITEMS.map((row) => ({
        ...row,
        title: t(row.titleKey),
        description: t(row.descKey),
      })),
    [t]
  );

  const unread = items.filter((i) => i.unread).length;

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
