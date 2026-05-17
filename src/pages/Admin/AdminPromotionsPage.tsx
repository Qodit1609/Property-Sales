import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/common";
import { ToastStack, type ToastMessage } from "@/components/propertyPost/Toast";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import type { Property } from "@/features/properties/propertyType";
import {
  approvePromotionRequestAPI,
  fetchPromotionRequestsAPI,
  rejectPromotionRequestAPI,
  repromotePromotionRequestAPI,
  deletePromotionRequestAPI,
} from "@/features/admin/adminAPI";

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

const getRemainingDays = (expiry?: string | null) => {
  if (!expiry) return null;
  const diff = new Date(expiry).getTime() - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const AdminPromotionsPage: React.FC = () => {
  const { t } = useTranslation();
  const [promotionRequests, setPromotionRequests] = useState<Property[]>([]);
  const [promotionLoading, setPromotionLoading] = useState(false);
  const [promotionActionLoadingId, setPromotionActionLoadingId] = useState<string | null>(null);
  const [repromoteConfirmId, setRepromoteConfirmId] = useState<string | null>(null);
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

  const refreshPromotions = useCallback(async () => {
    const requests = await fetchPromotionRequestsAPI();
    setPromotionRequests(requests);
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadPromotions = async () => {
      try {
        setPromotionLoading(true);
        const requests = await fetchPromotionRequestsAPI();
        if (mounted) setPromotionRequests(requests);
      } finally {
        if (mounted) setPromotionLoading(false);
      }
    };
    loadPromotions();
    return () => {
      mounted = false;
    };
  }, []);

  const handleApprovePromotion = useCallback(
    async (id: string) => {
      try {
        setPromotionActionLoadingId(id);
        await approvePromotionRequestAPI(id);
        await refreshPromotions();
        pushToast({ kind: "success", title: t("adminPanel.promotions.toast.approved") });
      } finally {
        setPromotionActionLoadingId(null);
      }
    },
    [pushToast, refreshPromotions]
  );

  const handleRejectPromotion = useCallback(
    async (id: string) => {
      try {
        setPromotionActionLoadingId(id);
        await rejectPromotionRequestAPI(id);
        await refreshPromotions();
        pushToast({ kind: "success", title: t("adminPanel.promotions.toast.rejected") });
      } finally {
        setPromotionActionLoadingId(null);
      }
    },
    [pushToast, refreshPromotions]
  );

  const handleRepromotePromotion = useCallback(
    async (id: string) => {
      try {
        setPromotionActionLoadingId(id);
        await repromotePromotionRequestAPI(id);
        await refreshPromotions();
        pushToast({ kind: "success", title: t("adminPanel.promotions.toast.extended") });
      } finally {
        setPromotionActionLoadingId(null);
        setRepromoteConfirmId(null);
      }
    },
    [pushToast, refreshPromotions]
  );

  return (
    <AdminLayout title={t("adminPanel.promotions.title")}>
      <div className="mx-auto max-w-7xl space-y-5">
        <ToastStack toasts={toasts} onDismiss={dismissToast} />
        <AdminConfirmDialog
          open={repromoteConfirmId !== null}
          title={t("adminPanel.promotions.repromoteTitle")}
          description={t("adminPanel.promotions.repromoteDescription")}
          confirmLabel={t("common.ok")}
          loading={repromoteConfirmId !== null && promotionActionLoadingId === repromoteConfirmId}
          onClose={() => {
            if (promotionActionLoadingId === repromoteConfirmId) return;
            setRepromoteConfirmId(null);
          }}
          onConfirm={() => {
            if (!repromoteConfirmId) return;
            void handleRepromotePromotion(repromoteConfirmId);
          }}
        />
        <section className="rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] p-4 shadow-sm sm:p-5">
          <h3 className="text-base font-semibold text-[var(--b1)]">{t("adminPanel.promotions.heading")}</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">{t("adminPanel.promotions.subtitle")}</p>
          {promotionLoading ? <p className="mt-3 text-sm text-[var(--muted)]">{t("adminPanel.promotions.loading")}</p> : null}
          {!promotionLoading && promotionRequests.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--muted)]">{t("adminPanel.promotions.empty")}</p>
          ) : null}
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {promotionRequests.map((request) => (
              <article key={request._id} className="rounded-xl border border-[var(--b2)] bg-[var(--white)] p-4">
                <p className="text-sm text-[var(--muted)]">
                  {t("adminPanel.promotions.seller", {
                    name: request.seller?.name ?? t("common.unknown"),
                  })}
                </p>
                <p className="mt-1 text-base font-semibold text-[var(--b1)]">{request.title}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {t("adminPanel.promotions.requestedDuration", {
                    months: request.requestedDuration ?? "-",
                  })}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {t("adminPanel.promotions.statusLine", {
                    status: request.promotionStatus ?? "none",
                  })}
                </p>
                {request.promotionStatus === "approved" ? (
                  <>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {t("adminPanel.promotions.approvedAt", {
                        date: formatDateTime(request.approvedAt),
                      })}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {t("adminPanel.promotions.liveDuration", {
                        from: formatDateTime(request.approvedAt),
                        to: formatDateTime(request.featuredExpiryDate),
                      })}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {t("adminPanel.promotions.remainingDays", {
                        days: getRemainingDays(request.featuredExpiryDate) ?? "-",
                      })}
                    </p>
                  </>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  {request.promotionStatus !== "approved" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={promotionActionLoadingId === request._id}
                      onClick={() => handleApprovePromotion(request._id)}
                    >
                      {t("common.approve")}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={promotionActionLoadingId === request._id}
                      onClick={() => setRepromoteConfirmId(request._id)}
                    >
                      {t("adminPanel.promotions.repromote")}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={promotionActionLoadingId === request._id}
                    onClick={() => handleRejectPromotion(request._id)}
                  >
                    {t("common.reject")}
                  </Button>
                  {request.promotionStatus === "rejected" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      disabled={promotionActionLoadingId === request._id}
                      onClick={async () => {
                        try {
                          setPromotionActionLoadingId(request._id);
                          await deletePromotionRequestAPI(request._id);
                          await refreshPromotions();
                          pushToast({ kind: "success", title: t("adminPanel.promotions.toast.deleted") });
                        } finally {
                          setPromotionActionLoadingId(null);
                        }
                      }}
                    >
                      {t("common.delete")}
                    </Button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminPromotionsPage;
