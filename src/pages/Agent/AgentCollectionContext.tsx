import React, { createContext, useContext, useMemo, useState } from "react";

export type AgentPropertyStatus = "draft" | "incomplete" | "ready";

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
  step1: AgentFieldEntryData;
  step2?: AgentDetailedEntryData;
  status: AgentPropertyStatus;
  createdAt: string;
  updatedAt: string;
};

type AgentCollectionContextValue = {
  properties: AgentCollectedProperty[];
  activeDraft: AgentFieldEntryData | null;
  saveFieldEntry: (payload: AgentFieldEntryData) => void;
  saveDetailedEntry: (payload: AgentDetailedEntryData) => void;
  clearActiveDraft: () => void;
  setPropertyStatus: (propertyId: string, status: AgentPropertyStatus) => void;
  getPropertyById: (propertyId: string) => AgentCollectedProperty | undefined;
};

const AgentCollectionContext = createContext<AgentCollectionContextValue | null>(
  null
);

const nowIso = () => new Date().toISOString();

export const createAgentPropertyId = () =>
  `AGP-${Date.now().toString(36).toUpperCase()}-${Math.floor(
    100 + Math.random() * 900
  )}`;

export const AgentCollectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [properties, setProperties] = useState<AgentCollectedProperty[]>([]);
  const [activeDraft, setActiveDraft] = useState<AgentFieldEntryData | null>(null);

  const saveFieldEntry = (payload: AgentFieldEntryData) => {
    const timestamp = nowIso();
    setActiveDraft(payload);

    setProperties((prev) => {
      const existing = prev.find((item) => item.id === payload.propertyId);
      if (!existing) {
        return [
          {
            id: payload.propertyId,
            step1: payload,
            status: "draft",
            createdAt: timestamp,
            updatedAt: timestamp,
          },
          ...prev,
        ];
      }

      return prev.map((item) =>
        item.id === payload.propertyId
          ? { ...item, step1: payload, updatedAt: timestamp }
          : item
      );
    });
  };

  const saveDetailedEntry = (payload: AgentDetailedEntryData) => {
    const timestamp = nowIso();
    setProperties((prev) =>
      prev.map((item) =>
        item.id === payload.propertyId
          ? { ...item, step2: payload, status: "ready", updatedAt: timestamp }
          : item
      )
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
