import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  XCircle,
} from "lucide-react";
import { Button, Input } from "@/components/common";
import { ToastStack, type ToastMessage } from "@/components/propertyPost/Toast";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import type { Property } from "../../features/properties/propertyType";
import {
  approveListing,
  clearAdminMutationError,
  deleteListingById,
  fetchAdminListings,
  rejectListing,
} from "../../features/admin/adminSlice";

const PROPERTY_TYPES = [
  "Farmhouse",
  "Farmland",
  "Agriculture Land",
  "Resort",
  "Flat",
  "House",
  "Plot",
  "Villa",
  "Apartment",
  "Commercial",
  "Other",
] as const;

const PER_PAGE = 10;
const ADMIN_VIEWED_STORAGE_KEY = "admin_viewed_property_ids";

function getViewedIdsFromSession(): Set<string> {
  if (typeof window === "undefined") return new Set<string>();
  try {
    const raw = window.sessionStorage.getItem(ADMIN_VIEWED_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(parsed)) return new Set<string>();
    return new Set(parsed.map((value) => String(value)));
  } catch {
    return new Set<string>();
  }
}

function approvalLabel(status: string | undefined): string {
  const s = (status ?? "pending").toLowerCase();
  if (s === "approved") return "Approved";
  if (s === "rejected") return "Rejected";
  if (s === "sold") return "Sold";
  return "Pending";
}

function statusBadgeClass(status: string | undefined): string {
  const s = (status ?? "pending").toLowerCase();
  if (s === "approved") return "bg-emerald-500/15 text-emerald-700";
  if (s === "rejected") return "bg-rose-500/15 text-rose-700";
  if (s === "sold") return "bg-slate-500/15 text-slate-700";
  return "bg-amber-500/15 text-amber-800";
}

function normalizedStatus(status: string | undefined): string {
  return (status ?? "pending").toLowerCase();
}

const filterSelectClass =
  "w-full min-h-[44px] rounded-xl border border-[var(--b2)] bg-[var(--white)] px-3 py-2.5 text-sm text-[var(--b1)] shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--b1-mid)]/35 focus:border-[var(--b1-mid)]";

const AdminPropertiesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    listings,
    listingsLoading,
    listingsError,
    listingsPagination,
    actionLoading,
    mutationError,
  } = useAppSelector((s) => s.admin);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState(() => {
    const status = (searchParams.get("status") ?? "").toLowerCase();
    return ["pending", "approved", "rejected", "sold"].includes(status)
      ? status
      : "";
  });
  const [filterType, setFilterType] = useState("");
  const [page, setPage] = useState(1);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const pushToast = useCallback((t: Omit<ToastMessage, "id">) => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now());
    setToasts((prev) => [...prev, { id, ...t }]);
  }, []);
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const [rejectId, setRejectId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewedIds, setViewedIds] = useState<Set<string>>(() =>
    getViewedIdsFromSession()
  );

  const load = useCallback(() => {
    dispatch(
      fetchAdminListings({
        page,
        limit: PER_PAGE,
      })
    );
  }, [dispatch, page]);
  useEffect(() => {
    const status = (searchParams.get("status") ?? "").toLowerCase();
    if (["pending", "approved", "rejected", "sold"].includes(status)) {
      setFilterStatus(status);
      setPage(1);
      return;
    }
    setFilterStatus("");
    setPage(1);
  }, [searchParams]);


  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const syncViewedIds = () => {
      setViewedIds(getViewedIdsFromSession());
    };
    syncViewedIds();
    window.addEventListener("focus", syncViewedIds);
    return () => {
      window.removeEventListener("focus", syncViewedIds);
    };
  }, []);

  useEffect(() => {
    if (!mutationError) return;
    const timer = window.setTimeout(() => {
      pushToast({ kind: "error", title: mutationError });
      dispatch(clearAdminMutationError());
    }, 0);
    return () => window.clearTimeout(timer);
  }, [mutationError, dispatch, pushToast]);

  const openEdit = useCallback(
    (listing: Property) => {
      navigate(`/post-property/basic?edit=${listing._id}`);
    },
    [navigate]
  );

  const openDetails = useCallback(
    (listing: Property) => {
      navigate(`/properties/${listing._id}`);
    },
    [navigate]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return listings.filter((l) => {
      if (filterStatus && normalizedStatus(l.status) !== filterStatus) return false;
      if (filterType && (l.propertyType ?? "") !== filterType) return false;
      if (!q) return true;
      return (
        (l.title && l.title.toLowerCase().includes(q)) ||
        (l.address && l.address.toLowerCase().includes(q))
      );
    });
  }, [listings, search, filterStatus, filterType]);

  const isListingViewed = useCallback(
    (listing: Property) => {
      const viewedFlag = (listing as Property & { isViewed?: boolean }).isViewed;
      return Boolean(viewedFlag) || viewedIds.has(listing._id);
    },
    [viewedIds]
  );

  const handleApprove = (listing: Property) => {
    if (!isListingViewed(listing)) {
      window.alert("First view the property");
      return;
    }

    const id = listing._id;
    dispatch(approveListing(id))
      .unwrap()
      .then(() =>
        pushToast({ kind: "success", title: "Property approved" })
      );
  };

  const submitReject = () => {
    if (!rejectId) return;
    dispatch(rejectListing(rejectId))
      .unwrap()
      .then(() => {
        pushToast({ kind: "success", title: "Property rejected" });
        setRejectId(null);
      });
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    dispatch(deleteListingById(deleteId))
      .unwrap()
      .then(() => {
        pushToast({ kind: "success", title: "Property deleted" });
        setDeleteId(null);
        load();
      });
  };

  const totalPages = Math.max(1, listingsPagination.pages || 1);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const actionBtn =
    "inline-flex items-center gap-1 whitespace-nowrap text-[11px] font-medium disabled:opacity-50";

  return (
    <AdminLayout title="Properties">
      <div className="mx-auto max-w-7xl space-y-5">
        <ToastStack toasts={toasts} onDismiss={dismissToast} />

        <header className="relative overflow-hidden rounded-2xl border border-[var(--b2)]/70 bg-[var(--white)] p-5 shadow-[0_2px_16px_rgba(27,67,50,0.06)] sm:p-6">
          <div
            className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-[var(--b2-soft)] to-transparent"
            aria-hidden
          />
          <div className="relative">
            <h2 className="text-lg font-semibold tracking-tight text-[var(--b1)] sm:text-xl">
              All properties
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">
              CRUD and moderation for every listing.
            </p>
          </div>
        </header>

        <section
          className="rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] p-4 shadow-sm sm:p-5"
          aria-label="Filters"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-12 xl:gap-4">
            <div className="sm:col-span-2 xl:col-span-5">
              <label
                htmlFor="admin-properties-search"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--b1-mid)]"
              >
                Search
              </label>
              <Input
                id="admin-properties-search"
                placeholder="Search on this page…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="off"
                className="border-[var(--b2)] text-sm"
              />
            </div>
            <div className="xl:col-span-3">
              <label
                htmlFor="admin-properties-status"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--b1-mid)]"
              >
                Status
              </label>
              <select
                id="admin-properties-status"
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setPage(1);
                }}
                className={filterSelectClass}
              >
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="sold">Sold</option>
              </select>
            </div>
            <div className="sm:col-span-2 xl:col-span-4">
              <label
                htmlFor="admin-properties-type"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--b1-mid)]"
              >
                Property type
              </label>
              <select
                id="admin-properties-type"
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setPage(1);
                }}
                className={filterSelectClass}
              >
                <option value="">All types</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {listingsLoading && (
          <div
            className="flex items-center gap-3 rounded-2xl border border-[var(--b2)] bg-[var(--white)] px-4 py-10 text-sm text-[var(--muted)]"
            role="status"
            aria-live="polite"
          >
            <span className="inline-block h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-[var(--b1-mid)] border-t-transparent" />
            Loading properties…
          </div>
        )}

        {listingsError && !listingsLoading && (
          <div
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
            role="alert"
          >
            {listingsError}
          </div>
        )}

        {!listingsLoading && !listingsError && (
          <>
            <div className="space-y-3 md:hidden">
              {filtered.map((listing) => (
                <PropertyCardMobile
                  key={listing._id}
                  listing={listing}
                  isViewed={isListingViewed(listing)}
                  actionLoading={actionLoading}
                  onApprove={() => handleApprove(listing)}
                  onReject={() => setRejectId(listing._id)}
                  onOpenDetails={() => openDetails(listing)}
                  onEdit={() => openEdit(listing)}
                  onDelete={() => setDeleteId(listing._id)}
                  actionBtn={actionBtn}
                />
              ))}
              {filtered.length === 0 && (
                <p className="rounded-xl border border-dashed border-[var(--b2)] py-10 text-center text-sm text-[var(--muted)]">
                  No properties match your filters.
                </p>
              )}
            </div>

            <div className="hidden md:block overflow-x-auto rounded-2xl border border-[var(--b2)] bg-[var(--white)] shadow-inner">
              <table className="w-full min-w-[920px] text-xs text-[var(--b1)]">
                <thead className="sticky top-0 z-10 bg-gradient-to-r from-[var(--b2-soft)] to-[var(--white)] text-[11px] font-semibold uppercase tracking-wide shadow-sm">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Property</th>
                    <th className="px-4 py-3 text-left font-medium">Type</th>
                    <th className="px-4 py-3 text-left font-medium">Price</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--b2)]/80">
                  {filtered.map((listing, index) => (
                    <tr
                      key={listing._id}
                      className={[
                        "cursor-pointer transition-colors hover:bg-[var(--b2-soft)]/80",
                        index % 2 === 1 ? "bg-[var(--b2-soft)]/15" : "",
                      ].join(" ")}
                      onClick={() => openDetails(listing)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openDetails(listing);
                        }
                      }}
                      tabIndex={0}
                      role="link"
                      aria-label={`Open details for ${listing.title || "property"}`}
                    >
                      <td className="px-4 py-3 align-top">
                        <p className="text-xs font-semibold text-[var(--b1)]">
                          {listing.title || "Untitled"}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[var(--b1-mid)] line-clamp-2">
                          {listing.address}
                        </p>
                      </td>
                      <td className="px-4 py-3 align-top text-[var(--b1-mid)]">
                        {listing.propertyType}
                      </td>
                      <td className="px-4 py-3 align-top">
                        ₹ {listing.price?.toLocaleString("en-IN") ?? "—"}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusBadgeClass(
                            listing.status
                          )}`}
                        >
                          {approvalLabel(listing.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top text-right">
                        <div className="flex flex-nowrap justify-end gap-1 overflow-x-auto">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={actionLoading}
                            onClick={(e) => {
                              e.stopPropagation();
                              openDetails(listing);
                            }}
                            className={`${actionBtn} border-[var(--b2)]`}
                            aria-label={isListingViewed(listing) ? "Viewed" : "Unviewed"}
                            title={isListingViewed(listing) ? "Viewed" : "Unviewed"}
                          >
                            {isListingViewed(listing) ? (
                              <Eye className="h-3.5 w-3.5" />
                            ) : (
                              <EyeOff className="h-3.5 w-3.5" />
                            )}
                            View
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={
                              actionLoading ||
                              !isListingViewed(listing) ||
                              ["approved", "sold"].includes(
                                normalizedStatus(listing.status)
                              )
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(listing);
                            }}
                            className={`${actionBtn} border-emerald-500/40 text-emerald-700`}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Approve
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={
                              actionLoading ||
                              !isListingViewed(listing) ||
                              ["rejected", "sold"].includes(
                                normalizedStatus(listing.status)
                              )
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              setRejectId(listing._id);
                            }}
                            className={`${actionBtn} border-amber-500/40 text-amber-800`}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Reject
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={actionLoading || !isListingViewed(listing)}
                            onClick={(e) => {
                              e.stopPropagation();
                              openEdit(listing);
                            }}
                            className={`${actionBtn} border-[var(--b2)]`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={actionLoading || !isListingViewed(listing)}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteId(listing._id);
                            }}
                            className={`${actionBtn} border-rose-500/40 text-rose-700`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-10 text-center text-[var(--muted)]"
                      >
                        No properties on this page.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {(totalPages > 1 || listingsPagination.total > 0) && (
              <div className="flex flex-col items-stretch justify-between gap-3 rounded-xl border border-[var(--b2)]/60 bg-[var(--b2-soft)]/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-center text-[11px] text-[var(--muted)] sm:text-left">
                  Page {page} of {totalPages}
                  {listingsPagination.total > 0 && (
                    <>
                      {" "}
                      · {listingsPagination.total} total
                    </>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!canPrev || listingsLoading}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Prev
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!canNext || listingsLoading}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {rejectId && (
          <Modal
            title="Reject listing?"
            onClose={() => setRejectId(null)}
            footer={
              <>
                <Button variant="outline" onClick={() => setRejectId(null)}>
                  Cancel
                </Button>
                <Button onClick={submitReject} disabled={actionLoading}>
                  {actionLoading ? "Submitting…" : "Reject"}
                </Button>
              </>
            }
          >
            <p className="text-sm text-[var(--muted)]">
              The server will record a default reason. Confirm to reject.
            </p>
          </Modal>
        )}

        {deleteId && (
          <Modal
            title="Delete property?"
            onClose={() => setDeleteId(null)}
            footer={
              <>
                <Button variant="outline" onClick={() => setDeleteId(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  disabled={actionLoading}
                  className="!bg-rose-600 hover:!opacity-90"
                >
                  {actionLoading ? "Deleting…" : "Delete"}
                </Button>
              </>
            }
          >
            <p className="text-sm text-[var(--b1)]">
              This permanently removes the listing.
            </p>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
};

function Modal({
  title,
  children,
  onClose,
  footer,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  footer: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-5 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-[var(--b1)]">{title}</h3>
          <button
            type="button"
            className="rounded-lg p-1 text-[var(--muted)] hover:bg-[var(--b2-soft)]"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {children}
        <div className="mt-6 flex flex-wrap justify-end gap-2">{footer}</div>
      </div>
    </div>
  );
}

const PropertyCardMobile = React.memo(function PropertyCardMobile({
  listing,
  isViewed,
  actionLoading,
  onApprove,
  onReject,
  onOpenDetails,
  onEdit,
  onDelete,
  actionBtn,
}: {
  listing: Property;
  isViewed: boolean;
  actionLoading: boolean;
  onApprove: () => void;
  onReject: () => void;
  onOpenDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
  actionBtn: string;
}) {
  const st = normalizedStatus(listing.status);
  const cannotApprove = st === "approved" || st === "sold";
  const cannotReject = st === "rejected" || st === "sold";
  return (
    <div className="rounded-xl border border-[var(--b2)] bg-[var(--white)] p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <button
            type="button"
            onClick={onOpenDetails}
            className="text-left text-sm font-semibold text-[var(--b1)] hover:underline"
          >
            {listing.title || "Untitled"}
          </button>
          <p className="mt-1 text-[11px] text-[var(--b1-mid)] line-clamp-2">
            {listing.address}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${statusBadgeClass(
            listing.status
          )}`}
        >
          {approvalLabel(listing.status)}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[var(--b1-mid)]">
        <span>{listing.propertyType}</span>
        <span>·</span>
        <span>₹ {listing.price?.toLocaleString("en-IN") ?? "—"}</span>
      </div>
      <div className="mt-3 flex flex-nowrap gap-1.5 overflow-x-auto">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={actionLoading}
          onClick={onOpenDetails}
          className={`${actionBtn} border-[var(--b2)]`}
          aria-label={isViewed ? "Viewed" : "Unviewed"}
          title={isViewed ? "Viewed" : "Unviewed"}
        >
          {isViewed ? (
            <Eye className="h-3.5 w-3.5" />
          ) : (
            <EyeOff className="h-3.5 w-3.5" />
          )}
          View
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={actionLoading || !isViewed || cannotApprove}
          onClick={onApprove}
          className={`${actionBtn} border-emerald-500/40 text-emerald-700`}
        >
          Approve
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={actionLoading || !isViewed || cannotReject}
          onClick={onReject}
          className={`${actionBtn} border-amber-500/40 text-amber-800`}
        >
          Reject
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={actionLoading || !isViewed}
          onClick={onEdit}
          className={`${actionBtn} border-[var(--b2)]`}
        >
          Edit
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={actionLoading || !isViewed}
          onClick={onDelete}
          className={`${actionBtn} border-rose-500/40 text-rose-700`}
        >
          Delete
        </Button>
      </div>
    </div>
  );
});

export default AdminPropertiesPage;
