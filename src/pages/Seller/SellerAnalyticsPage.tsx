import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Building2, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import type { RootState } from "../../app/store";
import { fetchMyListings } from "../../features/seller/sellerSlice";
import type { Property } from "../../features/properties/propertyType";
import { useSellerAggregates } from "../../hooks/useSellerAggregates";
import { SellerChartSkeleton } from "@/components/seller/SellerSkeleton";

const COLORS = ["#2D6A4F", "#40916C", "#52B788", "#74C69D", "#95D5B2"];

function topListings(listings: Property[], n: number) {
  return [...listings]
    .sort((a, b) => (b.analytics?.views ?? 0) - (a.analytics?.views ?? 0))
    .slice(0, n)
    .map((p) => ({
      name: (p.title ?? "Listing").slice(0, 22),
      views: p.analytics?.views ?? 0,
      leads: p.analytics?.contactClicks ?? 0,
    }));
}

function locationBuckets(listings: Property[]) {
  const map = new Map<string, number>();
  for (const p of listings) {
    const key = p.location?.city?.trim() || p.location?.state?.trim() || "Other";
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));
}

const SellerAnalyticsPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { listings, loading } = useAppSelector((s: RootState) => s.seller);
  const stats = useSellerAggregates(listings as Property[]);

  useEffect(() => {
    dispatch(fetchMyListings());
  }, [dispatch]);

  const conversion = useMemo(() => {
    if (stats.totalViews <= 0) return 0;
    return Math.min(100, Math.round((stats.totalLeads / stats.totalViews) * 100));
  }, [stats.totalLeads, stats.totalViews]);

  const ratio = useMemo(() => {
    if (stats.totalViews <= 0) return "—";
    return `${(stats.totalLeads / stats.totalViews).toFixed(2)} : 1`;
  }, [stats.totalLeads, stats.totalViews]);

  const top = useMemo(() => topListings(listings as Property[], 5), [listings]);
  const loc = useMemo(() => locationBuckets(listings as Property[]), [listings]);

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-[var(--b1)] sm:text-2xl">{t("sellerPanel.analytics.title")}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{t("sellerPanel.analytics.sub")}</p>
      </div>

      {loading ? (
        <SellerChartSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] p-5 shadow-sm"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                {t("sellerPanel.analytics.statConversion")}
              </p>
              <p className="mt-2 text-3xl font-semibold tabular-nums text-[var(--b1)]">{conversion}%</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 }}
              className="rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] p-5 shadow-sm"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                {t("sellerPanel.analytics.statRatio")}
              </p>
              <p className="mt-2 text-3xl font-semibold tabular-nums text-[var(--b1)]">{ratio}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] p-5 shadow-sm"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                {t("sellerPanel.analytics.statViews")}
              </p>
              <p className="mt-2 text-3xl font-semibold tabular-nums text-[var(--b1)]">
                {stats.totalViews.toLocaleString("en-IN")}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] p-5 shadow-sm"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                {t("sellerPanel.analytics.statLeads")}
              </p>
              <p className="mt-2 text-3xl font-semibold tabular-nums text-[var(--b1)]">
                {stats.totalLeads.toLocaleString("en-IN")}
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] p-5 shadow-sm"
            >
              <h3 className="text-base font-semibold text-[var(--b1)]">{t("sellerPanel.analytics.topTitle")}</h3>
              <p className="text-xs text-[var(--muted)]">{t("sellerPanel.analytics.topSub")}</p>
              <div className="mt-4 h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={top} layout="vertical" margin={{ left: 8, right: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--b2)" opacity={0.45} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted)" }} />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fill: "var(--muted)" }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid var(--b2)", fontSize: 12 }}
                    />
                    <Bar dataKey="views" name={t("sellerPanel.table.views")} radius={[0, 6, 6, 0]}>
                      {top.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] p-5 shadow-sm"
            >
              <h3 className="flex items-center gap-2 text-base font-semibold text-[var(--b1)]">
                <MapPin className="h-5 w-5 text-[var(--b1-mid)]" />
                {t("sellerPanel.analytics.locationsTitle")}
              </h3>
              <p className="text-xs text-[var(--muted)]">{t("sellerPanel.analytics.locationsSub")}</p>
              <ul className="mt-4 space-y-3">
                {loc.length === 0 ? (
                  <li className="text-sm text-[var(--muted)]">{t("sellerPanel.analytics.noData")}</li>
                ) : (
                  loc.map((row, i) => (
                    <li key={row.name} className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--b2-soft)] text-xs font-bold text-[var(--b1)]">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[var(--b1)]">{row.name}</p>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--b2-soft)]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (row.value / Math.max(...loc.map((l) => l.value))) * 100)}%` }}
                            className="h-full rounded-full bg-[var(--b1-mid)]"
                          />
                        </div>
                      </div>
                      <span className="text-sm font-semibold tabular-nums text-[var(--b1)]">{row.value}</span>
                    </li>
                  ))
                )}
              </ul>
            </motion.div>
          </div>

          <div className="rounded-2xl border border-dashed border-[var(--b2)] bg-[var(--b2-soft)]/40 px-4 py-3 text-sm text-[var(--muted)]">
            <Building2 className="mb-1 inline h-4 w-4 text-[var(--b1-mid)]" /> {t("sellerPanel.analytics.footer")}
          </div>
        </>
      )}
    </section>
  );
};

export default SellerAnalyticsPage;
