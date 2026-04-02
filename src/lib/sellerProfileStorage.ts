/**
 * Local persistence for seller profile and activity timestamps (until profile API exists).
 * Scoped by user email to avoid collisions between accounts on the same device.
 */

export type StoredSellerProfile = {
  displayName: string;
  company?: string;
  phone?: string;
  city?: string;
  gstin?: string;
  bio?: string;
  profilePhotoUrl?: string | null;
};

export type SellerActivityData = {
  /** Set on first successful profile save; null until then. */
  accountCreatedAt: string | null;
  lastLoginAt: string;
};

const profileKey = (email: string | undefined) =>
  `bhoomi_seller_profile_v1_${(email ?? "default").toLowerCase()}`;

const activityKey = (email: string | undefined) =>
  `bhoomi_seller_activity_v1_${(email ?? "default").toLowerCase()}`;

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadSellerProfile(email: string | undefined): StoredSellerProfile | null {
  if (typeof window === "undefined") return null;
  return safeParse<StoredSellerProfile>(localStorage.getItem(profileKey(email)));
}

export function saveSellerProfile(email: string | undefined, data: StoredSellerProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(profileKey(email), JSON.stringify(data));
  window.dispatchEvent(new Event("seller-profile-local-changed"));
}

export function loadSellerActivity(email: string | undefined): SellerActivityData | null {
  if (typeof window === "undefined") return null;
  return safeParse<SellerActivityData>(localStorage.getItem(activityKey(email)));
}

export function writeSellerActivity(email: string | undefined, data: SellerActivityData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(activityKey(email), JSON.stringify(data));
  window.dispatchEvent(new Event("seller-profile-local-changed"));
}

/** Call when seller workspace loads: updates last login for this session. */
export function touchSellerSession(email: string | undefined): void {
  const now = new Date().toISOString();
  const prev = loadSellerActivity(email);
  if (!prev) {
    writeSellerActivity(email, { accountCreatedAt: null, lastLoginAt: now });
    return;
  }
  writeSellerActivity(email, { ...prev, lastLoginAt: now });
}

/** Call when profile is saved the first time — pins “account created” if not already set. */
export function setAccountCreatedIfMissing(email: string | undefined): void {
  const now = new Date().toISOString();
  const prev = loadSellerActivity(email);
  if (!prev) {
    writeSellerActivity(email, { accountCreatedAt: now, lastLoginAt: now });
    return;
  }
  if (prev.accountCreatedAt) return;
  writeSellerActivity(email, { ...prev, accountCreatedAt: now });
}
