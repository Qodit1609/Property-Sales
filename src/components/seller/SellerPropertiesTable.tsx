import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  Ban,
  CircleCheck,
  RotateCcw,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Property } from "../../features/properties/propertyType";
import {
  getSellerListingDisplayStatus,
  sortPropertiesByRecency,
  type SellerListingDisplayStatus,
} from "../../lib/sellerHelpers";
import { Button } from "@/components/common";
import { cn } from "./sellerUtils";

const PAGE_SIZE = 8;

type SortKey = "recent" | "priceAsc" | "priceDesc" | "views" | "title";

type SellerPropertiesTableProps = {
  listings: Property[];
  actionLoading: boolean;
  onDelete: (id: string) => void;
  onDuplicate: (property: Property) => void;
  onMarkSold: (property: Property) => void;
  onMarkUnsold: (property: Property) => void;
  onDeactivate: (property: Property) => void;
  onActivate: (property: Property) => void;
  /** When set, only first N rows after filters/sort */
  limit?: number;
  compact?: boolean;
};

function statusBadgeClass(s: SellerListingDisplayStatus) {
  if (s === "approved") return "bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/30";
  if (s === "rejected") return "bg-[var(--error-bg)] text-[var(--error)] border-[var(--error)]/30";
  if (s === "sold") return "bg-sky-50 text-sky-800 border-sky-200";
  return "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/30";
}

function rowDate(p: Property) {
  const raw = p.statusDetails?.postedAt ?? p.postedAt ?? p.createdAt ?? "";
  const t = Date.parse(raw);
  if (!Number.isFinite(t)) return "—";
  return new Date(t).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function thumb(p: Property) {
  const url = p.images?.[0] ?? p.media?.images?.[0];
  return url || null;
}

function isValidObjectId(value: string | undefined) {
  return typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value);
}

function SellerPropertiesTableComponent({
  listings,
  actionLoading,
  onDelete,
  onDuplicate,
  onMarkSold,
  onMarkUnsold,
  onDeactivate,
  onActivate,
  limit,
  compact,
}: SellerPropertiesTableProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | SellerListingDisplayStatus>("all");
  const [sort, setSort] = useState<SortKey>("recent");
  const [page, setPage] = useState(0);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    if (!openMenu) return;
    const close = () => setOpenMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [openMenu]);

  const processed = useMemo(() => {
    let rows = [...listings];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter((p) => {
        const title = (p.title ?? "").toLowerCase();
        const addr = (p.address ?? p.location?.address ?? "").toLowerCase();
        const city = (p.location?.city ?? "").toLowerCase();
        return title.includes(q) || addr.includes(q) || city.includes(q);
      });
    }

    if (statusFilter !== "all") {
      rows = rows.filter((p) => getSellerListingDisplayStatus(p) === statusFilter);
    }

    if (sort === "recent") {
      rows = sortPropertiesByRecency(rows);
    } else if (sort === "priceAsc") {
      rows.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sort === "priceDesc") {
      rows.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    } else if (sort === "views") {
      rows.sort((a, b) => (b.analytics?.views ?? 0) - (a.analytics?.views ?? 0));
    } else if (sort === "title") {
      rows.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
    }

    if (typeof limit === "number") {
      rows = rows.slice(0, limit);
    }

    return rows;
  }, [listings, search, statusFilter, sort, limit]);

  const pageCount = typeof limit === "number" ? 1 : Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
  const currentPage = typeof limit === "number" ? 0 : Math.min(page, pageCount - 1);
  const pageRows = useMemo(() => {
    if (typeof limit === "number") return processed;
    const start = currentPage * PAGE_SIZE;
    return processed.slice(start, start + PAGE_SIZE);
  }, [processed, currentPage, limit]);

  const fmtPrice = useCallback((n: number) => {
    if (!Number.isFinite(n)) return t("sellerDashboard.na");
    return `₹ ${n.toLocaleString("en-IN")}`;
  }, [t]);

  const loc = useCallback((p: Property) => {
    const parts = [p.location?.locality, p.location?.city, p.location?.state].filter(Boolean);
    if (parts.length) return parts.join(", ");
    return p.address?.trim() || p.locationText?.trim() || t("sellerDashboard.na");
  }, [t]);

  return (
    <div className="space-y-4">
      {!compact && typeof limit !== "number" ? (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder={t("sellerPanel.table.searchPlaceholder")}
              className="w-full rounded-xl border border-[var(--b2)] bg-[var(--white)] py-2.5 pl-10 pr-3 text-sm text-[var(--b1)] shadow-sm outline-none ring-0 transition placeholder:text-[var(--muted)] focus:border-[var(--b1-mid)] focus:ring-2 focus:ring-[var(--b2)]"
            />
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as typeof statusFilter);
                setPage(0);
              }}
              className="w-full rounded-xl border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm font-medium text-[var(--b1)] shadow-sm outline-none focus:ring-2 focus:ring-[var(--b2)] sm:w-auto"
            >
              <option value="all">{t("sellerPanel.table.filterAll")}</option>
              <option value="pending">{t("sellerPanel.status.pending")}</option>
              <option value="approved">{t("sellerPanel.status.approved")}</option>
              <option value="rejected">{t("sellerPanel.status.rejected")}</option>
              <option value="sold">{t("sellerPanel.status.sold")}</option>
              <option value="deactivated">{t("sellerPanel.status.deactivated")}</option>
            </select>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortKey);
                setPage(0);
              }}
              className="w-full rounded-xl border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm font-medium text-[var(--b1)] shadow-sm outline-none focus:ring-2 focus:ring-[var(--b2)] sm:w-auto"
            >
              <option value="recent">{t("sellerPanel.table.sortRecent")}</option>
              <option value="priceDesc">{t("sellerPanel.table.sortPriceDesc")}</option>
              <option value="priceAsc">{t("sellerPanel.table.sortPriceAsc")}</option>
              <option value="views">{t("sellerPanel.table.sortViews")}</option>
              <option value="title">{t("sellerPanel.table.sortTitle")}</option>
            </select>
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-sm md:min-w-[860px] xl:min-w-[960px]">
            <thead className="bg-[var(--b2-soft)]/90 text-left text-[var(--b1)]">
              <tr>
                <th className="px-4 py-3 font-semibold">{t("sellerPanel.table.image")}</th>
                <th className="px-4 py-3 font-semibold">{t("sellerPanel.table.title")}</th>
                <th className="px-4 py-3 font-semibold tabular-nums">{t("sellerPanel.table.price")}</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">{t("sellerPanel.table.location")}</th>
                <th className="px-4 py-3 font-semibold">{t("sellerPanel.table.status")}</th>
                <th className="hidden px-4 py-3 font-semibold tabular-nums lg:table-cell">{t("sellerPanel.table.views")}</th>
                <th className="hidden px-4 py-3 font-semibold tabular-nums lg:table-cell">{t("sellerPanel.table.leads")}</th>
                <th className="hidden px-4 py-3 font-semibold xl:table-cell">{t("sellerPanel.table.created")}</th>
                <th className="w-[1%] whitespace-nowrap px-4 py-3 text-right font-semibold">{t("sellerPanel.table.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--b2)]/70">
              {pageRows.map((p) => {
                const st = getSellerListingDisplayStatus(p);
                const isDeactivated = st === "deactivated";
                const isSold = st === "sold";
                const img = thumb(p);
                const menuOpen = openMenu === p._id;
                return (
                  <motion.tr
                    key={p._id}
                    initial={false}
                    className="group bg-[var(--white)] transition hover:bg-[var(--b2-soft)]/50"
                  >
                    <td className="px-4 py-3 align-middle">
                      <div className="h-12 w-16 overflow-hidden rounded-lg border border-[var(--b2)] bg-[var(--b2-soft)]">
                        {img ? (
                          <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-[var(--muted)]">
                            —
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="max-w-[220px] px-4 py-3 align-top">
                      <p className="line-clamp-2 font-medium text-[var(--b1)]">{p.title?.trim() || t("sellerDashboard.untitled")}</p>
                      <p className="mt-0.5 text-xs text-[var(--muted)]">{p.propertyType}</p>
                    </td>
                    <td className="px-4 py-3 align-top tabular-nums text-[var(--b1)]">{fmtPrice(p.price)}</td>
                    <td className="hidden max-w-[200px] px-4 py-3 align-top text-[var(--b1)] md:table-cell">
                      <span className="line-clamp-2">{loc(p)}</span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
                          statusBadgeClass(st)
                        )}
                      >
                        {t(`sellerPanel.status.${st}`)}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 align-top tabular-nums text-[var(--b1)] lg:table-cell">
                      {p.analytics?.views ?? 0}
                    </td>
                    <td className="hidden px-4 py-3 align-top tabular-nums text-[var(--b1)] lg:table-cell">
                      {p.analytics?.contactClicks ?? 0}
                    </td>
                    <td className="hidden px-4 py-3 align-top text-[var(--b1)] xl:table-cell">{rowDate(p)}</td>
                    <td className="px-3 py-3 align-top text-right sm:px-4">
                      <div className="flex flex-nowrap justify-end gap-1.5">
                        <Link
                          to={`/properties/${p._id}`}
                          className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg border border-[var(--b2)] bg-[var(--white)] px-2 py-1 text-xs font-medium text-[var(--b1)] transition hover:bg-[var(--b2-soft)]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span className="hidden xl:inline">{t("sellerPanel.actions.view")}</span>
                        </Link>
                        {isValidObjectId(p._id) ? (
                          <Link
                            to={`/post-property/basic?edit=${p._id}`}
                            className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg border border-[var(--b2)] bg-[var(--white)] px-2 py-1 text-xs font-medium text-[var(--b1)] transition hover:bg-[var(--b2-soft)]"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="hidden xl:inline">{t("sellerPanel.actions.edit")}</span>
                          </Link>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg border border-[var(--b2)] bg-[var(--white)] px-2 py-1 text-xs font-medium text-[var(--muted)] opacity-60"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="hidden xl:inline">{t("sellerPanel.actions.edit")}</span>
                          </button>
                        )}
                        <Button
                          type="button"
                          disabled={actionLoading || isDeactivated}
                          onClick={() => onDuplicate(p)}
                          className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg border border-[var(--b2)] bg-[var(--b2-soft)] px-2 py-1 text-xs font-medium text-[var(--b1)] hover:opacity-90 disabled:opacity-50"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          <span className="hidden xl:inline">{t("sellerPanel.actions.duplicate")}</span>
                        </Button>
                        <div className="relative inline-block shrink-0 text-left">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg border border-[var(--b2)] bg-[var(--white)] px-2 py-1 text-xs font-medium text-[var(--b1)] transition hover:bg-[var(--b2-soft)]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenu(menuOpen ? null : p._id);
                            }}
                            aria-expanded={menuOpen}
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                            <span className="hidden xl:inline">{t("sellerPanel.actions.more")}</span>
                          </button>
                          {menuOpen ? (
                            <div
                              className="absolute right-0 z-50 mt-1 w-48 overflow-hidden rounded-xl border border-[var(--b2)] bg-[var(--white)] py-1 shadow-lg"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {isSold ? (
                                <button
                                  type="button"
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-[var(--b1)] hover:bg-[var(--b2-soft)]"
                                  onClick={() => {
                                    onMarkUnsold(p);
                                    setOpenMenu(null);
                                  }}
                                >
                                  <RotateCcw className="h-3.5 w-3.5" />
                                  {t("sellerPanel.actions.markUnsold")}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-[var(--b1)] hover:bg-[var(--b2-soft)]"
                                  onClick={() => {
                                    onMarkSold(p);
                                    setOpenMenu(null);
                                  }}
                                >
                                  <CircleCheck className="h-3.5 w-3.5" />
                                  {t("sellerPanel.actions.markSold")}
                                </button>
                              )}
                              {isDeactivated ? (
                                <button
                                  type="button"
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-[var(--b1)] hover:bg-[var(--b2-soft)]"
                                  onClick={() => {
                                    onActivate(p);
                                    setOpenMenu(null);
                                  }}
                                >
                                  <RotateCcw className="h-3.5 w-3.5" />
                                  {t("sellerPanel.actions.activate")}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-[var(--b1)] hover:bg-[var(--b2-soft)]"
                                  onClick={() => {
                                    onDeactivate(p);
                                    setOpenMenu(null);
                                  }}
                                >
                                  <Ban className="h-3.5 w-3.5" />
                                  {t("sellerPanel.actions.deactivate")}
                                </button>
                              )}
                              <button
                                type="button"
                                disabled={actionLoading}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-[var(--error)] hover:bg-[var(--error-bg)] disabled:opacity-50"
                                onClick={() => {
                                  onDelete(p._id);
                                  setOpenMenu(null);
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                {t("sellerDashboard.delete")}
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-[var(--muted)]">
                    {t("sellerPanel.table.emptyFilter")}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {!compact && typeof limit !== "number" && pageCount > 1 ? (
          <div className="flex items-center justify-between gap-2 border-t border-[var(--b2)]/80 px-4 py-3">
            <p className="text-xs text-[var(--muted)]">
              {t("sellerPanel.table.pageOf", {
                current: currentPage + 1,
                total: pageCount,
              })}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-[var(--b2)] bg-[var(--white)] px-3 py-1.5 text-xs font-medium text-[var(--b1)] transition enabled:hover:bg-[var(--b2-soft)] disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                {t("sellerPanel.table.prev")}
              </button>
              <button
                type="button"
                disabled={currentPage >= pageCount - 1}
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-[var(--b2)] bg-[var(--white)] px-3 py-1.5 text-xs font-medium text-[var(--b1)] transition enabled:hover:bg-[var(--b2-soft)] disabled:opacity-40"
              >
                {t("sellerPanel.table.next")}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export const SellerPropertiesTable = memo(SellerPropertiesTableComponent);
