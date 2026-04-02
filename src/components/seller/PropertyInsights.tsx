import { memo, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Eye, Heart, MessageCircle, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PropertyInsightItem } from "./PropertyInsightItem";
import type { PropertyInsightBadgeTone } from "./PropertyInsightItem";

/** Shape prepared for future listing-level or portfolio analytics API responses. */
export type PropertyInsightsAnalytics = {
  views: number;
  inquiries: number;
  saved: number;
};

const MOCK_ANALYTICS: PropertyInsightsAnalytics = {
  views: 142,
  inquiries: 12,
  saved: 28,
};

function popularityLevel(views: number): "High" | "Medium" | "Low" {
  if (views > 150) return "High";
  if (views > 50) return "Medium";
  return "Low";
}

function popularityTone(level: "High" | "Medium" | "Low"): PropertyInsightBadgeTone {
  if (level === "High") return "high";
  if (level === "Medium") return "medium";
  return "low";
}

function PropertyInsightsComponent() {
  const { t } = useTranslation();
  const [analytics] = useState<PropertyInsightsAnalytics>(() => ({ ...MOCK_ANALYTICS }));

  const level = useMemo(() => popularityLevel(analytics.views), [analytics.views]);
  const tone = useMemo(() => popularityTone(level), [level]);

  const popularityLabel = useMemo(() => {
    if (level === "High") return t("sellerPanel.propertyInsights.popularityHigh");
    if (level === "Medium") return t("sellerPanel.propertyInsights.popularityMedium");
    return t("sellerPanel.propertyInsights.popularityLow");
  }, [level, t]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] shadow-sm"
    >
      <div className="flex items-center justify-between gap-3 border-b border-[var(--b2)]/80 px-5 py-4">
        <div>
          <h3 className="text-base font-semibold text-[var(--b1)]">{t("sellerPanel.propertyInsights.title")}</h3>
          <p className="text-xs text-[var(--muted)]">{t("sellerPanel.propertyInsights.sub")}</p>
        </div>
        <Link
          to="/seller/analytics"
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-[var(--b1-mid)] transition hover:bg-[var(--b2-soft)]"
        >
          {t("sellerPanel.propertyInsights.cta")}
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
        <PropertyInsightItem
          label={t("sellerPanel.propertyInsights.views")}
          icon={Eye}
          value={analytics.views.toLocaleString("en-IN")}
        />
        <PropertyInsightItem
          label={t("sellerPanel.propertyInsights.inquiries")}
          icon={MessageCircle}
          value={analytics.inquiries.toLocaleString("en-IN")}
        />
        <PropertyInsightItem
          label={t("sellerPanel.propertyInsights.saved")}
          icon={Heart}
          value={analytics.saved.toLocaleString("en-IN")}
        />
        <PropertyInsightItem
          label={t("sellerPanel.propertyInsights.popularity")}
          icon={TrendingUp}
          value={popularityLabel}
          asBadge
          badgeTone={tone}
        />
      </div>
    </motion.div>
  );
}

export const PropertyInsights = memo(PropertyInsightsComponent);
