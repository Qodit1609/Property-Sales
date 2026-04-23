import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "./sellerUtils";

export type SellerStatItem = {
  key: string;
  label: string;
  value: number;
  icon: LucideIcon;
  accent: "neutral" | "success" | "warning" | "danger" | "info";
  to?: string;
};

const accentMap: Record<SellerStatItem["accent"], string> = {
  neutral:
    "border-[var(--b2)]/90 bg-gradient-to-br from-[var(--white)] via-[var(--white)] to-[var(--b2-soft)]/55",
  success:
    "border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 via-[var(--white)] to-[var(--white)]",
  warning:
    "border-amber-200/80 bg-gradient-to-br from-amber-50/90 via-[var(--white)] to-[var(--white)]",
  danger:
    "border-red-200/80 bg-gradient-to-br from-red-50/90 via-[var(--white)] to-[var(--white)]",
  info: "border-sky-200/80 bg-gradient-to-br from-sky-50/90 via-[var(--white)] to-[var(--white)]",
};

const iconAccentMap: Record<SellerStatItem["accent"], string> = {
  neutral: "bg-[var(--b2-soft)] text-[var(--b1)] ring-[var(--b2)]/50",
  success: "bg-emerald-100/90 text-emerald-900 ring-emerald-200/60",
  warning: "bg-amber-100/90 text-amber-900 ring-amber-200/60",
  danger: "bg-red-100/90 text-red-800 ring-red-200/60",
  info: "bg-sky-100/90 text-sky-900 ring-sky-200/60",
};

type SellerStatsProps = {
  items: SellerStatItem[];
  loading?: boolean;
};

function SellerStatsComponent({ items, loading }: SellerStatsProps) {
  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6"
      role="list"
      aria-label="Seller statistics"
    >
      {items.map((card, index) => {
        const Icon = card.icon;
        const cardBody = (
          <motion.article
            key={card.key}
            role="listitem"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: index * 0.04 }}
            whileHover={{ y: -2, transition: { duration: 0.18 } }}
            className={cn(
              "group min-h-[108px] rounded-2xl border p-4 shadow-sm ring-1 ring-black/[0.02] transition-shadow sm:p-5",
              card.to ? "cursor-pointer hover:shadow-md" : "",
              accentMap[card.accent]
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-sans text-xs font-medium leading-snug tracking-wide text-[var(--muted)]">
                  {card.label}
                </p>
                <p className="mt-2 font-serif text-3xl font-semibold tabular-nums tracking-tight text-[var(--b1)]">
                  {loading ? "—" : card.value.toLocaleString("en-IN")}
                </p>
              </div>
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-inner ring-1 transition group-hover:scale-[1.03]",
                  iconAccentMap[card.accent]
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </span>
            </div>
          </motion.article>
        );

        if (!card.to) return cardBody;
        return (
          <Link key={card.key} to={card.to} className="block focus-visible:outline-none">
            {cardBody}
          </Link>
        );
      })}
    </div>
  );
}

export const SellerStats = memo(SellerStatsComponent);
