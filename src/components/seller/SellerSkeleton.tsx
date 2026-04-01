import { motion } from "framer-motion";
import { cn } from "./sellerUtils";

export function SellerStatsSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6",
        className
      )}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.05 }}
          className="min-h-[108px] rounded-2xl border border-[var(--b2)]/60 bg-gradient-to-br from-[var(--white)] to-[var(--b2-soft)]/80 shadow-sm"
        />
      ))}
    </div>
  );
}

export function SellerTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      <div className="h-10 w-full max-w-md rounded-xl bg-[var(--b2-soft)] animate-pulse" />
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-14 w-full rounded-xl bg-[var(--b2-soft)]/80 animate-pulse"
          style={{ animationDelay: `${i * 40}ms` }}
        />
      ))}
    </div>
  );
}

export function SellerChartSkeleton() {
  return (
    <div className="h-[260px] w-full rounded-2xl border border-[var(--b2)]/60 bg-[var(--white)] p-4 shadow-sm">
      <div className="mb-4 h-5 w-40 rounded-md bg-[var(--b2-soft)] animate-pulse" />
      <div className="h-[200px] w-full rounded-xl bg-gradient-to-t from-[var(--b2-soft)] to-transparent animate-pulse" />
    </div>
  );
}
