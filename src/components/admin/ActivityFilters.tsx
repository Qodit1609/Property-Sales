import React from "react";
import { Input } from "@/components/common";

import type { ActivityCategoryFilter, UserTypeFilter } from "./activityLogTypes";

const filterSelectClass =
  "w-full min-h-[44px] rounded-xl border border-[var(--b2)] bg-[var(--white)] px-3 py-2.5 text-sm text-[var(--b1)] shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--b1-mid)]/35 focus:border-[var(--b1-mid)]";

const USER_OPTIONS: { value: UserTypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "seller", label: "Seller" },
  { value: "buyer", label: "Buyer" },
  { value: "admin", label: "Admin" },
];

const ACTIVITY_OPTIONS: { value: ActivityCategoryFilter; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "login", label: "Login" },
  { value: "property", label: "Property" },
  { value: "documents", label: "Documents" },
  { value: "leads", label: "Leads" },
  { value: "security", label: "Security" },
];

interface ActivityFiltersProps {
  userType: UserTypeFilter;
  onUserTypeChange: (v: UserTypeFilter) => void;
  activityCategory: ActivityCategoryFilter;
  onActivityCategoryChange: (v: ActivityCategoryFilter) => void;
  search: string;
  onSearchChange: (v: string) => void;
}

const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  userType,
  onUserTypeChange,
  activityCategory,
  onActivityCategoryChange,
  search,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:gap-3">
      <div className="grid w-full gap-3 sm:grid-cols-2 lg:flex lg:w-auto lg:min-w-0 lg:flex-1 lg:gap-3">
        <label className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            User type
          </span>
          <select
            className={filterSelectClass}
            value={userType}
            onChange={(e) => onUserTypeChange(e.target.value as UserTypeFilter)}
            aria-label="Filter by user type"
          >
            {USER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Activity type
          </span>
          <select
            className={filterSelectClass}
            value={activityCategory}
            onChange={(e) =>
              onActivityCategoryChange(e.target.value as ActivityCategoryFilter)
            }
            aria-label="Filter by activity category"
          >
            {ACTIVITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex w-full min-w-0 flex-col gap-1.5 lg:max-w-[200px]">
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          Date range
        </span>
        <input
          type="text"
          readOnly
          placeholder="Select dates (soon)"
          className={`${filterSelectClass} cursor-not-allowed bg-[var(--b2-soft)]/50 text-[var(--muted)]`}
          aria-label="Date range placeholder"
        />
      </label>

      <label className="flex w-full min-w-0 flex-col gap-1.5 lg:min-w-[220px] lg:flex-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          Search
        </span>
        <Input
          type="search"
          placeholder="Search by user name"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full min-w-0 border-[var(--b2)] text-sm shadow-sm"
          autoComplete="off"
        />
      </label>
    </div>
  );
};

export default ActivityFilters;
