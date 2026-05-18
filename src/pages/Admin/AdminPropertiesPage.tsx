import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
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
import CustomAlert from "@/components/common/CustomAlert";
import { translatePropertyType } from "@/lib/adminI18n";

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
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const getApprovalLabel = useCallback(
    (status: string | undefined) => {
      const s = (status ?? "pending").toLowerCase();
      if (s === "approved") return t("adminPanel.properties.status.approved");
      if (s === "rejected") return t("adminPanel.properties.status.rejected");
      if (s === "sold") return t("adminPanel.properties.status.sold");
      return t("adminPanel.properties.status.pending");
    },
    [t]
  );
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
  const [rejectDirectly, setRejectDirectly] = useState(false);
  const [rejectionDescription, setRejectionDescription] = useState("");
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [rejectModalError, setRejectModalError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewGuardAlertOpen, setViewGuardAlertOpen] = useState(false);
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

  useEffect(() => {
    if (!rejectId) {
      setRejectDirectly(false);
      setRejectionDescription("");
      setRejectionMessage("");
      setRejectModalError(null);
      return;
    }
    setRejectDirectly(false);
    setRejectionDescription("");
    setRejectionMessage("");
    setRejectModalError(null);
  }, [rejectId]);

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

  const rejectTargetListing = useMemo(
    () => (rejectId ? listings.find((l) => l._id === rejectId) : undefined),
    [listings, rejectId]
  );

  const handleApprove = (listing: Property) => {
    if (!isListingViewed(listing)) {
      setViewGuardAlertOpen(true);
      return;
    }

    const id = listing._id;
    dispatch(approveListing(id))
      .unwrap()
      .then(() =>
        pushToast({ kind: "success", title: t("adminPanel.properties.toast.approved") })
      );
  };

  const submitReject = () => {
    if (!rejectId) return;
    if (!rejectDirectly) {
      const d = rejectionDescription.trim();
      const m = rejectionMessage.trim();
      if (!d || !m) {
        setRejectModalError(t("adminPanel.properties.rejectModal.errorBothFields"));
        return;
      }
    }
    setRejectModalError(null);
    const payload = rejectDirectly
      ? {
          id: rejectId,
          rejectionType: "DIRECT" as const,
          rejectionDescription: "",
          rejectionMessage: "",
          canResubmit: false,
        }
      : {
          id: rejectId,
          rejectionType: "WITH_REASON" as const,
          rejectionDescription: rejectionDescription.trim(),
          rejectionMessage: rejectionMessage.trim(),
          canResubmit: true,
        };
    dispatch(rejectListing(payload))
      .unwrap()
      .then(() => {
        pushToast({ kind: "success", title: t("adminPanel.properties.toast.rejected") });
        setRejectId(null);
      });
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    dispatch(deleteListingById(deleteId))
      .unwrap()
      .then(() => {
        pushToast({ kind: "success", title: t("adminPanel.properties.toast.deleted") });
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
    <AdminLayout title={t("adminPanel.properties.title")}>
      <div className="mx-auto max-w-7xl space-y-5">
        <ToastStack toasts={toasts} onDismiss={dismissToast} />

        <header className="relative overflow-hidden rounded-2xl border border-[var(--b2)]/70 bg-[var(--white)] p-5 shadow-[0_2px_16px_rgba(27,67,50,0.06)] sm:p-6">
          <div
            className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-[var(--b2-soft)] to-transparent"
            aria-hidden
          />
          <div className="relative">
            <h2 className="text-lg font-semibold tracking-tight text-[var(--b1)] sm:text-xl">
              {t("adminPanel.properties.heading")}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">
              {t("adminPanel.properties.subtitle")}
            </p>
          </div>
        </header>

        <section
          className="rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] p-4 shadow-sm sm:p-5"
          aria-label={t("adminPanel.properties.filtersAria")}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-12 xl:gap-4">
            <div className="sm:col-span-2 xl:col-span-5">
              <label
                htmlFor="admin-properties-search"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--b1-mid)]"
              >
                {t("common.search")}
              </label>
              <Input
                id="admin-properties-search"
                placeholder={t("adminPanel.properties.searchPlaceholder")}
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
                {t("common.status")}
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
                <option value="">{t("adminPanel.properties.allStatuses")}</option>
                <option value="pending">{t("adminPanel.properties.status.pending")}</option>
                <option value="approved">{t("adminPanel.properties.status.approved")}</option>
                <option value="rejected">{t("adminPanel.properties.status.rejected")}</option>
                <option value="sold">{t("adminPanel.properties.status.sold")}</option>
              </select>
            </div>
            <div className="sm:col-span-2 xl:col-span-4">
              <label
                htmlFor="admin-properties-type"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--b1-mid)]"
              >
                {t("adminPanel.properties.propertyTypeLabel")}
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
                <option value="">{t("adminPanel.properties.allTypes")}</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {translatePropertyType(type)}
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
            {t("adminPanel.properties.loading")}
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
                  onDelete={() => setDeleteId(listing._id)}
                  actionBtn={actionBtn}
                  getApprovalLabel={getApprovalLabel}
                />
              ))}
              {filtered.length === 0 && (
                <p className="rounded-xl border border-dashed border-[var(--b2)] py-10 text-center text-sm text-[var(--muted)]">
                  {t("propertyList.emptyFiltered")}
                </p>
              )}
            </div>

            <div className="hidden md:block overflow-x-auto rounded-2xl border border-[var(--b2)] bg-[var(--white)] shadow-inner">
              <table className="w-full min-w-[920px] text-xs text-[var(--b1)]">
                <thead className="sticky top-0 z-10 bg-gradient-to-r from-[var(--b2-soft)] to-[var(--white)] text-[11px] font-semibold uppercase tracking-wide shadow-sm">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">{t("adminPanel.properties.table.property")}</th>
                    <th className="px-4 py-3 text-left font-medium">{t("adminPanel.properties.table.type")}</th>
                    <th className="px-4 py-3 text-left font-medium">{t("adminPanel.properties.table.price")}</th>
                    <th className="px-4 py-3 text-left font-medium">{t("adminPanel.properties.table.status")}</th>
                    <th className="px-4 py-3 text-right font-medium">{t("adminPanel.properties.table.actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--b2)]/80">
                  {filtered.map((listing, index) => (
                    <tr
                      key={listing._id}
                      className={[
                        "transition-colors hover:bg-[var(--b2-soft)]/80",
                        index % 2 === 1 ? "bg-[var(--b2-soft)]/15" : "",
                      ].join(" ")}
                    >
                      <td className="px-4 py-3 align-top">
                        <p className="text-xs font-semibold text-[var(--b1)]">
                          {listing.title || t("propertyCard.untitledProperty")}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[var(--b1-mid)] line-clamp-2">
                          {listing.address}
                        </p>
                      </td>
                      <td className="px-4 py-3 align-top text-[var(--b1-mid)]">
                        {translatePropertyType(listing.propertyType) || listing.propertyType}
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
                          {getApprovalLabel(listing.status)}
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
                            aria-label={
                              isListingViewed(listing)
                                ? t("adminPanel.properties.viewed")
                                : t("adminPanel.properties.unviewed")
                            }
                            title={
                              isListingViewed(listing)
                                ? t("adminPanel.properties.viewed")
                                : t("adminPanel.properties.unviewed")
                            }
                          >
                            {isListingViewed(listing) ? (
                              <Eye className="h-3.5 w-3.5" />
                            ) : (
                              <EyeOff className="h-3.5 w-3.5" />
                            )}
                            {t("common.view")}
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
                            {t("common.approve")}
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
                            {t("common.reject")}
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
                            {t("common.delete")}
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
                        {t("adminPanel.properties.emptyPage")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {(totalPages > 1 || listingsPagination.total > 0) && (
              <div className="flex flex-col items-stretch justify-between gap-3 rounded-xl border border-[var(--b2)]/60 bg-[var(--b2-soft)]/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-center text-[11px] text-[var(--muted)] sm:text-left">
                  {t("adminPanel.properties.pagination.pageOf", { page, totalPages })}
                  {listingsPagination.total > 0 && (
                    <>
                      {" "}
                      · {t("adminPanel.properties.pagination.total", { count: listingsPagination.total })}
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
                    {t("adminPanel.properties.pagination.prev")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!canNext || listingsLoading}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    {t("adminPanel.properties.pagination.next")}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {rejectId && (
          <Modal
            title={t("adminPanel.properties.rejectModal.title")}
            onClose={() => setRejectId(null)}
            closeLabel={t("common.close")}
            footer={
              <>
                <Button variant="outline" onClick={() => setRejectId(null)} disabled={actionLoading}>
                  {t("common.cancel")}
                </Button>
                <Button onClick={submitReject} disabled={actionLoading}>
                  {actionLoading ? t("adminPanel.properties.submitting") : t("common.reject")}
                </Button>
              </>
            }
          >
            <div className="space-y-4 text-sm text-[var(--b1)]">
              <div>
                <label
                  htmlFor="admin-reject-property-name"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--b1-mid)]"
                >
                  {t("adminPanel.properties.rejectModal.propertyName")}
                </label>
                <Input
                  id="admin-reject-property-name"
                  readOnly
                  value={rejectTargetListing?.title || t("propertyCard.untitledProperty")}
                  className="border-[var(--b2)] bg-[var(--b2-soft)]/40 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="admin-reject-description"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--b1-mid)]"
                >
                  {t("adminPanel.properties.rejectModal.shortDescription")}
                </label>
                <textarea
                  id="admin-reject-description"
                  rows={3}
                  disabled={rejectDirectly || actionLoading}
                  value={rejectionDescription}
                  onChange={(e) => setRejectionDescription(e.target.value)}
                  className={`${filterSelectClass} min-h-[88px] resize-y py-2.5`}
                />
              </div>
              <div>
                <label
                  htmlFor="admin-reject-message"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--b1-mid)]"
                >
                  {t("adminPanel.properties.rejectModal.suggestionMessage")}
                </label>
                <textarea
                  id="admin-reject-message"
                  rows={3}
                  disabled={rejectDirectly || actionLoading}
                  value={rejectionMessage}
                  onChange={(e) => setRejectionMessage(e.target.value)}
                  className={`${filterSelectClass} min-h-[88px] resize-y py-2.5`}
                />
              </div>
              <label className="flex cursor-pointer items-start gap-2.5 text-sm text-[var(--b1)]">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--b2)] text-[var(--b1-mid)] focus:ring-[var(--b1-mid)]"
                  checked={rejectDirectly}
                  disabled={actionLoading}
                  onChange={(e) => {
                    setRejectDirectly(e.target.checked);
                    setRejectModalError(null);
                  }}
                />
                <span>{t("adminPanel.properties.rejectModal.rejectWithoutReason")}</span>
              </label>
              {rejectModalError ? (
                <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                  {rejectModalError}
                </p>
              ) : null}
            </div>
          </Modal>
        )}

        {deleteId && (
          <Modal
            title={t("adminPanel.properties.deleteModal.title")}
            onClose={() => setDeleteId(null)}
            closeLabel={t("common.close")}
            footer={
              <>
                <Button variant="outline" onClick={() => setDeleteId(null)}>
                  {t("common.cancel")}
                </Button>
                <Button
                  onClick={confirmDelete}
                  disabled={actionLoading}
                  className="!bg-rose-600 hover:!opacity-90"
                >
                  {actionLoading ? t("adminPanel.properties.deleting") : t("common.delete")}
                </Button>
              </>
            }
          >
            <p className="text-sm text-[var(--b1)]">
              {t("adminPanel.properties.deleteModal.body")}
            </p>
          </Modal>
        )}
        <CustomAlert
          open={viewGuardAlertOpen}
          title={t("adminPanel.properties.actionBlocked.title")}
          message={t("adminPanel.properties.actionBlocked.message")}
          onConfirm={() => setViewGuardAlertOpen(false)}
        />
      </div>
    </AdminLayout>
  );
};

function Modal({
  title,
  children,
  onClose,
  footer,
  closeLabel,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  footer: React.ReactNode;
  closeLabel: string;
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
            aria-label={closeLabel}
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
  onDelete,
  actionBtn,
  getApprovalLabel,
}: {
  listing: Property;
  isViewed: boolean;
  actionLoading: boolean;
  onApprove: () => void;
  onReject: () => void;
  onOpenDetails: () => void;
  onDelete: () => void;
  actionBtn: string;
  getApprovalLabel: (status: string | undefined) => string;
}) {
  const { t } = useTranslation();
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
            {listing.title || t("propertyCard.untitledProperty")}
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
          {getApprovalLabel(listing.status)}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[var(--b1-mid)]">
        <span>{translatePropertyType(listing.propertyType) || listing.propertyType}</span>
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
          aria-label={isViewed ? t("adminPanel.properties.viewed") : t("adminPanel.properties.unviewed")}
          title={isViewed ? t("adminPanel.properties.viewed") : t("adminPanel.properties.unviewed")}
        >
          {isViewed ? (
            <Eye className="h-3.5 w-3.5" />
          ) : (
            <EyeOff className="h-3.5 w-3.5" />
          )}
          {t("common.view")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={actionLoading || !isViewed || cannotApprove}
          onClick={onApprove}
          className={`${actionBtn} border-emerald-500/40 text-emerald-700`}
        >
          {t("common.approve")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={actionLoading || !isViewed || cannotReject}
          onClick={onReject}
          className={`${actionBtn} border-amber-500/40 text-amber-800`}
        >
          {t("common.reject")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={actionLoading || !isViewed}
          onClick={onDelete}
          className={`${actionBtn} border-rose-500/40 text-rose-700`}
        >
          {t("common.delete")}
        </Button>
      </div>
    </div>
  );
});

export default AdminPropertiesPage;
