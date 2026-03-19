import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  MapPin,
  Ruler,
  Tag,
} from "lucide-react";
import type { Property } from "../../features/properties/propertyType";

interface PropertyFilterCardProps {
  properties: Property[];
  onFiltered: (filtered: Property[]) => void;
}

interface Filters {
  search: string;
  propertyType: string;
  bhk: string;
  minPrice: string;
  maxPrice: string;
  maxDistance: string;
  maxSize: string;
  selectedTags: string[];
}

const INITIAL_FILTERS: Filters = {
  search: "",
  propertyType: "",
  bhk: "",
  minPrice: "",
  maxPrice: "",
  maxDistance: "",
  maxSize: "",
  selectedTags: [],
};

const ALL_TAGS = ["Hot", "Popular", "Latest", "Premium"];

const BHK_OPTIONS = ["1", "2", "3", "4", "5+"];

const PropertyFilterCard: React.FC<PropertyFilterCardProps> = ({
  properties,
  onFiltered,
}) => {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const propertyTypes = useMemo(() => {
    const types = new Set(properties.map((p) => p.propertyType).filter(Boolean));
    return Array.from(types).sort();
  }, [properties]);

  const applyFilters = useCallback(
    (current: Filters) => {
      let result = [...properties];

      if (current.search.trim()) {
        const q = current.search.toLowerCase();
        result = result.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.address.toLowerCase().includes(q)
        );
      }

      if (current.propertyType) {
        result = result.filter(
          (p) => p.propertyType === current.propertyType
        );
      }

      if (current.bhk) {
        const bhkNum = parseInt(current.bhk, 10);
        result = result.filter((p) => {
          const beds = typeof p.beds === "string" ? parseInt(p.beds, 10) : p.beds;
          if (!beds) return false;
          return current.bhk === "5+" ? beds >= 5 : beds === bhkNum;
        });
      }

      if (current.minPrice) {
        const min = parseFloat(current.minPrice);
        if (!isNaN(min)) result = result.filter((p) => p.price >= min);
      }

      if (current.maxPrice) {
        const max = parseFloat(current.maxPrice);
        if (!isNaN(max)) result = result.filter((p) => p.price <= max);
      }

      if (current.maxDistance) {
        const dist = parseFloat(current.maxDistance);
        if (!isNaN(dist))
          result = result.filter(
            (p) =>
              p.distanceFromIndore !== undefined &&
              p.distanceFromIndore <= dist
          );
      }

      if (current.maxSize) {
        const size = parseFloat(current.maxSize);
        if (!isNaN(size))
          result = result.filter(
            (p) => p.size !== undefined && p.size <= size
          );
      }

      if (current.selectedTags.length > 0) {
        result = result.filter((p) =>
          current.selectedTags.some((t) => p.tags?.includes(t))
        );
      }

      onFiltered(result);
    },
    [properties, onFiltered]
  );

  useEffect(() => {
    applyFilters(filters);
  }, [properties]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const toggleTag = (tag: string) => {
    const tags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter((t) => t !== tag)
      : [...filters.selectedTags, tag];
    updateFilter("selectedTags", tags);
  };

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    applyFilters(INITIAL_FILTERS);
  };

  const hasActiveFilters =
    filters.search !== "" ||
    filters.propertyType !== "" ||
    filters.bhk !== "" ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "" ||
    filters.maxDistance !== "" ||
    filters.maxSize !== "" ||
    filters.selectedTags.length > 0;

  const activeCount = [
    filters.search,
    filters.propertyType,
    filters.bhk,
    filters.minPrice,
    filters.maxPrice,
    filters.maxDistance,
    filters.maxSize,
    ...(filters.selectedTags.length > 0 ? ["tags"] : []),
  ].filter(Boolean).length;

  const filterContent = (
    <div className="flex flex-col gap-5">
      {/* Search */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--b1)]">
          Search
        </label>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--b1-mid)]"
          />
          <input
            type="text"
            placeholder="Title or address..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[var(--b1-mid)] focus:ring-1 focus:ring-[var(--b1-mid)]"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter("search", "")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Property Type */}
      {propertyTypes.length > 1 && (
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--b1)]">
            Property Type
          </label>
          <select
            value={filters.propertyType}
            onChange={(e) => updateFilter("propertyType", e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm outline-none transition focus:border-[var(--b1-mid)] focus:ring-1 focus:ring-[var(--b1-mid)]"
          >
            <option value="">All Types</option>
            {propertyTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* BHK */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--b1)]">
          BHK
        </label>
        <div className="flex flex-wrap gap-2">
          {BHK_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => updateFilter("bhk", filters.bhk === opt ? "" : opt)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                filters.bhk === opt
                  ? "border-[var(--b1)] bg-[var(--b1)] text-[var(--fg)]"
                  : "border-gray-300 bg-white text-gray-600 hover:border-[var(--b1-mid)] hover:text-[var(--b1)]"
              }`}
            >
              {opt} BHK
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--b1)]">
          Price Range (₹)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm outline-none transition focus:border-[var(--b1-mid)] focus:ring-1 focus:ring-[var(--b1-mid)]"
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm outline-none transition focus:border-[var(--b1-mid)] focus:ring-1 focus:ring-[var(--b1-mid)]"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[var(--b1)]">
          <Tag size={13} />
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                filters.selectedTags.includes(tag)
                  ? "border-[var(--b1)] bg-[var(--b2-soft)] text-[var(--b1)]"
                  : "border-gray-300 bg-white text-gray-500 hover:border-[var(--b1-mid)]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-1.5 text-xs font-semibold text-[var(--b1-mid)] hover:text-[var(--b1)] transition"
      >
        {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {showAdvanced ? "Hide" : "Show"} Advanced Filters
      </button>

      {showAdvanced && (
        <div className="flex flex-col gap-4 rounded-lg border border-dashed border-[var(--b2)] bg-[var(--b2-soft)]/30 p-3">
          {/* Max Distance */}
          <div>
            <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[var(--b1)]">
              <MapPin size={13} />
              Max Distance from Indore (km)
            </label>
            <input
              type="number"
              placeholder="e.g. 50"
              value={filters.maxDistance}
              onChange={(e) => updateFilter("maxDistance", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm outline-none transition focus:border-[var(--b1-mid)] focus:ring-1 focus:ring-[var(--b1-mid)]"
            />
          </div>

          {/* Max Size */}
          <div>
            <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[var(--b1)]">
              <Ruler size={13} />
              Max Size (sqft / acres)
            </label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={filters.maxSize}
              onChange={(e) => updateFilter("maxSize", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm outline-none transition focus:border-[var(--b1-mid)] focus:ring-1 focus:ring-[var(--b1-mid)]"
            />
          </div>
        </div>
      )}

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-[var(--error)] bg-[var(--error-bg)] py-2 text-xs font-semibold text-[var(--error)] transition hover:bg-red-100"
        >
          <RotateCcw size={13} />
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="mb-4 flex items-center gap-2 rounded-lg bg-[var(--b1)] px-4 py-2.5 text-sm font-semibold text-[var(--fg)] shadow transition hover:bg-[var(--b1-mid)] lg:hidden"
      >
        <SlidersHorizontal size={16} />
        Filters
        {activeCount > 0 && (
          <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--fg)] text-[10px] font-bold text-[var(--b1)]">
            {activeCount}
          </span>
        )}
      </button>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-[85vw] max-w-sm overflow-y-auto bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[var(--b1)] font-[Playfair_Display]">
                Filters
              </h3>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
              >
                <X size={20} />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block rounded-xl border border-[var(--b2-soft)] bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-[var(--b1)] font-[Playfair_Display]">
          Filter Properties
        </h3>
        {filterContent}
      </div>
    </>
  );
};

export default PropertyFilterCard;
