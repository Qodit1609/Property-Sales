import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { twMerge } from "tailwind-merge";

export type DashboardPageTopBarProps = {
  title: string;
  subtitle: string;
  icon?: LucideIcon;
  rightSlot?: ReactNode;
  className?: string;
};

/**
 * White overview strip aligned with the seller dashboard header (grid icon, serif title, bell slot).
 */
export function DashboardPageTopBar({
  title,
  subtitle,
  icon: Icon = LayoutDashboard,
  rightSlot,
  className,
}: DashboardPageTopBarProps) {
  return (
    <div
      className={twMerge(
        "relative overflow-hidden rounded-2xl border border-[var(--b2)]/90 bg-[var(--white)] p-5 shadow-sm sm:p-6",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[var(--b2)]/20 blur-3xl"
        aria-hidden
      />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--b2)]/80 bg-[var(--white)] text-[var(--b1)] shadow-sm sm:h-12 sm:w-12">
            <Icon className="h-5 w-5 text-[var(--b1-mid)] sm:h-6 sm:w-6" strokeWidth={1.75} aria-hidden />
          </span>
          <div className="min-w-0">
            <h1 className="font-serif text-xl font-semibold leading-tight text-[var(--b1)] sm:text-2xl">
              {title}
            </h1>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[var(--muted)]">{subtitle}</p>
          </div>
        </div>
        {rightSlot ? (
          <div className="flex w-full shrink-0 justify-end self-start sm:w-auto">{rightSlot}</div>
        ) : null}
      </div>
    </div>
  );
}
