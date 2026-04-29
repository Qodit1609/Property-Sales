import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import api from "@/lib/apiClient";

export type AgentPropertyStatus =
  | "draft"
  | "incomplete"
  | "ready"
  | "approved"
  | "rejected";

export type AgentFieldEntryData = {
  propertyId: string;
  agentName: string;
  village: string;
  tehsil: string;
  district: string;
  landType: string;
  propertySize: string;
  roadAccess: string;
  waterAvailability: string;
  ownerName?: string;
  ownerContact?: string;
  images: File[];
};

export type AgentDetailedEntryData = {
  propertyId: string;
  expectedPrice: string;
  negotiable: string;
  ownershipType: string;
  registryAvailable: string;
  khasraAvailable: string;
  landDispute: string;
  electricity: string;
  cropHistory: string;
  ownerContact: string;
  exactLocation: string;
  nearbyLandmarks: string;
  roadType: string;
  waterSourceDetails: string;
  connectivityInfo: string;
  propertyHighlights: string;
  issuesDrawbacks: string;
  attachments: File[];
  khasraFiles: File[];
  khatauniFiles: File[];
  nakshaFiles: File[];
  notes: string;
};

export type AgentCollectedProperty = {
  id: string;
  backendId?: string;
  step1: AgentFieldEntryData;
  step2?: AgentDetailedEntryData;
  status: AgentPropertyStatus;
  createdAt: string;
  updatedAt: string;
};

type AgentCollectionContextValue = {
  properties: AgentCollectedProperty[];
  activeDraft: AgentFieldEntryData | null;
  saveFieldEntry: (payload: AgentFieldEntryData) => Promise<void>;
  saveDetailedEntry: (payload: AgentDetailedEntryData) => Promise<void>;
  clearActiveDraft: () => void;
  setPropertyStatus: (propertyId: string, status: AgentPropertyStatus) => void;
  getPropertyById: (propertyId: string) => AgentCollectedProperty | undefined;
};

const AgentCollectionContext = createContext<AgentCollectionContextValue | null>(
  null
);

const nowIso = () => new Date().toISOString();
const asObject = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};
const asString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;
const normalizeStatus = (value: unknown): AgentPropertyStatus => {
  const status = String(value ?? "").toLowerCase();
  if (
    status === "draft" ||
    status === "incomplete" ||
    status === "ready" ||
    status === "approved" ||
    status === "rejected"
  ) {
    return status;
  }
  return "draft";
};

const mapBackendProperty = (raw: unknown): AgentCollectedProperty | null => {
  const obj = asObject(raw);
  const step1Obj = asObject(obj.step1);
  const step2Obj = asObject(obj.step2);

  const id =
    asString(step1Obj.propertyId) ||
    asString(obj.propertyId) ||
    asString(obj._id);

  if (!id) return null;

  const step1: AgentFieldEntryData = {
    propertyId: id,
    agentName: asString(step1Obj.agentName),
    village: asString(step1Obj.village),
    tehsil: asString(step1Obj.tehsil),
    district: asString(step1Obj.district),
    landType: asString(step1Obj.landType),
    propertySize: asString(step1Obj.propertySize),
    roadAccess: asString(step1Obj.roadAccess),
    waterAvailability: asString(step1Obj.waterAvailability),
    ownerName: asString(step1Obj.ownerName) || undefined,
    ownerContact: asString(step1Obj.ownerContact) || undefined,
    images: [],
  };

  const hasStep2 = Object.keys(step2Obj).length > 0;
  const step2: AgentDetailedEntryData | undefined = hasStep2
    ? {
        propertyId: id,
        expectedPrice: asString(step2Obj.expectedPrice),
        negotiable: asString(step2Obj.negotiable),
        ownershipType: asString(step2Obj.ownershipType),
        registryAvailable: asString(step2Obj.registryAvailable),
        khasraAvailable: asString(step2Obj.khasraAvailable),
        landDispute: asString(step2Obj.landDispute),
        electricity: asString(step2Obj.electricity),
        cropHistory: asString(step2Obj.cropHistory),
        ownerContact: asString(step2Obj.ownerContact),
        exactLocation: asString(step2Obj.exactLocation),
        nearbyLandmarks: asString(step2Obj.nearbyLandmarks),
        roadType: asString(step2Obj.roadType),
        waterSourceDetails: asString(step2Obj.waterSourceDetails),
        connectivityInfo: asString(step2Obj.connectivityInfo),
        propertyHighlights: asString(step2Obj.propertyHighlights),
        issuesDrawbacks: asString(step2Obj.issuesDrawbacks),
        attachments: [],
        khasraFiles: [],
        khatauniFiles: [],
        nakshaFiles: [],
        notes: asString(step2Obj.notes),
      }
    : undefined;

  return {
    id,
    backendId: asString(obj._id),
    step1,
    step2,
    status: normalizeStatus(obj.status),
    createdAt: asString(obj.createdAt, nowIso()),
    updatedAt: asString(obj.updatedAt, nowIso()),
  };
};

export const createAgentPropertyId = () =>
  `AGP-${Date.now().toString(36).toUpperCase()}-${Math.floor(
    100 + Math.random() * 900
  )}`;

export const AgentCollectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [properties, setProperties] = useState<AgentCollectedProperty[]>([]);
  const [activeDraft, setActiveDraft] = useState<AgentFieldEntryData | null>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadProperties = async () => {
      try {
        const res = await api.get("/agent/properties");
        const rows = Array.isArray(res.data?.data) ? res.data.data : [];
        const mapped = rows
          .map((row: unknown) => mapBackendProperty(row))
          .filter((row: AgentCollectedProperty | null): row is AgentCollectedProperty => Boolean(row));
        setProperties(mapped);
      } catch (error) {
        console.error("Failed to load agent properties", error);
      }
    };

    void loadProperties();
  }, []);

  const saveFieldEntry = async (payload: AgentFieldEntryData) => {
    const timestamp = nowIso();
    setActiveDraft(payload);

    const existing = properties.find((item) => item.id === payload.propertyId);
    if (existing) {
      setProperties((prev) =>
        prev.map((item) =>
          item.id === payload.propertyId
            ? { ...item, step1: payload, updatedAt: timestamp }
            : item
        )
      );
      return;
    }

    const res = await api.post("/agent/property/step1", payload);
    const created = mapBackendProperty(res.data?.data);
    const createdEntry: AgentCollectedProperty =
      created ?? {
        id: payload.propertyId,
        step1: payload,
        status: "draft",
        createdAt: timestamp,
        updatedAt: timestamp,
      };

    setProperties((prev) => [createdEntry, ...prev]);
  };

  const saveDetailedEntry = async (payload: AgentDetailedEntryData) => {
    const timestamp = nowIso();
    const current = properties.find((item) => item.id === payload.propertyId);
    if (!current?.backendId) {
      throw new Error("Missing backend property reference for step 2");
    }

    const res = await api.put(`/agent/property/${current.backendId}/step2`, payload);
    const updated = mapBackendProperty(res.data?.data);

    setProperties((prev) =>
      prev.map((item) => {
        if (item.id !== payload.propertyId) return item;
        if (!updated) {
          return { ...item, step2: payload, status: "ready", updatedAt: timestamp };
        }
        return {
          ...item,
          ...updated,
          step1: { ...item.step1, ...updated.step1 },
          step2: updated.step2 ?? payload,
          updatedAt: updated.updatedAt || timestamp,
        };
      })
    );
    setActiveDraft(null);
  };

  const clearActiveDraft = () => setActiveDraft(null);

  const setPropertyStatus = (propertyId: string, status: AgentPropertyStatus) => {
    setProperties((prev) =>
      prev.map((item) =>
        item.id === propertyId ? { ...item, status, updatedAt: nowIso() } : item
      )
    );
  };

  const getPropertyById = (propertyId: string) =>
    properties.find((item) => item.id === propertyId);

  const value = useMemo<AgentCollectionContextValue>(
    () => ({
      properties,
      activeDraft,
      saveFieldEntry,
      saveDetailedEntry,
      clearActiveDraft,
      setPropertyStatus,
      getPropertyById,
    }),
    [properties, activeDraft]
  );

  return (
    <AgentCollectionContext.Provider value={value}>
      {children}
    </AgentCollectionContext.Provider>
  );
};

export const useAgentCollection = () => {
  const ctx = useContext(AgentCollectionContext);
  if (!ctx) {
    throw new Error("useAgentCollection must be used inside AgentCollectionProvider");
  }
  return ctx;
};
