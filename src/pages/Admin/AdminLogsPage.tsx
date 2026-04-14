import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { FileClock, ScrollText } from "lucide-react";
import { Input } from "@/components/common";
import api from "../../lib/apiClient";

type AdminLogItem = {
  _id: string;
  name: string;
  email: string;
  role: "buyer" | "seller";
  action: string;
  createdAt: string;
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

const AdminLogsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState<AdminLogItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadLogs = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin/logs");
        const items = Array.isArray(response.data?.data) ? response.data.data : [];
        if (mounted) {
          setLogs(items as AdminLogItem[]);
        }
      } catch (error) {
        if (mounted) {
          setLogs([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadLogs();

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!search) return logs;
    const l = search.toLowerCase();
    return logs.filter(
      (log) =>
        log.action.toLowerCase().includes(l) ||
        log.name.toLowerCase().includes(l) ||
        log.email.toLowerCase().includes(l) ||
        log.role.toLowerCase().includes(l)
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

        <div className="overflow-hidden rounded-xl border border-[var(--b2)]/90 bg-[var(--white)] shadow-md shadow-[var(--b1)]/5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--b2)] bg-[var(--b2-soft)]/80">
                  <th className="px-4 py-3.5 font-semibold text-[var(--b1)] sm:px-5">Name</th>
                  <th className="px-4 py-3.5 font-semibold text-[var(--b1)] sm:px-5">Email</th>
                  <th className="px-4 py-3.5 font-semibold text-[var(--b1)] sm:px-5">Role</th>
                  <th className="px-4 py-3.5 font-semibold text-[var(--b1)] sm:px-5">Action</th>
                  <th className="px-4 py-3.5 font-semibold text-[var(--b1)] sm:px-5">Date</th>
                  <th className="px-4 py-3.5 font-semibold text-[var(--b1)] sm:px-5">Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, index) => (
                  <tr
                    key={log._id}
                    className={[
                      "border-b border-[var(--b2)]/70 transition-colors",
                      index % 2 === 1 ? "bg-[var(--b2-soft)]/35" : "bg-[var(--white)]",
                    ].join(" ")}
                  >
                    <td className="px-4 py-3.5 font-medium text-[var(--b1)] sm:px-5">{log.name}</td>
                    <td className="px-4 py-3.5 text-[var(--b1-mid)] sm:px-5">{log.email}</td>
                    <td className="px-4 py-3.5 text-[var(--b1-mid)] sm:px-5">{log.role}</td>
                    <td className="px-4 py-3.5 text-[var(--b1-mid)] sm:px-5">{log.action}</td>
                    <td className="px-4 py-3.5 text-[var(--b1-mid)] sm:px-5">{formatDate(log.createdAt)}</td>
                    <td className="px-4 py-3.5 text-[var(--b1-mid)] sm:px-5">{formatTime(log.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--b2)] bg-[var(--b2-soft)]/30 py-14 text-center">
            <ScrollText className="h-10 w-10 text-[var(--b1-mid)]" />
            <p className="font-medium text-[var(--b1)]">No logs match your search</p>
            <p className="text-sm text-[var(--muted)]">Try a different keyword.</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--b2)] bg-[var(--b2-soft)]/30 py-14 text-center">
            <p className="text-sm text-[var(--muted)]">Loading logs...</p>
          </div>
        )}
      </section>
    </AdminLayout>
  );
};

export default AdminLogsPage;
