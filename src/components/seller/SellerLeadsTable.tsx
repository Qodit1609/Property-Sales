import { memo } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import type { SellerLeadRecord } from "@/features/seller/sellerAPI";

type SellerLeadsTableProps = {
  rows: SellerLeadRecord[];
  onDeleteRow?: (row: SellerLeadRecord) => void;
};

const activityLabelMap: Record<SellerLeadRecord["activityType"], string> = {
  view: "View Property",
  cart: "Add to Cart",
  wishlist: "Wishlist",
  compare: "Compare Property",
};

function formatDateTime(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function SellerLeadsTableComponent({ rows, onDeleteRow }: SellerLeadsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[760px] w-full text-sm">
        <thead className="bg-[var(--b2-soft)]/90">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Buyer Name</th>
            <th className="px-4 py-3 text-left font-semibold">Activity Type</th>
            <th className="px-4 py-3 text-left font-semibold">Property Name</th>
            <th className="px-4 py-3 text-left font-semibold">Date & Time</th>
            <th className="px-4 py-3 text-left font-semibold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--b2)]/70">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-[var(--muted)]">
                No activities yet.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <motion.tr
                key={row.id}
                initial={false}
                whileHover={{ backgroundColor: "rgba(216, 243, 220, 0.35)" }}
                className="transition-colors"
              >
                <td className="px-4 py-3 font-medium text-[var(--b1)]">{row.buyerName || "-"}</td>
                <td className="px-4 py-3 text-[var(--b1)]">
                  {activityLabelMap[row.activityType] ?? row.activityType}
                </td>
                <td className="px-4 py-3 text-[var(--b1)]">{row.propertyName || "-"}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{formatDateTime(row.timestamp)}</td>
                <td className="px-4 py-3 text-[var(--muted)]">
                  <button
                    type="button"
                    onClick={() => onDeleteRow?.(row)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[var(--b2)] bg-[var(--white)] px-2.5 py-1.5 text-xs font-medium text-[var(--error)] transition hover:bg-[var(--b2-soft)]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export const SellerLeadsTable = memo(SellerLeadsTableComponent);
