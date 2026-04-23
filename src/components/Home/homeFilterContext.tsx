import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Property } from "@/features/properties/propertyType";

export type AppliedCriteria = {
  city: string;
  propertyType: string;
  listingTypeKey: string;
  search: string;
};

function getAddressLine(p: Property): string {
  return (p.location?.address ?? p.address ?? "").trim();
}

export function extractCityFromProperty(p: Property): string {
  const fromLoc = p.location?.city?.trim();
  if (fromLoc) return fromLoc;
  const line = getAddressLine(p);
  const parts = line.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return "";
  return parts[parts.length - 1] ?? "";
}

export function normalizeListingKey(raw: string | undefined): string {
  if (!raw) return "";
  const t = raw.trim().toLowerCase();
  if (t === "buy") return "sale";
  return t;
}

function propertyMatchesListingKey(p: Property, selectedKey: string): boolean {
  if (!selectedKey) return true;
  const got = normalizeListingKey(p.listingType);
  if (!got) return false;
  return got === selectedKey;
}

export function filterPropertiesByCriteria(
  properties: Property[],
  c: AppliedCriteria
): Property[] {
  const q = c.search.trim().toLowerCase();
  return properties.filter((p) => {
    if (c.city) {
      if (extractCityFromProperty(p).toLowerCase() !== c.city.toLowerCase()) {
        return false;
      }
    }
    if (c.propertyType) {
      if (
        (p.propertyType || "").toLowerCase() !== c.propertyType.toLowerCase()
      ) {
        return false;
      }
    }
    if (c.listingTypeKey) {
      if (!propertyMatchesListingKey(p, c.listingTypeKey)) return false;
    }
    if (q) {
      const title = (p.title || "").toLowerCase();
      const addr = getAddressLine(p).toLowerCase();
      if (!title.includes(q) && !addr.includes(q)) return false;
    }
    return true;
  });
}

type HomeFilterContextValue = {
  appliedCriteria: AppliedCriteria | null;
  setAppliedCriteria: (c: AppliedCriteria | null) => void;
  getFilteredProperties: (all: Property[]) => Property[];
};

const HomeFilterContext = createContext<HomeFilterContextValue | null>(null);

export function useHomeFilterOptional() {
  return useContext(HomeFilterContext);
}

export function HomeFilterProvider({ children }: { children: ReactNode }) {
  const [appliedCriteria, setAppliedCriteria] = useState<AppliedCriteria | null>(
    null
  );

  const getFilteredProperties = useCallback(
    (all: Property[]) => {
      if (!appliedCriteria) return all;
      return filterPropertiesByCriteria(all, appliedCriteria);
    },
    [appliedCriteria]
  );

  const value = useMemo(
    () => ({
      appliedCriteria,
      setAppliedCriteria,
      getFilteredProperties,
    }),
    [appliedCriteria, getFilteredProperties]
  );

  return (
    <HomeFilterContext.Provider value={value}>{children}</HomeFilterContext.Provider>
  );
}
