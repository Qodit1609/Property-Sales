import React from "react";

interface FilterSelectProps {
  icon: React.ReactNode;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  icon,
  options,
  value,
  onChange,
  ariaLabel,
}) => {
  return (
    <div className="flex items-center bg-[var(--white)] rounded-lg shadow-sm border border-[var(--b2)] px-3 md:px-3 w-full sm:w-auto flex-1 min-w-full sm:min-w-[140px] md:min-w-[160px] focus-within:ring-2 focus-within:ring-[var(--b2)] transition">
      <span className="mr-2 text-[var(--b2)]">{icon}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="bg-transparent outline-none w-full py-4 cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterSelect;
