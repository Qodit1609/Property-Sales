import { useCallback, useEffect, useMemo, useState } from "react";
import {
  loadAgentProfile,
  saveAgentProfile,
  type StoredAgentProfile,
} from "../../lib/agentProfileStorage";

export type AgentProfileLocal = StoredAgentProfile;

const baseProfile: AgentProfileLocal = {
  displayName: "",
  mobileNumber: "",
  email: "",
  assignedArea: "",
  profilePhotoUrl: "",
};

export const useAgentProfileLocal = (email?: string | null) => {
  const scopedEmail = useMemo(() => email ?? undefined, [email]);
  const [profile, setProfile] = useState<AgentProfileLocal>(baseProfile);
  const [saveError, setSaveError] = useState<string | null>(null);
  const refresh = useCallback(() => {
    const stored = loadAgentProfile(scopedEmail);
    if (!stored) {
      setProfile(baseProfile);
      return;
    }
    setProfile({
      displayName: stored.displayName ?? "",
      mobileNumber: stored.mobileNumber ?? "",
      email: stored.email ?? "",
      assignedArea: stored.assignedArea ?? "",
      profilePhotoUrl: stored.profilePhotoUrl ?? "",
    });
  }, [scopedEmail]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onCustom = () => refresh();
    const onStorage = (e: StorageEvent) => {
      if (!e.key?.includes("agent.profile.local.")) return;
      refresh();
    };
    window.addEventListener("agent-profile-local-changed", onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("agent-profile-local-changed", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  const saveProfile = (next: AgentProfileLocal) => {
    try {
      setProfile(next);
      saveAgentProfile(scopedEmail, next);
      setSaveError(null);
      return true;
    } catch {
      try {
        const fallback = { ...next, profilePhotoUrl: "" };
        setProfile(fallback);
        saveAgentProfile(scopedEmail, fallback);
        setSaveError("Image was too large, so it was not saved.");
        return false;
      } catch {
        setSaveError("Unable to save profile on this browser.");
        return false;
      }
    }
  };

  return { profile, saveProfile, saveError };
};
