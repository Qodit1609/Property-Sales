import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/common";
import { ToastStack, type ToastMessage } from "@/components/propertyPost/Toast";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  approveTestimonial,
  deleteTestimonial,
  getTestimonials,
  rejectTestimonial,
} from "@/features/testimonials/testimonialApi";
import type { Testimonial } from "@/features/testimonials/testimonialTypes";
import CustomAlert from "@/components/common/CustomAlert";

const toLabel = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const badgeClass = (status: string) => {
  if (status === "approved") return "bg-emerald-500/15 text-emerald-700";
  if (status === "rejected") return "bg-rose-500/15 text-rose-700";
  return "bg-amber-500/15 text-amber-800";
};

const AdminTestimonialPage: React.FC = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selected, setSelected] = useState<Testimonial | null>(null);
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [guardAlertOpen, setGuardAlertOpen] = useState(false);

  const pushToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now());
    setToasts((prev) => [...prev, { id, ...toast }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await getTestimonials());
    } catch (error) {
      pushToast({
        kind: "error",
        title: "Load failed",
        detail: error instanceof Error ? error.message : "Unable to fetch testimonials",
      });
    } finally {
      setLoading(false);
    }
  }, [pushToast]);

  useEffect(() => {
    void load();
  }, [load]);

  const withViewedGuard = (item: Testimonial, cb: () => Promise<void>) => {
    if (!viewedIds.has(item.id)) {
      setGuardAlertOpen(true);
      return;
    }
    void cb();
  };

  const runAction = async (task: () => Promise<void>, ok: string) => {
    setActionLoading(true);
    try {
      await task();
      pushToast({ kind: "success", title: ok });
      await load();
    } catch (error) {
      pushToast({
        kind: "error",
        title: "Action failed",
        detail: error instanceof Error ? error.message : "Unable to process action",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const sorted = useMemo(
    () =>
      [...items].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [items]
  );

  return (
    <AdminLayout title="Testimonial">
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <div className="space-y-4 rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm sm:p-5">
        {loading ? (
          <p className="text-sm text-[var(--muted)]">Loading testimonials...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-sm text-[var(--b1)]">
              <thead className="bg-[var(--b2-soft)]/50 text-xs uppercase tracking-wide text-[var(--b1-mid)]">
                <tr>
                  <th className="px-3 py-2 text-left">Full Name</th>
                  <th className="px-3 py-2 text-left">Role</th>
                  <th className="px-3 py-2 text-left">Location</th>
                  <th className="px-3 py-2 text-left">Rating</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Created Date</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--b2)]/60">
                {sorted.map((item) => {
                  const viewed = viewedIds.has(item.id);
                  return (
                    <tr key={item.id}>
                      <td className="px-3 py-2">{item.fullName}</td>
                      <td className="px-3 py-2">{toLabel(item.role)}</td>
                      <td className="px-3 py-2">{item.location}</td>
                      <td className="px-3 py-2">{item.rating}/5</td>
                      <td className="px-3 py-2">
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${badgeClass(
                            item.status
                          )}`}
                        >
                          {toLabel(item.status)}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex justify-end gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelected(item);
                              setViewedIds((prev) => new Set(prev).add(item.id));
                            }}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={actionLoading || !viewed || item.status === "approved"}
                            onClick={() =>
                              withViewedGuard(item, () =>
                                runAction(
                                  () => approveTestimonial(item.id).then(() => undefined),
                                  "Testimonial approved"
                                )
                              )
                            }
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Approve
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={actionLoading || !viewed || item.status === "rejected"}
                            onClick={() =>
                              withViewedGuard(item, () =>
                                runAction(
                                  () => rejectTestimonial(item.id).then(() => undefined),
                                  "Testimonial rejected"
                                )
                              )
                            }
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Reject
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={actionLoading || !viewed}
                            onClick={() =>
                              withViewedGuard(item, () =>
                                runAction(
                                  () => deleteTestimonial(item.id),
                                  "Testimonial deleted"
                                )
                              )
                            }
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-8 text-center text-[var(--muted)]">
                      No testimonials found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-xl rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[var(--b1)]">
                Testimonial Details
              </h3>
              <button
                type="button"
                className="rounded-lg p-1 text-[var(--muted)] hover:bg-[var(--b2-soft)]"
                onClick={() => setSelected(null)}
              >
                ×
              </button>
            </div>
            <div className="space-y-2 text-sm text-[var(--b1)]">
              <p>
                <strong>Name:</strong> {selected.fullName}
              </p>
              <p>
                <strong>Role:</strong> {toLabel(selected.role)}
              </p>
              <p>
                <strong>Location:</strong> {selected.location}
              </p>
              <p>
                <strong>Occupation:</strong> {selected.occupation}
              </p>
              <p>
                <strong>Rating:</strong> {selected.rating}/5
              </p>
              <p>
                <strong>Status:</strong> {toLabel(selected.status)}
              </p>
              <p className="whitespace-pre-wrap">
                <strong>Description:</strong> {selected.description}
              </p>
            </div>
          </div>
        </div>
      )}
      <CustomAlert
        open={guardAlertOpen}
        title="Action blocked"
        message="First click View to enable this action."
        onConfirm={() => setGuardAlertOpen(false)}
      />
    </AdminLayout>
  );
};

export default AdminTestimonialPage;
