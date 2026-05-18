import { memo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { SellerPropertyLeads } from "@/features/seller/sellerAPI";
import { SellerLeadsTable } from "./SellerLeadsTable";

type PropertyLeadsCardProps = {
  propertyLeads: SellerPropertyLeads;
  onDeleteRow?: (propertyId: string, rowId: string, leadId?: string, activityType?: "cart" | "wishlist" | "compare") => void;
  onClearAll?: (propertyId: string) => void;
};

function PropertyLeadsCardComponent({ propertyLeads, onDeleteRow, onClearAll }: PropertyLeadsCardProps) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] shadow-sm"
    >
      <div className="flex items-center justify-between gap-3 border-b border-[var(--b2)]/70 px-4 py-3 sm:px-5">
        <h2 className="text-base font-semibold text-[var(--b1)]">
          {propertyLeads.propertyName || t("sellerPanel.leadsCard.untitledProperty")}
        </h2>
        <button
          type="button"
          onClick={() => onClearAll?.(propertyLeads.propertyId)}
          className="inline-flex items-center rounded-lg border border-[var(--b2)] bg-[var(--white)] px-2.5 py-1.5 text-xs font-medium text-[var(--error)] transition hover:bg-[var(--b2-soft)]"
        >
          {t("sellerPanel.leadsCard.clearAll")}
        </button>
      </div>
      <SellerLeadsTable
        rows={propertyLeads.leads}
        onDeleteRow={(row) => onDeleteRow?.(propertyLeads.propertyId, row.id, row.leadId, row.activityType as "cart" | "wishlist" | "compare")}
      />
    </motion.div>
  );
}

export const PropertyLeadsCard = memo(PropertyLeadsCardComponent);
