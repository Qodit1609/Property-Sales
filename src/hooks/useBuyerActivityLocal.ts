import { useCallback, useEffect, useState } from "react";
import { loadBuyerActivity, type BuyerActivityData } from "../lib/buyerProfileStorage";

export function useBuyerActivityLocal(email: string | undefined) {
  const [activity, setActivity] = useState<BuyerActivityData | null>(() =>
    loadBuyerActivity(email)
  );

  const refresh = useCallback(() => {
    setActivity(loadBuyerActivity(email));
  }, [email]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onCustom = () => refresh();
    const onStorage = (e: StorageEvent) => {
      if (!e.key?.includes("bhoomi_buyer_activity_v1")) return;
      refresh();
    };
    window.addEventListener("buyer-profile-local-changed", onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("buyer-profile-local-changed", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  return activity;
}
