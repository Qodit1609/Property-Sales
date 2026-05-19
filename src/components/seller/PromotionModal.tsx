import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/common";

type PromotionModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (duration: 1 | 3 | 6) => Promise<void> | void;
  loading?: boolean;
  isFirstPromotionFree: boolean;
};

const PRICING: Record<1 | 3 | 6, number> = {
  1: 2499,
  3: 5999,
  6: 9999,
};

const PromotionModal: React.FC<PromotionModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  isFirstPromotionFree,
}) => {
  const { t } = useTranslation();
  const [duration, setDuration] = useState<1 | 3 | 6>(1);
  const amount = useMemo(() => (isFirstPromotionFree ? 0 : PRICING[duration]), [duration, isFirstPromotionFree]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-[var(--b1)]">{t("sellerPanel.promotionModal.title")}</h3>
          <button
            type="button"
            className="rounded-lg p-1 text-[var(--muted)] hover:bg-[var(--b2-soft)]"
            onClick={onClose}
            aria-label={t("common.close")}
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-[var(--b1)]">{t("sellerPanel.promotionModal.selectDuration")}</p>
            <div className="grid grid-cols-3 gap-2">
              {[1, 3, 6].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDuration(m as 1 | 3 | 6)}
                  className={`rounded-xl border px-3 py-2 text-sm ${
                    duration === m
                      ? "border-[var(--b1-mid)] bg-[var(--b2-soft)] text-[var(--b1)]"
                      : "border-[var(--b2)] bg-[var(--white)] text-[var(--muted)]"
                  }`}
                >
                  {m === 1
                    ? t("sellerPanel.promotionModal.month", { count: m })
                    : t("sellerPanel.promotionModal.months", { count: m })}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-[var(--b2)] bg-[var(--b2-soft)]/30 p-3 text-sm text-[var(--b1)]">
            {t("sellerPanel.promotionModal.pricingLabel")}:{" "}
            {isFirstPromotionFree
              ? t("sellerPanel.promotionModal.pricingFree")
              : t("sellerPanel.promotionModal.pricingRs", { amount: amount.toLocaleString("en-IN") })}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              {t("common.cancel")}
            </Button>
            <Button onClick={() => onSubmit(duration)} disabled={loading}>
              {loading ? t("common.submitting") : t("sellerPanel.promotionModal.sendRequest")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;
