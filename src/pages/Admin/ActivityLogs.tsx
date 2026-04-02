import React, { useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import ActivityFilters from "../../components/admin/ActivityFilters";
import ActivityLogTable from "../../components/admin/ActivityLogTable";
import ActivityStats from "../../components/admin/ActivityStats";
import {
  computeActivityStats,
  filterActivityLogs,
  MOCK_ACTIVITY_LOGS,
} from "../../components/admin/activityLogMockData";
import type {
  ActivityCategoryFilter,
  UserTypeFilter,
} from "../../components/admin/activityLogTypes";

const ActivityLogs: React.FC = () => {
  const [userType, setUserType] = useState<UserTypeFilter>("all");
  const [activityCategory, setActivityCategory] =
    useState<ActivityCategoryFilter>("all");
  const [search, setSearch] = useState("");

  const stats = useMemo(
    () => computeActivityStats(MOCK_ACTIVITY_LOGS),
    []
  );

  const filteredRows = useMemo(
    () =>
      filterActivityLogs(MOCK_ACTIVITY_LOGS, {
        userType,
        activityCategory,
        search,
      }),
    [userType, activityCategory, search]
  );

  return (
    <AdminLayout title="Audit logs">
      <div className="space-y-6">
        <header className="relative overflow-hidden rounded-2xl border border-[var(--b2)]/60 bg-[var(--white)] p-5 shadow-[0_2px_16px_rgba(27,67,50,0.07)] sm:p-6">
          <div
            className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-gradient-to-br from-[var(--b2-soft)]/90 to-transparent"
            aria-hidden
          />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--b2-soft)] text-sky-600 shadow-sm">
                <ClipboardList className="h-6 w-6" aria-hidden />
              </div>
              <div>
                <h1 className="font-sans text-xl font-semibold tracking-tight text-[var(--b1)] sm:text-2xl">
                  Activity logs
                </h1>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
                  Track seller, buyer, and admin actions across properties,
                  documents, and security. Static preview — connect your audit API
                  when ready.
                </p>
              </div>
            </div>
          </div>
        </header>

        <ActivityStats stats={stats} />

        <section className="space-y-4 rounded-2xl border border-[var(--b2)]/90 bg-[var(--white)] p-4 shadow-md shadow-[var(--b1)]/5 sm:p-6">
          <div className="border-b border-[var(--b2)]/60 pb-4">
            <h2 className="font-sans text-lg font-semibold text-[var(--b1)]">
              Filters
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Narrow by role and category. Date range and export will wire to
              your backend.
            </p>
          </div>
          <ActivityFilters
            userType={userType}
            onUserTypeChange={setUserType}
            activityCategory={activityCategory}
            onActivityCategoryChange={setActivityCategory}
            search={search}
            onSearchChange={setSearch}
          />
        </section>

        <section className="space-y-3">
          <h2 className="font-sans text-lg font-semibold text-[var(--b1)]">
            Activity table
          </h2>
          <ActivityLogTable rows={filteredRows} />
        </section>
      </div>
    </AdminLayout>
  );
};

export default ActivityLogs;
