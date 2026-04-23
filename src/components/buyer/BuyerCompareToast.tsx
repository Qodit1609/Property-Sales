import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { clearCompareNotice } from "../../features/buyer/buyerSlice";

/** Single global toast so compare limit messages are not repeated on every PropertyCard. */
const BuyerCompareToast: React.FC = () => {
  const dispatch = useAppDispatch();
  const message = useAppSelector((s) => s.buyer.compareNotice);

  useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(() => dispatch(clearCompareNotice()), 5000);
    return () => window.clearTimeout(t);
  }, [message, dispatch]);

  if (!message) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-4 left-1/2 z-[998] w-[min(92vw,24rem)] -translate-x-1/2 px-3"
      role="status"
    >
      <div className="pointer-events-auto rounded-xl border border-amber-200/80 bg-amber-50 px-3 py-2.5 text-center text-xs font-medium text-amber-950 shadow-lg shadow-amber-900/10 ring-1 ring-amber-300/50">
        {message}
      </div>
    </div>
  );
};

export default BuyerCompareToast;
