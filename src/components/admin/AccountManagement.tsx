import React, { useEffect, useMemo, useState } from "react";
import { Trash2, Users } from "lucide-react";
import { Button, Input } from "@/components/common";
import AdminConfirmDialog from "./AdminConfirmDialog";

import type { ManagedAccount } from "../../features/auth/roleTypes";

const ROLE_FILTERS = ["All", "Buyer", "Seller", "Agent"] as const;
type RoleFilterOption = (typeof ROLE_FILTERS)[number];

function matchesRoleFilter(
  account: ManagedAccount,
  filter: RoleFilterOption
): boolean {
  if (filter === "All") return true;
  const r = (account.role ?? "").toLowerCase();
  if (filter === "Buyer") return r === "buyer";
  if (filter === "Seller") return r === "seller";
  if (filter === "Agent") return r === "agent";
  return true;
}

interface AccountManagementProps {
  accounts: ManagedAccount[];
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  onDelete: (id: string | number) => void;
  initialRoleFilter?: "all" | "buyer" | "seller" | "agent" | "user";
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--b2)] bg-[var(--white)]">
      <div className="grid grid-cols-4 gap-0 border-b border-[var(--b2)] bg-[var(--b2-soft)] px-4 py-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-3 w-16 animate-pulse rounded bg-[var(--b2)]/60"
          />
        ))}
        <div className="mx-auto h-3 w-16 animate-pulse rounded bg-[var(--b2)]/60" />
      </div>
      <div className="divide-y divide-[var(--b2)]">
        {[1, 2, 3, 4, 5].map((row) => (
          <div
            key={row}
            className="grid grid-cols-4 items-center gap-2 px-4 py-3"
          >
            <div className="h-3 w-24 animate-pulse rounded bg-[var(--b2)]/50" />
            <div className="h-3 w-40 animate-pulse rounded bg-[var(--b2)]/50" />
            <div className="h-6 w-14 animate-pulse rounded-full bg-[var(--b2)]/50" />
            <div className="mx-auto h-8 w-20 animate-pulse rounded-lg bg-[var(--b2)]/50" />
          </div>
        ))}
      </div>
    </div>
  );
}

const AccountManagement: React.FC<AccountManagementProps> = ({
  accounts,
  loading,
  error,
  actionLoading,
  onDelete,
  initialRoleFilter = "all",
}) => {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilterOption>(() => {
    if (initialRoleFilter === "buyer" || initialRoleFilter === "user") return "Buyer";
    if (initialRoleFilter === "seller") return "Seller";
    if (initialRoleFilter === "agent") return "Agent";
    return "All";
  });
  const [deleteTarget, setDeleteTarget] = useState<ManagedAccount | null>(null);

  useEffect(() => {
    if (initialRoleFilter === "buyer" || initialRoleFilter === "user") {
      setRoleFilter("Buyer");
      return;
    }
    if (initialRoleFilter === "seller") {
      setRoleFilter("Seller");
      return;
    }
    if (initialRoleFilter === "agent") {
      setRoleFilter("Agent");
      return;
    }
    setRoleFilter("All");
  }, [initialRoleFilter]);

  const filtered = useMemo(() => {
    const byRole = accounts.filter((u) => matchesRoleFilter(u, roleFilter));
    if (!query.trim()) return byRole;
    const lower = query.toLowerCase();
    return byRole.filter(
      (u) =>
        u.name.toLowerCase().includes(lower) ||
        u.email.toLowerCase().includes(lower) ||
        (u.role && u.role.toLowerCase().includes(lower))
    );
  }, [accounts, query, roleFilter]);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    onDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5 rounded-2xl border border-[var(--b2)]/90 bg-[var(--white)] p-4 shadow-md shadow-[var(--b1)]/5 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 shrink">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--b1)] sm:text-2xl">
            Users
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
            Filter by role, search, and manage accounts.
          </p>
        </div>

        <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 lg:max-w-xl lg:flex-nowrap lg:justify-end">
          <Input
            placeholder="Search accounts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full min-w-0 border-[var(--b2)] text-sm shadow-sm sm:flex-1 sm:min-w-[200px]"
          />

          <Button
            type="button"
            onClick={() => {
              const csv = [
                ["Name", "Email", "Role"],
                ...filtered.map((u) => [u.name, u.email, u.role || ""]),
              ]
                .map((row) => row.join(","))
                .join("\n");

              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "accounts.csv";
              a.click();
              URL.revokeObjectURL(url);
            }}
            variant="primary"
            className="w-full shrink-0 shadow-sm sm:w-auto sm:self-center"
          >
            Export CSV
          </Button>
        </div>
      </div>

      <div
        className="-mx-1 flex min-w-0 flex-nowrap gap-2 overflow-x-auto px-1 pb-0.5 sm:flex-wrap sm:overflow-visible"
        role="tablist"
        aria-label="Filter by role"
      >
        {ROLE_FILTERS.map((f) => {
          const active = roleFilter === f;
          return (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setRoleFilter(f)}
              className={[
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
                active
                  ? "border-[var(--b1-mid)] bg-[var(--b2-soft)] text-[var(--b1)] shadow-sm ring-2 ring-[var(--b1-mid)]/20"
                  : "border-[var(--b2)] bg-[var(--white)] text-[var(--muted)] hover:border-[var(--b1-mid)]/40 hover:bg-[var(--b2-soft)]/80 hover:text-[var(--b1)]",
              ].join(" ")}
            >
              {f}
            </button>
          );
        })}
      </div>

      {error && (
        <div
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
          role="alert"
        >
          {error}
        </div>
      )}

      {loading && <TableSkeleton />}

      {!loading && (
        <>
          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {filtered.map((row) => (
              <article
                key={String(row.id)}
                className="rounded-xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--b1)]">{row.name}</p>
                    <p className="mt-0.5 break-all text-xs text-[var(--b1-mid)]">
                      {row.email}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[var(--b2-soft)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--b1)] ring-1 ring-[var(--b2)]">
                    {row.role ?? "N/A"}
                  </span>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => setDeleteTarget(row)}
                    variant="outline"
                    size="sm"
                    className="gap-1.5 border-rose-300 text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </article>
            ))}
            {filtered.length === 0 && (
              <EmptyState
                noAccounts={accounts.length === 0}
                query={query}
                roleFilter={roleFilter}
              />
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block">
            <div className="overflow-x-auto rounded-xl border border-[var(--b2)] bg-[var(--white)] shadow-inner shadow-[var(--b2-soft)]">
              <table className="min-w-[640px] w-full text-left text-sm text-[var(--b1)]">
                <thead className="sticky top-0 z-10 bg-gradient-to-r from-[var(--b2-soft)] to-[var(--white)] text-xs font-semibold uppercase tracking-wider text-[var(--b1)] shadow-sm">
                  <tr>
                    <th className="px-4 py-3.5">Name</th>
                    <th className="px-4 py-3.5">Email</th>
                    <th className="px-4 py-3.5">Role</th>
                    <th className="w-[1%] whitespace-nowrap px-4 py-3.5 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[var(--b2)]/80">
                  {filtered.map((row, index) => (
                    <tr
                      key={String(row.id)}
                      className={[
                        "transition-colors hover:bg-[var(--b2-soft)]/70",
                        index % 2 === 1 ? "bg-[var(--b2-soft)]/25" : "",
                      ].join(" ")}
                    >
                      <td className="px-4 py-3.5 font-medium text-[var(--b1)]">
                        {row.name}
                      </td>

                      <td className="max-w-[220px] truncate px-4 py-3.5 text-sm text-[var(--b1-mid)]">
                        {row.email}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center rounded-full bg-[var(--b2-soft)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--b1)] ring-1 ring-[var(--b2)]">
                          {row.role ?? "N/A"}
                        </span>
                      </td>

                      <td className="w-[1%] whitespace-nowrap px-4 py-3.5 text-center">
                        <Button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => setDeleteTarget(row)}
                          variant="outline"
                          size="sm"
                          className="inline-flex gap-1.5 border-rose-300 text-rose-700 hover:bg-rose-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-0">
                        <EmptyState
                          noAccounts={accounts.length === 0}
                          query={query}
                          roleFilter={roleFilter}
                          inTable
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <AdminConfirmDialog
        open={deleteTarget !== null}
        title="Delete this account?"
        description={
          deleteTarget
            ? `This will permanently remove ${deleteTarget.name} (${deleteTarget.email}). This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete account"
        cancelLabel="Cancel"
        destructive
        loading={actionLoading}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

function EmptyState({
  noAccounts,
  query,
  roleFilter,
  inTable,
}: {
  noAccounts: boolean;
  query: string;
  roleFilter: RoleFilterOption;
  inTable?: boolean;
}) {
  const inner = (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--b2-soft)] text-[var(--b1-mid)]">
        <Users className="h-6 w-6" />
      </div>
      <p className="font-medium text-[var(--b1)]">
        {noAccounts ? "No accounts yet" : "No matching users"}
      </p>
      <p className="max-w-sm text-sm text-[var(--muted)]">
        {noAccounts
          ? "When users register, they will appear here."
          : `Try adjusting your search${query ? ` “${query}”` : ""} or switch from “${roleFilter}”.`}
      </p>
    </div>
  );

  if (inTable) return inner;
  return (
    <div className="rounded-xl border border-dashed border-[var(--b2)] bg-[var(--b2-soft)]/30">
      {inner}
    </div>
  );
}

export default AccountManagement;
