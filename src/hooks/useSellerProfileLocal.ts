import { useCallback, useEffect, useState } from "react";
import { loadSellerProfile, type StoredSellerProfile } from "../lib/sellerProfileStorage";

/**
 * Re-reads when profile is saved in-session or from another tab (storage event).
 */
export function useSellerProfileLocal(email: string | undefined) {
  const [profile, setProfile] = useState<StoredSellerProfile | null>(() =>
    loadSellerProfile(email)
  );

  const refresh = useCallback(() => {
    setProfile(loadSellerProfile(email));
  }, [email]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onCustom = () => refresh();
    const onStorage = (e: StorageEvent) => {
      if (!e.key?.includes("bhoomi_seller_profile_v1")) return;
      refresh();
    };
    window.addEventListener("seller-profile-local-changed", onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("seller-profile-local-changed", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  return profile;
}
