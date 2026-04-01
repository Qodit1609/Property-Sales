import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SellerNotificationsBell } from "./SellerNotificationsBell";
import { cn } from "./sellerUtils";

type SellerTopBarProps = {
  onOpenMobileNav: () => void;
  className?: string;
};

export function SellerTopBar({ onOpenMobileNav, className }: SellerTopBarProps) {
  const { t } = useTranslation();

  return (
    <header
      className={cn(
        "sticky top-[68px] z-40 flex items-center justify-between gap-3 border-b border-[var(--b2)]/70 bg-[var(--white)]/95 px-4 py-3.5 shadow-[0_1px_0_rgba(27,67,50,0.04)] backdrop-blur-md md:px-6 lg:px-8",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--b2)] bg-[var(--white)] text-[var(--b1)] shadow-sm transition hover:bg-[var(--b2-soft)] md:hidden"
          onClick={onOpenMobileNav}
          aria-label={t("sellerPanel.topbar.menu")}
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0 hidden sm:block">
          <p className="truncate text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
            {t("sellerPanel.topbar.kicker")}
          </p>
          <p className="truncate text-sm font-semibold text-[var(--b1)]">{t("sellerPanel.topbar.tagline")}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <SellerNotificationsBell />
      </div>
    </header>
  );
}
