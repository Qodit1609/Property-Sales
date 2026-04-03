/**
 * Local persistence for buyer profile photo and activity (until profile API exists).
 * Scoped by user email to avoid collisions between accounts on the same device.
 */

export type StoredBuyerProfile = {
  profilePhotoUrl?: string | null;
};

export type BuyerActivityData = {
  accountCreatedAt: string | null;
  lastLoginAt: string;
};

const profileKey = (email: string | undefined) =>
  `bhoomi_buyer_profile_v1_${(email ?? "default").toLowerCase()}`;

const activityKey = (email: string | undefined) =>
  `bhoomi_buyer_activity_v1_${(email ?? "default").toLowerCase()}`;

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadBuyerProfile(email: string | undefined): StoredBuyerProfile | null {
  if (typeof window === "undefined") return null;
  return safeParse<StoredBuyerProfile>(localStorage.getItem(profileKey(email)));
}

export function saveBuyerProfile(email: string | undefined, data: StoredBuyerProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(profileKey(email), JSON.stringify(data));
  window.dispatchEvent(new Event("buyer-profile-local-changed"));
}

export function loadBuyerActivity(email: string | undefined): BuyerActivityData | null {
  if (typeof window === "undefined") return null;
  return safeParse<BuyerActivityData>(localStorage.getItem(activityKey(email)));
}

export function writeBuyerActivity(email: string | undefined, data: BuyerActivityData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(activityKey(email), JSON.stringify(data));
  window.dispatchEvent(new Event("buyer-profile-local-changed"));
}

export function touchBuyerSession(email: string | undefined): void {
  const now = new Date().toISOString();
  const prev = loadBuyerActivity(email);
  if (!prev) {
    writeBuyerActivity(email, { accountCreatedAt: now, lastLoginAt: now });
    return;
  }
  writeBuyerActivity(email, { ...prev, lastLoginAt: now });
}
