import React, { useState, useMemo } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { FileClock } from "lucide-react";
import { Input} from "@/components/common";

const mockLogs = [
  {
    id: "1",
    actor: "admin@bhoomiwala.com",
    action: "Approved listing",
    target: "5 Acre agriculture land near Indore Bypass",
    timestamp: "2026-03-10T11:20:00Z",
  },
  {
    id: "2",
    actor: "admin@bhoomiwala.com",
    action: "Rejected listing",
    target: "Farmhouse near Mhow",
    timestamp: "2026-03-09T15:42:00Z",
  },
];

const AdminLogsPage: React.FC = () => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return mockLogs;
    const l = search.toLowerCase();
    return mockLogs.filter(
      (log) =>
        log.action.toLowerCase().includes(l) ||
        log.target.toLowerCase().includes(l) ||
        log.actor.toLowerCase().includes(l)
    );
  }, [search]);

  return (
    <AdminLayout title="Admin Activity Logs">
      <section className="space-y-4 rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--b2-soft)] text-sky-500">
              <FileClock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[var(--b1)]">
                Moderation activity trail
              </h2>
              <p className="text-[11px] text-[var(--muted)]">
                Approvals, rejections and user actions (structure ready for
                backend wiring).
              </p>
            </div>
          </div>
          <Input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border border-[var(--b2)] px-2 py-1 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-[var(--b1-mid)]"
          />
        </div>

        <div className="mt-2 space-y-2 text-xs text-[var(--b1)]">
          {filtered.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 rounded-xl border border-[var(--b2)] bg-[var(--b2-soft)] px-3 py-2"
            >
              <div className="mt-0.5 h-8 w-0.5 rounded-full bg-gradient-to-b from-sky-400 to-emerald-400" />
              <div className="flex-1">
                <p className="text-[11px] font-medium text-[var(--b1)]">
                  {log.action}
                </p>
                <p className="mt-0.5 text-[11px] text-[var(--b1-mid)]">
                  {log.target}
                </p>
                <p className="mt-0.5 text-[10px] text-[var(--muted)]">
                  {log.actor} ·{" "}
                  {new Date(log.timestamp).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminLogsPage;

