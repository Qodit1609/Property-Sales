export type StoredAgentProfile = {
  displayName: string;
  mobileNumber: string;
  email: string;
  assignedArea: string;
  profilePhotoUrl?: string;
};

const profileKey = (email: string | undefined) =>
  `agent.profile.local.${(email ?? "anonymous").toLowerCase()}`;

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadAgentProfile(email: string | undefined): StoredAgentProfile | null {
  if (typeof window === "undefined") return null;
  return safeParse<StoredAgentProfile>(localStorage.getItem(profileKey(email)));
}

export function saveAgentProfile(email: string | undefined, data: StoredAgentProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(profileKey(email), JSON.stringify(data));
  window.dispatchEvent(new Event("agent-profile-local-changed"));
}
