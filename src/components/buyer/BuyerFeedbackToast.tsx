import React, { useEffect, useState } from "react";
import { BUYER_ACTION_FEEDBACK_EVENT } from "./buyerActionFeedback";

/** Global ephemeral toasts for wishlist / compare / cart actions (green theme). */
const BuyerFeedbackToast: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const onEvt = (e: Event) => {
      const ce = e as CustomEvent<string>;
      if (typeof ce.detail === "string" && ce.detail.trim()) {
        setMessage(ce.detail.trim());
      }
    };
    window.addEventListener(BUYER_ACTION_FEEDBACK_EVENT, onEvt);
    return () => window.removeEventListener(BUYER_ACTION_FEEDBACK_EVENT, onEvt);
  }, []);

  useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(() => setMessage(null), 2600);
    return () => window.clearTimeout(t);
  }, [message]);

  if (!message) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-[4.5rem] left-1/2 z-[997] w-[min(92vw,22rem)] -translate-x-1/2 px-3 sm:bottom-6 md:bottom-6"
      role="status"
    >
      <div className="pointer-events-auto rounded-xl border border-emerald-200/90 bg-emerald-50/95 px-3 py-2.5 text-center text-xs font-medium text-emerald-950 shadow-lg shadow-emerald-900/10 ring-1 ring-emerald-300/40">
        {message}
      </div>
    </div>
  );
};

export default BuyerFeedbackToast;
