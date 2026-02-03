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
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-3 bg-[#F8F9F1]">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl bg-[#D8F3DC]">
        <div className="flex items-center justify-between px-5 py-4 rounded-t-2xl bg-[#1B4332] text-white">
          <h2 className="text-lg font-semibold">{title}</h2>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="h-8 w-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-[#2D6A4F] transition focus:outline-none focus:ring-2 focus:ring-white/70"
          >
            ✕
          </button>
        </div>

        <div className="p-6 text-[#1B4332]">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
