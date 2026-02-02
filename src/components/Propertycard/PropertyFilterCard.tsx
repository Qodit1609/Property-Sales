import React, { useState } from "react";

const PropertyFilterCard: React.FC = () => {
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState(1000000);
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [distance, setDistance] = useState(0);
  const [size, setSize] = useState(0);
  const [tags, setTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const clearAll = () => {
    setSearch("");
    setMinPrice(1000000);
    setMaxPrice(50000000);
    setDistance(0);
    setSize(0);
    setTags([]);
  };

  const applyFilters = () => {
    const payload = {
      search,
      minPrice,
      maxPrice,
      distance,
      size,
      tags,
    };
    console.log("Applied Filters:", payload);
  };

  const titleClass = "text-xs uppercase tracking-wide text-[#FFFBE6]/80 mb-1";

  return (
    <div className="w-[320px] bg-[#347928] text-[#FFFBE6] p-5 rounded-2xl shadow-xl">
      <div className="flex mb-5">
        <input
          type="text"
          placeholder="Search Farmhouse/Farmland"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            flex-1 px-3 py-2
            rounded-l-md
            text-gray-900
            bg-[#FFFBE6]
            border border-[#C0EBA6]
            focus:border-[#FCCD2A]
            focus:ring-1 focus:ring-[#FCCD2A]
            outline-none
          "
        />
        <button
          onClick={applyFilters}
          className="
            bg-[#FCCD2A]
            px-4
            rounded-r-md
            border border-l-0 border-[#FCCD2A]
            text-[#347928]
            font-semibold
            hover:brightness-95
          "
        >
          Go
        </button>
      </div>

      <p className={titleClass}>PRICE (₹)</p>
      <input
        type="range"
        min={1000000}
        max={50000000}
        step={500000}
        value={maxPrice}
        onChange={(e) => setMaxPrice(Number(e.target.value))}
        className="w-full accent-[#FCCD2A]"
      />
      <div className="flex justify-between text-xs mb-2">
        <span>10 lac</span>
        <span>5 crore</span>
      </div>
      <div className="flex justify-between mb-5 text-sm">
        <span>{minPrice.toLocaleString()}</span>
        <span>{maxPrice.toLocaleString()}</span>
      </div>

      <p className={titleClass}>DISTANCE FROM INDORE (KM)</p>
      <input
        type="range"
        min={0}
        max={200}
        value={distance}
        onChange={(e) => setDistance(Number(e.target.value))}
        className="w-full accent-[#FCCD2A]"
      />
      <div className="flex justify-between text-sm mb-5">
        <span>0</span>
        <span>{distance}</span>
        <span>200</span>
      </div>

      <p className={titleClass}>SIZE (SQ. FT.)</p>
      <input
        type="range"
        min={0}
        max={40000}
        step={500}
        value={size}
        onChange={(e) => setSize(Number(e.target.value))}
        className="w-full accent-[#FCCD2A]"
      />
      <div className="flex justify-between text-sm mb-5">
        <span>0</span>
        <span>{size}</span>
        <span>40,000</span>
      </div>

      <p className={`${titleClass} mb-2`}>TAGS</p>
      <div className="grid grid-cols-2 gap-2 mb-5">
        {["Hot", "Popular", "Latest", "Premium"].map((tag) => (
          <label key={tag} className="flex items-center gap-2 text-sm">
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

      <button
        onClick={clearAll}
        className="w-full bg-[#C0EBA6] text-[#347928] py-2 rounded-md font-semibold hover:brightness-95"
      >
        Clear All
      </button>
    </div>
  );
};

export default PropertyFilterCard;
