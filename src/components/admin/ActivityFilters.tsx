import React from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/common";

import type { ActivityCategoryFilter, UserTypeFilter } from "./activityLogTypes";

const filterSelectClass =
  "w-full min-h-[44px] rounded-xl border border-[var(--b2)] bg-[var(--white)] px-3 py-2.5 text-sm text-[var(--b1)] shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--b1-mid)]/35 focus:border-[var(--b1-mid)]";

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
  const { t } = useTranslation();

  const userOptions: { value: UserTypeFilter; labelKey: string }[] = [
    { value: "all", labelKey: "adminPanel.activityLogsPage.filterAll" },
    { value: "seller", labelKey: "adminPanel.activityLogsPage.filterSeller" },
    { value: "buyer", labelKey: "adminPanel.activityLogsPage.filterBuyer" },
  ];

  const activityOptions: { value: ActivityCategoryFilter; labelKey: string }[] = [
    { value: "all", labelKey: "adminPanel.activityLogsPage.filterAllTypes" },
    { value: "login", labelKey: "adminPanel.activityLogsPage.filterLogin" },
    { value: "property", labelKey: "adminPanel.activityLogsPage.filterProperty" },
  ];

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:gap-3">
      <div className="grid w-full gap-3 sm:grid-cols-2 lg:flex lg:w-auto lg:min-w-0 lg:flex-1 lg:gap-3">
        <label className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            {t("adminPanel.activityLogsPage.filterUserType")}
          </span>
          <select
            className={filterSelectClass}
            value={userType}
            onChange={(e) => onUserTypeChange(e.target.value as UserTypeFilter)}
            aria-label={t("adminPanel.activityLogsPage.filterUserType")}
          >
            {userOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {t(o.labelKey)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            {t("adminPanel.activityLogsPage.filterActivityType")}
          </span>
          <select
            className={filterSelectClass}
            value={activityCategory}
            onChange={(e) =>
              onActivityCategoryChange(e.target.value as ActivityCategoryFilter)
            }
            aria-label={t("adminPanel.activityLogsPage.filterActivityType")}
          >
            {activityOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {t(o.labelKey)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex w-full min-w-0 flex-col gap-1.5 lg:min-w-[220px] lg:flex-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          {t("adminPanel.activityLogsPage.searchLabel")}
        </span>
        <Input
          type="search"
          placeholder={t("adminPanel.activityLogsPage.searchByUserPlaceholder")}
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
