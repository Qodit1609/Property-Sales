import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/common";

type CustomAlertProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  showCancel?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
};

const CustomAlert: React.FC<CustomAlertProps> = ({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  showCancel = false,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();
  const resolvedConfirm = confirmLabel ?? t("common.ok");
  const resolvedCancel = cancelLabel ?? t("common.cancel");

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel?.();
      }
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-[var(--b1)]/45 p-4 backdrop-blur-[1px] sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="custom-alert-title"
        className="w-full max-w-md rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-5 shadow-2xl transition-all duration-200"
      >
        <h2 id="custom-alert-title" className="text-lg font-semibold text-[var(--b1)]">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{message}</p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          {showCancel ? (
            <Button type="button" variant="outline" onClick={onCancel}>
              {resolvedCancel}
            </Button>
          ) : null}
          <Button type="button" variant="primary" onClick={onConfirm}>
            {resolvedConfirm}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
