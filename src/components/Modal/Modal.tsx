import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-3 bg-[var(--fg)]">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl bg-[var(--b2-soft)]">
        <div className="flex items-center justify-between px-5 py-4 rounded-t-2xl bg-[var(--b1)] text-[var(--white)]">
          <h2 className="text-lg font-semibold">{title}</h2>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="h-8 w-8 flex items-center justify-center rounded-full bg-[var(--white)]/20 hover:bg-[var(--b1-mid)] transition focus:outline-none focus:ring-2 focus:ring-[var(--white)]/70"
          >
            ✕
          </button>
        </div>

        <div className="p-6 text-[var(--b1)]">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
