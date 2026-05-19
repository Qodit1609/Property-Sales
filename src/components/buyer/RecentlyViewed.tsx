import React from "react";
import { useTranslation } from "react-i18next";
import { Clock3 } from "lucide-react";
import { useAppSelector } from "../../hooks/reduxHooks";
import { useBuyerResolvedProperties } from "../../hooks/useBuyerResolvedProperties";
import PropertyCard from "../Cards/PropertyCard";

interface Props {
  title?: string;
  className?: string;
}

const RecentlyViewed: React.FC<Props> = ({ title, className = "" }) => {
  const { t } = useTranslation();
  const resolvedTitle = title ?? t("buyerPanel.recentlyViewed.title");
  const recentIds = useAppSelector((s) => s.buyer.recentIds);
  const { properties, loading } = useBuyerResolvedProperties(recentIds);

  if (recentIds.length === 0) {
    return (
      <section
        className={`rounded-2xl border border-dashed border-[var(--b2)] bg-[var(--white)]/80 px-4 py-8 text-center ${className}`}
      >
        <Clock3 className="mx-auto mb-2 h-8 w-8 text-[var(--b2)]" />
        <p className="text-sm font-medium text-[var(--b1)]">
          {t("buyerPanel.recentlyViewed.emptyTitle")}
        </p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          {t("buyerPanel.recentlyViewed.emptyBody")}
        </p>
      </section>
    );
  }

  return (
    <section className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-[var(--b1)]">{resolvedTitle}</h2>
        {loading && (
          <span className="text-[10px] text-[var(--muted)]">
            {t("buyerPanel.recentlyViewed.updating")}
          </span>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {properties.map((p) => (
          <PropertyCard key={p._id} property={p} />
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
