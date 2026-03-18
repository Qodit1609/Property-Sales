import React, { useEffect } from "react";
import { Button } from "@/components/common";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  if (!open) return null;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">

      {/* Background Blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl border border-white/20 bg-[var(--b2-soft)] backdrop-blur-lg">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 rounded-t-2xl bg-[var(--b1)] text-[var(--white)]">
          <h2 className="text-lg font-semibold">{title}</h2>

          <Button
            onClick={onClose}
            aria-label="Close modal"
            className="h-9 w-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
          >
            ✕
          </Button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Modal;