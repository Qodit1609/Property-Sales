import React from "react";
import { useTranslation } from "react-i18next";
import {
  Building2,
  ShieldCheck,
  Clock,
  XCircle,
  Users,
  UserRound,
  Store,
  UserCog,
} from "lucide-react";

import type { Property } from "../../features/properties/propertyType";
import type { ManagedAccount } from "../../features/auth/roleTypes";

interface AdminStatsProps {
  accounts: ManagedAccount[];
  listings: Property[];
  onCardClick?: (section: "listings" | "users", statId: string) => void;
}

type Tone = "emerald" | "sky" | "amber" | "rose" | "slate";

interface StatItem {
  id: string;
  labelKey: string;
  value: number;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  tone: Tone;
}

interface StatSection {
  id: "listings" | "users";
  titleKey: string;
  descriptionKey: string;
  items: StatItem[];
}

const AdminStats: React.FC<AdminStatsProps> = ({
  accounts,
  listings,
  onCardClick,
}) => {
  const { t } = useTranslation();
  const totalAccounts = accounts.length;
  const buyers = accounts.filter((u) => u.role === "buyer").length;
  const sellers = accounts.filter((u) => u.role === "seller").length;
  const agents = accounts.filter((u) => u.role === "agent").length;

  const totalListings = listings.length;
  const approvedListings = listings.filter((l) => l.status === "approved")
    .length;
  const pendingListings = listings.filter((l) => l.status === "pending").length;
  const rejectedListings = listings.filter((l) => l.status === "rejected")
    .length;

  const sections: StatSection[] = [
    {
      id: "listings",
      titleKey: "adminPanel.dashboard.stats.listingsTitle",
      descriptionKey: "adminPanel.dashboard.stats.listingsDescription",
      items: [
        {
          id: "totalProperties",
          labelKey: "adminPanel.dashboard.stats.totalProperties",
          value: totalListings,
          icon: Building2,
          tone: "emerald",
        },
        {
          id: "approved",
          labelKey: "adminPanel.dashboard.stats.approved",
          value: approvedListings,
          icon: ShieldCheck,
          tone: "sky",
        },
        {
          id: "pendingReview",
          labelKey: "adminPanel.dashboard.stats.pendingReview",
          value: pendingListings,
          icon: Clock,
          tone: "amber",
        },
        {
          id: "rejected",
          labelKey: "adminPanel.dashboard.stats.rejected",
          value: rejectedListings,
          icon: XCircle,
          tone: "rose",
        },
      ],
    },
    {
      id: "users",
      titleKey: "adminPanel.dashboard.stats.usersTitle",
      descriptionKey: "adminPanel.dashboard.stats.usersDescription",
      items: [
        {
          id: "totalAccounts",
          labelKey: "adminPanel.dashboard.stats.totalAccounts",
          value: totalAccounts,
          icon: Users,
          tone: "slate",
        },
        {
          id: "buyers",
          labelKey: "adminPanel.dashboard.stats.buyers",
          value: buyers,
          icon: UserRound,
          tone: "emerald",
        },
        {
          id: "sellers",
          labelKey: "adminPanel.dashboard.stats.sellers",
          value: sellers,
          icon: Store,
          tone: "sky",
        },
        {
          id: "agents",
          labelKey: "adminPanel.dashboard.stats.agents",
          value: agents,
          icon: UserCog,
          tone: "amber",
        },
      ],
    },
  ];

  const toneStyles: Record<
    Tone,
    {
      iconGradient: string;
      iconShadow: string;
      glow: string;
    }
  > = {
    emerald: {
      iconGradient: "from-emerald-500 to-emerald-600",
      iconShadow: "shadow-emerald-500/30",
      glow: "from-emerald-400/20",
    },
    sky: {
      iconGradient: "from-sky-500 to-blue-600",
      iconShadow: "shadow-sky-500/30",
      glow: "from-sky-400/20",
    },
    amber: {
      iconGradient: "from-amber-500 to-orange-500",
      iconShadow: "shadow-amber-500/30",
      glow: "from-amber-400/20",
    },
    rose: {
      iconGradient: "from-rose-500 to-rose-600",
      iconShadow: "shadow-rose-500/30",
      glow: "from-rose-400/20",
    },
    slate: {
      iconGradient: "from-slate-500 to-slate-700",
      iconShadow: "shadow-slate-500/25",
      glow: "from-slate-400/15",
    },
  };

  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <section key={section.id} className="space-y-4">
          <div className="border-b border-[var(--b2)]/40 pb-3">
            <h2 className="text-sm font-semibold tracking-tight text-[var(--b1)]">
              {t(section.titleKey)}
            </h2>
            <p className="mt-0.5 text-xs text-[var(--muted)]">{t(section.descriptionKey)}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {section.items.map((card) => {
              const Icon = card.icon;
              const toneStyle = toneStyles[card.tone];

              return (
                <article
                  key={card.id}
                  onClick={() => onCardClick?.(section.id, card.id)}
                  className="group relative overflow-hidden rounded-2xl border border-[var(--b2)]/50 bg-[var(--white)] p-5 shadow-[0_2px_12px_rgba(27,67,50,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--b2)] hover:shadow-[0_12px_28px_rgba(27,67,50,0.12)]"
                >
                  <div
                    className={`pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-br ${toneStyle.glow} to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100`}
                    aria-hidden
                  />

                  <div className="relative flex gap-4">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${toneStyle.iconGradient} text-white shadow-lg ${toneStyle.iconShadow}`}
                    >
                      <Icon className="h-7 w-7" aria-hidden />
                    </div>

                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                        {t(card.labelKey)}
                      </p>
                      <p className="mt-1.5 text-3xl font-bold tabular-nums tracking-tight text-[var(--b1)]">
                        {card.value}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};

export default AdminStats;
