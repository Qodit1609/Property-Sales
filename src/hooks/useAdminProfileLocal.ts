import { useCallback, useEffect, useState } from "react";
import { loadAdminProfile, type StoredAdminProfile } from "../lib/adminProfileStorage";

export function useAdminProfileLocal(identity: string | undefined) {
  const [profile, setProfile] = useState<StoredAdminProfile | null>(() =>
    loadAdminProfile(identity)
  );

  const refresh = useCallback(() => {
    setProfile(loadAdminProfile(identity));
  }, [identity]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onCustom = () => refresh();
    const onStorage = (e: StorageEvent) => {
      if (!e.key?.includes("bhoomi_admin_profile_v1")) return;
      refresh();
    };
    window.addEventListener("admin-profile-local-changed", onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("admin-profile-local-changed", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  return profile;
}
