import { useCallback, useEffect, useState } from "react";
import { loadSellerActivity, type SellerActivityData } from "../lib/sellerProfileStorage";

export function useSellerActivityLocal(email: string | undefined) {
  const [activity, setActivity] = useState<SellerActivityData | null>(() =>
    loadSellerActivity(email)
  );

  const refresh = useCallback(() => {
    setActivity(loadSellerActivity(email));
  }, [email]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onCustom = () => refresh();
    const onStorage = (e: StorageEvent) => {
      if (!e.key?.includes("bhoomi_seller_activity_v1")) return;
      refresh();
    };
    window.addEventListener("seller-profile-local-changed", onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("seller-profile-local-changed", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  return activity;
}
