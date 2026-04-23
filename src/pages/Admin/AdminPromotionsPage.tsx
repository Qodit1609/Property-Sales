import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/common";
import { ToastStack, type ToastMessage } from "@/components/propertyPost/Toast";
import AdminLayout from "@/components/admin/AdminLayout";
import type { Property } from "@/features/properties/propertyType";
import {
  approvePromotionRequestAPI,
  fetchPromotionRequestsAPI,
  rejectPromotionRequestAPI,
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
  const [promotionRequests, setPromotionRequests] = useState<Property[]>([]);
  const [promotionLoading, setPromotionLoading] = useState(false);
  const [promotionActionLoadingId, setPromotionActionLoadingId] = useState<string | null>(null);
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
        pushToast({ kind: "success", title: "Promotion approved" });
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
        pushToast({ kind: "success", title: "Promotion rejected" });
      } finally {
        setPromotionActionLoadingId(null);
      }
    },
    [pushToast, refreshPromotions]
  );

  return (
    <AdminLayout title="Promotion Requests">
      <div className="mx-auto max-w-7xl space-y-5">
        <ToastStack toasts={toasts} onDismiss={dismissToast} />
        <section className="rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] p-4 shadow-sm sm:p-5">
          <h3 className="text-base font-semibold text-[var(--b1)]">Promotion Requests</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">Dynamic list of seller promotion requests.</p>
          {promotionLoading ? <p className="mt-3 text-sm text-[var(--muted)]">Loading requests...</p> : null}
          {!promotionLoading && promotionRequests.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--muted)]">No promotion requests found.</p>
          ) : null}
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {promotionRequests.map((request) => (
              <article key={request._id} className="rounded-xl border border-[var(--b2)] bg-[var(--white)] p-4">
                <p className="text-sm text-[var(--muted)]">Seller: {request.seller?.name ?? "Unknown"}</p>
                <p className="mt-1 text-base font-semibold text-[var(--b1)]">{request.title}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Requested Duration: {request.requestedDuration ?? "-"} month(s)
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">Status: {request.promotionStatus ?? "none"}</p>
                {request.promotionStatus === "approved" ? (
                  <>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Approved At: {formatDateTime(request.approvedAt)}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Live Duration: {formatDateTime(request.approvedAt)} to{" "}
                      {formatDateTime(request.featuredExpiryDate)}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Remaining Days Left: {getRemainingDays(request.featuredExpiryDate) ?? "-"}
                    </p>
                  </>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={promotionActionLoadingId === request._id}
                    onClick={() => handleApprovePromotion(request._id)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={promotionActionLoadingId === request._id}
                    onClick={() => handleRejectPromotion(request._id)}
                  >
                    Reject
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
                          pushToast({ kind: "success", title: "Promotion request deleted" });
                        } finally {
                          setPromotionActionLoadingId(null);
                        }
                      }}
                    >
                      Delete
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
