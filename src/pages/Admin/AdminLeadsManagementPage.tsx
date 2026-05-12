import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Inbox,
  Phone,
  MessageCircle,
  Calendar,
  Store,
  UserCog,
  ClipboardList,
} from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import Modal from "../../components/Modal/Modal";
import { Button, Input } from "@/components/common";
import {
  LEAD_TYPE_LABELS,
  fetchLeadDetailAPI,
  fetchLeadsManagementAPI,
  type LeadItem,
  type LeadType,
  type LeadsPagination,
  type LeadsSummary,
} from "../../features/admin/leadsManagementAPI";

type TabId = "all" | LeadType;

type TabDefinition = {
  id: TabId;
  label: string;
  countKey: keyof Pick<
    LeadsSummary,
    | "total"
    | "buyerInquiries"
    | "contactRequests"
    | "callRequests"
    | "visitRequests"
    | "sellerLeads"
    | "agentInquiries"
    | "agentDetailedEntries"
  >;
};

const TABS: TabDefinition[] = [
  { id: "all", label: "All Leads", countKey: "total" },
  { id: "buyer_inquiry", label: "Buyer Inquiries", countKey: "buyerInquiries" },
  { id: "visit_request", label: "Visit Requests", countKey: "visitRequests" },
  { id: "contact_request", label: "Contact Requests", countKey: "contactRequests" },
  { id: "call_request", label: "Call Requests", countKey: "callRequests" },
  { id: "seller_lead", label: "Seller Leads", countKey: "sellerLeads" },
  { id: "agent_inquiry", label: "Agent Inquiries", countKey: "agentInquiries" },
  { id: "agent_detailed_entry", label: "Agent Detailed Entries", countKey: "agentDetailedEntries" },
];

type SummaryCardTone = "emerald" | "sky" | "amber" | "rose" | "slate" | "violet";

type SummaryCardConfig = {
  label: string;
  value: number;
  tone: SummaryCardTone;
  icon: React.ComponentType<{ className?: string }>;
};

const SUMMARY_TONES: Record<
  SummaryCardTone,
  { iconGradient: string; iconShadow: string; glow: string }
> = {
  emerald: {
    iconGradient: "from-emerald-500 to-emerald-600",
    iconShadow: "shadow-emerald-500/30",
    glow: "from-emerald-400/20",
  },
  sky: {
    iconGradient: "from-sky-500 to-blue-600",
    iconShadow: "shadow-sky-500/30",
    glow: "from-sky-400/20",
  },
  amber: {
    iconGradient: "from-amber-500 to-orange-500",
    iconShadow: "shadow-amber-500/30",
    glow: "from-amber-400/20",
  },
  rose: {
    iconGradient: "from-rose-500 to-rose-600",
    iconShadow: "shadow-rose-500/30",
    glow: "from-rose-400/20",
  },
  slate: {
    iconGradient: "from-slate-500 to-slate-700",
    iconShadow: "shadow-slate-500/25",
    glow: "from-slate-400/15",
  },
  violet: {
    iconGradient: "from-violet-500 to-purple-600",
    iconShadow: "shadow-violet-500/30",
    glow: "from-violet-400/20",
  },
};

const PER_PAGE = 20;

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "", label: "All statuses" },
  { value: "received", label: "Received" },
  { value: "sent", label: "Sent" },
  { value: "failed", label: "Failed" },
  { value: "scheduled", label: "Scheduled" },
  { value: "rescheduled", label: "Rescheduled" },
  { value: "cancelled", label: "Cancelled" },
  { value: "viewed", label: "Viewed" },
  { value: "interested", label: "Interested" },
  { value: "contacted", label: "Contacted" },
  { value: "uninterested", label: "Uninterested" },
  { value: "draft", label: "Draft" },
  { value: "incomplete", label: "Incomplete" },
  { value: "ready", label: "Ready" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const filterSelectClass =
  "w-full min-h-[44px] rounded-xl border border-[var(--b2)] bg-[var(--white)] px-3 py-2.5 text-sm text-[var(--b1)] shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--b1-mid)]/35 focus:border-[var(--b1-mid)]";

function statusBadgeClass(status: string): string {
  const s = status.toLowerCase();
  if (
    s === "approved" ||
    s === "sent" ||
    s === "ready" ||
    s === "contacted" ||
    s === "interested"
  )
    return "bg-emerald-500/15 text-emerald-700";
  if (s === "rejected" || s === "failed" || s === "cancelled" || s === "uninterested")
    return "bg-rose-500/15 text-rose-700";
  if (s === "scheduled" || s === "rescheduled") return "bg-sky-500/15 text-sky-700";
  if (s === "draft" || s === "incomplete") return "bg-amber-500/15 text-amber-800";
  return "bg-slate-500/15 text-slate-700";
}

function leadTypeBadgeClass(type: LeadType): string {
  switch (type) {
    case "buyer_inquiry":
      return "bg-emerald-500/10 text-emerald-700 ring-emerald-500/30";
    case "contact_request":
      return "bg-sky-500/10 text-sky-700 ring-sky-500/30";
    case "call_request":
      return "bg-violet-500/10 text-violet-700 ring-violet-500/30";
    case "visit_request":
      return "bg-amber-500/10 text-amber-800 ring-amber-500/30";
    case "seller_lead":
      return "bg-rose-500/10 text-rose-700 ring-rose-500/30";
    case "agent_inquiry":
      return "bg-slate-500/10 text-slate-700 ring-slate-500/30";
    case "agent_detailed_entry":
      return "bg-indigo-500/10 text-indigo-700 ring-indigo-500/30";
    default:
      return "bg-slate-500/10 text-slate-700 ring-slate-500/30";
  }
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(handle);
  }, [value, delayMs]);
  return debounced;
}

const AdminLeadsManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const [items, setItems] = useState<LeadItem[]>([]);
  const [pagination, setPagination] = useState<LeadsPagination>({
    total: 0,
    count: 0,
    page: 1,
    pages: 1,
    perPage: PER_PAGE,
  });
  const [summary, setSummary] = useState<LeadsSummary>({
    total: 0,
    byType: {
      buyer_inquiry: 0,
      contact_request: 0,
      call_request: 0,
      visit_request: 0,
      seller_lead: 0,
      agent_inquiry: 0,
      agent_detailed_entry: 0,
    },
    buyerInquiries: 0,
    contactRequests: 0,
    callRequests: 0,
    visitRequests: 0,
    sellerLeads: 0,
    agentInquiries: 0,
    agentDetailedEntries: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const debouncedSearch = useDebouncedValue(search, 350);

  useEffect(() => {
    setPage(1);
  }, [activeTab, status, debouncedSearch, dateFrom, dateTo]);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchLeadsManagementAPI({
        page,
        limit: PER_PAGE,
        type: activeTab === "all" ? "" : (activeTab as LeadType),
        status,
        search: debouncedSearch,
        dateFrom,
        dateTo,
      });
      setItems(result.items);
      setPagination(result.pagination);
      setSummary(result.summary);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load leads";
      setError(message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [page, activeTab, status, debouncedSearch, dateFrom, dateTo]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const summaryCards: SummaryCardConfig[] = useMemo(
    () => [
      { label: "Total leads", value: summary.total, tone: "slate", icon: Inbox },
      {
        label: "Buyer inquiries",
        value: summary.buyerInquiries,
        tone: "emerald",
        icon: ClipboardList,
      },
      {
        label: "Visit requests",
        value: summary.visitRequests,
        tone: "amber",
        icon: Calendar,
      },
      {
        label: "Contact requests",
        value: summary.contactRequests,
        tone: "sky",
        icon: MessageCircle,
      },
      {
        label: "Call requests",
        value: summary.callRequests,
        tone: "violet",
        icon: Phone,
      },
      { label: "Seller leads", value: summary.sellerLeads, tone: "rose", icon: Store },
      {
        label: "Agent inquiries",
        value: summary.agentInquiries + summary.agentDetailedEntries,
        tone: "slate",
        icon: UserCog,
      },
    ],
    [summary]
  );

  const openLeadDetail = useCallback(async (lead: LeadItem) => {
    setSelectedLead(lead);
    setDetailError("");
    setDetailLoading(true);
    try {
      const detail = await fetchLeadDetailAPI(lead.type, lead.id);
      setSelectedLead(detail);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load lead details";
      setDetailError(message);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const closeLeadDetail = useCallback(() => {
    setSelectedLead(null);
    setDetailError("");
    setDetailLoading(false);
  }, []);

  const totalPages = pagination.pages || 1;
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const resetFilters = useCallback(() => {
    setStatus("");
    setSearch("");
    setDateFrom("");
    setDateTo("");
    setActiveTab("all");
  }, []);

  return (
    <AdminLayout
      title="Leads Management"
      topBarSubtitle="Track inquiries, visits and agent-collected leads in one place."
    >
      <div className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            const tone = SUMMARY_TONES[card.tone];
            return (
              <article
                key={card.label}
                className="group relative overflow-hidden rounded-2xl border border-[var(--b2)]/50 bg-[var(--white)] p-5 shadow-[0_2px_12px_rgba(27,67,50,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--b2)] hover:shadow-[0_12px_28px_rgba(27,67,50,0.12)]"
              >
                <div
                  className={`pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-br ${tone.glow} to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100`}
                  aria-hidden
                />
                <div className="relative flex gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tone.iconGradient} text-white shadow-lg ${tone.iconShadow}`}
                  >
                    <Icon className="h-7 w-7" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                      {card.label}
                    </p>
                    <p className="mt-1.5 text-3xl font-bold tabular-nums tracking-tight text-[var(--b1)]">
                      {card.value}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="rounded-2xl border border-[var(--b2)]/90 bg-[var(--white)] p-4 shadow-md shadow-[var(--b1)]/5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? "border-[var(--b1-mid)] bg-[var(--b1-mid)] text-[var(--fg)] shadow-sm"
                      : "border-[var(--b2)] bg-[var(--white)] text-[var(--b1)] hover:bg-[var(--b2-soft)]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                      isActive
                        ? "bg-[var(--fg)]/20 text-[var(--fg)]"
                        : "bg-[var(--b2-soft)] text-[var(--b1)]"
                    }`}
                  >
                    {summary[tab.countKey] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <label
                className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]"
                htmlFor="leads-search"
              >
                Search
              </label>
              <Input
                id="leads-search"
                type="search"
                placeholder="Name, email, phone, property, agent…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label
                className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]"
                htmlFor="leads-status"
              >
                Status
              </label>
              <select
                id="leads-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={filterSelectClass}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]"
                htmlFor="leads-date-from"
              >
                From
              </label>
              <input
                id="leads-date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className={filterSelectClass}
              />
            </div>

            <div>
              <label
                className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]"
                htmlFor="leads-date-to"
              >
                To
              </label>
              <input
                id="leads-date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className={filterSelectClass}
              />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-[var(--muted)]">
              {pagination.total} matching lead{pagination.total === 1 ? "" : "s"}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="border-[var(--b2)]"
            >
              Reset filters
            </Button>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[var(--b2)]/90 bg-[var(--white)] shadow-md shadow-[var(--b1)]/5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--b2)] bg-[var(--b2-soft)]/80">
                  <th className="px-4 py-3.5 font-semibold text-[var(--b1)] sm:px-5">Lead</th>
                  <th className="px-4 py-3.5 font-semibold text-[var(--b1)] sm:px-5">Type</th>
                  <th className="px-4 py-3.5 font-semibold text-[var(--b1)] sm:px-5">Status</th>
                  <th className="px-4 py-3.5 font-semibold text-[var(--b1)] sm:px-5">Property / Subject</th>
                  <th className="px-4 py-3.5 font-semibold text-[var(--b1)] sm:px-5">Linked</th>
                  <th className="px-4 py-3.5 font-semibold text-[var(--b1)] sm:px-5">Created</th>
                  <th className="px-4 py-3.5 text-right font-semibold text-[var(--b1)] sm:px-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!loading && !error && items.map((lead, index) => (
                  <tr
                    key={`${lead.type}-${lead.id}`}
                    className={[
                      "border-b border-[var(--b2)]/70 transition-colors hover:bg-[var(--b2-soft)]/40",
                      index % 2 === 1 ? "bg-[var(--b2-soft)]/25" : "bg-[var(--white)]",
                    ].join(" ")}
                  >
                    <td className="px-4 py-3.5 align-top sm:px-5">
                      <p className="text-sm font-semibold text-[var(--b1)]">{lead.name || "Unknown"}</p>
                      <p className="text-xs text-[var(--muted)]">{lead.email || "—"}</p>
                      {lead.phone ? (
                        <p className="mt-0.5 text-xs text-[var(--muted)]">{lead.phone}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3.5 align-top sm:px-5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset ${leadTypeBadgeClass(lead.type)}`}
                      >
                        {LEAD_TYPE_LABELS[lead.type] ?? lead.type}
                      </span>
                      {lead.source ? (
                        <p className="mt-1 text-[11px] text-[var(--muted)]">Source: {lead.source}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3.5 align-top sm:px-5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusBadgeClass(lead.status)}`}
                      >
                        {lead.status || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 align-top text-[var(--b1-mid)] sm:px-5">
                      {lead.propertyTitle ? (
                        <p className="text-xs">{lead.propertyTitle}</p>
                      ) : (
                        <p className="text-xs text-[var(--muted)]">—</p>
                      )}
                      {lead.message ? (
                        <p className="mt-1 line-clamp-2 text-[11px] text-[var(--muted)]">
                          {lead.message}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3.5 align-top text-[var(--b1-mid)] sm:px-5">
                      {lead.agentName ? (
                        <p className="text-xs">
                          <span className="text-[var(--muted)]">Agent:</span> {lead.agentName}
                        </p>
                      ) : null}
                      {lead.sellerName ? (
                        <p className="text-xs">
                          <span className="text-[var(--muted)]">Seller:</span> {lead.sellerName}
                        </p>
                      ) : null}
                      {!lead.agentName && !lead.sellerName ? (
                        <p className="text-xs text-[var(--muted)]">—</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3.5 align-top text-[var(--b1-mid)] sm:px-5">
                      <p className="text-xs">{formatDate(lead.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3.5 align-top sm:px-5">
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openLeadDetail(lead)}
                          className="border-[var(--b2)]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-[var(--muted)]">
                      Loading leads…
                    </td>
                  </tr>
                ) : null}

                {!loading && error ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-[var(--error)]">
                      {error}
                    </td>
                  </tr>
                ) : null}

                {!loading && !error && items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-[var(--muted)]">
                      No leads match the current filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {(totalPages > 1 || pagination.total > 0) && (
            <div className="flex flex-col items-stretch justify-between gap-3 border-t border-[var(--b2)]/60 bg-[var(--b2-soft)]/20 px-4 py-3 sm:flex-row sm:items-center">
              <p className="text-center text-[11px] text-[var(--muted)] sm:text-left">
                Page {pagination.page} of {totalPages}
                {pagination.total > 0 ? <> · {pagination.total} total</> : null}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!canPrev || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!canNext || loading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>

      <Modal
        open={Boolean(selectedLead)}
        onClose={closeLeadDetail}
        title="Lead details"
      >
        {selectedLead ? (
          <LeadDetailContent
            lead={selectedLead}
            loading={detailLoading}
            error={detailError}
          />
        ) : null}
        <div className="mt-5 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={closeLeadDetail}
            className="border-[var(--b2)]"
          >
            Close
          </Button>
        </div>
      </Modal>
    </AdminLayout>
  );
};

type LeadDetailContentProps = {
  lead: LeadItem;
  loading: boolean;
  error: string;
};

const LeadDetailContent: React.FC<LeadDetailContentProps> = ({
  lead,
  loading,
  error,
}) => {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[var(--b2)] bg-[var(--b2-soft)]/30 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-base font-semibold text-[var(--b1)]">{lead.name || "Unknown"}</p>
            <p className="text-xs text-[var(--muted)]">
              {LEAD_TYPE_LABELS[lead.type] ?? lead.type} · {lead.source || "—"}
            </p>
          </div>
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusBadgeClass(lead.status)}`}
          >
            {lead.status || "—"}
          </span>
        </div>
        <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
          <DetailField label="Email" value={lead.email || "—"} />
          <DetailField label="Phone" value={lead.phone || "—"} />
          <DetailField label="Created" value={formatDateTime(lead.createdAt)} />
          <DetailField label="Last update" value={formatDateTime(lead.updatedAt)} />
          {lead.propertyTitle ? (
            <DetailField label="Property / subject" value={lead.propertyTitle} />
          ) : null}
          {lead.agentName ? <DetailField label="Agent" value={lead.agentName} /> : null}
          {lead.sellerName ? <DetailField label="Seller" value={lead.sellerName} /> : null}
        </div>
      </div>

      {lead.message ? (
        <div className="rounded-xl border border-[var(--b2)] bg-[var(--white)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            Message
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--b1)]">{lead.message}</p>
        </div>
      ) : null}

      {loading ? (
        <p className="text-xs text-[var(--muted)]">Loading full lead details…</p>
      ) : null}
      {!loading && error ? (
        <p className="text-xs text-[var(--error)]">{error}</p>
      ) : null}

      {!loading && !error && lead.details ? (
        <LeadExtendedDetails lead={lead} />
      ) : null}
    </div>
  );
};

const DetailField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
      {label}
    </p>
    <p className="text-sm text-[var(--b1)]">{value}</p>
  </div>
);

const LeadExtendedDetails: React.FC<{ lead: LeadItem }> = ({ lead }) => {
  const details = lead.details ?? {};
  const blocks: React.ReactNode[] = [];

  if (lead.type === "visit_request") {
    blocks.push(
      <div key="visit-info" className="rounded-xl border border-[var(--b2)] bg-[var(--white)] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
          Visit details
        </p>
        <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
          <DetailField label="Scheduled at" value={formatDateTime(details.visitDate)} />
          <DetailField label="Visit type" value={details.visitType || "—"} />
          {details.notes ? <DetailField label="Notes" value={details.notes} /> : null}
        </div>
      </div>
    );
  }

  if (
    (lead.type === "contact_request" || lead.type === "call_request") &&
    (details.submittedAt || details.sentAt || details.failureReason)
  ) {
    blocks.push(
      <div key="contact-info" className="rounded-xl border border-[var(--b2)] bg-[var(--white)] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
          Inquiry meta
        </p>
        <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
          <DetailField label="Submitted at" value={formatDateTime(details.submittedAt)} />
          <DetailField label="Sent at" value={formatDateTime(details.sentAt)} />
          {details.failureReason ? (
            <DetailField label="Failure reason" value={details.failureReason} />
          ) : null}
        </div>
      </div>
    );
  }

  if (
    (lead.type === "buyer_inquiry" || lead.type === "seller_lead") &&
    (details.viewCount !== undefined ||
      details.lastViewedAt ||
      details.propertyType ||
      details.price ||
      details.address ||
      details.property)
  ) {
    blocks.push(
      <div key="engagement-info" className="rounded-xl border border-[var(--b2)] bg-[var(--white)] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
          Engagement
        </p>
        <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
          <DetailField label="View count" value={String(details.viewCount ?? "—")} />
          <DetailField
            label="Last viewed at"
            value={formatDateTime(details.lastViewedAt)}
          />
          {details.propertyType ? (
            <DetailField label="Property type" value={details.propertyType} />
          ) : null}
          {details.price !== undefined && details.price !== null ? (
            <DetailField
              label="Price"
              value={`₹ ${Number(details.price).toLocaleString("en-IN")}`}
            />
          ) : null}
          {details.address ? <DetailField label="Address" value={details.address} /> : null}
          {details.property?.title ? (
            <DetailField label="Linked property" value={details.property.title} />
          ) : null}
          {details.property?.approvalStatus ? (
            <DetailField
              label="Property status"
              value={details.property.approvalStatus}
            />
          ) : null}
          {details.buyer?.role ? (
            <DetailField label="Buyer role" value={details.buyer.role} />
          ) : null}
        </div>
        {Array.isArray(details.activityHistory) && details.activityHistory.length > 0 ? (
          <div className="mt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
              Activity history
            </p>
            <ul className="mt-2 space-y-1 text-xs text-[var(--b1)]">
              {details.activityHistory.slice(0, 8).map((entry, idx) => (
                <li
                  key={`${entry.activityType}-${entry.timestamp ?? idx}`}
                  className="flex items-center justify-between rounded-md border border-[var(--b2)]/70 bg-[var(--b2-soft)]/40 px-2 py-1"
                >
                  <span className="font-medium">{entry.activityType}</span>
                  <span className="text-[var(--muted)]">{formatDateTime(entry.timestamp)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    );
  }

  if (lead.type === "agent_inquiry" || lead.type === "agent_detailed_entry") {
    blocks.push(
      <div key="agent-info" className="rounded-xl border border-[var(--b2)] bg-[var(--white)] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
          Agent entry
        </p>
        <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
          {details.propertyId ? (
            <DetailField label="Property ID" value={details.propertyId} />
          ) : null}
          {details.adminRemark ? (
            <DetailField label="Admin remark" value={details.adminRemark} />
          ) : null}
          <DetailField
            label="Has detailed entry"
            value={details.hasDetailedEntry ? "Yes" : "No"}
          />
        </div>
        {details.step1 && Object.keys(details.step1).length > 0 ? (
          <div className="mt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
              Step 1 – Field entry
            </p>
            <KeyValueBlock data={details.step1} />
          </div>
        ) : null}
        {details.step2 && Object.keys(details.step2).length > 0 ? (
          <div className="mt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
              Step 2 – Detailed entry
            </p>
            <KeyValueBlock data={details.step2} />
          </div>
        ) : null}
      </div>
    );
  }

  if (blocks.length === 0) return null;

  return <div className="space-y-3">{blocks}</div>;
};

const KeyValueBlock: React.FC<{ data: Record<string, unknown> }> = ({ data }) => {
  const entries = Object.entries(data).filter(([, value]) => {
    if (value === null || value === undefined || value === "") return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  });

  if (entries.length === 0) {
    return <p className="text-xs text-[var(--muted)]">No additional data.</p>;
  }

  return (
    <dl className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="rounded-md border border-[var(--b2)]/70 bg-[var(--b2-soft)]/40 px-2 py-1"
        >
          <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            {key}
          </dt>
          <dd className="mt-0.5 break-words text-sm text-[var(--b1)]">{stringifyValue(value)}</dd>
        </div>
      ))}
    </dl>
  );
};

function stringifyValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export default AdminLeadsManagementPage;
