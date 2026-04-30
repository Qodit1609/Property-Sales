import api from "@/lib/apiClient";

export type AgentClientType = "buyer" | "seller";

export type AgentClient = {
  id: string;
  name: string;
  email: string;
  type: AgentClientType;
};

export type AgentVisitStatus = "scheduled" | "rescheduled" | "cancelled";

export type AgentVisit = {
  id: string;
  clientId?: string;
  clientName: string;
  property: string;
  when: string;
  status: AgentVisitStatus;
  notes?: string;
};

export type AgentLeadStatus = "new" | "contacted" | "qualified" | "closed";

export type AgentLead = {
  id: string;
  name: string;
  email: string;
  property: string;
  status: AgentLeadStatus;
};

const normalizeClient = (raw: Record<string, unknown>, fallbackType: AgentClientType): AgentClient => {
  const firstName = String(raw.firstName ?? "").trim();
  const lastName = String(raw.lastName ?? "").trim();
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  const directName = String(
    raw.name ??
      raw.clientName ??
      raw.fullName ??
      raw.username ??
      raw.contactName ??
      ""
  ).trim();
  const resolvedName = directName || fullName || "Unknown Client";
  const resolvedEmail = String(raw.email ?? raw.contactEmail ?? raw.mail ?? "N/A").trim() || "N/A";
  const resolvedId = String(raw.id ?? raw._id ?? raw.clientId ?? "").trim();

  return {
    id: resolvedId,
    name: resolvedName,
    email: resolvedEmail,
    type:
      String(raw.type ?? raw.role ?? fallbackType).toLowerCase() === "seller"
        ? "seller"
        : "buyer",
  };
};

const collectClientRows = (value: unknown): Record<string, unknown>[] => {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is Record<string, unknown> => Boolean(item) && typeof item === "object"
    );
  }

  if (!value || typeof value !== "object") return [];

  const source = value as Record<string, unknown>;
  const nestedKeys = ["data", "items", "rows", "clients", "results", "list"];
  for (const key of nestedKeys) {
    const nested = source[key];
    if (Array.isArray(nested)) {
      return nested.filter(
        (item): item is Record<string, unknown> => Boolean(item) && typeof item === "object"
      );
    }
  }

  return [];
};

export const fetchAgentClientsAPI = async (): Promise<AgentClient[]> => {
  const res = await api.get("/agent/clients");
  const payload = res.data?.data ?? res.data ?? {};

  if (Array.isArray(payload)) {
    return collectClientRows(payload).map((client) => normalizeClient(client, "buyer"));
  }

  const source = payload as Record<string, unknown>;
  const buyersRaw = collectClientRows(source.buyers);
  const sellersRaw = collectClientRows(source.sellers);
  const genericRaw = collectClientRows(source.clients).length
    ? collectClientRows(source.clients)
    : collectClientRows(source.items).length
      ? collectClientRows(source.items)
      : collectClientRows(source.rows).length
        ? collectClientRows(source.rows)
        : collectClientRows(source.data);

  const buyers = buyersRaw.map((client) => normalizeClient(client, "buyer"));
  const sellers = sellersRaw.map((client) => normalizeClient(client, "seller"));
  const generic = genericRaw.map((client) => normalizeClient(client, "buyer"));

  const merged = [...buyers, ...sellers, ...generic].filter((client) => client.name.trim().length > 0);
  const seen = new Set<string>();
  return merged.filter((client) => {
    const key = `${client.id}|${client.name.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const fetchAgentVisitsAPI = async (): Promise<AgentVisit[]> => {
  const res = await api.get("/visits");
  const rows = res.data?.data ?? res.data ?? [];
  if (!Array.isArray(rows)) return [];
  return rows.map((row: Record<string, unknown>) => ({
    id: String(row.id ?? row._id ?? ""),
    clientId: row.clientId ? String(row.clientId) : undefined,
    clientName: String(row.clientName ?? row.client ?? "Unknown Client"),
    property: String(row.property ?? row.type ?? ""),
    when: String(row.when ?? row.date ?? ""),
    status:
      String(row.status ?? "scheduled").toLowerCase() === "cancelled"
        ? "cancelled"
        : String(row.status ?? "").toLowerCase() === "rescheduled"
          ? "rescheduled"
          : "scheduled",
    notes: row.notes ? String(row.notes) : undefined,
  }));
};

export const createAgentVisitAPI = async (payload: {
  clientId?: string;
  clientName: string;
  type: string;
  date: string;
  notes?: string;
  status?: AgentVisitStatus;
}): Promise<AgentVisit> => {
  const res = await api.post("/visits", payload);
  const row = res.data?.data ?? res.data ?? {};
  return {
    id: String(row.id ?? row._id ?? ""),
    clientId: row.clientId ? String(row.clientId) : payload.clientId,
    clientName: String(row.clientName ?? payload.clientName),
    property: String(row.property ?? row.type ?? payload.type),
    when: String(row.when ?? row.date ?? payload.date),
    status:
      String(row.status ?? payload.status ?? "scheduled").toLowerCase() === "cancelled"
        ? "cancelled"
        : String(row.status ?? payload.status ?? "").toLowerCase() === "rescheduled"
          ? "rescheduled"
          : "scheduled",
    notes: row.notes ? String(row.notes) : payload.notes,
  };
};

export const deleteAgentVisitAPI = async (visitId: string): Promise<void> => {
  await api.delete(`/visits/${visitId}`);
};

export const fetchAgentLeadsAPI = async (): Promise<AgentLead[]> => {
  const res = await api.get("/leads");
  const rows = res.data?.data ?? res.data ?? [];
  if (!Array.isArray(rows)) return [];
  return rows.map((row: Record<string, unknown>) => ({
    id: String(row.id ?? row._id ?? ""),
    name: String(row.name ?? row.clientName ?? "Unknown"),
    email: String(row.email ?? "N/A"),
    property: String(row.property ?? row.propertyName ?? ""),
    status:
      String(row.status ?? "new").toLowerCase() === "closed"
        ? "closed"
        : String(row.status ?? "").toLowerCase() === "qualified"
          ? "qualified"
          : String(row.status ?? "").toLowerCase() === "contacted"
            ? "contacted"
            : "new",
  }));
};
