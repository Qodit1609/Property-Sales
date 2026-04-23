import type {
  ActivityCategoryFilter,
  ActivityLogEntry,
  ActivityLogStats,
  ActivityTypeCode,
  UserTypeFilter,
} from "./activityLogTypes";

export const MOCK_ACTIVITY_LOGS: ActivityLogEntry[] = [
  {
    id: "log-001",
    userName: "John Smith",
    role: "seller",
    activity: "Property added",
    activityType: "PROPERTY_CREATED",
    target: "Farm Land",
    date: "Today",
    status: "Success",
    statusTone: "success",
    actorId: "usr-seller-1",
    entityType: "property",
    entityId: "prop-101",
    timestamp: "2026-04-02T09:15:00.000Z",
    metadata: { source: "dashboard" },
  },
  {
    id: "log-002",
    userName: "Raj Patel",
    role: "buyer",
    activity: "Property viewed",
    activityType: "PROPERTY_VIEWED",
    target: "Plot",
    date: "Today",
    status: "Viewed",
    statusTone: "info",
    actorId: "usr-buyer-2",
    entityType: "property",
    entityId: "prop-88",
    timestamp: "2026-04-02T10:02:00.000Z",
  },
  {
    id: "log-003",
    userName: "Admin",
    role: "admin",
    activity: "Property approved",
    activityType: "PROPERTY_APPROVED",
    target: "Farmhouse",
    date: "Today",
    status: "Approved",
    statusTone: "success",
    actorId: "usr-admin-1",
    entityType: "property",
    entityId: "prop-77",
    timestamp: "2026-04-02T08:40:00.000Z",
  },
  {
    id: "log-004",
    userName: "Priya Sharma",
    role: "seller",
    activity: "Property edited",
    activityType: "PROPERTY_EDITED",
    target: "Agriculture Land",
    date: "Today",
    status: "Success",
    statusTone: "success",
    actorId: "usr-seller-3",
    entityType: "property",
    entityId: "prop-120",
    timestamp: "2026-04-02T11:20:00.000Z",
  },
  {
    id: "log-005",
    userName: "Amit Verma",
    role: "seller",
    activity: "Property deleted",
    activityType: "PROPERTY_DELETED",
    target: "Commercial plot",
    date: "Yesterday",
    status: "Success",
    statusTone: "success",
    actorId: "usr-seller-4",
    entityType: "property",
    entityId: "prop-55",
    timestamp: "2026-04-01T16:45:00.000Z",
  },
  {
    id: "log-006",
    userName: "John Smith",
    role: "seller",
    activity: "Document uploaded",
    activityType: "DOCUMENT_UPLOADED",
    target: "Title deed",
    date: "Today",
    status: "Pending",
    statusTone: "warning",
    actorId: "usr-seller-1",
    entityType: "document",
    entityId: "doc-901",
    timestamp: "2026-04-02T12:00:00.000Z",
  },
  {
    id: "log-007",
    userName: "John Smith",
    role: "seller",
    activity: "Seller login",
    activityType: "SELLER_LOGIN",
    target: "Session",
    date: "Today",
    status: "Success",
    statusTone: "success",
    actorId: "usr-seller-1",
    entityType: "session",
    timestamp: "2026-04-02T08:05:00.000Z",
  },
  {
    id: "log-008",
    userName: "Raj Patel",
    role: "buyer",
    activity: "Buyer login",
    activityType: "BUYER_LOGIN",
    target: "Session",
    date: "Today",
    status: "Success",
    statusTone: "success",
    actorId: "usr-buyer-2",
    entityType: "session",
    timestamp: "2026-04-02T09:50:00.000Z",
  },
  {
    id: "log-009",
    userName: "Raj Patel",
    role: "buyer",
    activity: "Contact request",
    activityType: "CONTACT_REQUEST",
    target: "Villa listing",
    date: "Today",
    status: "Pending",
    statusTone: "warning",
    actorId: "usr-buyer-2",
    entityType: "lead",
    entityId: "lead-404",
    timestamp: "2026-04-02T10:30:00.000Z",
  },
  {
    id: "log-010",
    userName: "Neha Gupta",
    role: "buyer",
    activity: "Property saved",
    activityType: "PROPERTY_SAVED",
    target: "Resort",
    date: "Yesterday",
    status: "Success",
    statusTone: "success",
    actorId: "usr-buyer-5",
    entityType: "property",
    entityId: "prop-200",
    timestamp: "2026-04-01T19:10:00.000Z",
  },
  {
    id: "log-011",
    userName: "Admin",
    role: "admin",
    activity: "Property rejected",
    activityType: "PROPERTY_REJECTED",
    target: "Flat",
    date: "Yesterday",
    status: "Failed",
    statusTone: "danger",
    actorId: "usr-admin-1",
    entityType: "property",
    entityId: "prop-66",
    timestamp: "2026-04-01T14:00:00.000Z",
  },
  {
    id: "log-012",
    userName: "Admin",
    role: "admin",
    activity: "Document verified",
    activityType: "DOCUMENT_VERIFIED",
    target: "Survey map",
    date: "Today",
    status: "Approved",
    statusTone: "success",
    actorId: "usr-admin-1",
    entityType: "document",
    entityId: "doc-905",
    timestamp: "2026-04-02T13:15:00.000Z",
  },
  {
    id: "log-013",
    userName: "Admin",
    role: "admin",
    activity: "User blocked",
    activityType: "USER_BLOCKED",
    target: "Account #4821",
    date: "Yesterday",
    status: "Success",
    statusTone: "success",
    actorId: "usr-admin-1",
    entityType: "user",
    entityId: "usr-4821",
    timestamp: "2026-04-01T11:30:00.000Z",
  },
  {
    id: "log-014",
    userName: "Admin",
    role: "admin",
    activity: "User verified",
    activityType: "USER_VERIFIED",
    target: "Seller KYC",
    date: "Today",
    status: "Approved",
    statusTone: "success",
    actorId: "usr-admin-1",
    entityType: "user",
    entityId: "usr-seller-9",
    timestamp: "2026-04-02T07:00:00.000Z",
  },
  {
    id: "log-015",
    userName: "Kiran Rao",
    role: "buyer",
    activity: "Search activity",
    activityType: "SEARCH_ACTIVITY",
    target: "Farmland near Indore",
    date: "Today",
    status: "Success",
    statusTone: "success",
    actorId: "usr-buyer-8",
    entityType: "search",
    timestamp: "2026-04-02T14:22:00.000Z",
  },
  {
    id: "log-016",
    userName: "Sneha Iyer",
    role: "seller",
    activity: "Profile updated",
    activityType: "PROFILE_UPDATED",
    target: "Profile",
    date: "Yesterday",
    status: "Success",
    statusTone: "success",
    actorId: "usr-seller-6",
    entityType: "user",
    entityId: "usr-seller-6",
    timestamp: "2026-04-01T18:00:00.000Z",
  },
];

const LOGIN_TYPES = new Set<ActivityTypeCode>([
  "SELLER_LOGIN",
  "BUYER_LOGIN",
]);

const PROPERTY_TYPES = new Set<ActivityTypeCode>([
  "PROPERTY_CREATED",
  "PROPERTY_EDITED",
  "PROPERTY_DELETED",
  "PROPERTY_APPROVED",
  "PROPERTY_REJECTED",
]);

const DOCUMENT_TYPES = new Set<ActivityTypeCode>([
  "DOCUMENT_UPLOADED",
  "DOCUMENT_VERIFIED",
]);

const LEADS_TYPES = new Set<ActivityTypeCode>([
  "CONTACT_REQUEST",
  "PROPERTY_VIEWED",
  "PROPERTY_SAVED",
  "SEARCH_ACTIVITY",
]);

const SECURITY_TYPES = new Set<ActivityTypeCode>([
  "USER_BLOCKED",
  "USER_VERIFIED",
  "PROFILE_UPDATED",
]);

export function activityMatchesCategory(
  activityType: ActivityTypeCode,
  category: ActivityCategoryFilter
): boolean {
  if (category === "all") return true;
  if (category === "login") return LOGIN_TYPES.has(activityType);
  if (category === "property") return PROPERTY_TYPES.has(activityType);
  if (category === "documents") return DOCUMENT_TYPES.has(activityType);
  if (category === "leads") return LEADS_TYPES.has(activityType);
  if (category === "security") return SECURITY_TYPES.has(activityType);
  return true;
}

export function computeActivityStats(logs: ActivityLogEntry[]): ActivityLogStats {
  return {
    total: logs.length,
    seller: logs.filter((l) => l.role === "seller").length,
    buyer: logs.filter((l) => l.role === "buyer").length,
    admin: logs.filter((l) => l.role === "admin").length,
  };
}

export function filterActivityLogs(
  logs: ActivityLogEntry[],
  options: {
    userType: UserTypeFilter;
    activityCategory: ActivityCategoryFilter;
    search: string;
  }
): ActivityLogEntry[] {
  const q = options.search.trim().toLowerCase();
  return logs.filter((row) => {
    if (options.userType !== "all" && row.role !== options.userType) {
      return false;
    }
    if (!activityMatchesCategory(row.activityType, options.activityCategory)) {
      return false;
    }
    if (q && !row.userName.toLowerCase().includes(q)) {
      return false;
    }
    return true;
  });
}
