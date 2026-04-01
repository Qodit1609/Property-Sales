import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "./sellerUtils";

type SellerEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function SellerEmptyState({ icon: Icon, title, description, action, className }: SellerEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-dashed border-[var(--b2)]/90 bg-gradient-to-b from-[var(--white)] via-[var(--b2-soft)]/25 to-[var(--b2-soft)]/50 px-5 py-12 text-center shadow-sm sm:px-8 sm:py-16",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -left-16 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-[var(--b2)]/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[var(--b1-mid)]/15 blur-2xl"
        aria-hidden
      />
      <div className="relative">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--white)]/95 text-[var(--b1)] shadow-md ring-1 ring-[var(--b2)]/70">
          <Icon className="h-8 w-8 text-[var(--b1-mid)]" strokeWidth={1.35} aria-hidden />
        </span>
        <h2 className="mt-5 font-serif text-xl font-semibold tracking-tight text-[var(--b1)] sm:text-2xl">{title}</h2>
        <p className="mx-auto mt-2 max-w-md font-sans text-sm leading-relaxed text-[var(--muted)] sm:text-[0.9375rem]">
          {description}
        </p>
        {action ? <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">{action}</div> : null}
      </div>
    </motion.div>
  );
}
