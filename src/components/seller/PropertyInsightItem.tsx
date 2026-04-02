import { memo } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "./sellerUtils";

export type PropertyInsightBadgeTone = "high" | "medium" | "low";

export type PropertyInsightItemProps = {
  label: string;
  icon: LucideIcon;
  value: string | number;
  asBadge?: boolean;
  badgeTone?: PropertyInsightBadgeTone;
};

function toneClass(tone: PropertyInsightBadgeTone) {
  if (tone === "high") return "border-[var(--success)]/30 bg-[var(--success-bg)] text-[var(--success)]";
  if (tone === "medium") return "border-[var(--warning)]/30 bg-[var(--warning-bg)] text-[var(--warning)]";
  return "border-[var(--b2)] bg-[var(--b2-soft)] text-[var(--b1-mid)]";
}

function PropertyInsightItemComponent({ label, icon: Icon, value, asBadge, badgeTone = "low" }: PropertyInsightItemProps) {
  return (
    <div className="rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] p-5 shadow-sm transition hover:shadow-md">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-2">
        {asBadge ? (
          <span
            className={cn(
              "inline-flex max-w-full items-center rounded-lg border px-3 py-1.5 text-sm font-semibold tabular-nums",
              toneClass(badgeTone)
            )}
          >
            {value}
          </span>
        ) : (
          <p className="text-2xl font-semibold tabular-nums text-[var(--b1)] sm:text-3xl">{value}</p>
        )}
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--b2-soft)] text-[var(--b1-mid)]">
          <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </span>
      </div>
    </div>
  );
}

export const PropertyInsightItem = memo(PropertyInsightItemComponent);
