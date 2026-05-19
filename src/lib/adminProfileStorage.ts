export type StoredAdminProfile = {
  profilePhotoUrl?: string | null;
  phone?: string;
};

const profileKey = (identity: string | undefined) =>
  `bhoomi_admin_profile_v1_${(identity ?? "default").toLowerCase()}`;

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadAdminProfile(identity: string | undefined): StoredAdminProfile | null {
  if (typeof window === "undefined") return null;
  return safeParse<StoredAdminProfile>(localStorage.getItem(profileKey(identity)));
}

export function saveAdminProfile(identity: string | undefined, data: StoredAdminProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(profileKey(identity), JSON.stringify(data));
  window.dispatchEvent(new Event("admin-profile-local-changed"));
}
