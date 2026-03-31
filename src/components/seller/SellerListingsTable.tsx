import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Property } from "../../features/properties/propertyType";
import { Button } from "@/components/common";
import {
  normalizeListingStatus,
  sortPropertiesByRecency,
} from "../../lib/sellerHelpers";

export interface SellerListingsTableProps {
  listings: Property[];
  actionLoading: boolean;
  onDelete: (id: string) => void;
  /** When set, only the first N listings (after recency sort) are shown. */
  limit?: number;
}

function statusClassName(normalized: ReturnType<typeof normalizeListingStatus>) {
  if (normalized === "approved") {
    return "bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/30";
  }
  if (normalized === "rejected") {
    return "bg-[var(--error-bg)] text-[var(--error)] border-[var(--error)]/30";
  }
  return "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/30";
}

const SellerListingsTable: React.FC<SellerListingsTableProps> = ({
  listings,
  actionLoading,
  onDelete,
  limit,
}) => {
  const { t } = useTranslation();
  const sorted = sortPropertiesByRecency(listings);
  const rows =
    typeof limit === "number" ? sorted.slice(0, limit) : sorted;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[720px] w-full text-sm">
        <thead className="bg-[var(--b2-soft)] text-[var(--b1)]">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">
              {t("sellerDashboard.property")}
            </th>
            <th className="px-4 py-3 text-left font-semibold">
              {t("sellerDashboard.type")}
            </th>
            <th className="px-4 py-3 text-left font-semibold">
              {t("sellerDashboard.price")}
            </th>
            <th className="px-4 py-3 text-left font-semibold">
              {t("sellerDashboard.status")}
            </th>
            <th className="px-4 py-3 text-right font-semibold">
              {t("sellerDashboard.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--b2)]">
          {rows.map((p) => {
            const normalized = normalizeListingStatus(
              p.status ?? p.statusDetails?.approvalStatus
            );
            const title = p.title?.trim() || t("sellerDashboard.untitled");
            const addr =
              p.address?.trim() ||
              p.locationText?.trim() ||
              p.location?.address?.trim() ||
              "";
            return (
              <tr key={p._id} className="hover:bg-[var(--b2-soft)]">
                <td className="px-4 py-3 align-top">
                  <p className="font-medium text-[var(--b1)]">{title}</p>
                  {addr ? (
                    <p className="mt-0.5 line-clamp-2 text-xs text-[var(--muted)]">
                      {addr}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3 align-top text-[var(--b1)]">
                  {p.propertyType || t("sellerDashboard.na")}
                </td>
                <td className="px-4 py-3 align-top tabular-nums text-[var(--b1)]">
                  {typeof p.price === "number" && Number.isFinite(p.price)
                    ? `₹ ${p.price.toLocaleString("en-IN")}`
                    : t("sellerDashboard.na")}
                </td>
                <td className="px-4 py-3 align-top">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusClassName(
                      normalized
                    )}`}
                  >
                    {normalized}
                  </span>
                </td>
                <td className="px-4 py-3 align-top text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Link
                      to={`/properties/${p._id}`}
                      className="inline-flex rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-1.5 text-xs font-medium text-[var(--b1)] transition hover:bg-[var(--b2-soft)]"
                    >
                      {t("propertyCard.viewDetails")}
                    </Link>
                    <Button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => onDelete(p._id)}
                      className="inline-flex items-center rounded-md border border-[var(--error)] bg-[var(--error-bg)] px-3 py-1.5 text-xs font-medium text-[var(--error)] transition hover:opacity-80 disabled:opacity-50"
                    >
                      {t("sellerDashboard.delete")}
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-8 text-center text-sm text-[var(--muted)]"
              >
                {t("sellerDashboard.noListingsYet")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SellerListingsTable;
