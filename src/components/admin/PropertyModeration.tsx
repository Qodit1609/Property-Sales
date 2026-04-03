import React, { useState, useMemo } from "react";
import { CheckCircle2, Trash2, XCircle } from "lucide-react";
import { Button, Input } from "@/components/common";
import AdminConfirmDialog from "./AdminConfirmDialog";

import type { Property } from "../../features/properties/propertyType";

function normalizeListingStatus(status: string | undefined): string {
  return (status ?? "pending").toLowerCase();
}

interface PropertyModerationProps {
  listings: Property[];
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}

const PropertyModeration: React.FC<PropertyModerationProps> = ({
  listings,
  loading,
  error,
  actionLoading,
  onApprove,
  onReject,
  onDelete,
}) => {
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "approved" | "pending" | "rejected" | "sold"
  >("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);

  const getStatusBadgeClass = (status: string) => {
    const s = (status || "pending").toLowerCase();
    if (s === "approved") return "bg-emerald-500/15 text-emerald-700";
    if (s === "rejected") return "bg-rose-500/15 text-rose-700";
    if (s === "sold") return "bg-slate-500/15 text-slate-700";
    return "bg-amber-500/15 text-amber-800";
  };

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (
        filterStatus !== "all" &&
        normalizeListingStatus(l.status) !== filterStatus
      )
        return false;
      if (!query) return true;
      const lower = query.toLowerCase();
      return (
        (l.title && l.title.toLowerCase().includes(lower)) ||
        (l.address && l.address.toLowerCase().includes(lower))
      );
    });
  }, [listings, query, filterStatus]);

  const deleteListing = filtered.find((l) => l._id === deleteId);
  const actionBtnBase =
    "inline-flex items-center gap-1 text-[11px] font-medium sm:text-xs";

  const confirmDelete = () => {
    if (!deleteId) return;
    onDelete(deleteId);
    setDeleteId(null);
  };

  const confirmReject = () => {
    if (!rejectId) return;
    onReject(rejectId);
    setRejectId(null);
  };

  return (
    <div className="space-y-5 rounded-2xl border border-[var(--b2)]/90 bg-[var(--white)] p-4 shadow-md shadow-[var(--b1)]/5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-[var(--b1)] sm:text-2xl">
            Property moderation
          </h2>
          <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
            Approve, reject, or remove listings. Use filters to focus on a
            status.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch lg:max-w-xl">
          <Input
            placeholder="Search listings…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full min-w-0 border-[var(--b2)] text-sm shadow-sm sm:flex-1"
          />

          <select
            value={filterStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setFilterStatus(
                e.target.value as
                  | "all"
                  | "approved"
                  | "pending"
                  | "rejected"
                  | "sold"
              )
            }
            className="w-full rounded-lg border border-[var(--b2)] bg-[var(--white)] px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--b1-mid)] sm:w-48"
          >
            <option value="all">All statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

      {error && (
        <div
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
          role="alert"
        >
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-3 rounded-xl border border-[var(--b2)] bg-[var(--white)] px-4 py-10 text-sm text-[var(--muted)]">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[var(--b1-mid)] border-t-transparent" />
          Loading listings…
        </div>
      )}

      {!loading && (
        <>
          <div className="space-y-3 md:hidden">
            {filtered.map((listing) => (
              <article
                key={listing._id}
                className="rounded-xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--b1)]">
                      {listing.title || "Untitled"}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-[var(--b1-mid)]">
                      {listing.address}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${getStatusBadgeClass(
                      listing.status ?? "pending"
                    )}`}
                  >
                    {listing.status ?? "pending"}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--b1-mid)]">
                  <span>{listing.propertyType}</span>
                  <span aria-hidden>·</span>
                  <span className="font-medium text-[var(--b1)]">
                    ₹ {listing.price?.toLocaleString("en-IN") ?? "N/A"}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    disabled={
                      actionLoading ||
                      ["approved", "sold"].includes(
                        normalizeListingStatus(listing.status)
                      )
                    }
                    onClick={() => onApprove(listing._id)}
                    variant="outline"
                    size="sm"
                    className={`${actionBtnBase} border-emerald-400/60 text-emerald-700 hover:bg-emerald-50`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Approve
                  </Button>

                  <Button
                    type="button"
                    disabled={
                      actionLoading ||
                      ["rejected", "sold"].includes(
                        normalizeListingStatus(listing.status)
                      )
                    }
                    onClick={() => setRejectId(listing._id)}
                    variant="outline"
                    size="sm"
                    className={`${actionBtnBase} border-amber-400/60 text-amber-800 hover:bg-amber-50`}
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Reject
                  </Button>

                  <Button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => setDeleteId(listing._id)}
                    variant="outline"
                    size="sm"
                    className={`${actionBtnBase} border-rose-300 text-rose-700 hover:bg-rose-50`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </article>
            ))}
            {filtered.length === 0 && (
              <p className="rounded-xl border border-dashed border-[var(--b2)] bg-[var(--b2-soft)]/30 py-12 text-center text-sm text-[var(--muted)]">
                No listings match your filters.
              </p>
            )}
          </div>

          <div className="hidden overflow-x-auto rounded-xl border border-[var(--b2)] bg-[var(--white)] shadow-inner md:block">
            <table className="min-w-[880px] w-full text-sm text-[var(--b1)]">
              <thead className="sticky top-0 z-10 bg-gradient-to-r from-[var(--b2-soft)] to-[var(--white)] text-xs font-semibold uppercase tracking-wider shadow-sm">
                <tr>
                  <th className="px-4 py-3.5 text-left">Property</th>
                  <th className="px-4 py-3.5 text-left">Type</th>
                  <th className="px-4 py-3.5 text-left">Price</th>
                  <th className="px-4 py-3.5 text-left">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--b2)]/80">
                {filtered.map((listing, index) => (
                  <tr
                    key={listing._id}
                    className={[
                      "transition-colors hover:bg-[var(--b2-soft)]/70",
                      index % 2 === 1 ? "bg-[var(--b2-soft)]/20" : "",
                    ].join(" ")}
                  >
                    <td className="px-4 py-3.5 align-top">
                      <p className="font-semibold text-[var(--b1)]">
                        {listing.title || "Untitled"}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-[var(--b1-mid)]">
                        {listing.address}
                      </p>
                    </td>

                    <td className="px-4 py-3.5 align-top text-[var(--b1-mid)]">
                      {listing.propertyType}
                    </td>

                    <td className="px-4 py-3.5 align-top font-medium">
                      ₹ {listing.price?.toLocaleString("en-IN") ?? "N/A"}
                    </td>

                    <td className="px-4 py-3.5 align-top">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${getStatusBadgeClass(
                          listing.status ?? "pending"
                        )}`}
                      >
                        {listing.status ?? "pending"}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 align-top text-right">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <Button
                          type="button"
                          disabled={
                            actionLoading ||
                            ["approved", "sold"].includes(
                              normalizeListingStatus(listing.status)
                            )
                          }
                          onClick={() => onApprove(listing._id)}
                          variant="outline"
                          size="sm"
                          className={`${actionBtnBase} border-emerald-400/60 text-emerald-700 hover:bg-emerald-50`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Approve
                        </Button>

                        <Button
                          type="button"
                          disabled={
                            actionLoading ||
                            ["rejected", "sold"].includes(
                              normalizeListingStatus(listing.status)
                            )
                          }
                          onClick={() => setRejectId(listing._id)}
                          variant="outline"
                          size="sm"
                          className={`${actionBtnBase} border-amber-400/60 text-amber-800 hover:bg-amber-50`}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Reject
                        </Button>

                        <Button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => setDeleteId(listing._id)}
                          variant="outline"
                          size="sm"
                          className={`${actionBtnBase} border-rose-300 text-rose-700 hover:bg-rose-50`}
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
                      className="px-4 py-12 text-center text-[var(--muted)]"
                    >
                      No listings available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      <AdminConfirmDialog
        open={deleteId !== null}
        title="Delete this listing?"
        description={
          deleteListing
            ? `“${deleteListing.title || "Untitled"}” will be permanently removed.`
            : ""
        }
        confirmLabel="Delete listing"
        destructive
        loading={actionLoading}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />

      <AdminConfirmDialog
        open={rejectId !== null}
        title="Reject this listing?"
        description="The listing will be marked as rejected. You can change this later by approving it again if needed."
        confirmLabel="Reject"
        loading={actionLoading}
        onClose={() => setRejectId(null)}
        onConfirm={confirmReject}
      />
    </div>
  );
};

export default PropertyModeration;
