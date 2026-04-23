import { useEffect } from "react";
import { CheckCircle2, Info, XCircle, X } from "lucide-react";
import { Button } from "@/components/common";

export type ToastKind = "success" | "error" | "info";

export type ToastMessage = {
  id: string;
  kind: ToastKind;
  title: string;
  detail?: string;
  durationMs?: number;
};

function KindIcon({ kind }: { kind: ToastKind }) {
  const common = "h-4 w-4";
  if (kind === "success")
    return <CheckCircle2 className={`${common} text-[var(--success)]`} />;
  if (kind === "error")
    return <XCircle className={`${common} text-[var(--error)]`} />;
  return <Info className={`${common} text-[var(--b1-mid)]`} />;
}

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timers = toasts.map((t) => {
      const duration = t.durationMs ?? 3500;
      return window.setTimeout(() => onDismiss(t.id), duration);
    });
    return () => timers.forEach((x) => window.clearTimeout(x));
  }, [toasts, onDismiss]);

  return (
    <div className="fixed right-4 top-24 z-[60] flex w-[92vw] max-w-xs flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`relative overflow-hidden rounded-2xl border shadow-lg px-3 py-2.5 backdrop-blur-md
          bg-white/70
          animate-[toastIn_160ms_ease-out]
          ${
            t.kind === "success"
              ? "border-[var(--success)]/40"
              : t.kind === "error"
              ? "border-[var(--error)]/35"
              : "border-[var(--b2)]/60"
          }`}
          role="status"
          aria-live="polite"
        >
          {/* accent bar */}
          <div
            className={`absolute left-0 top-0 h-full w-1 ${
              t.kind === "success"
                ? "bg-[var(--success)]"
                : t.kind === "error"
                ? "bg-[var(--error)]"
                : "bg-[var(--b2)]"
            }`}
          />

          <div className="flex items-start gap-2.5 pl-1">
            <div className="mt-[2px] shrink-0">
              <KindIcon kind={t.kind} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[var(--b1)] truncate leading-5">
                {t.title}
              </p>
              {t.detail && (
                <p className="text-[11px] text-[var(--muted)] leading-4 line-clamp-2">
                  {t.detail}
                </p>
              )}
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={() => onDismiss(t.id)}
              className="shrink-0 rounded-md p-1 text-[var(--b1-mid)] hover:bg-[var(--b2-soft)] hover:text-[var(--b1)] transition"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      {/* local keyframes, scoped to this component */}
      <style>
        {`
          @keyframes toastIn {
            from { opacity: 0; transform: translateY(-6px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}
      </style>
    </div>
  );
}

