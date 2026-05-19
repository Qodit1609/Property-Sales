import React from "react";
import { useTranslation } from "react-i18next";
import { Activity, Store, UserRound, Shield } from "lucide-react";

import type { ActivityLogStats } from "./activityLogTypes";

interface ActivityStatsProps {
  stats: ActivityLogStats;
}

const ActivityStats: React.FC<ActivityStatsProps> = ({ stats }) => {
  const { t } = useTranslation();

  const cards = [
    {
      labelKey: "adminPanel.activityLogsPage.statsTotal",
      value: stats.total,
      icon: Activity,
      tone: "slate" as const,
    },
    {
      labelKey: "adminPanel.activityLogsPage.statsSeller",
      value: stats.seller,
      icon: Store,
      tone: "sky" as const,
    },
    {
      labelKey: "adminPanel.activityLogsPage.statsBuyer",
      value: stats.buyer,
      icon: UserRound,
      tone: "emerald" as const,
    },
    {
      labelKey: "adminPanel.activityLogsPage.statsAdmin",
      value: stats.admin,
      icon: Shield,
      tone: "amber" as const,
    },
  ];

  const toneStyles = {
    slate: {
      gradient: "from-slate-500 to-slate-700",
      shadow: "shadow-slate-500/25",
      glow: "from-slate-400/15",
    },
    sky: {
      gradient: "from-sky-500 to-blue-600",
      shadow: "shadow-sky-500/30",
      glow: "from-sky-400/20",
    },
    emerald: {
      gradient: "from-emerald-500 to-emerald-600",
      shadow: "shadow-emerald-500/30",
      glow: "from-emerald-400/20",
    },
    amber: {
      gradient: "from-amber-500 to-orange-500",
      shadow: "shadow-amber-500/30",
      glow: "from-amber-400/20",
    },
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const tone = toneStyles[card.tone];
        return (
          <article
            key={card.labelKey}
            className="group relative overflow-hidden rounded-2xl border border-[var(--b2)]/50 bg-[var(--white)] p-4 shadow-[0_2px_12px_rgba(27,67,50,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--b2)] hover:shadow-[0_12px_28px_rgba(27,67,50,0.12)]"
          >
            <div
              className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${tone.glow} to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100`}
              aria-hidden
            />
            <div className="relative flex items-center gap-3">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tone.gradient} text-white shadow-lg ${tone.shadow}`}
              >
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                  {t(card.labelKey)}
                </p>
                <p className="text-2xl font-bold tabular-nums text-[var(--b1)]">{card.value}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default ActivityStats;

