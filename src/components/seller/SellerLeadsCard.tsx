import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Flame, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "./sellerUtils";
import type { SellerDashboardRecentLead } from "@/features/seller/sellerAPI";

export type SellerLeadPreview = {
  id: string;
  buyer: string;
  propertyTitle: string;
  interest: "hot" | "warm" | "cold";
  lastActivity: string;
};

function interestStyles(interest: SellerLeadPreview["interest"]) {
  if (interest === "hot") return "bg-[var(--error-bg)] text-[var(--error)] border-[var(--error)]/25";
  if (interest === "warm") return "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/25";
  return "bg-[var(--b2-soft)] text-[var(--b1-mid)] border-[var(--b2)]";
}

const getLastActivityLabel = (timestamp: string) => {
  const time = new Date(timestamp).getTime();
  if (Number.isNaN(time)) return "";
  const diffMs = Date.now() - time;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diffMs < hour) return `${Math.max(1, Math.floor(diffMs / minute))}m ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`;
  return `${Math.floor(diffMs / day)}d ago`;
};

type SellerLeadsCardProps = {
  recentLeads?: SellerDashboardRecentLead[];
};

function SellerLeadsCardComponent({ recentLeads }: SellerLeadsCardProps) {
  const { t } = useTranslation();
  const items = useMemo<SellerLeadPreview[]>(() => {
    if (!Array.isArray(recentLeads) || recentLeads.length === 0) return [];
    return recentLeads.map((lead) => ({
      id: lead.id,
      buyer: lead.buyer,
      propertyTitle: lead.propertyTitle,
      interest: lead.interest,
      lastActivity: getLastActivityLabel(lead.timestamp),
    }));
  }, [recentLeads]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] shadow-sm"
    >
      <div className="flex items-center justify-between gap-3 border-b border-[var(--b2)]/80 px-5 py-4">
        <div>
          <h3 className="text-base font-semibold text-[var(--b1)]">{t("sellerPanel.leadsPreview.title")}</h3>
          <p className="text-xs text-[var(--muted)]">{t("sellerPanel.leadsPreview.sub")}</p>
        </div>
        <Link
          to="/seller/leads"
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-[var(--b1-mid)] transition hover:bg-[var(--b2-soft)]"
        >
          {t("sellerPanel.leadsPreview.cta")}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      <ul className="divide-y divide-[var(--b2)]/60">
        {items.map((lead, i) => (
          <motion.li
            key={lead.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.04 * i, duration: 0.2 }}
            className="flex items-start gap-3 px-5 py-3.5 transition hover:bg-[var(--b2-soft)]/50"
          >
            <span
              className={cn(
                "mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl border text-[var(--b1)] shadow-inner",
                interestStyles(lead.interest)
              )}
            >
              {lead.interest === "hot" ? <Flame className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--b1)]">{lead.buyer}</p>
              <p className="truncate text-xs text-[var(--muted)]">{lead.propertyTitle}</p>
            </div>
            <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
              {lead.lastActivity}
            </span>
          </motion.li>
        ))}
        {items.length === 0 ? (
          <li className="px-5 py-4 text-sm text-[var(--muted)]">No recent leads yet.</li>
        ) : null}
      </ul>
    </motion.div>
  );
}

export const SellerLeadsCard = memo(SellerLeadsCardComponent);
