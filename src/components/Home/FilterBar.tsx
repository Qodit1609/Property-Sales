import { useState } from "react";
import FilterSelect from "./FilterSelect";
import {
  LocationIcon,
  CategoryIcon,
  TypeIcon,
  SearchIcon,
} from "./Icons";
import { FILTER_OPTIONS } from "./constants";

interface FilterBarProps {
  onSearch?: (filters: FilterValues) => void;
}

export interface FilterValues {
  location: string;
  category: string;
  type: string;
  search: string;
}

const FilterBar: React.FC<FilterBarProps> = ({ onSearch }) => {
  const [filters, setFilters] = useState<FilterValues>({
    location: "all",
    category: "all",
    type: "all",
    search: "",
  });

  const handleFilterChange = (field: keyof FilterValues, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(filters);
  };

  return (
    <div className="absolute left-1/2 bottom-[-45px] z-20 w-full -translate-x-1/2 px-2 sm:px-4">
      <div className="w-full max-w-[1200px] mx-auto bg-[var(--b2-soft)]/95 backdrop-blur-md rounded-3xl shadow-2xl px-3 sm:px-6 py-4 sm:py-6 border border-[var(--b2)]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-3 md:gap-4 items-stretch sm:items-center justify-between"
        >
          {/* Location */}
          <FilterSelect
            icon={<LocationIcon className="w-5 h-5" />}
            options={FILTER_OPTIONS.location}
            value={filters.location}
            onChange={(value) => handleFilterChange("location", value)}
            ariaLabel="Select location"
          />

          {/* Category */}
          <FilterSelect
            icon={<CategoryIcon className="w-5 h-5" />}
            options={FILTER_OPTIONS.category}
            value={filters.category}
            onChange={(value) => handleFilterChange("category", value)}
            ariaLabel="Select category"
          />

          {/* Type */}
          <FilterSelect
            icon={<TypeIcon className="w-5 h-5" />}
            options={FILTER_OPTIONS.type}
            value={filters.type}
            onChange={(value) => handleFilterChange("type", value)}
            ariaLabel="Select type"
          />

          {/* Search */}
          <div className="flex items-center bg-[var(--white)] rounded-lg shadow-sm border border-[var(--b2)] px-3 md:px-3 w-full sm:w-auto flex-[2] min-w-full sm:min-w-[160px] focus-within:ring-2 focus-within:ring-[var(--b2)] transition">
            <span className="mr-2 text-[var(--b2)]">
              <SearchIcon className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search a Property"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="bg-transparent outline-none w-full py-3"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--b1-mid)] to-[var(--b2)] hover:from-[var(--b1)] hover:to-[var(--b2-soft)] transition text-fg font-semibold flex items-center justify-center gap-2 shadow-md border border-[var(--b2)] focus:ring-2 focus:ring-[var(--b2)]"
          >
            <SearchIcon className="w-5 h-5" />
            <span>Search</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default FilterBar;
