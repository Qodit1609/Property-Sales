import React, { useEffect } from "react";
import { Button } from "@/components/common";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-start sm:items-center justify-center overflow-y-auto no-scrollbar p-3 sm:p-4">

      {/* Background Blur */}
      <div
        className="absolute inset-0 bg-[var(--b1)]/35 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative my-2 w-full max-w-3xl overflow-hidden rounded-2xl border border-[var(--b2)]/70 bg-[var(--fg)] shadow-[0_20px_60px_rgba(27,67,50,0.28)]">

        {/* Header */}
        {title ? (
          <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 rounded-t-2xl bg-[var(--b1)] text-[var(--fg)]">
            <h2 className="text-lg font-semibold">{title}</h2>

            <Button
              onClick={onClose}
              aria-label="Close modal"
              className="h-9 w-9 flex items-center justify-center rounded-full bg-[var(--fg)]/20 hover:bg-[var(--fg)]/30 transition"
            >
              ✕
            </Button>
          </div>
        ) : null}

        {/* Body */}
        <div className="p-3 sm:p-4 md:p-5">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Modal;