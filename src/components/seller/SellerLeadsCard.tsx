import { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Flame, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "./sellerUtils";

export type SellerLeadPreview = {
  id: string;
  buyer: string;
  propertyTitle: string;
  interest: "hot" | "warm" | "cold";
  lastActivity: string;
};

const MOCK: SellerLeadPreview[] = [
  { id: "L1", buyer: "R. Sharma", propertyTitle: "Indore fringe farmland", interest: "hot", lastActivity: "2h ago" },
  { id: "L2", buyer: "A. Patel", propertyTitle: "Weekend farmhouse", interest: "warm", lastActivity: "Yesterday" },
  { id: "L3", buyer: "K. Verma", propertyTitle: "Resort plot", interest: "cold", lastActivity: "3d ago" },
];

function interestStyles(interest: SellerLeadPreview["interest"]) {
  if (interest === "hot") return "bg-[var(--error-bg)] text-[var(--error)] border-[var(--error)]/25";
  if (interest === "warm") return "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/25";
  return "bg-[var(--b2-soft)] text-[var(--b1-mid)] border-[var(--b2)]";
}

function SellerLeadsCardComponent() {
  const { t } = useTranslation();

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
        {MOCK.map((lead, i) => (
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
      </ul>
    </motion.div>
  );
}

export const SellerLeadsCard = memo(SellerLeadsCardComponent);
