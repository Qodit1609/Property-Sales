import React, { useEffect, useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import ActivityFilters from "../../components/admin/ActivityFilters";
import ActivityLogTable from "../../components/admin/ActivityLogTable";
import ActivityStats from "../../components/admin/ActivityStats";
import type {
  ActivityLogEntry,
  ActivityLogRole,
  ActivityStatusTone,
  ActivityTypeCode,
  ActivityCategoryFilter,
  UserTypeFilter,
} from "../../components/admin/activityLogTypes";
import api from "../../lib/apiClient";

type BackendLog = {
  _id: string;
  name: string;
  email: string;
  role: "buyer" | "seller" | "admin";
  action: string;
  createdAt: string;
  status?: string;
};

type BackendUser = {
  _id: string;
  name: string;
  email?: string;
  role: "buyer" | "seller" | "admin";
  lastLogin?: string;
};

type BackendAgent = {
  _id: string;
  name: string;
  stats?: {
    totalProperties?: number;
    lastPropertyAddedAt?: string | null;
  };
};

function normalizeEmail(value: string | undefined): string {
  return String(value ?? "").trim().toLowerCase();
}

function classifyActivityType(action: string): ActivityTypeCode {
  const value = action.toLowerCase();
  const normalized = value.replace(/_/g, " ");
  if (normalized.includes("seller login")) return "SELLER_LOGIN";
  if (normalized.includes("seller logout")) return "SELLER_LOGOUT";
  if (normalized.includes("buyer login")) return "BUYER_LOGIN";
  if (normalized.includes("buyer logout")) return "BUYER_LOGOUT";
  if (normalized.includes("login")) return "BUYER_LOGIN";
  if (normalized.includes("logout")) return "BUYER_LOGOUT";
  if (value.includes("approved")) return "PROPERTY_APPROVED";
  if (value.includes("rejected")) return "PROPERTY_REJECTED";
  if (value.includes("deleted")) return "PROPERTY_DELETED";
  if (value.includes("edited") || value.includes("updated")) return "PROPERTY_EDITED";
  if (value.includes("created") || value.includes("added")) return "PROPERTY_CREATED";
  if (value.includes("document uploaded")) return "DOCUMENT_UPLOADED";
  if (value.includes("document verified")) return "DOCUMENT_VERIFIED";
  if (value.includes("blocked")) return "USER_BLOCKED";
  if (value.includes("verified")) return "USER_VERIFIED";
  return "SEARCH_ACTIVITY";
}

function classifyStatusTone(status: string): ActivityStatusTone {
  const value = status.toLowerCase();
  if (value.includes("success") || value.includes("approved") || value.includes("created")) {
    return "success";
  }
  if (value.includes("pending")) return "warning";
  if (value.includes("reject") || value.includes("fail")) return "danger";
  if (value.includes("update") || value.includes("view")) return "info";
  return "neutral";
}

function formatLogDate(iso: string): string {
  const date = new Date(iso);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

function formatDuration(startIso: string, endIso: string): string {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return "-";
  const diffMinutes = Math.floor((end - start) / 60000);
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

const ActivityLogs: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<ActivityLogEntry[]>([]);
  const [userType, setUserType] = useState<UserTypeFilter>("all");
  const [activityCategory, setActivityCategory] =
    useState<ActivityCategoryFilter>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [sellerPropertyCountByName, setSellerPropertyCountByName] = useState<
    Record<string, number>
  >({});
  const [sellerPropertyAddedAtByName, setSellerPropertyAddedAtByName] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    let mounted = true;
    const loadLogs = async () => {
      try {
        setLoading(true);
        const [logsResponse, sellerUsersResponse, buyerUsersResponse, agentsResponse] = await Promise.all([
          api.get("/admin/logs"),
          api.get("/admin/users?role=seller&limit=1000"),
          api.get("/admin/users?role=buyer&limit=1000"),
          api.get("/admin/agents?limit=1000"),
        ]);
        const rows = Array.isArray(logsResponse.data?.data) ? logsResponse.data.data : [];
        const sellerUsers = Array.isArray(sellerUsersResponse.data?.data)
          ? sellerUsersResponse.data.data
          : [];
        const buyerUsers = Array.isArray(buyerUsersResponse.data?.data)
          ? buyerUsersResponse.data.data
          : [];
        const agents = Array.isArray(agentsResponse.data?.data) ? agentsResponse.data.data : [];
        const activeEmails = new Set(
          [...(sellerUsers as BackendUser[]), ...(buyerUsers as BackendUser[])]
            .map((user) => normalizeEmail(user.email))
            .filter(Boolean)
        );
        if (!mounted) return;
        const mappedLogs: ActivityLogEntry[] = (rows as BackendLog[])
          .filter((log) => {
            if (log.role !== "buyer" && log.role !== "seller") return true;
            return activeEmails.has(normalizeEmail(log.email));
          })
          .map((log) => {
            const status = log.status ?? "Success";
            return {
              id: String(log._id),
              userName: String(log.name ?? ""),
              role: (log.role ?? "buyer") as ActivityLogRole,
              activity: String(log.action ?? ""),
              activityType: classifyActivityType(String(log.action ?? "")),
              target: "",
              date: formatLogDate(String(log.createdAt ?? "")),
              status,
              statusTone: classifyStatusTone(status),
              actorId: String(log._id),
              timestamp: String(log.createdAt ?? ""),
            };
          });

        const existingLoginKeys = new Set(
          mappedLogs
            .filter((entry) => entry.activityType === "SELLER_LOGIN" || entry.activityType === "BUYER_LOGIN")
            .map((entry) => `${entry.role}|${entry.userName}|${entry.timestamp}`)
        );

        const users = [...sellerUsers, ...buyerUsers] as BackendUser[];
        const fallbackLoginRows: ActivityLogEntry[] = users
          .filter(
            (user) =>
              (user.role === "seller" || user.role === "buyer") &&
              Boolean(user.lastLogin)
          )
          .filter((user) => {
            const key = `${user.role}|${String(user.name ?? "")}|${String(user.lastLogin ?? "")}`;
            return !existingLoginKeys.has(key);
          })
          .map((user) => ({
            id: `lastlogin-${String(user._id)}`,
            userName: String(user.name ?? ""),
            role: user.role as ActivityLogRole,
            activity: user.role === "seller" ? "SELLER_LOGIN" : "BUYER_LOGIN",
            activityType: user.role === "seller" ? "SELLER_LOGIN" : "BUYER_LOGIN",
            target: "",
            date: formatLogDate(String(user.lastLogin ?? "")),
            status: "Success",
            statusTone: "success",
            actorId: String(user._id),
            timestamp: String(user.lastLogin ?? ""),
          }));

        const sellerCounts: Record<string, number> = {};
        const sellerAddedAt: Record<string, string> = {};
        for (const agent of agents as BackendAgent[]) {
          const key = String(agent.name ?? "").trim();
          if (!key) continue;
          sellerCounts[key] = Number(agent.stats?.totalProperties ?? 0);
          const addedAt = String(agent.stats?.lastPropertyAddedAt ?? "").trim();
          if (addedAt) {
            sellerAddedAt[key] = addedAt;
          }
        }

        setSellerPropertyCountByName(sellerCounts);
        setSellerPropertyAddedAtByName(sellerAddedAt);
        setAuditLogs([...mappedLogs, ...fallbackLoginRows]);
      } catch {
        if (mounted) {
          setSellerPropertyCountByName({});
          setSellerPropertyAddedAtByName({});
          setAuditLogs([]);
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

  const dedupedAuditLogs = useMemo(() => {
    const latestLoginByUser = new Map<string, ActivityLogEntry>();
    for (const row of auditLogs) {
      const isLoginRow = row.activityType === "SELLER_LOGIN" || row.activityType === "BUYER_LOGIN";
      if (!isLoginRow) continue;
      const key = `${row.role}|${row.userName.trim().toLowerCase()}`;
      const current = latestLoginByUser.get(key);
      const rowTs = new Date(row.timestamp).getTime();
      const currentTs = current ? new Date(current.timestamp).getTime() : Number.NEGATIVE_INFINITY;
      const normalizedRowTs = Number.isFinite(rowTs) ? rowTs : Number.NEGATIVE_INFINITY;
      const normalizedCurrentTs = Number.isFinite(currentTs) ? currentTs : Number.NEGATIVE_INFINITY;
      if (!current || normalizedRowTs >= normalizedCurrentTs) {
        latestLoginByUser.set(key, row);
      }
    }

    return auditLogs.filter((row) => {
      const isLoginRow = row.activityType === "SELLER_LOGIN" || row.activityType === "BUYER_LOGIN";
      if (!isLoginRow) return true;
      const key = `${row.role}|${row.userName.trim().toLowerCase()}`;
      return latestLoginByUser.get(key)?.id === row.id;
    });
  }, [auditLogs]);

  const stats = useMemo(() => {
    return {
      total: dedupedAuditLogs.length,
      seller: dedupedAuditLogs.filter((l) => l.role === "seller").length,
      buyer: dedupedAuditLogs.filter((l) => l.role === "buyer").length,
      admin: dedupedAuditLogs.filter((l) => l.role === "admin").length,
    };
  }, [dedupedAuditLogs]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const baseRows = auditLogs.filter((row) => {
      if (userType !== "all" && row.role !== userType) return false;
      if (activityCategory === "login") {
        if (!(row.activityType === "SELLER_LOGIN" || row.activityType === "BUYER_LOGIN")) {
          return false;
        }
      }
      if (activityCategory === "property") {
        if (!row.activityType.startsWith("PROPERTY_")) return false;
      }
      if (!q) return true;
      return (
        row.userName.toLowerCase().includes(q) ||
        row.activity.toLowerCase().includes(q) ||
        row.role.toLowerCase().includes(q) ||
        row.status.toLowerCase().includes(q)
      );
    });

    const latestLoginByUser = new Map<string, ActivityLogEntry>();
    for (const row of baseRows) {
      const isLoginRow = row.activityType === "SELLER_LOGIN" || row.activityType === "BUYER_LOGIN";
      if (!isLoginRow) continue;
      const key = `${row.role}|${row.userName.trim().toLowerCase()}`;
      const current = latestLoginByUser.get(key);
      const rowTs = new Date(row.timestamp).getTime();
      const currentTs = current ? new Date(current.timestamp).getTime() : Number.NEGATIVE_INFINITY;
      const normalizedRowTs = Number.isFinite(rowTs) ? rowTs : Number.NEGATIVE_INFINITY;
      const normalizedCurrentTs = Number.isFinite(currentTs) ? currentTs : Number.NEGATIVE_INFINITY;
      if (!current || normalizedRowTs >= normalizedCurrentTs) {
        latestLoginByUser.set(key, row);
      }
    }

    const rowsWithLatestLoginsOnly = baseRows.filter((row) => {
      const isLoginRow = row.activityType === "SELLER_LOGIN" || row.activityType === "BUYER_LOGIN";
      if (!isLoginRow) return true;
      const key = `${row.role}|${row.userName.trim().toLowerCase()}`;
      return latestLoginByUser.get(key)?.id === row.id;
    });

    if (activityCategory !== "login") {
      return rowsWithLatestLoginsOnly;
    }

    const logoutRows = auditLogs.filter(
      (row) => row.activityType === "SELLER_LOGOUT" || row.activityType === "BUYER_LOGOUT"
    );

    return rowsWithLatestLoginsOnly.map((row) => {
      const loginTs = new Date(row.timestamp).getTime();
      const matchingLogout = logoutRows
        .filter((log) => {
          if (log.role !== row.role) return false;
          if (log.userName !== row.userName) return false;
          const logoutTs = new Date(log.timestamp).getTime();
          return Number.isFinite(logoutTs) && Number.isFinite(loginTs) && logoutTs >= loginTs;
        })
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())[0];

      const logoutAt = matchingLogout ? formatLogDate(matchingLogout.timestamp) : "-";
      return {
        ...row,
        loginAt: row.date,
        logoutAt,
        sessionDuration: matchingLogout
          ? formatDuration(row.timestamp, matchingLogout.timestamp)
          : "-",
      };
    });
  }, [auditLogs, userType, activityCategory, search]);

  const sellerSummary = useMemo(() => {
    const sellerRows = auditLogs.filter((row) => row.role === "seller");
    const map = new Map<
      string,
      { userName: string; propertyCount: number; addedAt: string[] }
    >();
    for (const row of sellerRows) {
      const key = row.userName || row.id;
      if (!map.has(key)) {
        map.set(key, { userName: row.userName, propertyCount: 0, addedAt: [] });
      }
      if (row.activityType.startsWith("PROPERTY_")) {
        const current = map.get(key)!;
        current.propertyCount += 1;
        current.addedAt.push(row.date);
      }
    }
    for (const value of map.values()) {
      if (Object.prototype.hasOwnProperty.call(sellerPropertyCountByName, value.userName)) {
        value.propertyCount = sellerPropertyCountByName[value.userName];
      }
      if (
        value.addedAt.length === 0 &&
        Object.prototype.hasOwnProperty.call(sellerPropertyAddedAtByName, value.userName)
      ) {
        value.addedAt = [formatLogDate(sellerPropertyAddedAtByName[value.userName])];
      }
    }
    return {
      totalSellers: map.size,
      rows: Array.from(map.values()),
    };
  }, [auditLogs, sellerPropertyCountByName, sellerPropertyAddedAtByName]);

  const buyerSummary = useMemo(() => {
    const buyerRows = auditLogs.filter((row) => row.role === "buyer");
    const map = new Map<string, { userName: string }>();
    for (const row of buyerRows) {
      const key = row.userName || row.id;
      if (!map.has(key)) {
        map.set(key, { userName: row.userName });
      }
    }
    return {
      totalBuyers: map.size,
      rows: Array.from(map.values()),
    };
  }, [auditLogs]);

  return (
    <AdminLayout title="Activity logs">
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
                <h1 className="text-xl font-semibold tracking-tight text-[var(--b1)] sm:text-2xl">
                  Activity logs
                </h1>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
                  Track admin actions across properties and users.
                </p>
              </div>
            </div>
          </div>
        </header>

        <ActivityStats stats={stats} />

        <section className="space-y-4 rounded-2xl border border-[var(--b2)]/90 bg-[var(--white)] p-4 shadow-md shadow-[var(--b1)]/5 sm:p-6">
          <div className="border-b border-[var(--b2)]/60 pb-4">
            <h2 className="text-lg font-semibold text-[var(--b1)]">
              Filters
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Narrow by role and category.
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

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-[var(--b2)]/90 bg-[var(--white)] shadow-md shadow-[var(--b1)]/5">
            <div className="border-b border-[var(--b2)]/70 px-4 py-3 sm:px-5">
              <h3 className="text-sm font-semibold text-[var(--b1)]">Seller activities</h3>
              <p className="mt-1 text-xs text-[var(--muted)]">Total sellers: {sellerSummary.totalSellers}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--b2)] bg-[var(--b2-soft)]/80">
                    <th className="px-4 py-3 font-semibold text-[var(--b1)] sm:px-5">Name</th>
                    <th className="px-4 py-3 font-semibold text-[var(--b1)] sm:px-5">Properties Added</th>
                    <th className="px-4 py-3 font-semibold text-[var(--b1)] sm:px-5">Added At</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerSummary.rows.map((row, index) => (
                    <tr
                      key={`${row.userName}-${index}`}
                      className={[
                        "border-b border-[var(--b2)]/70",
                        index % 2 === 1 ? "bg-[var(--b2-soft)]/35" : "bg-[var(--white)]",
                      ].join(" ")}
                    >
                      <td className="px-4 py-3 text-[var(--b1)] sm:px-5">{row.userName}</td>
                      <td className="px-4 py-3 text-[var(--b1-mid)] sm:px-5">{row.propertyCount}</td>
                      <td className="px-4 py-3 text-[var(--b1-mid)] sm:px-5">
                        {row.addedAt[0] ?? "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[var(--b2)]/90 bg-[var(--white)] shadow-md shadow-[var(--b1)]/5">
            <div className="border-b border-[var(--b2)]/70 px-4 py-3 sm:px-5">
              <h3 className="text-sm font-semibold text-[var(--b1)]">Buyer activities</h3>
              <p className="mt-1 text-xs text-[var(--muted)]">Total buyers: {buyerSummary.totalBuyers}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[320px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--b2)] bg-[var(--b2-soft)]/80">
                    <th className="px-4 py-3 font-semibold text-[var(--b1)] sm:px-5">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {buyerSummary.rows.map((row, index) => (
                    <tr
                      key={`${row.userName}-${index}`}
                      className={[
                        "border-b border-[var(--b2)]/70",
                        index % 2 === 1 ? "bg-[var(--b2-soft)]/35" : "bg-[var(--white)]",
                      ].join(" ")}
                    >
                      <td className="px-4 py-3 text-[var(--b1)] sm:px-5">{row.userName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--b1)]">
            Activity table
          </h2>
          <ActivityLogTable rows={filteredRows} activityCategory={activityCategory} />
          {loading ? (
            <p className="text-sm text-[var(--muted)]">Loading logs...</p>
          ) : null}
        </section>
      </div>
    </AdminLayout>
  );
};

export default ActivityLogs;
