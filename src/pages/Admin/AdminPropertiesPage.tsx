import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
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
  createAdminProperty,
  deleteListingById,
  fetchAdminListings,
  rejectListing,
  updateAdminProperty,
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

const AdminPropertiesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    listings,
    listingsLoading,
    listingsError,
    listingsPagination,
    actionLoading,
    mutationError,
  } = useAppSelector((s) => s.admin);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
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

  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [addForm, setAddForm] = useState({
    title: "",
    description: "",
    price: "",
    propertyType: "Farmhouse",
    listingType: "sale" as "sale" | "rent",
  });

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    price: "",
    propertyType: "Farmhouse",
    listingType: "sale" as "sale" | "rent",
  });

  const load = useCallback(() => {
    dispatch(
      fetchAdminListings({
        page,
        limit: PER_PAGE,
        ...(filterStatus ? { status: filterStatus } : {}),
        ...(filterType ? { propertyType: filterType } : {}),
      })
    );
  }, [dispatch, page, filterStatus, filterType]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!mutationError) return;
    const timer = window.setTimeout(() => {
      pushToast({ kind: "error", title: mutationError });
      dispatch(clearAdminMutationError());
    }, 0);
    return () => window.clearTimeout(timer);
  }, [mutationError, dispatch, pushToast]);

  const editing = useMemo(
    () => listings.find((l) => l._id === editId) ?? null,
    [listings, editId]
  );

  const openEdit = useCallback((listing: Property) => {
    setEditForm({
      title: listing.title ?? "",
      description: listing.description ?? "",
      price: String(listing.price ?? ""),
      propertyType: listing.propertyType ?? "Farmhouse",
      listingType:
        listing.listingType === "rent" || listing.listingType === "sale"
          ? listing.listingType
          : "sale",
    });
    setEditId(listing._id);
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return listings;
    const q = search.trim().toLowerCase();
    return listings.filter(
      (l) =>
        (l.title && l.title.toLowerCase().includes(q)) ||
        (l.address && l.address.toLowerCase().includes(q))
    );
  }, [listings, search]);

  const handleApprove = (id: string) => {
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

  const submitAdd = () => {
    const price = Number(addForm.price);
    if (
      !addForm.title.trim() ||
      !addForm.description.trim() ||
      !Number.isFinite(price)
    ) {
      pushToast({
        kind: "error",
        title: "Please fill title, description, and a valid price",
      });
      return;
    }
    dispatch(
      createAdminProperty({
        title: addForm.title,
        description: addForm.description,
        price,
        propertyType: addForm.propertyType,
        listingType: addForm.listingType,
      })
    )
      .unwrap()
      .then(() => {
        pushToast({ kind: "success", title: "Property created" });
        setAddOpen(false);
        setAddForm({
          title: "",
          description: "",
          price: "",
          propertyType: "Farmhouse",
          listingType: "sale",
        });
        setPage(1);
        dispatch(
          fetchAdminListings({
            page: 1,
            limit: PER_PAGE,
            ...(filterStatus ? { status: filterStatus } : {}),
            ...(filterType ? { propertyType: filterType } : {}),
          })
        );
      });
  };

  const submitEdit = () => {
    if (!editId) return;
    const price = Number(editForm.price);
    if (!editForm.title.trim() || !Number.isFinite(price)) {
      pushToast({
        kind: "error",
        title: "Title and valid price are required",
      });
      return;
    }
    dispatch(
      updateAdminProperty({
        id: editId,
        payload: {
          title: editForm.title.trim(),
          description: editForm.description.trim(),
          price,
          propertyType: editForm.propertyType,
          listingType: editForm.listingType,
        },
      })
    )
      .unwrap()
      .then(() => {
        pushToast({ kind: "success", title: "Property updated" });
        setEditId(null);
      });
  };

  const totalPages = Math.max(1, listingsPagination.pages || 1);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const actionBtn =
    "inline-flex items-center gap-1 text-[11px] font-medium disabled:opacity-50";

  return (
    <AdminLayout title="Properties">
      <div className="mx-auto max-w-7xl space-y-4">
        <ToastStack toasts={toasts} onDismiss={dismissToast} />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-[var(--b1)]">
              All properties
            </h2>
            <p className="text-xs text-[var(--muted)]">
              CRUD and moderation for every listing.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate("/post-property/basic")}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Full wizard
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => setAddOpen(true)}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Quick add
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-end">
          <Input
            placeholder="Search on this page…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full lg:max-w-xs text-sm"
          />
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-[var(--b2)] bg-white px-3 py-2 text-sm lg:w-44"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="sold">Sold</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-[var(--b2)] bg-white px-3 py-2 text-sm lg:w-52"
          >
            <option value="">All types</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {listingsLoading && (
          <div className="flex items-center gap-2 rounded-xl border border-[var(--b2)] bg-[var(--white)] px-4 py-8 text-sm text-[var(--muted)]">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[var(--b1-mid)] border-t-transparent" />
            Loading properties…
          </div>
        )}

        {listingsError && !listingsLoading && (
          <p className="text-sm text-rose-600">{listingsError}</p>
        )}

        {!listingsLoading && !listingsError && (
          <>
            <div className="space-y-3 md:hidden">
              {filtered.map((listing) => (
                <PropertyCardMobile
                  key={listing._id}
                  listing={listing}
                  actionLoading={actionLoading}
                  onApprove={() => handleApprove(listing._id)}
                  onReject={() => setRejectId(listing._id)}
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

            <div className="hidden md:block overflow-x-auto rounded-xl border border-[var(--b2)] bg-[var(--white)]">
              <table className="min-w-[920px] w-full text-xs text-[var(--b1)]">
                <thead className="sticky top-0 bg-[var(--b2-soft)] text-[11px] uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Property</th>
                    <th className="px-4 py-3 text-left font-medium">Type</th>
                    <th className="px-4 py-3 text-left font-medium">Price</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--b2)]">
                  {filtered.map((listing) => (
                    <tr
                      key={listing._id}
                      className="hover:bg-[var(--b2-soft)] transition-colors"
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
                        <div className="flex flex-wrap justify-end gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={
                              actionLoading ||
                              (listing.status ?? "").toLowerCase() ===
                                "approved"
                            }
                            onClick={() => handleApprove(listing._id)}
                            className={`${actionBtn} border-emerald-500/40 text-emerald-700`}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Approve
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={actionLoading}
                            onClick={() => setRejectId(listing._id)}
                            className={`${actionBtn} border-amber-500/40 text-amber-800`}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Reject
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={actionLoading}
                            onClick={() => openEdit(listing)}
                            className={`${actionBtn} border-[var(--b2)]`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={actionLoading}
                            onClick={() => setDeleteId(listing._id)}
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

            {totalPages > 1 && (
              <div className="flex flex-col items-center justify-between gap-3 border-t border-[var(--b2)] pt-4 sm:flex-row">
                <p className="text-[11px] text-[var(--muted)]">
                  Page {page} of {totalPages} · {listingsPagination.total} total
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

        {addOpen && (
          <Modal
            title="Quick add property"
            onClose={() => setAddOpen(false)}
            footer={
              <>
                <Button variant="outline" onClick={() => setAddOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={submitAdd} disabled={actionLoading}>
                  {actionLoading ? "Saving…" : "Create"}
                </Button>
              </>
            }
          >
            <div className="space-y-3">
              <Input
                label="Title"
                value={addForm.title}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, title: e.target.value }))
                }
              />
              <div>
                <label className="mb-1 block text-sm">Description</label>
                <textarea
                  className="w-full min-h-[88px] rounded-lg border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={addForm.description}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </div>
              <Input
                label="Price (₹)"
                type="number"
                min={0}
                value={addForm.price}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, price: e.target.value }))
                }
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm">Property type</label>
                  <select
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                    value={addForm.propertyType}
                    onChange={(e) =>
                      setAddForm((f) => ({ ...f, propertyType: e.target.value }))
                    }
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm">Listing type</label>
                  <select
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                    value={addForm.listingType}
                    onChange={(e) =>
                      setAddForm((f) => ({
                        ...f,
                        listingType: e.target.value as "sale" | "rent",
                      }))
                    }
                  >
                    <option value="sale">Sale</option>
                    <option value="rent">Rent</option>
                  </select>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {editId && editing && (
          <Modal
            title="Edit property"
            onClose={() => setEditId(null)}
            footer={
              <>
                <Button variant="outline" onClick={() => setEditId(null)}>
                  Cancel
                </Button>
                <Button onClick={submitEdit} disabled={actionLoading}>
                  {actionLoading ? "Saving…" : "Save changes"}
                </Button>
              </>
            }
          >
            <div className="space-y-3">
              <Input
                label="Title"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, title: e.target.value }))
                }
              />
              <div>
                <label className="mb-1 block text-sm">Description</label>
                <textarea
                  className="w-full min-h-[88px] rounded-lg border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </div>
              <Input
                label="Price (₹)"
                type="number"
                min={0}
                value={editForm.price}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, price: e.target.value }))
                }
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm">Property type</label>
                  <select
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                    value={editForm.propertyType}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, propertyType: e.target.value }))
                    }
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm">Listing type</label>
                  <select
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                    value={editForm.listingType}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        listingType: e.target.value as "sale" | "rent",
                      }))
                    }
                  >
                    <option value="sale">Sale</option>
                    <option value="rent">Rent</option>
                  </select>
                </div>
              </div>
            </div>
          </Modal>
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
  actionLoading,
  onApprove,
  onReject,
  onEdit,
  onDelete,
  actionBtn,
}: {
  listing: Property;
  actionLoading: boolean;
  onApprove: () => void;
  onReject: () => void;
  onEdit: () => void;
  onDelete: () => void;
  actionBtn: string;
}) {
  const st = (listing.status ?? "pending").toLowerCase();
  return (
    <div className="rounded-xl border border-[var(--b2)] bg-[var(--white)] p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-[var(--b1)]">
            {listing.title || "Untitled"}
          </p>
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
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={actionLoading || st === "approved"}
          onClick={onApprove}
          className={`${actionBtn} border-emerald-500/40 text-emerald-700`}
        >
          Approve
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={actionLoading}
          onClick={onReject}
          className={`${actionBtn} border-amber-500/40 text-amber-800`}
        >
          Reject
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={actionLoading}
          onClick={onEdit}
          className={`${actionBtn} border-[var(--b2)]`}
        >
          Edit
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={actionLoading}
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
