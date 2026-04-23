import React, { useMemo } from "react";
import { useAgentCollection } from "./AgentCollectionContext";

type StatCardProps = {
  label: string;
  value: string;
  hint: string;
};

function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-[var(--b1)]">{value}</p>
      <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p>
    </div>
  );
}

const AgentDashboardPage: React.FC = () => {
  const { properties } = useAgentCollection();

  const recentActivity = useMemo(() => {
    return properties.slice(0, 5).map((p) => ({
      id: p.id,
      title: p.step1.village,
      status: p.status,
    }));
  }, [properties]);

  const statusTotals = useMemo(() => {
    return properties.reduce(
      (acc, property) => {
        acc[property.status] += 1;
        return acc;
      },
      { draft: 0, incomplete: 0, ready: 0 }
    );
  }, [properties]);

  return (
    <section className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[var(--b1)]">
          Agent Dashboard
        </h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Track listings, leads and visits at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Collected Properties"
          value={String(properties.length)}
          hint="Agent property collection entries."
        />
        <StatCard
          label="Draft"
          value={String(statusTotals.draft)}
          hint="Step 1 saved and editable."
        />
        <StatCard
          label="Incomplete"
          value={String(statusTotals.incomplete)}
          hint="Step 2 pending final details."
        />
        <StatCard
          label="Ready"
          value={String(statusTotals.ready)}
          hint="Ready for admin approval flow."
        />
      </div>

      <div className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] shadow-sm">
        <div className="border-b border-[var(--b2)] px-4 py-3">
          <h2 className="text-sm font-semibold text-[var(--b1)]">
            Recent Activity
          </h2>
          <p className="text-[11px] text-[var(--muted)]">
            Latest property status snapshots.
          </p>
        </div>
        <div className="p-4">
          {recentActivity.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">
              No recent activity found.
            </p>
          ) : (
            <ul className="space-y-3">
              {recentActivity.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[var(--b2)] bg-[var(--b2-soft)]/40 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--b1)]">
                      {a.title || "Untitled"}
                    </p>
                    <p className="text-[11px] text-[var(--muted)]">
                      ID: {a.id}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[var(--b2-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--b1)] ring-1 ring-[var(--b2)]">
                    {String(a.status).toUpperCase()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default AgentDashboardPage;

