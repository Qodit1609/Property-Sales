import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslation } from "react-i18next";
import type { Property } from "../../features/properties/propertyType";
import { SELLER_CHART_WEEKS } from "./sellerNav";

type Point = { label: string; views: number; leads: number };

function buildTrendData(listings: Property[], weeks: number): Point[] {
  const baseViews = listings.reduce((s, p) => s + (p.analytics?.views ?? 0), 0);
  const baseLeads = listings.reduce((s, p) => s + (p.analytics?.contactClicks ?? 0), 0);
  const v = Math.max(1, baseViews);
  const l = Math.max(1, baseLeads);

  return Array.from({ length: weeks }, (_, i) => {
    const t = i / Math.max(1, weeks - 1);
    const wave = 0.85 + 0.15 * Math.sin((i + 1) * 0.9);
    return {
      label: `W${i + 1}`,
      views: Math.max(0, Math.round((v / weeks) * wave * (0.7 + t * 0.35))),
      leads: Math.max(0, Math.round((l / weeks) * wave * (0.65 + t * 0.4))),
    };
  });
}

type SellerChartsProps = {
  listings: Property[];
};

function SellerChartsComponent({ listings }: SellerChartsProps) {
  const { t } = useTranslation();
  const data = useMemo(() => buildTrendData(listings, SELLER_CHART_WEEKS), [listings]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] p-5 shadow-sm"
      >
        <div className="mb-4 flex flex-col gap-1">
          <h3 className="text-base font-semibold text-[var(--b1)]">{t("sellerPanel.charts.viewsTitle")}</h3>
          <p className="text-xs text-[var(--muted)]">{t("sellerPanel.charts.viewsSub")}</p>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="sellerViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--b1-mid)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--b2)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--b2)" opacity={0.45} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--b2)",
                  fontSize: 12,
                }}
                labelStyle={{ color: "var(--b1)" }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="var(--b1-mid)"
                strokeWidth={2}
                fill="url(#sellerViews)"
                isAnimationActive
                animationDuration={600}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
        className="rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] p-5 shadow-sm"
      >
        <div className="mb-4 flex flex-col gap-1">
          <h3 className="text-base font-semibold text-[var(--b1)]">{t("sellerPanel.charts.leadsTitle")}</h3>
          <p className="text-xs text-[var(--muted)]">{t("sellerPanel.charts.leadsSub")}</p>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="sellerLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.32} />
                  <stop offset="100%" stopColor="#bae6fd" stopOpacity={0.06} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--b2)" opacity={0.45} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--b2)",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="leads"
                stroke="#0284c7"
                strokeWidth={2}
                fill="url(#sellerLeads)"
                isAnimationActive
                animationDuration={600}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}

export const SellerCharts = memo(SellerChartsComponent);
