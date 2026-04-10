import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";

const SellerNotificationsPage = () => {
  const { t } = useTranslation();

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] px-4 py-4 shadow-sm sm:px-5 sm:py-5">
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
      </div>

      <div className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-3 shadow-sm sm:p-4">
        <div className="rounded-xl border border-dashed border-[var(--b2)] bg-[var(--b2-soft)] px-4 py-10 text-center sm:px-6 sm:py-12">
          <p className="text-sm font-medium text-[var(--b1)] sm:text-base">
            {t("sellerPanel.notifications.emptyTitle")}
          </p>
          <p className="mx-auto mt-1 max-w-xl text-[11px] text-[var(--muted)] sm:text-xs">
            {t("sellerPanel.notifications.emptySub")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default SellerNotificationsPage;
