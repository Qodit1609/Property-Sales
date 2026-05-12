import api from "../../lib/apiClient";

export type LeadType =
  | "buyer_inquiry"
  | "contact_request"
  | "call_request"
  | "visit_request"
  | "seller_lead"
  | "agent_inquiry"
  | "agent_detailed_entry";

export const LEAD_TYPE_VALUES: LeadType[] = [
  "buyer_inquiry",
  "contact_request",
  "call_request",
  "visit_request",
  "seller_lead",
  "agent_inquiry",
  "agent_detailed_entry",
];

export const LEAD_TYPE_LABELS: Record<LeadType, string> = {
  buyer_inquiry: "Buyer Inquiry",
  contact_request: "Contact Request",
  call_request: "Call Request",
  visit_request: "Visit Request",
  seller_lead: "Seller Lead",
  agent_inquiry: "Agent Inquiry",
  agent_detailed_entry: "Agent Detailed Entry",
};

export type LeadActivityHistoryEntry = {
  activityType: string;
  timestamp: string | null;
};

export type LeadActivityState = {
  isActive: boolean;
  timestamp: string | null;
};

export type LeadDetails = {
  submittedAt?: string | null;
  sentAt?: string | null;
  senderIp?: string;
  senderUserAgent?: string;
  failureReason?: string;
  visitDate?: string | null;
  visitType?: string;
  notes?: string;
  clientId?: string | null;
  viewCount?: number;
  lastViewedAt?: string | null;
  propertyType?: string;
  price?: number | null;
  address?: string;
  activities?: Record<string, LeadActivityState | null | undefined> | null;
  activityHistory?: LeadActivityHistoryEntry[];
  buyer?: {
    id?: string | null;
    role?: string;
  };
  propertyId?: string;
  adminRemark?: string;
  step1?: Record<string, unknown>;
  step2?: Record<string, unknown>;
  hasDetailedEntry?: boolean;
  property?: {
    id: string;
    title: string;
    price: number | null;
    propertyType: string;
    listingType: string;
    address: string;
    approvalStatus: string;
  };
};

export type LeadItem = {
  id: string;
  type: LeadType;
  status: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  propertyId: string | null;
  propertyTitle: string;
  agentId: string | null;
  agentName: string;
  sellerId: string | null;
  sellerName: string;
  createdAt: string | null;
  updatedAt: string | null;
  details?: LeadDetails;
};

export type LeadsSummary = {
  total: number;
  byType: Record<LeadType, number>;
  buyerInquiries: number;
  contactRequests: number;
  callRequests: number;
  visitRequests: number;
  sellerLeads: number;
  agentInquiries: number;
  agentDetailedEntries: number;
};

export type LeadsPagination = {
  total: number;
  count: number;
  page: number;
  pages: number;
  perPage: number;
};

export type LeadsListResult = {
  items: LeadItem[];
  pagination: LeadsPagination;
  summary: LeadsSummary;
};

export type LeadsListParams = {
  page?: number;
  limit?: number;
  type?: LeadType | "";
  status?: string;
  search?: string;
  agent?: string;
  seller?: string;
  dateFrom?: string;
  dateTo?: string;
};

const emptyPagination = (page = 1, limit = 20): LeadsPagination => ({
  total: 0,
  count: 0,
  page,
  pages: 1,
  perPage: limit,
});

const emptySummary = (): LeadsSummary => ({
  total: 0,
  byType: {
    buyer_inquiry: 0,
    contact_request: 0,
    call_request: 0,
    visit_request: 0,
    seller_lead: 0,
    agent_inquiry: 0,
    agent_detailed_entry: 0,
  },
  buyerInquiries: 0,
  contactRequests: 0,
  callRequests: 0,
  visitRequests: 0,
  sellerLeads: 0,
  agentInquiries: 0,
  agentDetailedEntries: 0,
});

const sanitizeParams = (
  params: LeadsListParams
): Record<string, string | number> => {
  const cleaned: Record<string, string | number> = {};
  if (params.page) cleaned.page = params.page;
  if (params.limit) cleaned.limit = params.limit;
  if (params.type) cleaned.type = params.type;
  if (params.status) cleaned.status = params.status;
  if (params.search) cleaned.search = params.search;
  if (params.agent) cleaned.agent = params.agent;
  if (params.seller) cleaned.seller = params.seller;
  if (params.dateFrom) cleaned.dateFrom = params.dateFrom;
  if (params.dateTo) cleaned.dateTo = params.dateTo;
  return cleaned;
};

type ParsedListBody = {
  items: LeadItem[];
  pagination: Partial<LeadsPagination> | null;
  summary: Partial<LeadsSummary> | null;
};

/**
 * Supports:
 * - Flat: { data: LeadItem[], pagination, summary } (Express res.json from listLeads)
 * - Wrapped: { success, message, data: { data: LeadItem[], pagination, summary } } (ResponseFormatter.success)
 */
function parseLeadsListResponseBody(resData: unknown): ParsedListBody {
  if (!resData || typeof resData !== "object") {
    return { items: [], pagination: null, summary: null };
  }

  const extractFrom = (obj: Record<string, unknown>): ParsedListBody | null => {
    const rows = obj.data;
    if (!Array.isArray(rows)) return null;
    const pag = obj.pagination;
    const summ = obj.summary;
    return {
      items: rows as LeadItem[],
      pagination:
        pag && typeof pag === "object"
          ? (pag as Partial<LeadsPagination>)
          : null,
      summary:
        summ && typeof summ === "object"
          ? (summ as Partial<LeadsSummary>)
          : null,
    };
  };

  const root = resData as Record<string, unknown>;
  const direct = extractFrom(root);
  if (direct) return direct;

  const inner = root.data;
  if (inner && typeof inner === "object" && !Array.isArray(inner)) {
    const nested = extractFrom(inner as Record<string, unknown>);
    if (nested) return nested;
  }

  return { items: [], pagination: null, summary: null };
}

export const fetchLeadsManagementAPI = async (
  params: LeadsListParams = {}
): Promise<LeadsListResult> => {
  const res = await api.get("/admin/leads-management", {
    params: sanitizeParams(params),
  });

  const { items, pagination: paginationRaw, summary: summaryRaw } =
    parseLeadsListResponseBody(res.data);

  const pagination: LeadsPagination = paginationRaw
    ? {
        total: Number(paginationRaw.total ?? items.length),
        count: Number(paginationRaw.count ?? items.length),
        page: Number(paginationRaw.page ?? params.page ?? 1),
        pages: Number(paginationRaw.pages ?? 1),
        perPage: Number(paginationRaw.perPage ?? params.limit ?? 20),
      }
    : emptyPagination(params.page ?? 1, params.limit ?? 20);

  const summary: LeadsSummary = summaryRaw
    ? {
        ...emptySummary(),
        ...summaryRaw,
        byType: { ...emptySummary().byType, ...(summaryRaw.byType ?? {}) },
      }
    : emptySummary();

  return { items, pagination, summary };
};

export const fetchLeadDetailAPI = async (
  type: LeadType,
  id: string
): Promise<LeadItem> => {
  const res = await api.get(`/admin/leads-management/${type}/${id}`);
  const data = res.data?.data ?? res.data;
  return data as LeadItem;
};
