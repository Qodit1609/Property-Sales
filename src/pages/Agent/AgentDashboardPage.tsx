import React, { useMemo } from "react";
import { useAppSelector } from "../../hooks/reduxHooks";

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
  const { data } = useAppSelector((state) => state.properties);

  const totals = useMemo(() => {
    const approved = data.filter((p) => p.status === "approved").length;
    const pending = data.filter((p) => p.status !== "approved").length;
    return { total: data.length, approved, pending };
  }, [data]);

  const recentActivity = useMemo(() => {
    return data.slice(0, 5).map((p) => ({
      id: p._id,
      title: p.title,
      status: p.status ?? "pending",
    }));
  }, [data]);

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
          label="Total Properties"
          value={String(totals.total)}
          hint="All visible listings in the system."
        />
        <StatCard
          label="Active Leads"
          value="0"
          hint="Leads module connected next."
        />
        <StatCard
          label="Scheduled Visits"
          value="0"
          hint="Visit scheduling connected next."
        />
        <StatCard
          label="Pending Review"
          value={String(totals.pending)}
          hint={`${totals.approved} approved.`}
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

