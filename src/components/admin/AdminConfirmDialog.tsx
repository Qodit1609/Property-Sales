import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/common";

interface AdminConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const AdminConfirmDialog: React.FC<AdminConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive,
  loading,
  onConfirm,
  onClose,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 backdrop-blur-[1px] sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-title"
        className="w-full max-w-md rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="admin-confirm-title"
          className="text-lg font-semibold text-[var(--b1)]"
        >
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          {description}
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onConfirm}
            disabled={loading}
            className={
              destructive
                ? "!bg-rose-600 hover:!bg-rose-700 hover:!opacity-100 focus-visible:ring-2 focus-visible:ring-rose-500"
                : undefined
            }
          >
            <span className="inline-flex items-center gap-2">
              {loading ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              ) : null}
              {confirmLabel}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminConfirmDialog;
