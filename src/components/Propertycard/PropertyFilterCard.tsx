import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isSizeInAcres } from "../Data/properties";
import type { Property } from "../Data/properties";

interface PropertyFilterCardProps {
  properties: Property[];
  onFiltered: (filtered: Property[]) => void;
}

const PropertyFilterCard: React.FC<PropertyFilterCardProps> = ({
  properties,
  onFiltered,
}) => {
  const location = useLocation();
  const isAgriPage = location.pathname === "/agriculture-land";

  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000000);
  const [distance, setDistance] = useState(200);
  const [size, setSize] = useState(isAgriPage ? 1000 : 40000);
  const [tags, setTags] = useState<string[]>([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const sizeUnit = isAgriPage ? "Acres" : "Sq. Ft.";
  const sizeMax = isAgriPage ? 1000 : 40000;
  const sizeStep = isAgriPage ? 1 : 100;

  const toggleTag = (tag: string) =>
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const clearAll = () => {
    setSearch("");
    setMinPrice(0);
    setMaxPrice(50000000);
    setDistance(200);
    setSize(sizeMax);
    setTags([]);
  };

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !p.title.toLowerCase().includes(q) &&
          !p.address.toLowerCase().includes(q)
        )
          return false;
      }
      if (p.price < minPrice || p.price > maxPrice) return false;
      if (p.distanceFromIndore > distance) return false;
      if (isAgriPage && isSizeInAcres(p.propertyType) && p.size > size)
        return false;
      if (!isAgriPage && !isSizeInAcres(p.propertyType) && p.size > size)
        return false;
      if (tags.length > 0 && !tags.some((t) => p.tags.includes(t)))
        return false;

      return true;
    });
  }, [properties, search, minPrice, maxPrice, distance, size, tags, isAgriPage]);

  useEffect(() => {
    onFiltered(filtered);
  }, [filtered]);

  const titleClass =
    "text-xs uppercase tracking-wide text-[var(--fg)]/80 mb-1 font-sans";

  const formatPrice = (n: number) =>
    n >= 10000000
      ? `${(n / 10000000).toFixed(1)} Cr`
      : n >= 100000
      ? `${(n / 100000).toFixed(0)} L`
      : n.toLocaleString();

  return (
    <>
      {/* ===== MOBILE ACTION BAR ===== */}
      <div className="flex items-center gap-3 mb-4 lg:hidden">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="px-4 py-2 rounded-md bg-[var(--b2)] text-[var(--b1)] font-semibold"
        >
          Filters
        </button>

        <button
          onClick={clearAll}
          className="
            px-4 py-2 rounded-md
            border border-[var(--b2)]
            text-[var(--b2)]
            font-semibold
            hover:bg-[var(--b2)]
            hover:text-[var(--b1)]
            transition
          "
        >
          Clear
        </button>
      </div>

      {isFilterOpen && (
        <div
          onClick={() => setIsFilterOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* ===== FILTER PANEL ===== */}
      <div
        className={`
          fixed top-0 left-0 h-full w-[85%] max-w-[320px] z-50
          bg-[var(--b1)] shadow-xl p-5
          transform transition-transform duration-300
          rounded-none
          ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:shadow-none lg:w-full
          lg:rounded-2xl
        `}
      >

        <div className="flex justify-between items-center mb-4 lg:hidden">
          <h3 className="font-semibold text-lg">Filters</h3>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="flex mb-5">
          <input
            type="text"
            placeholder="Search property…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 rounded-l-md bg-white text-black border text-sm"
          />
          <span className="px-3 rounded-r-md bg-[var(--b2)] text-[var(--b1)] flex items-center">
            🔍
          </span>
        </div>

        <p className={titleClass}>PRICE (₹)</p>
        <input
          type="range"
          min={100000}
          max={1000000000}
          step={100000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[var(--b2)]"
        />
        <div className="flex justify-between text-xs mb-4">
          <span>1 Lac</span>
          <span className="font-semibold text-[var(--b2)]">
            {formatPrice(maxPrice)}
          </span>
          <span>100 Cr</span>
        </div>

        <p className={titleClass}>DISTANCE FROM INDORE (KM)</p>
        <input
          type="range"
          min={0}
          max={200}
          step={5}
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          className="w-full accent-[var(--b2)]"
        />
        <div className="flex justify-between text-sm mb-4">
          <span>0</span>
          <span className="font-semibold">{distance} km</span>
          <span>200</span>
        </div>

        <p className={titleClass}>SIZE ({sizeUnit.toUpperCase()})</p>
        <input
          type="range"
          min={0}
          max={sizeMax}
          step={sizeStep}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="w-full accent-[var(--b2)]"
        />
        <div className="flex justify-between text-sm mb-5">
          <span>0</span>
          <span className="font-semibold">
            {size.toLocaleString()} {sizeUnit}
          </span>
          <span>{sizeMax.toLocaleString()}</span>
        </div>

        <p className={`${titleClass} mb-2`}>TAGS</p>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {["Hot", "Popular", "Latest", "Premium"].map((tag) => (
            <label key={tag} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={tags.includes(tag)}
                onChange={() => toggleTag(tag)}
                className="accent-[var(--b2)]"
              />
              {tag}
            </label>
          ))}
        </div>

        <button
          onClick={clearAll}
          className="w-full py-2 rounded-md bg-[var(--b2)] text-[var(--b1)] font-semibold"
        >
          Clear All
        </button>
      </div>
    </>
  );
};

export default PropertyFilterCard;
