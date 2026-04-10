import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchBuyerUsersAPI, type BuyerUser } from "@/features/seller/sellerAPI";

type LeadRow = {
  id: string;
  buyer: string;
  email: string;
  contact: string;
  verified: string;
  active: string;
  details: string;
  lastLogin: string;
  joinedAt: string;
};

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
}

function mapBuyerToRow(buyer: BuyerUser): LeadRow {
  return {
    id: buyer._id,
    buyer: buyer.name?.trim() || "-",
    email: buyer.email?.trim() || "-",
    contact: buyer.contact?.trim() || "-",
    verified: buyer.verified?.trim() || "-",
    active: typeof buyer.isActive === "boolean" ? (buyer.isActive ? "active" : "inactive") : "-",
    details: buyer.details?.trim() || "-",
    lastLogin: formatDate(buyer.lastLogin) || "-",
    joinedAt: formatDate(buyer.createdAt),
  };
}

function SellerLeadsPage() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [leadRows, setLeadRows] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const loadLeads = async () => {
      try {
        setLoading(true);
        setError("");
        const leads = await fetchBuyerUsersAPI();
        if (!mounted) return;
        setLeadRows(leads.map(mapBuyerToRow));
      } catch (err) {
        if (!mounted) return;
        const message = err instanceof Error ? err.message : "Failed to load leads.";
        setError(message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadLeads();
    return () => {
      mounted = false;
    };
  }, []);

  const rows = useMemo(() => {
    let r = leadRows;
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      r = r.filter(
        (x) =>
          x.buyer.toLowerCase().includes(s) ||
          x.email.toLowerCase().includes(s) ||
          x.contact.toLowerCase().includes(s)
      );
    }
    return r;
  }, [q, leadRows]);

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
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="min-w-[680px] w-full text-sm">
            <thead className="bg-[var(--b2-soft)]/90">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">{t("sellerPanel.leadsPage.colBuyer")}</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">{t("sellerPanel.leadsPage.colContact")}</th>
                <th className="px-4 py-3 text-left font-semibold">Verified</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Last Login</th>
                <th className="px-4 py-3 text-left font-semibold">Details</th>
                <th className="px-4 py-3 text-left font-semibold">{t("sellerPanel.leadsPage.colActivity")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--b2)]/70">
              {loading && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[var(--muted)]">
                    Loading leads...
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[var(--error)]">
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[var(--muted)]">
                    No leads found.
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <motion.tr
                  key={row.id}
                  initial={false}
                  whileHover={{ backgroundColor: "rgba(216, 243, 220, 0.35)" }}
                  className="transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-[var(--b1)]">{row.buyer}</td>
                  <td className="px-4 py-3 text-[var(--b1)]">{row.email}</td>
                  <td className="px-4 py-3 text-[var(--b1)]">{row.contact}</td>
                  <td className="px-4 py-3 text-[var(--b1)] capitalize">{row.verified}</td>
                  <td className="px-4 py-3 text-[var(--b1)] capitalize">{row.active}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">{row.lastLogin}</td>
                  <td className="max-w-[280px] px-4 py-3 text-[var(--muted)]">
                    <span className="line-clamp-2">{row.details}</span>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">{row.joinedAt}</td>
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
