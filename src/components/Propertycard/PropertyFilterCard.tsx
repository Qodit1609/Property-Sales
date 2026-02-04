// import React, { useState } from "react";

// const PropertyFilterCard: React.FC = () => {
//   const [search, setSearch] = useState("");
//   const [minPrice, setMinPrice] = useState(1000000);
//   const [maxPrice, setMaxPrice] = useState(50000000);
//   const [distance, setDistance] = useState(0);
//   const [size, setSize] = useState(0);
//   const [tags, setTags] = useState<string[]>([]);

//   const toggleTag = (tag: string) => {
//     setTags((prev) =>
//       prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
//     );
//   };

//   const clearAll = () => {
//     setSearch("");
//     setMinPrice(1000000);
//     setMaxPrice(50000000);
//     setDistance(0);
//     setSize(0);
//     setTags([]);
//   };

//   const applyFilters = () => {
//     const payload = {
//       search,
//       minPrice,
//       maxPrice,
//       distance,
//       size,
//       tags,
//     };
//     console.log("Applied Filters:", payload);
//   };

//   const titleClass = "text-xs uppercase tracking-wide text-[#FFFBE6]/80 mb-1";

//   return (
//     <div className="w-[320px] bg-[#347928] text-[#FFFBE6] p-5 rounded-2xl shadow-xl">
//       <div className="flex mb-5">
//         <input
//           type="text"
//           placeholder="Search Farmhouse/Farmland"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="
//             flex-1 px-3 py-2
//             rounded-l-md
//             text-gray-900
//             bg-[#FFFBE6]
//             border border-[#C0EBA6]
//             focus:border-[#FCCD2A]
//             focus:ring-1 focus:ring-[#FCCD2A]
//             outline-none
//           "
//         />
//         <button
//           onClick={applyFilters}
//           className="
//             bg-[#FCCD2A]
//             px-4
//             rounded-r-md
//             border border-l-0 border-[#FCCD2A]
//             text-[#347928]
//             font-semibold
//             hover:brightness-95
//           "
//         >
//           Go
//         </button>
//       </div>

//       <p className={titleClass}>PRICE (₹)</p>
//       <input
//         type="range"
//         min={1000000}
//         max={50000000}
//         step={500000}
//         value={maxPrice}
//         onChange={(e) => setMaxPrice(Number(e.target.value))}
//         className="w-full accent-[#FCCD2A]"
//       />
//       <div className="flex justify-between text-xs mb-2">
//         <span>10 lac</span>
//         <span>5 crore</span>
//       </div>
//       <div className="flex justify-between mb-5 text-sm">
//         <span>{minPrice.toLocaleString()}</span>
//         <span>{maxPrice.toLocaleString()}</span>
//       </div>

//       <p className={titleClass}>DISTANCE FROM INDORE (KM)</p>
//       <input
//         type="range"
//         min={0}
//         max={200}
//         value={distance}
//         onChange={(e) => setDistance(Number(e.target.value))}
//         className="w-full accent-[#FCCD2A]"
//       />
//       <div className="flex justify-between text-sm mb-5">
//         <span>0</span>
//         <span>{distance}</span>
//         <span>200</span>
//       </div>

//       <p className={titleClass}>SIZE (SQ. FT.)</p>
//       <input
//         type="range"
//         min={0}
//         max={40000}
//         step={500}
//         value={size}
//         onChange={(e) => setSize(Number(e.target.value))}
//         className="w-full accent-[#FCCD2A]"
//       />
//       <div className="flex justify-between text-sm mb-5">
//         <span>0</span>
//         <span>{size}</span>
//         <span>40,000</span>
//       </div>

//       <p className={`${titleClass} mb-2`}>TAGS</p>
//       <div className="grid grid-cols-2 gap-2 mb-5">
//         {["Hot", "Popular", "Latest", "Premium"].map((tag) => (
//           <label key={tag} className="flex items-center gap-2 text-sm">
//             <input
//               type="checkbox"
//               checked={tags.includes(tag)}
//               onChange={() => toggleTag(tag)}
//               className="accent-[#FCCD2A]"
//             />
//             {tag}
//           </label>
//         ))}
//       </div>

//       <button
//         onClick={clearAll}
//         className="w-full bg-[#C0EBA6] text-[#347928] py-2 rounded-md font-semibold hover:brightness-95"
//       >
//         Clear All
//       </button>
//     </div>
//   );
// };

// export default PropertyFilterCard;

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

  // ── state ──
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000000);
  const [distance, setDistance] = useState(200);
  const [size, setSize] = useState(isAgriPage ? 1000 : 40000);
  const [tags, setTags] = useState<string[]>([]);

  // ── derived from route ──
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

  // ── live filter logic ──
  const filtered = useMemo(() => {
    return properties.filter((p) => {
      // 1. search – title or address
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.address.toLowerCase().includes(q))
          return false;
      }
      // 2. price
      if (p.price < minPrice || p.price > maxPrice) return false;
      // 3. distance
      if (p.distanceFromIndore > distance) return false;
      // 4. size – only compare when units match
      if (isAgriPage && isSizeInAcres(p.propertyType) && p.size > size) return false;
      if (!isAgriPage && !isSizeInAcres(p.propertyType) && p.size > size) return false;
      // 5. tags – property must have at least one selected tag
      if (tags.length > 0 && !tags.some((t) => p.tags.includes(t))) return false;

      return true;
    });
  }, [properties, search, minPrice, maxPrice, distance, size, tags, isAgriPage]);

  // push filtered list up whenever it changes
  useEffect(() => {
    onFiltered(filtered);
  }, [filtered]);

  // ── helpers ──
  const titleClass = "text-xs uppercase tracking-wide text-[#FFFBE6]/80 mb-1";

  const formatPrice = (n: number) =>
    n >= 10000000
      ? `${(n / 10000000).toFixed(1)} Cr`
      : n >= 100000
        ? `${(n / 100000).toFixed(0)} L`
        : n.toLocaleString();

  return (
    <div className="w-full max-w-[320px] bg-[#347928] text-[#FFFBE6] p-5 rounded-2xl shadow-xl">
      {/* Search */}
      <div className="flex mb-5">
        <input
          type="text"
          placeholder="Search property…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 rounded-l-md text-gray-900 bg-[#FFFBE6] border border-[#C0EBA6] focus:border-[#FCCD2A] focus:ring-1 focus:ring-[#FCCD2A] outline-none text-sm"
        />
        <span className="bg-[#FCCD2A] px-3 rounded-r-md border border-l-0 border-[#FCCD2A] text-[#347928] font-semibold flex items-center text-sm">
          🔍
        </span>
      </div>

      {/* PRICE */}
      <p className={titleClass}>PRICE (₹)</p>
      <input
        type="range"
        min={100000}
        max={1000000000}
        step={100000}
        value={maxPrice}
        onChange={(e) => setMaxPrice(Number(e.target.value))}
        className="w-full accent-[#FCCD2A]"
      />
      <div className="flex justify-between text-xs mb-2">
        <span>1 lac</span>
        <span>100 crore</span>
      </div>
      <div className="flex justify-between mb-5 text-sm">
        <span className="font-semibold text-[#FCCD2A]">{formatPrice(maxPrice)}</span>
      </div>
      {/* DISTANCE */}
      <p className={titleClass}>DISTANCE FROM INDORE (KM)</p>
      <input
        type="range" min={0} max={200} step={5}
        value={distance}
        onChange={(e) => setDistance(Number(e.target.value))}
        className="w-full accent-[#FCCD2A]"
      />
      <div className="flex justify-between text-sm mb-5">
        <span>0 km</span>
        <span className="font-semibold text-[#FCCD2A]">{distance} km</span>
        <span>200 km</span>
      </div>

      {/* SIZE – label & range switch based on route */}
      <p className={titleClass}>SIZE ({sizeUnit.toUpperCase()})</p>
      <input
        type="range" min={0} max={sizeMax} step={sizeStep}
        value={size}
        onChange={(e) => setSize(Number(e.target.value))}
        className="w-full accent-[#FCCD2A]"
      />
      <div className="flex justify-between text-sm mb-5">
        <span>0</span>
        <span className="font-semibold text-[#FCCD2A]">{size.toLocaleString()} {sizeUnit}</span>
        <span>{sizeMax.toLocaleString()}</span>
      </div>

      {/* TAGS */}
      <p className={`${titleClass} mb-2`}>TAGS</p>
      <div className="grid grid-cols-2 gap-2 mb-5">
        {["Hot", "Popular", "Latest", "Premium"].map((tag) => (
          <label key={tag} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={tags.includes(tag)}
              onChange={() => toggleTag(tag)}
              className="accent-[#FCCD2A]"
            />
            {tag}
          </label>
        ))}
      </div>

      {/* Result count */}
      {/* <p className="text-xs text-center text-[#C0EBA6] mb-3">
        Showing <span className="font-bold text-[#FCCD2A]">{filtered.length}</span> of {properties.length} properties
      </p> */}

      {/* Clear */}
      <button
        onClick={clearAll}
        className="w-full bg-[#C0EBA6] text-[#347928] py-2 rounded-md font-semibold hover:brightness-95 transition"
      >
        Clear All
      </button>
    </div>
  );
};

export default PropertyFilterCard;