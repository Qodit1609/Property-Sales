import React, { useState, useMemo } from "react";
import { CheckCircle2, Trash2, XCircle } from "lucide-react";
import { Button, Input } from "@/components/common";

import type { Property } from "../../features/properties/propertyType";

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
    "all" | "approved" | "pending" | "rejected"
  >("all");

  const getStatusBadgeClass = (status: string) => {
    if (status === "approved") return "bg-emerald-500/15 text-emerald-600";
    if (status === "rejected") return "bg-rose-500/15 text-rose-600";
    return "bg-amber-500/15 text-amber-600";
  };

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (filterStatus !== "all" && l.status !== filterStatus) return false;
      if (!query) return true;
      const lower = query.toLowerCase();
      return (
        (l.title && l.title.toLowerCase().includes(lower)) ||
        (l.address && l.address.toLowerCase().includes(lower))
      );
    });
  }, [listings, query, filterStatus]);

  const actionBtnBase =
    "inline-flex items-center gap-1 text-[11px] font-medium";

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[var(--b1)]">
            Property moderation
          </h2>
          <p className="text-[11px] text-[var(--muted)]">
            Approve, reject or flag listings with a Stripe-grade table experience.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Search listings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-48 text-sm"
          />

          <select
            value={filterStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setFilterStatus(
                e.target.value as "all" | "approved" | "pending" | "rejected"
              )
            }
            className="rounded-md border border-[var(--b2)] bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b1-mid)]"
          >
            <option value="all">All statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading && (
        <p className="text-[11px] text-[var(--muted)]">Loading listings…</p>
      )}
      {error && <p className="text-[11px] text-rose-400">{error}</p>}

      <div className="overflow-x-auto rounded-xl border border-[var(--b2)] bg-[var(--white)]">
        <table className="min-w-[900px] w-full text-xs text-[var(--b1)]">
          <thead className="sticky top-0 bg-[var(--b2-soft)] text-[11px] uppercase tracking-wide text-[var(--b1)]">
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
                  <p className="mt-0.5 text-[11px] text-[var(--b1-mid)] line-clamp-1">
                    {listing.address}
                  </p>
                </td>

                <td className="px-4 py-3 align-top text-xs text-[var(--b1-mid)]">
                  {listing.propertyType}
                </td>

                <td className="px-4 py-3 align-top text-xs text-[var(--b1)]">
                  ₹ {listing.price?.toLocaleString("en-IN") ?? "N/A"}
                </td>

                <td className="px-4 py-3 align-top">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${getStatusBadgeClass(
                      listing.status ?? "pending"
                    )}`}
                  >
                    {listing.status ?? "pending"}
                  </span>
                </td>

                <td className="px-4 py-3 align-top text-right">
                  <div className="flex flex-wrap justify-end gap-1.5">
                    <Button
                      type="button"
                      disabled={actionLoading || listing.status === "approved"}
                      onClick={() => onApprove(listing._id)}
                      variant="outline"
                      className={`${actionBtnBase} border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/20`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approve
                    </Button>

                    <Button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => onReject(listing._id)}
                      variant="outline"
                      className={`${actionBtnBase} border-amber-500/40 text-amber-600 hover:bg-amber-500/20`}
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject
                    </Button>

                    <Button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => onDelete(listing._id)}
                      variant="outline"
                      className={`${actionBtnBase} border-rose-500/40 text-rose-600 hover:bg-rose-500/20`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-[11px] text-[var(--muted)]"
                >
                  No listings available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropertyModeration;