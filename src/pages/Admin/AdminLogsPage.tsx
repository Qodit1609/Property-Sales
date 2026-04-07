import React, { useState, useMemo } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { FileClock, ScrollText } from "lucide-react";
import { Input } from "@/components/common";
import { useAppSelector } from "../../hooks/reduxHooks";

const AdminLogsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const logs = useAppSelector((s) => s.admin.activityLogs);

  const filtered = useMemo(() => {
    if (!search) return logs;
    const l = search.toLowerCase();
    return logs.filter(
      (log) =>
        log.action.toLowerCase().includes(l) ||
        log.target.toLowerCase().includes(l) ||
        log.actor.toLowerCase().includes(l)
    );
  }, [search, logs]);

  return (
    <AdminLayout title="Activity logs">
      <section className="space-y-5 rounded-2xl border border-[var(--b2)]/90 bg-[var(--white)] p-4 shadow-md shadow-[var(--b1)]/5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--b2-soft)] text-sky-600">
              <FileClock className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[var(--b1)] sm:text-2xl">
                Activity trail
              </h2>
              <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
                Moderation and account events from admin actions.
              </p>
            </div>
          </div>
          <Input
            type="search"
            placeholder="Search logs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full min-w-0 border-[var(--b2)] text-sm shadow-sm sm:max-w-xs"
          />
        </div>

        <ul className="space-y-3">
          {filtered.map((log) => (
            <li
              key={log.id}
              className="flex gap-3 rounded-xl border border-[var(--b2)]/80 bg-gradient-to-r from-[var(--b2-soft)]/50 to-[var(--white)] p-4 shadow-sm transition hover:border-[var(--b1-mid)]/30"
            >
              <div
                className="mt-1 h-10 w-1 shrink-0 rounded-full bg-gradient-to-b from-sky-400 to-emerald-500"
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--b1)]">
                  {log.action}
                </p>
                <p className="mt-1 text-sm text-[var(--b1-mid)]">{log.target}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {log.actor} ·{" "}
                  {new Date(log.timestamp).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--b2)] bg-[var(--b2-soft)]/30 py-14 text-center">
            <ScrollText className="h-10 w-10 text-[var(--b1-mid)]" />
            <p className="font-medium text-[var(--b1)]">No logs match your search</p>
            <p className="text-sm text-[var(--muted)]">Try a different keyword.</p>
          </div>
        )}
      </section>
    </AdminLayout>
  );
};

export default AdminLogsPage;
