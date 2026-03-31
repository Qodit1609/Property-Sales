import type { AdminProfileData, ProfileExtrasPayload, ThemePreference } from "./adminProfileTypes";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Loose international-friendly phone pattern (optional + and digits/spaces) */
const PHONE_RE = /^[+]?[\d\s().-]{7,20}$/;

export function parseProfileExtras(details: unknown): ProfileExtrasPayload {
  if (details == null || details === "") return {};
  if (typeof details === "object" && !Array.isArray(details)) {
    return details as ProfileExtrasPayload;
  }
  if (typeof details !== "string") return {};
  try {
    const o = JSON.parse(details) as unknown;
    if (o && typeof o === "object" && !Array.isArray(o)) {
      return o as ProfileExtrasPayload;
    }
  } catch {
    return {};
  }
  return {};
}

export function stringifyProfileExtras(extras: ProfileExtrasPayload): string {
  return JSON.stringify(extras);
}

function coerceImageUrl(userIdProf: unknown): string {
  if (userIdProf == null) return "";
  if (typeof userIdProf === "string") return userIdProf;
  if (typeof userIdProf === "object" && userIdProf !== null && "url" in userIdProf) {
    return String((userIdProf as { url?: string }).url ?? "");
  }
  return "";
}

function formatIso(d: unknown): string | null {
  if (d == null) return null;
  if (d instanceof Date) return d.toISOString();
  const t = Date.parse(String(d));
  if (Number.isNaN(t)) return null;
  return new Date(t).toISOString();
}

export function mapUserToAdminProfile(raw: Record<string, unknown>): AdminProfileData {
  const extras = parseProfileExtras(raw.details);
  const fromExtras = typeof extras.profileImage === "string" ? extras.profileImage : "";
  const profileImage = fromExtras || coerceImageUrl(raw.userIdProf);

  const theme: ThemePreference =
    extras.theme === "dark" || extras.theme === "light" ? extras.theme : "light";

  return {
    basicInfo: {
      fullName: String(raw.name ?? ""),
      email: String(raw.email ?? ""),
      phone: String(raw.contact ?? ""),
      profileImage,
    },
    security: {
      passwordMasked: "••••••••",
    },
    professional: {
      role: String(raw.role ?? "admin"),
      experience: String(extras.experience ?? ""),
      department: String(extras.department ?? ""),
    },
    address: {
      country: String(extras.country ?? ""),
      state: String(extras.state ?? ""),
      city: String(extras.city ?? ""),
      zipCode: String(extras.zip ?? ""),
    },
    preferences: {
      theme,
      notifications: Boolean(extras.notifications ?? true),
    },
    activity: {
      lastLogin: formatIso(raw.lastLogin),
      accountCreated: formatIso(raw.createdAt),
    },
    media: {
      profileImage,
      otherDocuments: Array.isArray(extras.documents)
        ? extras.documents.map((x) => String(x))
        : [],
    },
  };
}

export function buildExtrasFromForm(
  form: AdminProfileData,
  previousDetails: unknown
): ProfileExtrasPayload {
  const prev = parseProfileExtras(previousDetails);
  return {
    ...prev,
    experience: form.professional.experience.trim(),
    department: form.professional.department.trim(),
    country: form.address.country.trim(),
    state: form.address.state.trim(),
    city: form.address.city.trim(),
    zip: form.address.zipCode.trim(),
    theme: form.preferences.theme,
    notifications: form.preferences.notifications,
    documents: form.media.otherDocuments,
    profileImage: form.media.profileImage || form.basicInfo.profileImage,
  };
}

export function validateBasicInfo(form: AdminProfileData): string | null {
  if (!form.basicInfo.fullName.trim()) return "Full name is required.";
  if (!form.basicInfo.email.trim()) return "Email is required.";
  if (!EMAIL_RE.test(form.basicInfo.email.trim())) return "Enter a valid email address.";
  if (form.basicInfo.phone.trim() && !PHONE_RE.test(form.basicInfo.phone.trim())) {
    return "Enter a valid phone number.";
  }
  return null;
}

export function validateAddress(form: AdminProfileData): string | null {
  const { country, state, city, zipCode } = form.address;
  const parts = [country, state, city, zipCode].map((x) => x.trim());
  const anyFilled = parts.some(Boolean);
  const allFilled = parts.every(Boolean);
  if (anyFilled && !allFilled) {
    return "Complete country, state, city, and zip code, or leave all empty.";
  }
  return null;
}

export function validatePasswordChange(
  current: string,
  next: string,
  confirm: string
): string | null {
  if (!next && !confirm && !current) return null;
  if (!current.trim()) return "Enter your current password.";
  if (next.length < 6) return "New password must be at least 6 characters.";
  if (next !== confirm) return "New password and confirmation do not match.";
  return null;
}

export const emptyAdminProfile = (): AdminProfileData => ({
  basicInfo: {
    fullName: "",
    email: "",
    phone: "",
    profileImage: "",
  },
  security: { passwordMasked: "••••••••" },
  professional: { role: "admin", experience: "", department: "" },
  address: { country: "", state: "", city: "", zipCode: "" },
  preferences: { theme: "light", notifications: true },
  activity: { lastLogin: null, accountCreated: null },
  media: { profileImage: "", otherDocuments: [] },
});
