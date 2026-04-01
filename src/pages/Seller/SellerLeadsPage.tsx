import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Filter, Search, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/components/seller/sellerUtils";

type LeadRow = {
  id: string;
  buyer: string;
  contact: string;
  property: string;
  interest: "hot" | "warm" | "cold";
  lastActivity: string;
  status: "new" | "contacted" | "converted" | "lost";
};

const MOCK: LeadRow[] = [
  {
    id: "1",
    buyer: "Ravi Sharma",
    contact: "+91 98765 43210",
    property: "Farmland — Indore corridor",
    interest: "hot",
    lastActivity: "Today, 10:24",
    status: "new",
  },
  {
    id: "2",
    buyer: "Anita Patel",
    contact: "anita.p@email.com",
    property: "Farmhouse — weekend retreat",
    interest: "warm",
    lastActivity: "Yesterday",
    status: "contacted",
  },
  {
    id: "3",
    buyer: "Karan Verma",
    contact: "+91 91234 56789",
    property: "Resort plot",
    interest: "cold",
    lastActivity: "3 days ago",
    status: "converted",
  },
];

function tagClass(kind: LeadRow["interest"] | LeadRow["status"]) {
  if (kind === "hot") return "bg-[var(--error-bg)] text-[var(--error)] border-[var(--error)]/25";
  if (kind === "warm") return "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/25";
  if (kind === "cold") return "bg-[var(--b2-soft)] text-[var(--b1-mid)] border-[var(--b2)]";
  if (kind === "new") return "bg-sky-50 text-sky-900 border-sky-200";
  if (kind === "contacted") return "bg-[var(--b2-soft)] text-[var(--b1)] border-[var(--b2)]";
  if (kind === "converted") return "bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/25";
  return "bg-[var(--b2-soft)] text-[var(--muted)] border-[var(--b2)]";
}

function SellerLeadsPage() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [interest, setInterest] = useState<"all" | LeadRow["interest"]>("all");

  const rows = useMemo(() => {
    let r = MOCK;
    if (interest !== "all") r = r.filter((x) => x.interest === interest);
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      r = r.filter(
        (x) =>
          x.buyer.toLowerCase().includes(s) ||
          x.property.toLowerCase().includes(s) ||
          x.contact.toLowerCase().includes(s)
      );
    }
    return r;
  }, [q, interest]);

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[var(--b1)] sm:text-2xl">{t("sellerPanel.leadsPage.title")}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{t("sellerPanel.leadsPage.sub")}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("sellerPanel.leadsPage.searchPlaceholder")}
            className="w-full rounded-xl border border-[var(--b2)] bg-[var(--white)] py-2.5 pl-10 pr-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-[var(--b2)]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            <Filter className="h-3.5 w-3.5" />
            {t("sellerPanel.leadsPage.interest")}
          </span>
          {(["all", "hot", "warm", "cold"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setInterest(k)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition",
                interest === k
                  ? "border-[var(--b1)] bg-[var(--b1)] text-[var(--fg)]"
                  : "border-[var(--b2)] bg-[var(--white)] text-[var(--b1)] hover:bg-[var(--b2-soft)]"
              )}
            >
              {k === "all" ? t("sellerPanel.table.filterAll") : t(`sellerPanel.leads.interest.${k}`)}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="min-w-[880px] w-full text-sm">
            <thead className="bg-[var(--b2-soft)]/90">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">{t("sellerPanel.leadsPage.colBuyer")}</th>
                <th className="px-4 py-3 text-left font-semibold">{t("sellerPanel.leadsPage.colContact")}</th>
                <th className="px-4 py-3 text-left font-semibold">{t("sellerPanel.leadsPage.colProperty")}</th>
                <th className="px-4 py-3 text-left font-semibold">{t("sellerPanel.leadsPage.colInterest")}</th>
                <th className="px-4 py-3 text-left font-semibold">{t("sellerPanel.leadsPage.colActivity")}</th>
                <th className="px-4 py-3 text-left font-semibold">{t("sellerPanel.leadsPage.colStatus")}</th>
                <th className="px-4 py-3 text-right font-semibold">{t("sellerPanel.leadsPage.colActions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--b2)]/70">
              {rows.map((row) => (
                <motion.tr
                  key={row.id}
                  initial={false}
                  whileHover={{ backgroundColor: "rgba(216, 243, 220, 0.35)" }}
                  className="transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-[var(--b1)]">{row.buyer}</td>
                  <td className="px-4 py-3 text-[var(--b1)]">{row.contact}</td>
                  <td className="max-w-[220px] px-4 py-3 text-[var(--b1)]">
                    <span className="line-clamp-2">{row.property}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", tagClass(row.interest))}>
                      {t(`sellerPanel.leads.interest.${row.interest}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">{row.lastActivity}</td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", tagClass(row.status))}>
                      {t(`sellerPanel.leads.status.${row.status}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button type="button" className="rounded-lg border border-[var(--b2)] bg-[var(--white)] px-2 py-1 text-xs font-medium hover:bg-[var(--b2-soft)]">
                        <Star className="mr-1 inline h-3.5 w-3.5" />
                        {t("sellerPanel.leads.actions.hot")}
                      </button>
                      <button type="button" className="rounded-lg border border-[var(--b2)] bg-[var(--white)] px-2 py-1 text-xs font-medium hover:bg-[var(--b2-soft)]">
                        {t("sellerPanel.leads.actions.notes")}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
}

export default SellerLeadsPage;
