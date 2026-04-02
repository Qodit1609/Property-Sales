/**
 * Admin audit / activity log types.
 * UI fields + placeholders for future API / Mongo activity collection.
 */

export type ActivityLogRole = "seller" | "buyer" | "admin";

/** High-level buckets for filter UI (maps to activityType groups). */
export type ActivityCategoryFilter =
  | "all"
  | "login"
  | "property"
  | "documents"
  | "leads"
  | "security";

export type UserTypeFilter = "all" | ActivityLogRole;

export type ActivityTypeCode =
  | "PROPERTY_CREATED"
  | "PROPERTY_EDITED"
  | "PROPERTY_DELETED"
  | "DOCUMENT_UPLOADED"
  | "SELLER_LOGIN"
  | "PROFILE_UPDATED"
  | "BUYER_LOGIN"
  | "PROPERTY_VIEWED"
  | "CONTACT_REQUEST"
  | "PROPERTY_SAVED"
  | "SEARCH_ACTIVITY"
  | "PROPERTY_APPROVED"
  | "PROPERTY_REJECTED"
  | "DOCUMENT_VERIFIED"
  | "USER_BLOCKED"
  | "USER_VERIFIED";

/** Display / badge variant for the Status column. */
export type ActivityStatusTone =
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "info";

export interface ActivityLogEntry {
  id: string;
  /** Display name in table */
  userName: string;
  role: ActivityLogRole;
  /** Human-readable activity label */
  activity: string;
  activityType: ActivityTypeCode;
  target: string;
  /** Short display e.g. "Today" — future: format from timestamp */
  date: string;
  /** Row status label */
  status: string;
  statusTone: ActivityStatusTone;

  /** Future: actor document id */
  actorId?: string;
  /** Future: related entity type (property, user, document, …) */
  entityType?: string;
  /** Future: related entity id */
  entityId?: string;
  /** ISO timestamp for sorting / API */
  timestamp: string;
  /** Future: arbitrary payload from backend */
  metadata?: Record<string, unknown>;
}

export interface ActivityLogStats {
  total: number;
  seller: number;
  buyer: number;
  admin: number;
}
