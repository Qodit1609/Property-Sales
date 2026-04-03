import { useCallback, useEffect, useState } from "react";
import { loadBuyerProfile, type StoredBuyerProfile } from "../lib/buyerProfileStorage";

export function useBuyerProfileLocal(email: string | undefined) {
  const [profile, setProfile] = useState<StoredBuyerProfile | null>(() =>
    loadBuyerProfile(email)
  );

  const refresh = useCallback(() => {
    setProfile(loadBuyerProfile(email));
  }, [email]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onCustom = () => refresh();
    const onStorage = (e: StorageEvent) => {
      if (!e.key?.includes("bhoomi_buyer_profile_v1")) return;
      refresh();
    };
    window.addEventListener("buyer-profile-local-changed", onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("buyer-profile-local-changed", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  return profile;
}
