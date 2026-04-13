import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Ruler,
  Sprout,
  Droplets,
  Landmark,
} from "lucide-react";
import type { Property } from "../../features/properties/propertyType";

interface PropertyFilterCardProps {
  properties: Property[];
  onFiltered: (filtered: Property[]) => void;
}

/** Centralized filter state — listingType uses backend values; "both" means no listing filter. */
export interface PropertyFiltersState {
  search: string;
  listingType: "both" | "sale" | "rent";
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
  minBedrooms: string;
  maxBedrooms: string;
  minBathrooms: string;
  maxBathrooms: string;
  minParking: string;
  maxParking: string;
  soilType: string;
  waterAvailability: string;
  irrigationSystem: TriBool;
  borewellAvailable: TriBool;
  roadAccess: TriBool;
  electricityAvailable: TriBool;
  powerBackup: TriBool;
  security: TriBool;
  gatedCommunity: TriBool;
  farmhouseBuilt: TriBool;
}

type TriBool = "both" | "yes" | "no";

const INITIAL_FILTERS: PropertyFiltersState = {
  search: "",
  listingType: "both",
  minPrice: "",
  maxPrice: "",
  minArea: "",
  maxArea: "",
  minBedrooms: "",
  maxBedrooms: "",
  minBathrooms: "",
  maxBathrooms: "",
  minParking: "",
  maxParking: "",
  soilType: "",
  waterAvailability: "",
  irrigationSystem: "both",
  borewellAvailable: "both",
  roadAccess: "both",
  electricityAvailable: "both",
  powerBackup: "both",
  security: "both",
  gatedCommunity: "both",
  farmhouseBuilt: "both",
};

const inputBaseClass =
  "min-h-[44px] min-w-0 w-full rounded-lg border border-b2/40 bg-white py-2 px-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted/55 hover:border-[var(--b1-mid)]/40 focus:border-primary focus:ring-2 focus:ring-[var(--b2-soft)] font-serif";

const sectionCardClass =
  "rounded-xl border border-b2/35 bg-white/95 p-3.5 shadow-sm sm:p-4";

const primaryCardClass =
  "rounded-xl border border-b2/35 bg-gradient-to-b from-white to-[var(--b2-soft)]/30 p-3.5 shadow-sm sm:p-4";

const normalizeText = (value?: string | null) => (value ?? "").toLowerCase();

const parseNumberish = (value: unknown): number | undefined => {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
};

const parseBooleanLike = (value: unknown): boolean | undefined => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return undefined;
    if (["yes", "true", "available", "present", "1", "y", "on"].includes(normalized)) {
      return true;
    }
    if (
      ["no", "false", "not available", "absent", "none", "0", "n", "off"].includes(
        normalized
      )
    ) {
      return false;
    }
  }
  return undefined;
};

const matchesBooleanFilter = (value: unknown, filter: TriBool) => {
  if (filter === "both") return true;
  const parsed = parseBooleanLike(value);
  if (parsed === undefined) return false;
  return filter === "yes" ? parsed : !parsed;
};

const getAddress = (property: Property) =>
  property.location?.address ?? property.address ?? "";

const getBedroomCount = (property: Property) =>
  parseNumberish(property.bedrooms ?? property.beds);

const getBathroomCount = (property: Property) =>
  parseNumberish(property.bathrooms ?? property.baths);

const getParkingCount = (property: Property) =>
  parseNumberish(property.parking ?? property.features?.parking);

const parseBudgetToMaxPrice = (budget: string): string => {
  const normalized = budget.trim().toLowerCase();
  const match = normalized.match(/under\s*([0-9]+(?:\.[0-9]+)?)\s*(cr|l|k)?/i);
  if (!match) return "";

  const rawValue = Number.parseFloat(match[1]);
  if (Number.isNaN(rawValue)) return "";

  const unit = (match[2] ?? "").toLowerCase();
  if (unit === "cr") return String(Math.round(rawValue * 1_00_00_000));
  if (unit === "l") return String(Math.round(rawValue * 1_00_000));
  if (unit === "k") return String(Math.round(rawValue * 1_000));
  return String(Math.round(rawValue));
};

export const FilterSection: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay?: number;
}> = ({ icon, title, children, delay = 0 }) => (
  <motion.section
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.22, delay }}
    className={sectionCardClass}
  >
    <div className="mb-2 flex items-center gap-1.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--b2-soft)] text-b1">
        {icon}
      </span>
      <h4 className="text-sm font-semibold tracking-wide text-foreground">{title}</h4>
    </div>
    {children}
  </motion.section>
);

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
    {children}
  </label>
);

export const FilterChip: React.FC<{
  label: string;
  onRemove: () => void;
  removeLabel?: string;
}> = ({ label, onRemove, removeLabel = "Remove filter" }) => (
  <span
    className="inline-flex max-w-full items-center gap-1 rounded-full border border-b2 bg-[var(--b2-soft)] px-2.5 py-1 text-xs font-medium text-b1 shadow-sm transition hover:border-[var(--b1-mid)] hover:bg-[var(--b2-soft)] focus-within:ring-2 focus-within:ring-b2"
    title={label}
  >
    <span className="truncate">{label}</span>
    <button
      type="button"
      onClick={onRemove}
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-b1 transition hover:bg-b2/60 hover:text-b1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label={removeLabel}
    >
      <X size={12} strokeWidth={2.5} />
    </button>
  </span>
);

const BooleanToggleGroup: React.FC<{
  value: TriBool;
  onChange: (next: TriBool) => void;
}> = ({ value, onChange }) => {
  const options: Array<{ id: TriBool; label: string }> = [
    { id: "both", label: "Both" },
    { id: "yes", label: "Yes" },
    { id: "no", label: "No" },
  ];

  return (
    <div className="grid grid-cols-3 gap-1 rounded-lg border border-b2/40 bg-[var(--b2-soft)]/50 p-1">
      {options.map((option) => {
        const isActive = value === option.id;
        return (
          <motion.button
            key={option.id}
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(option.id)}
            className={`whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary font-serif ${
              isActive
                ? "bg-b1 text-fg shadow-sm"
                : "text-muted hover:bg-white"
            }`}
          >
            {option.label}
          </motion.button>
        );
      })}
    </div>
  );
};

const ListingTypeToggle: React.FC<{
  value: PropertyFiltersState["listingType"];
  onChange: (next: PropertyFiltersState["listingType"]) => void;
}> = ({ value, onChange }) => {
  const options: Array<{ id: PropertyFiltersState["listingType"]; label: string }> = [
    { id: "both", label: "Both" },
    { id: "sale", label: "Buy" },
    { id: "rent", label: "Rent" },
  ];

  return (
    <div className="grid grid-cols-3 gap-1 rounded-lg border border-b2/40 bg-[var(--b2-soft)]/50 p-1">
      {options.map((option) => {
        const isActive = value === option.id;
        return (
          <motion.button
            key={option.id}
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(option.id)}
            className={`whitespace-nowrap rounded-md px-2 py-2 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:py-1.5 font-serif ${
              isActive
                ? "bg-b1 text-fg shadow-sm"
                : "text-muted hover:bg-white"
            }`}
          >
            {option.label}
          </motion.button>
        );
      })}
    </div>
  );
};

type AppliedChip = { id: string; label: string };

function buildAppliedChips(f: PropertyFiltersState): AppliedChip[] {
  const chips: AppliedChip[] = [];

  if (f.listingType !== "both") {
    chips.push({
      id: "listingType",
      label: f.listingType === "sale" ? "Buy" : "Rent",
    });
  }

  if (f.search.trim()) {
    chips.push({ id: "location", label: f.search.trim() });
  }

  if (f.minPrice || f.maxPrice) {
    const parts = [
      f.minPrice ? `Min ₹${f.minPrice}` : null,
      f.maxPrice ? `Max ₹${f.maxPrice}` : null,
    ].filter(Boolean) as string[];
    chips.push({ id: "price", label: parts.join(" · ") });
  }

  if (f.minArea || f.maxArea) {
    chips.push({
      id: "area",
      label: `Area: ${f.minArea || "—"} – ${f.maxArea || "—"}`,
    });
  }

  if (f.minBedrooms || f.maxBedrooms) {
    chips.push({
      id: "bedrooms",
      label: `Bedrooms: ${f.minBedrooms || "—"} – ${f.maxBedrooms || "—"}`,
    });
  }

  if (f.minBathrooms || f.maxBathrooms) {
    chips.push({
      id: "bathrooms",
      label: `Bathrooms: ${f.minBathrooms || "—"} – ${f.maxBathrooms || "—"}`,
    });
  }

  if (f.minParking || f.maxParking) {
    chips.push({
      id: "parking",
      label: `Parking: ${f.minParking || "—"} – ${f.maxParking || "—"}`,
    });
  }

  if (f.soilType) chips.push({ id: "soilType", label: f.soilType });

  if (f.waterAvailability) {
    chips.push({ id: "waterAvailability", label: f.waterAvailability });
  }

  const boolLabel = (name: string, v: TriBool) =>
    v !== "both" ? `${name}: ${v === "yes" ? "Yes" : "No"}` : null;

  const addBool = (id: keyof PropertyFiltersState, name: string, v: TriBool) => {
    const lbl = boolLabel(name, v);
    if (lbl) chips.push({ id, label: lbl });
  };

  addBool("irrigationSystem", "Irrigation", f.irrigationSystem);
  addBool("borewellAvailable", "Borewell", f.borewellAvailable);
  addBool("roadAccess", "Road access", f.roadAccess);
  addBool("electricityAvailable", "Electricity", f.electricityAvailable);
  addBool("powerBackup", "Power backup", f.powerBackup);
  addBool("security", "Security", f.security);
  addBool("gatedCommunity", "Gated", f.gatedCommunity);
  addBool("farmhouseBuilt", "Farmhouse built", f.farmhouseBuilt);

  return chips;
}

const PropertyFilterCard: React.FC<PropertyFilterCardProps> = ({
  properties,
  onFiltered,
}) => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<PropertyFiltersState>(INITIAL_FILTERS);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [secondaryOpen, setSecondaryOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const soilTypeOptions = useMemo(() => {
    const types = new Set(
      properties
        .map((p) => p.soilAndFarming?.soilType)
        .filter((soil): soil is string => Boolean(soil?.trim()))
    );
    return Array.from(types).sort((a, b) => a.localeCompare(b));
  }, [properties]);

  const waterAvailabilityOptions = useMemo(() => {
    const values = new Set(
      properties
        .map((p) => p.waterResources?.waterAvailability)
        .filter((value): value is string => Boolean(value?.trim()))
    );
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [properties]);

  const applyFilters = useCallback(
    (current: PropertyFiltersState) => {
      let result = [...properties];

      if (current.search.trim()) {
        const q = current.search.toLowerCase();
        result = result.filter(
          (p) =>
            normalizeText(p.title).includes(q) ||
            normalizeText(getAddress(p)).includes(q) ||
            normalizeText(p.location?.city).includes(q)
        );
      }

      if (current.listingType !== "both") {
        const selected = current.listingType.toLowerCase();
        result = result.filter((p) => normalizeText(p.listingType) === selected);
      }

      if (current.minPrice) {
        const min = Number.parseFloat(current.minPrice);
        if (!Number.isNaN(min)) result = result.filter((p) => p.price >= min);
      }

      if (current.maxPrice) {
        const max = Number.parseFloat(current.maxPrice);
        if (!Number.isNaN(max)) result = result.filter((p) => p.price <= max);
      }

      if (current.minArea) {
        const min = Number.parseFloat(current.minArea);
        if (!Number.isNaN(min)) {
          result = result.filter((p) => {
            const area = parseNumberish(p.area);
            return area !== undefined && area >= min;
          });
        }
      }

      if (current.maxArea) {
        const max = Number.parseFloat(current.maxArea);
        if (!Number.isNaN(max)) {
          result = result.filter((p) => {
            const area = parseNumberish(p.area);
            return area !== undefined && area <= max;
          });
        }
      }

      if (current.minBedrooms) {
        const min = Number.parseFloat(current.minBedrooms);
        if (!Number.isNaN(min)) {
          result = result.filter((p) => {
            const bedrooms = getBedroomCount(p);
            return bedrooms !== undefined && bedrooms >= min;
          });
        }
      }

      if (current.maxBedrooms) {
        const max = Number.parseFloat(current.maxBedrooms);
        if (!Number.isNaN(max)) {
          result = result.filter((p) => {
            const bedrooms = getBedroomCount(p);
            return bedrooms !== undefined && bedrooms <= max;
          });
        }
      }

      if (current.minBathrooms) {
        const min = Number.parseFloat(current.minBathrooms);
        if (!Number.isNaN(min)) {
          result = result.filter((p) => {
            const bathrooms = getBathroomCount(p);
            return bathrooms !== undefined && bathrooms >= min;
          });
        }
      }

      if (current.maxBathrooms) {
        const max = Number.parseFloat(current.maxBathrooms);
        if (!Number.isNaN(max)) {
          result = result.filter((p) => {
            const bathrooms = getBathroomCount(p);
            return bathrooms !== undefined && bathrooms <= max;
          });
        }
      }

      if (current.minParking) {
        const min = Number.parseFloat(current.minParking);
        if (!Number.isNaN(min)) {
          result = result.filter((p) => {
            const parking = getParkingCount(p);
            return parking !== undefined && parking >= min;
          });
        }
      }

      if (current.maxParking) {
        const max = Number.parseFloat(current.maxParking);
        if (!Number.isNaN(max)) {
          result = result.filter((p) => {
            const parking = getParkingCount(p);
            return parking !== undefined && parking <= max;
          });
        }
      }

      if (current.soilType) {
        const soil = current.soilType.toLowerCase();
        result = result.filter(
          (p) => normalizeText(p.soilAndFarming?.soilType) === soil
        );
      }

      if (current.waterAvailability) {
        const water = current.waterAvailability.toLowerCase();
        result = result.filter(
          (p) => normalizeText(p.waterResources?.waterAvailability) === water
        );
      }

      result = result.filter((p) =>
        matchesBooleanFilter(p.waterResources?.irrigationSystem, current.irrigationSystem)
      );

      result = result.filter((p) =>
        matchesBooleanFilter(
          p.waterResources?.borewellAvailable,
          current.borewellAvailable
        )
      );

      result = result.filter((p) =>
        matchesBooleanFilter(p.infrastructure?.roadAccess, current.roadAccess)
      );

      result = result.filter((p) =>
        matchesBooleanFilter(
          p.infrastructure?.electricityAvailable,
          current.electricityAvailable
        )
      );

      result = result.filter((p) =>
        matchesBooleanFilter(p.features?.powerBackup, current.powerBackup)
      );

      result = result.filter((p) =>
        matchesBooleanFilter(p.features?.security, current.security)
      );

      result = result.filter((p) =>
        matchesBooleanFilter(p.infrastructure?.gated, current.gatedCommunity)
      );

      result = result.filter((p) =>
        matchesBooleanFilter(p.features?.farmhouseBuilt, current.farmhouseBuilt)
      );

      onFiltered(result);
    },
    [properties, onFiltered]
  );

  useEffect(() => {
    applyFilters(filters);
  }, [properties]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const location = (searchParams.get("location") ?? "").trim();
    const type = (searchParams.get("type") ?? "").trim();
    const tag = (searchParams.get("tag") ?? "").trim();
    const budget = (searchParams.get("budget") ?? "").trim();

    if (!location && !type && !tag && !budget) return;

    const searchSeed = location || type || tag;
    const budgetMax = budget ? parseBudgetToMaxPrice(budget) : "";

    setFilters((prev) => {
      const next: PropertyFiltersState = {
        ...prev,
        search: searchSeed,
        minPrice: "",
        maxPrice: budgetMax,
      };
      applyFilters(next);
      return next;
    });
  }, [searchParams, applyFilters]);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    []
  );

  const commitFilters = useCallback(
    (next: PropertyFiltersState) => {
      setFilters(next);
      applyFilters(next);
    },
    [applyFilters]
  );

  const updateFilter = useCallback(
    <K extends keyof PropertyFiltersState>(key: K, value: PropertyFiltersState[K]) => {
      setFilters((prev) => {
        const next = { ...prev, [key]: value };
        if (key === "search") {
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => applyFilters(next), 320);
        } else {
          applyFilters(next);
        }
        return next;
      });
    },
    [applyFilters]
  );

  const resetFilters = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    commitFilters(INITIAL_FILTERS);
  }, [commitFilters]);

  const removeAppliedChip = useCallback(
    (chipId: string) => {
      setFilters((prev) => {
        let next: PropertyFiltersState = { ...prev };
        switch (chipId) {
          case "listingType":
            next.listingType = "both";
            break;
          case "location":
            next.search = "";
            break;
          case "price":
            next.minPrice = "";
            next.maxPrice = "";
            break;
          case "area":
            next.minArea = "";
            next.maxArea = "";
            break;
          case "bedrooms":
            next.minBedrooms = "";
            next.maxBedrooms = "";
            break;
          case "bathrooms":
            next.minBathrooms = "";
            next.maxBathrooms = "";
            break;
          case "parking":
            next.minParking = "";
            next.maxParking = "";
            break;
          case "soilType":
            next.soilType = "";
            break;
          case "waterAvailability":
            next.waterAvailability = "";
            break;
          case "irrigationSystem":
            next.irrigationSystem = "both";
            break;
          case "borewellAvailable":
            next.borewellAvailable = "both";
            break;
          case "roadAccess":
            next.roadAccess = "both";
            break;
          case "electricityAvailable":
            next.electricityAvailable = "both";
            break;
          case "powerBackup":
            next.powerBackup = "both";
            break;
          case "security":
            next.security = "both";
            break;
          case "gatedCommunity":
            next.gatedCommunity = "both";
            break;
          case "farmhouseBuilt":
            next.farmhouseBuilt = "both";
            break;
          default:
            return prev;
        }
        applyFilters(next);
        return next;
      });
    },
    [applyFilters]
  );

  const appliedChips = useMemo(() => buildAppliedChips(filters), [filters]);

  const activeCount = appliedChips.length;

  const hasActiveFilters = activeCount > 0;

  const appliedFiltersBlock = (
    <div
      className={`border-b border-b2/30 pb-3 ${hasActiveFilters ? "" : "hidden"}`}
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">
          Applied filters
        </span>
        <button
          type="button"
          onClick={resetFilters}
          className="text-xs font-semibold text-primary underline-offset-2 transition hover:opacity-90 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
        >
          Clear all
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {appliedChips.map((chip) => (
          <FilterChip
            key={`${chip.id}-${chip.label}`}
            label={chip.label}
            onRemove={() => removeAppliedChip(chip.id)}
            removeLabel={`Remove ${chip.label}`}
          />
        ))}
      </div>
    </div>
  );

  const primaryFilters = (
    <div className={primaryCardClass}>
      <div className="grid grid-cols-1 gap-3 sm:gap-3">
        <div>
          <FieldLabel>Buy / Rent</FieldLabel>
          <ListingTypeToggle
            value={filters.listingType}
            onChange={(next) => updateFilter("listingType", next)}
          />
        </div>

        <div>
          <FieldLabel>Location</FieldLabel>
          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted/70"
            />
            <input
              type="text"
              placeholder="City, area, or keyword"
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className={`${inputBaseClass} pl-8 pr-9`}
              autoComplete="off"
            />
            {filters.search ? (
              <button
                type="button"
                onClick={() => commitFilters({ ...filters, search: "" })}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted/70 transition hover:bg-[var(--b2-soft)] hover:text-b1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Clear location"
              >
                <X size={14} />
              </button>
            ) : null}
          </div>
        </div>

        <div>
          <FieldLabel>Price range (INR)</FieldLabel>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              type="number"
              inputMode="decimal"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => updateFilter("minPrice", e.target.value)}
              className={inputBaseClass}
            />
            <input
              type="number"
              inputMode="decimal"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => updateFilter("maxPrice", e.target.value)}
              className={inputBaseClass}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const secondaryFilters = (
    <div className="flex flex-col gap-3">
      <FilterSection icon={<Landmark size={14} />} title="Resort & farmhouse">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
          <div>
            <FieldLabel>Bedrooms</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                inputMode="numeric"
                placeholder="Min"
                value={filters.minBedrooms}
                onChange={(e) => updateFilter("minBedrooms", e.target.value)}
                className={inputBaseClass}
              />
              <input
                type="number"
                inputMode="numeric"
                placeholder="Max"
                value={filters.maxBedrooms}
                onChange={(e) => updateFilter("maxBedrooms", e.target.value)}
                className={inputBaseClass}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Bathrooms</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                inputMode="numeric"
                placeholder="Min"
                value={filters.minBathrooms}
                onChange={(e) => updateFilter("minBathrooms", e.target.value)}
                className={inputBaseClass}
              />
              <input
                type="number"
                inputMode="numeric"
                placeholder="Max"
                value={filters.maxBathrooms}
                onChange={(e) => updateFilter("maxBathrooms", e.target.value)}
                className={inputBaseClass}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Parking</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                inputMode="numeric"
                placeholder="Min"
                value={filters.minParking}
                onChange={(e) => updateFilter("minParking", e.target.value)}
                className={inputBaseClass}
              />
              <input
                type="number"
                inputMode="numeric"
                placeholder="Max"
                value={filters.maxParking}
                onChange={(e) => updateFilter("maxParking", e.target.value)}
                className={inputBaseClass}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Power backup</FieldLabel>
            <BooleanToggleGroup
              value={filters.powerBackup}
              onChange={(next) => updateFilter("powerBackup", next)}
            />
          </div>

          <div>
            <FieldLabel>Security</FieldLabel>
            <BooleanToggleGroup
              value={filters.security}
              onChange={(next) => updateFilter("security", next)}
            />
          </div>

          <div>
            <FieldLabel>Gated community</FieldLabel>
            <BooleanToggleGroup
              value={filters.gatedCommunity}
              onChange={(next) => updateFilter("gatedCommunity", next)}
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <FieldLabel>Farmhouse built</FieldLabel>
            <BooleanToggleGroup
              value={filters.farmhouseBuilt}
              onChange={(next) => updateFilter("farmhouseBuilt", next)}
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection icon={<Sprout size={14} />} title="Land details" delay={0.04}>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
          <div>
            <FieldLabel>
              <span className="inline-flex items-center gap-1">
                <Ruler size={10} /> Area range
              </span>
            </FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                inputMode="decimal"
                placeholder="Min"
                value={filters.minArea}
                onChange={(e) => updateFilter("minArea", e.target.value)}
                className={inputBaseClass}
              />
              <input
                type="number"
                inputMode="decimal"
                placeholder="Max"
                value={filters.maxArea}
                onChange={(e) => updateFilter("maxArea", e.target.value)}
                className={inputBaseClass}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Soil type</FieldLabel>
            <select
              value={filters.soilType}
              onChange={(e) => updateFilter("soilType", e.target.value)}
              className={`${inputBaseClass} cursor-pointer appearance-none bg-[length:1rem] bg-[right_0.5rem_center] bg-no-repeat pr-8`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231B4332' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              }}
            >
              <option value="">Both</option>
              {soilTypeOptions.map((soil) => (
                <option key={soil} value={soil}>
                  {soil}
                </option>
              ))}
            </select>
          </div>
        </div>
      </FilterSection>

      <FilterSection icon={<Droplets size={14} />} title="Water & resources" delay={0.06}>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
          <div>
            <FieldLabel>Water availability</FieldLabel>
            <select
              value={filters.waterAvailability}
              onChange={(e) => updateFilter("waterAvailability", e.target.value)}
              className={`${inputBaseClass} cursor-pointer appearance-none bg-[length:1rem] bg-[right_0.5rem_center] bg-no-repeat pr-8`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231B4332' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              }}
            >
              <option value="">Both</option>
              {waterAvailabilityOptions.map((water) => (
                <option key={water} value={water}>
                  {water}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel>Irrigation</FieldLabel>
            <BooleanToggleGroup
              value={filters.irrigationSystem}
              onChange={(next) => updateFilter("irrigationSystem", next)}
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <FieldLabel>Borewell</FieldLabel>
            <BooleanToggleGroup
              value={filters.borewellAvailable}
              onChange={(next) => updateFilter("borewellAvailable", next)}
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection icon={<Landmark size={14} />} title="Infrastructure" delay={0.08}>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
          <div>
            <FieldLabel>Road access</FieldLabel>
            <BooleanToggleGroup
              value={filters.roadAccess}
              onChange={(next) => updateFilter("roadAccess", next)}
            />
          </div>
          <div>
            <FieldLabel>Electricity</FieldLabel>
            <BooleanToggleGroup
              value={filters.electricityAvailable}
              onChange={(next) => updateFilter("electricityAvailable", next)}
            />
          </div>
        </div>
      </FilterSection>
    </div>
  );

  const expandToggle = (
    <motion.button
      type="button"
      layout
      onClick={() => setSecondaryOpen((o) => !o)}
      className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-lg border border-b2/40 bg-white py-2.5 text-xs font-semibold text-foreground shadow-sm transition hover:border-[var(--b1-mid)]/50 hover:bg-[var(--b2-soft)]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary font-serif"
    >
      <SlidersHorizontal size={15} className="text-b1" />
      {secondaryOpen ? "Show less" : "Apply more filter"}
      <motion.span
        animate={{ rotate: secondaryOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        className="inline-flex"
      >
        <ChevronDown size={16} className="text-muted" />
      </motion.span>
    </motion.button>
  );

  const filterBody = (
    <div className="flex flex-col gap-3">
      {appliedFiltersBlock}
      {primaryFilters}
      {expandToggle}
      <AnimatePresence initial={false}>
        {secondaryOpen ? (
          <motion.div
            key="secondary"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {secondaryFilters}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-3.5 right-3.5 z-40 inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-[var(--b1)] px-4 py-2.5 text-xs font-semibold text-[var(--fg)] shadow-lg ring-1 ring-black/5 backdrop-blur-sm transition hover:bg-[var(--b1-mid)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 lg:hidden"
      >
        <SlidersHorizontal size={14} />
        Filters
        {activeCount > 0 ? (
          <span className="ml-0.5 inline-flex min-w-[1.125rem] items-center justify-center rounded-full bg-white px-1 py-0.5 text-[9px] font-bold text-[var(--b1)]">
            {activeCount}
          </span>
        ) : null}
      </motion.button>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              className="absolute right-0 top-0 flex h-[100dvh] max-h-[100dvh] w-full max-w-sm flex-col overflow-hidden bg-gradient-to-b from-white to-[var(--b2-soft)]/35 shadow-2xl sm:w-[90vw]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-b2/30 bg-white/95 px-3 py-3 backdrop-blur">
                <div>
                  <h3 className="text-sm font-bold text-[var(--b1)]">Filter properties</h3>
                  <p className="text-xs text-muted">Refine by location, price & more</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full p-2 text-muted transition hover:bg-[var(--b2-soft)] hover:text-b1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Close filters"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 pb-6">
                {filterBody}
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.aside
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.26 }}
        className="hidden min-h-0 lg:block lg:w-full lg:max-w-[340px] xl:max-w-[380px]"
      >
        <div className="rounded-xl border border-b2/35 bg-gradient-to-b from-white to-[var(--b2-soft)]/25 p-4 shadow-[0_8px_24px_rgba(27,67,50,0.08)] sm:p-5">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-[var(--b1)]">Filter properties</h3>
              <p className="mt-0.5 text-xs text-muted">
                Compact search — expand for advanced options
              </p>
            </div>
            {activeCount > 0 ? (
              <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-b1 px-2 text-[10px] font-bold text-fg">
                {activeCount}
              </span>
            ) : null}
          </div>
          {filterBody}
        </div>
      </motion.aside>
    </>
  );
};

export default PropertyFilterCard;
