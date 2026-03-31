import api from "../../lib/apiClient";
import type { ManagedAccount } from "../auth/roleTypes";
import { normalizeRoleValue } from "../auth/roleUtils";
import type { Property } from "../properties/propertyType";

/* =========================
   ACCOUNTS (admin)
========================= */

function normalizeAdminUser(raw: unknown): ManagedAccount {
  const r =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const id = r.id ?? r._id ?? "";
  const role = normalizeRoleValue(r.role);
  return {
    id: id as string | number,
    name: String(r.name ?? ""),
    email: String(r.email ?? ""),
    ...(role ? { role } : {}),
  };
}

export const fetchAdminUsersAPI = async (): Promise<ManagedAccount[]> => {
  const res = await api.get("/admin/users");
  const raw = res.data.data ?? res.data;
  const list = Array.isArray(raw) ? raw : [];
  return list.map(normalizeAdminUser);
};

export const deleteAdminUserAPI = async (userId: string): Promise<void> => {
  await api.delete(`/admin/users/${userId}`);
};

/* =========================
   NORMALIZE (admin list/detail; avoids editing propertyAPI)
========================= */

function extractSellerId(r: Record<string, unknown>): string | undefined {
  const sid = r.sellerId;
  if (sid == null) return undefined;
  if (typeof sid === "string") return sid;
  if (typeof sid === "object" && sid !== null && "_id" in sid) {
    const id = (sid as { _id?: unknown })._id;
    return id != null ? String(id) : undefined;
  }
  return undefined;
}

function quickNormalize(raw: unknown): Property {
  const r =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const statusObj =
    r.status && typeof r.status === "object"
      ? (r.status as Record<string, unknown>)
      : {};
  const loc =
    r.location && typeof r.location === "object"
      ? (r.location as Record<string, unknown>)
      : {};
  const media =
    r.media && typeof r.media === "object"
      ? (r.media as Record<string, unknown>)
      : {};
  const approval = String(
    statusObj.approvalStatus ?? "pending"
  ).toLowerCase();
  const addr =
    String(loc.address ?? r.address ?? "").trim() ||
    [loc.city, loc.state].filter(Boolean).join(", ") ||
    "Location not available";
  const imgRaw = Array.isArray(r.images) ? r.images : [];
  const mediaImgs = Array.isArray(media.images) ? media.images : [];
  const images = (
    imgRaw.length ? imgRaw : mediaImgs
  ).map((x) => String(x));

  const sellerId = extractSellerId(r);

  return {
    _id: String(r._id ?? ""),
    ...(sellerId ? { sellerId } : {}),
    title: String(r.title ?? "Untitled"),
    description: String(r.description ?? ""),
    address: addr,
    price: typeof r.price === "number" ? r.price : Number(r.price) || 0,
    images,
    propertyType: String(r.propertyType ?? "Property"),
    listingType:
      r.listingType === "rent" || r.listingType === "sale"
        ? r.listingType
        : "sale",
    status: approval,
    statusDetails: {
      approvalStatus: approval,
      featured: Boolean(statusObj.featured),
      verified: Boolean(statusObj.verified),
      isActive: Boolean(statusObj.isActive),
    },
  } as Property;
}

/* =========================
   ALL PROPERTIES (ADMIN) — paginated
========================= */

export type AdminListingsParams = {
  page?: number;
  limit?: number;
  status?: string;
  propertyType?: string;
};

export type AdminListingsPagination = {
  total: number;
  page: number;
  pages: number;
  perPage: number;
};

export type AdminListingsResult = {
  items: Property[];
  pagination: AdminListingsPagination;
};

export const fetchAdminListingsAPI = async (
  params: AdminListingsParams = {}
): Promise<AdminListingsResult> => {
  const res = await api.get("/properties/admin/all", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      ...(params.status ? { status: params.status } : {}),
      ...(params.propertyType ? { propertyType: params.propertyType } : {}),
    },
  });

  const rawList = Array.isArray(res.data?.data) ? res.data.data : [];
  const items = rawList.map((item: unknown) => quickNormalize(item));
  const p = res.data?.pagination;
  const pagination: AdminListingsPagination = {
    total: typeof p?.total === "number" ? p.total : items.length,
    page: typeof p?.page === "number" ? p.page : params.page ?? 1,
    pages: typeof p?.pages === "number" ? p.pages : 1,
    perPage: typeof p?.perPage === "number" ? p.perPage : params.limit ?? 10,
  };

  return { items, pagination };
};

/** Backend max page size is 100 (see validatePagination). Fetches every page and merges rows. */
export const ADMIN_LISTINGS_PAGE_SIZE = 100;

export const fetchAllAdminListingsAPI = async (): Promise<AdminListingsResult> => {
  const limit = ADMIN_LISTINGS_PAGE_SIZE;
  const first = await fetchAdminListingsAPI({ page: 1, limit });
  let items = [...first.items];
  const { total, pages } = first.pagination;
  for (let page = 2; page <= pages; page += 1) {
    const batch = await fetchAdminListingsAPI({ page, limit });
    items = items.concat(batch.items);
  }
  return {
    items,
    pagination: {
      total,
      page: 1,
      pages,
      perPage: limit,
    },
  };
};

/* =========================
   APPROVE / REJECT / DELETE
========================= */

export const approveListingAPI = async (id: string): Promise<Property> => {
  const res = await api.put(`/properties/${id}/approve`);
  return quickNormalize(res.data.data ?? res.data);
};

export const rejectListingAPI = async (id: string): Promise<Property> => {
  const res = await api.put(`/properties/${id}/reject`, {
    reason: "Rejected by admin",
  });
  return quickNormalize(res.data.data ?? res.data);
};

export const deleteListingAPI = async (id: string): Promise<void> => {
  await api.delete(`/properties/${id}`);
};

/* =========================
   CREATE / UPDATE
========================= */

export type AdminCreatePropertyPayload = {
  title: string;
  description: string;
  price: number;
  propertyType: string;
  listingType: "sale" | "rent";
};

export const createAdminPropertyAPI = async (
  payload: AdminCreatePropertyPayload
): Promise<Property> => {
  const lat = 22.7196;
  const lng = 75.8577;
  const body = {
    title: payload.title.trim(),
    description: payload.description.trim(),
    price: payload.price,
    propertyType: payload.propertyType,
    listingType: payload.listingType,
    address: "Address pending update",
    city: "Indore",
    state: "Madhya Pradesh",
    pincode: "452001",
    latitude: lat,
    longitude: lng,
    location: {
      address: "Address pending update",
      city: "Indore",
      coordinates: [lng, lat],
    },
  };
  const res = await api.post("/properties", body);
  return quickNormalize(res.data.data ?? res.data);
};

export type AdminUpdatePropertyPayload = {
  title?: string;
  description?: string;
  price?: number;
  propertyType?: string;
  listingType?: "sale" | "rent";
};

export const updateAdminPropertyAPI = async (
  id: string,
  payload: AdminUpdatePropertyPayload
): Promise<Property> => {
  const res = await api.put(`/properties/${id}`, payload);
  return quickNormalize(res.data.data ?? res.data);
};
