import api from "../../lib/apiClient";
import type { AdminProfileData } from "./adminProfileTypes";
import { buildExtrasFromForm, mapUserToAdminProfile } from "./adminAccountHelpers";

function unwrapData<T>(res: { data?: { data?: T; success?: boolean } }): T | undefined {
  return res.data?.data ?? undefined;
}

export async function fetchAdminUserById(userId: string): Promise<{
  profile: AdminProfileData;
  raw: Record<string, unknown>;
}> {
  const res = await api.get(`/admin/users/${encodeURIComponent(userId)}`);
  const raw = unwrapData<Record<string, unknown>>(res);
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid profile response");
  }
  return { profile: mapUserToAdminProfile(raw), raw };
}

export type UpdateAdminProfilePayload = {
  name: string;
  email: string;
  contact?: string;
  details: string;
  userIdProf?: string | null;
  password?: string;
};

export async function updateAdminUserProfile(
  userId: string,
  payload: UpdateAdminProfilePayload
): Promise<{ profile: AdminProfileData; raw: Record<string, unknown> }> {
  const res = await api.put(`/admin/users/${encodeURIComponent(userId)}`, payload);
  const raw = unwrapData<Record<string, unknown>>(res);
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid update response");
  }
  return { profile: mapUserToAdminProfile(raw), raw };
}

export function buildUpdatePayload(
  form: AdminProfileData,
  previousRaw: Record<string, unknown>,
  password?: string
): UpdateAdminProfilePayload {
  const extras = buildExtrasFromForm(form, previousRaw.details);
  const detailsStr = JSON.stringify(extras);
  if (detailsStr.length > 1000) {
    throw new Error(
      "Profile details are too large for the server (max 1000 characters). Remove extra document links."
    );
  }
  return {
    name: form.basicInfo.fullName.trim(),
    email: form.basicInfo.email.trim(),
    contact: form.basicInfo.phone.trim() || undefined,
    details: detailsStr,
    userIdProf:
      form.media.profileImage || form.basicInfo.profileImage || null,
    ...(password ? { password } : {}),
  };
}

/**
 * Uploads a file to `/media/upload` (admin-only). Returns the CDN URL when successful.
 */
export async function uploadAdminProfileAsset(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("tag", "profile");
  formData.append("name", file.name);
  const res = await api.post("/media/upload", formData);
  const root = res.data?.data as { url?: string; mediaAsset?: { cloudinaryUrl?: string } } | undefined;
  const url = root?.url ?? root?.mediaAsset?.cloudinaryUrl;
  if (!url) {
    throw new Error("Upload did not return a file URL.");
  }
  return url;
}
