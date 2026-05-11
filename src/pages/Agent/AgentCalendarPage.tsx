import React, { useEffect, useMemo, useState } from "react";
import { fetchAgentVisitsAPI, type AgentVisit } from "@/features/agent/agentAPI";
import { formatTime } from "@/utils/propertyFormatters";

const formatDateKey = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const AgentCalendarPage: React.FC = () => {
  const [visits, setVisits] = useState<AgentVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const loadVisits = async () => {
      try {
        setLoading(true);
        setError("");
        const rows = await fetchAgentVisitsAPI();
        if (!mounted) return;
        setVisits(rows);
      } catch (err) {
        if (!mounted) return;
        const message = err instanceof Error ? err.message : "Failed to load calendar.";
        setError(message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadVisits();
    return () => {
      mounted = false;
    };
  }, []);

  const groupedVisits = useMemo(() => {
    const sorted = [...visits].sort((a, b) => new Date(a.when).getTime() - new Date(b.when).getTime());
    return sorted.reduce<Record<string, AgentVisit[]>>((acc, visit) => {
      const key = formatDateKey(visit.when);
      if (!acc[key]) acc[key] = [];
      acc[key].push(visit);
      return acc;
    }, {});
  }, [visits]);

  const dateGroups = Object.entries(groupedVisits);

  return (
    <section className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[var(--b1)]">Calendar</h1>
        <p className="mt-1 text-xs text-[var(--muted)]">All scheduled visits by date.</p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] px-4 py-6 text-center text-sm text-[var(--muted)] shadow-sm">
          Loading calendar...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] px-4 py-6 text-center text-sm text-[var(--error)] shadow-sm">
          {error}
        </div>
      ) : dateGroups.length === 0 ? (
        <div className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] px-4 py-6 text-center text-sm text-[var(--muted)] shadow-sm">
          No visits scheduled.
        </div>
      ) : (
        <div className="space-y-4">
          {dateGroups.map(([dateLabel, rows]) => (
            <div key={dateLabel} className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] shadow-sm">
              <div className="border-b border-[var(--b2)] px-4 py-3">
                <h2 className="text-sm font-semibold text-[var(--b1)]">{dateLabel}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-[760px] w-full text-sm">
                  <thead className="bg-[var(--b2-soft)] text-[var(--b1)]">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Time</th>
                      <th className="px-4 py-3 text-left font-semibold">Client</th>
                      <th className="px-4 py-3 text-left font-semibold">Property</th>
                      <th className="px-4 py-3 text-left font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--b2)]">
                    {rows.map((visit) => (
                      <tr key={visit.id} className="hover:bg-[var(--b2-soft)]">
                        <td className="px-4 py-3">{formatTime(visit.when)}</td>
                        <td className="px-4 py-3 font-medium text-[var(--b1)]">{visit.clientName}</td>
                        <td className="px-4 py-3">{visit.property}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-[var(--b2-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--b1)] ring-1 ring-[var(--b2)]">
                            {visit.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AgentCalendarPage;
