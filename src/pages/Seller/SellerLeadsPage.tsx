import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PropertyLeadsCard } from "@/components/seller/PropertyLeadsCard";
import {
  clearSellerLeadRowsAPI,
  deleteSellerLeadRowAPI,
  fetchSellerLeadsAPI,
  type SellerPropertyLeads,
} from "@/features/seller/sellerAPI";

function SellerLeadsPage() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [propertyLeads, setPropertyLeads] = useState<SellerPropertyLeads[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const loadLeads = async () => {
      try {
        setLoading(true);
        setError("");
        const leads = await fetchSellerLeadsAPI();
        if (!mounted) return;
        setPropertyLeads(leads);
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
    const search = q.trim().toLowerCase();
    if (!search) return propertyLeads;
    return propertyLeads
      .map((entry) => ({
        ...entry,
        leads: entry.leads.filter(
          (lead) =>
            lead.buyerName.toLowerCase().includes(search) ||
            lead.propertyName.toLowerCase().includes(search) ||
            lead.activityType.toLowerCase().includes(search)
        ),
      }))
      .filter((entry) => entry.propertyName.toLowerCase().includes(search) || entry.leads.length > 0);
  }, [q, propertyLeads]);

  const hasLeads = useMemo(
    () => rows.some((propertyEntry) => propertyEntry.leads.length > 0),
    [rows]
  );

  const handleDeleteRow = async (
    propertyId: string,
    rowId: string,
    leadId?: string,
    activityType?: "cart" | "wishlist" | "compare"
  ) => {
    try {
      if (leadId && activityType) {
        await deleteSellerLeadRowAPI({ leadId, activityType });
      }
      setPropertyLeads((prev) =>
        prev.map((entry) =>
          entry.propertyId !== propertyId
            ? entry
            : { ...entry, leads: entry.leads.filter((lead) => lead.id !== rowId) }
        )
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete row.";
      setError(message);
    }
  };

  const handleClearAll = async (propertyId: string) => {
    try {
      await clearSellerLeadRowsAPI(propertyId);
      setPropertyLeads((prev) =>
        prev.map((entry) =>
          entry.propertyId !== propertyId ? entry : { ...entry, leads: [] }
        )
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to clear rows.";
      setError(message);
    }
  };

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

      <div className="space-y-5">
        {loading && (
          <div className="rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] px-4 py-8 text-center text-[var(--muted)] shadow-sm">
            Loading leads...
          </div>
        )}
        {!loading && error && (
          <div className="rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] px-4 py-8 text-center text-[var(--error)] shadow-sm">
            {error}
          </div>
        )}
        {!loading && !error && rows.length === 0 && (
          <div className="rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] px-4 py-8 text-center text-[var(--muted)] shadow-sm">
            No approved properties found.
          </div>
        )}
        {!loading && !error && rows.length > 0 && !hasLeads && (
          <div className="rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] px-4 py-8 text-center text-[var(--muted)] shadow-sm">
            No leads found.
          </div>
        )}
        {!loading &&
          !error &&
          rows.map((propertyEntry) => (
            <PropertyLeadsCard
              key={propertyEntry.propertyId}
              propertyLeads={propertyEntry}
              onDeleteRow={handleDeleteRow}
              onClearAll={handleClearAll}
            />
          ))}
      </div>
    </section>
  );
}

export default SellerLeadsPage;
