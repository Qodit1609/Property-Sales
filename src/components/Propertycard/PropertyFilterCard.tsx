import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
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

interface Filters {
  search: string;
  propertyType: string;
  listingType: string;
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
  irrigationSystem: "any" | "yes" | "no";
  borewellAvailable: "any" | "yes" | "no";
  roadAccess: "any" | "yes" | "no";
  electricityAvailable: "any" | "yes" | "no";
  powerBackup: "any" | "yes" | "no";
  security: "any" | "yes" | "no";
  gatedCommunity: "any" | "yes" | "no";
  farmhouseBuilt: "any" | "yes" | "no";
}

const INITIAL_FILTERS: Filters = {
  search: "",
  propertyType: "",
  listingType: "",
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
  irrigationSystem: "any",
  borewellAvailable: "any",
  roadAccess: "any",
  electricityAvailable: "any",
  powerBackup: "any",
  security: "any",
  gatedCommunity: "any",
  farmhouseBuilt: "any",
};

const inputBaseClass =
  "min-w-0 w-full rounded-lg border border-emerald-100 bg-white py-1.5 px-2.5 text-xs text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100";

const sectionCardClass =
  "rounded-xl border border-emerald-100 bg-gradient-to-b from-white to-emerald-50/35 p-3 sm:p-4";

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

const matchesBooleanFilter = (
  value: unknown,
  filter: Filters["irrigationSystem"]
) => {
  if (filter === "any") return true;
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

const FilterSection: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay?: number;
}> = ({ icon, title, children, delay = 0 }) => (
  <motion.section
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.28, delay }}
    className={sectionCardClass}
  >
    <div className="mb-2.5 flex items-center gap-1.5">
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
        {icon}
      </span>
      <h4 className="text-xs font-semibold tracking-wide text-[var(--b1)]">{title}</h4>
    </div>
    {children}
  </motion.section>
);

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-700">
    {children}
  </label>
);

const BooleanToggleGroup: React.FC<{
  value: "any" | "yes" | "no";
  onChange: (next: "any" | "yes" | "no") => void;
}> = ({ value, onChange }) => {
  const options: Array<{ id: "any" | "yes" | "no"; label: string }> = [
    { id: "any", label: "Any" },
    { id: "yes", label: "Yes" },
    { id: "no", label: "No" },
  ];

  return (
    <div className="grid grid-cols-3 gap-1 rounded-lg border border-emerald-100 bg-white p-1">
      {options.map((option) => {
        const isActive = value === option.id;
        return (
          <motion.button
            key={option.id}
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(option.id)}
            className={`whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-semibold transition ${
              isActive
                ? "bg-emerald-700 text-white shadow-sm"
                : "text-slate-600 hover:bg-emerald-50"
            }`}
          >
            {option.label}
          </motion.button>
        );
      })}
    </div>
  );
};

const PropertyFilterCard: React.FC<PropertyFilterCardProps> = ({
  properties,
  onFiltered,
}) => {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [mobileOpen, setMobileOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const propertyTypes = useMemo(() => {
    const types = new Set(properties.map((p) => p.propertyType).filter(Boolean));
    return Array.from(types).sort((a, b) => a.localeCompare(b));
  }, [properties]);

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

  const listingTypeOptions = useMemo(() => {
    const values = new Set(
      properties
        .map((p) => p.listingType?.trim()?.toLowerCase() ?? "")
        .filter((value): value is string => Boolean(value))
    );

    const ordered = ["sale", "rent"].filter((value) => values.has(value));
    const others = Array.from(values)
      .filter((value) => !ordered.includes(value))
      .sort((a, b) => a.localeCompare(b));

    return [...ordered, ...others];
  }, [properties]);

  const applyFilters = useCallback(
    (current: Filters) => {
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

      if (current.propertyType) {
        result = result.filter((p) => p.propertyType === current.propertyType);
      }

      if (current.listingType) {
        const selectedListingType = current.listingType.toLowerCase();
        result = result.filter(
          (p) => normalizeText(p.listingType) === selectedListingType
        );
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
        matchesBooleanFilter(
          p.waterResources?.irrigationSystem,
          current.irrigationSystem
        )
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

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    []
  );

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    const next = { ...filters, [key]: value };
    setFilters(next);

    if (key === "search") {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => applyFilters(next), 300);
    } else {
      applyFilters(next);
    }
  };

  const resetFilters = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setFilters(INITIAL_FILTERS);
    applyFilters(INITIAL_FILTERS);
  };

  const hasActiveFilters = useMemo(
    () =>
      filters.search !== "" ||
      filters.propertyType !== "" ||
      filters.listingType !== "" ||
      filters.minPrice !== "" ||
      filters.maxPrice !== "" ||
      filters.minArea !== "" ||
      filters.maxArea !== "" ||
      filters.minBedrooms !== "" ||
      filters.maxBedrooms !== "" ||
      filters.minBathrooms !== "" ||
      filters.maxBathrooms !== "" ||
      filters.minParking !== "" ||
      filters.maxParking !== "" ||
      filters.soilType !== "" ||
      filters.waterAvailability !== "" ||
      filters.irrigationSystem !== "any" ||
      filters.borewellAvailable !== "any" ||
      filters.roadAccess !== "any" ||
      filters.electricityAvailable !== "any" ||
      filters.powerBackup !== "any" ||
      filters.security !== "any" ||
      filters.gatedCommunity !== "any" ||
      filters.farmhouseBuilt !== "any",
    [filters]
  );

  const activeCount = useMemo(
    () =>
      [
        filters.search,
        filters.propertyType,
        filters.listingType,
        filters.minPrice,
        filters.maxPrice,
        filters.minArea,
        filters.maxArea,
        filters.minBedrooms,
        filters.maxBedrooms,
        filters.minBathrooms,
        filters.maxBathrooms,
        filters.minParking,
        filters.maxParking,
        filters.soilType,
        filters.waterAvailability,
        filters.irrigationSystem !== "any" ? "irrigation" : "",
        filters.borewellAvailable !== "any" ? "borewell" : "",
        filters.roadAccess !== "any" ? "road" : "",
        filters.electricityAvailable !== "any" ? "electricity" : "",
        filters.powerBackup !== "any" ? "powerBackup" : "",
        filters.security !== "any" ? "security" : "",
        filters.gatedCommunity !== "any" ? "gatedCommunity" : "",
        filters.farmhouseBuilt !== "any" ? "farmhouseBuilt" : "",
      ].filter(Boolean).length,
    [filters]
  );

  const filterContent = (
    <div className="flex flex-col gap-3 sm:gap-4">
      <FilterSection icon={<Search size={13} />} title="Basic Filters">
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-1">
          <div className="md:col-span-2 lg:col-span-1">
            <FieldLabel>Search</FieldLabel>
            <div className="relative">
              <Search
                size={14}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Title, address or city"
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className={`${inputBaseClass} pl-8 pr-7`}
              />
              {filters.search && (
                <button
                  type="button"
                  onClick={() => updateFilter("search", "")}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 transition hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          <div>
            <FieldLabel>Property Type</FieldLabel>
            <select
              value={filters.propertyType}
              onChange={(e) => updateFilter("propertyType", e.target.value)}
              className={inputBaseClass}
            >
              <option value="">All Types</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel>Price Range (INR)</FieldLabel>
            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => updateFilter("minPrice", e.target.value)}
                className={inputBaseClass}
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => updateFilter("maxPrice", e.target.value)}
                className={inputBaseClass}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Listing Type</FieldLabel>
            <select
              value={filters.listingType}
              onChange={(e) => updateFilter("listingType", e.target.value)}
              className={inputBaseClass}
            >
              <option value="">Any</option>
              {listingTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </FilterSection>

      <FilterSection
        icon={<Landmark size={13} />}
        title="Resort & Farmhouse"
        delay={0.04}
      >
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-1">
          <div>
            <FieldLabel>Bedrooms</FieldLabel>
            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="number"
                placeholder="Min"
                value={filters.minBedrooms}
                onChange={(e) => updateFilter("minBedrooms", e.target.value)}
                className={inputBaseClass}
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxBedrooms}
                onChange={(e) => updateFilter("maxBedrooms", e.target.value)}
                className={inputBaseClass}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Bathrooms</FieldLabel>
            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="number"
                placeholder="Min"
                value={filters.minBathrooms}
                onChange={(e) => updateFilter("minBathrooms", e.target.value)}
                className={inputBaseClass}
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxBathrooms}
                onChange={(e) => updateFilter("maxBathrooms", e.target.value)}
                className={inputBaseClass}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Parking Slots</FieldLabel>
            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="number"
                placeholder="Min"
                value={filters.minParking}
                onChange={(e) => updateFilter("minParking", e.target.value)}
                className={inputBaseClass}
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxParking}
                onChange={(e) => updateFilter("maxParking", e.target.value)}
                className={inputBaseClass}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Power Backup</FieldLabel>
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
            <FieldLabel>Gated Community</FieldLabel>
            <BooleanToggleGroup
              value={filters.gatedCommunity}
              onChange={(next) => updateFilter("gatedCommunity", next)}
            />
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <FieldLabel>Farmhouse Built</FieldLabel>
            <BooleanToggleGroup
              value={filters.farmhouseBuilt}
              onChange={(next) => updateFilter("farmhouseBuilt", next)}
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection icon={<Sprout size={13} />} title="Land Details" delay={0.05}>
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-1">
          <div>
            <FieldLabel>
              <span className="inline-flex items-center gap-1">
                <Ruler size={10} /> Area Range
              </span>
            </FieldLabel>
            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="number"
                placeholder="Min"
                value={filters.minArea}
                onChange={(e) => updateFilter("minArea", e.target.value)}
                className={inputBaseClass}
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxArea}
                onChange={(e) => updateFilter("maxArea", e.target.value)}
                className={inputBaseClass}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Soil Type</FieldLabel>
            <select
              value={filters.soilType}
              onChange={(e) => updateFilter("soilType", e.target.value)}
              className={inputBaseClass}
            >
              <option value="">All Soil Types</option>
              {soilTypeOptions.map((soil) => (
                <option key={soil} value={soil}>
                  {soil}
                </option>
              ))}
            </select>
          </div>
        </div>
      </FilterSection>

      <FilterSection
        icon={<Droplets size={13} />}
        title="Water & Resources"
        delay={0.1}
      >
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-1">
          <div>
            <FieldLabel>Water Availability</FieldLabel>
            <select
              value={filters.waterAvailability}
              onChange={(e) => updateFilter("waterAvailability", e.target.value)}
              className={inputBaseClass}
            >
              <option value="">Any</option>
              {waterAvailabilityOptions.map((water) => (
                <option key={water} value={water}>
                  {water}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel>Irrigation Available</FieldLabel>
            <BooleanToggleGroup
              value={filters.irrigationSystem}
              onChange={(next) => updateFilter("irrigationSystem", next)}
            />
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <FieldLabel>Borewell Available</FieldLabel>
            <BooleanToggleGroup
              value={filters.borewellAvailable}
              onChange={(next) => updateFilter("borewellAvailable", next)}
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection
        icon={<Landmark size={13} />}
        title="Infrastructure"
        delay={0.15}
      >
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-1">
          <div>
            <FieldLabel>Road Access</FieldLabel>
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

      {hasActiveFilters && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={resetFilters}
          className="flex items-center justify-center gap-1 rounded-lg border border-red-200 bg-red-50 py-1.5 text-[11px] font-semibold text-red-600 transition hover:bg-red-100"
        >
          <RotateCcw size={11} />
          Clear All Filters
        </motion.button>
      )}
    </div>
  );

  return (
    <>
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-3.5 right-3.5 z-40 inline-flex items-center gap-1.5 rounded-full bg-[var(--b1)] px-3 py-2 text-xs font-semibold text-[var(--fg)] shadow-lg ring-1 ring-black/5 backdrop-blur-sm transition hover:bg-[var(--b1-mid)] lg:hidden"
      >
        <SlidersHorizontal size={14} />
        Filters
        {activeCount > 0 && (
          <span className="ml-0.5 inline-flex min-w-4.5 items-center justify-center rounded-full bg-white px-1 py-0.5 text-[9px] font-bold text-[var(--b1)]">
            {activeCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              className="absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-gradient-to-b from-white to-emerald-50/40 p-3 shadow-2xl sm:w-[86vw] md:w-[64vw]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 -mx-3 mb-3 flex items-center justify-between border-b border-emerald-100 bg-white/95 px-3 py-2.5 backdrop-blur">
                <div>
                  <h3 className="text-sm font-bold text-[var(--b1)]">Filter Properties</h3>
                  <p className="text-[11px] text-slate-500">
                    Refine farms by land, water and infrastructure
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full p-1 text-slate-500 transition hover:bg-emerald-50 hover:text-slate-900"
                  aria-label="Close filters"
                >
                  <X size={17} />
                </button>
              </div>
              {filterContent}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="hidden lg:sticky lg:top-24 lg:block lg:w-full lg:max-w-[340px] xl:max-w-[380px]"
      >
        <div className="rounded-xl border border-emerald-100 bg-gradient-to-b from-white to-emerald-50/25 p-4 xl:p-5 shadow-[0_8px_24px_rgba(16,24,40,0.08)]">
          <div className="mb-4 flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-[var(--b1)]">Filter Properties</h3>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Smart filters for agriculture land listings
              </p>
            </div>
            {activeCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-700 px-1.5 text-[10px] font-bold text-white">
                {activeCount}
              </span>
            )}
          </div>
          {filterContent}
        </div>
      </motion.aside>
    </>
  );
};

export default PropertyFilterCard;
