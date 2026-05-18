import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Trash2, Users } from "lucide-react";
import { Button, Input } from "@/components/common";
import AdminConfirmDialog from "./AdminConfirmDialog";
import { translateRole } from "@/lib/adminI18n";

import type { ManagedAccount } from "../../features/auth/roleTypes";

type RoleFilterOption = "All" | "Buyer" | "Seller" | "Agent";

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
  onToggleBlock: (id: string | number) => void;
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
  onToggleBlock,
  initialRoleFilter = "all",
}) => {
  const { t } = useTranslation();
  const roleFilters: RoleFilterOption[] = ["All", "Buyer", "Seller", "Agent"];
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilterOption>(() => {
    if (initialRoleFilter === "buyer" || initialRoleFilter === "user") return "Buyer";
    if (initialRoleFilter === "seller") return "Seller";
    if (initialRoleFilter === "agent") return "Agent";
    return "All";
  });
  const [deleteTarget, setDeleteTarget] = useState<ManagedAccount | null>(null);
  const [blockTarget, setBlockTarget] = useState<ManagedAccount | null>(null);

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
    const visibleAccounts = accounts.filter((u) => {
      const role = (u.role ?? "").toLowerCase().trim();
      return role !== "admin" && role !== "super admin" && role !== "superadmin";
    });
    const byRole = visibleAccounts.filter((u) => matchesRoleFilter(u, roleFilter));
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

  const confirmToggleBlock = () => {
    if (!blockTarget) return;
    onToggleBlock(blockTarget.id);
    setBlockTarget(null);
  };

  return (
    <div className="space-y-5 rounded-2xl border border-[var(--b2)]/90 bg-[var(--white)] p-4 shadow-md shadow-[var(--b1)]/5 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 shrink">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--b1)] sm:text-2xl">
            {t("adminPanel.users.roleTitle")}
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
            {t("adminPanel.users.roleSubtitle")}
          </p>
        </div>

        <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 lg:max-w-xl lg:flex-nowrap lg:justify-end">
          <Input
            placeholder={t("adminPanel.users.searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full min-w-0 border-[var(--b2)] text-sm shadow-sm sm:flex-1 sm:min-w-[200px]"
          />

          <Button
            type="button"
            onClick={() => {
              const csv = [
                [
                  t("adminPanel.users.table.name"),
                  t("adminPanel.users.table.email"),
                  t("adminPanel.users.table.role"),
                ],
                ...filtered.map((u) => [
                  u.name,
                  u.email,
                  translateRole(u.role) || u.role || "",
                ]),
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
            {t("adminPanel.users.exportCsv")}
          </Button>
        </div>
      </div>

      <div
        className="-mx-1 flex min-w-0 flex-nowrap gap-2 overflow-x-auto px-1 pb-0.5 sm:flex-wrap sm:overflow-visible"
        role="tablist"
        aria-label={t("adminPanel.users.filterByRole")}
      >
        {roleFilters.map((f) => {
          const active = roleFilter === f;
          const roleKey =
            f === "All"
              ? "all"
              : f === "Buyer"
                ? "buyer"
                : f === "Seller"
                  ? "seller"
                  : "agent";
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
              {t(`adminPanel.users.roles.${roleKey}`)}
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
                    {row.role ? translateRole(row.role) : t("common.na")}
                  </span>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => setBlockTarget(row)}
                    variant="outline"
                    size="sm"
                    className="gap-1.5 border-rose-300 text-rose-700 hover:bg-rose-50"
                  >
                    {row.isBlocked ? t("adminPanel.users.unblock") : t("adminPanel.users.block")}
                  </Button>
                  <Button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => setDeleteTarget(row)}
                    variant="outline"
                    size="sm"
                    className="gap-1.5 border-rose-300 text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {t("common.delete")}
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
                    <th className="px-4 py-3.5">{t("adminPanel.users.table.name")}</th>
                    <th className="px-4 py-3.5">{t("adminPanel.users.table.email")}</th>
                    <th className="px-4 py-3.5">{t("adminPanel.users.table.role")}</th>
                    <th className="w-[1%] whitespace-nowrap px-4 py-3.5 text-center">
                      {t("common.actions")}
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
                          {row.role ? translateRole(row.role) : t("common.na")}
                        </span>
                      </td>

                      <td className="w-[1%] whitespace-nowrap px-4 py-3.5 text-center">
                        <Button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => setBlockTarget(row)}
                          variant="outline"
                          size="sm"
                          className="inline-flex gap-1.5 border-rose-300 text-rose-700 hover:bg-rose-50"
                        >
                          {row.isBlocked ? t("adminPanel.users.unblock") : t("adminPanel.users.block")}
                        </Button>
                        {" "}
                        <Button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => setDeleteTarget(row)}
                          variant="outline"
                          size="sm"
                          className="inline-flex gap-1.5 border-rose-300 text-rose-700 hover:bg-rose-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {t("common.delete")}
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
        title={t("adminPanel.users.deleteConfirm.title")}
        description={
          deleteTarget
            ? t("adminPanel.users.deleteConfirm.description", {
                name: deleteTarget.name,
                email: deleteTarget.email,
              })
            : ""
        }
        confirmLabel={t("adminPanel.users.deleteConfirm.confirm")}
        destructive
        loading={actionLoading}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <AdminConfirmDialog
        open={blockTarget !== null}
        title={
          blockTarget?.isBlocked
            ? t("adminPanel.users.blockConfirm.unblockTitle")
            : t("adminPanel.users.blockConfirm.blockTitle")
        }
        description={
          blockTarget
            ? t("adminPanel.users.blockConfirm.description", {
                action: blockTarget.isBlocked
                  ? t("adminPanel.users.unblock")
                  : t("adminPanel.users.block"),
                name: blockTarget.name,
                email: blockTarget.email,
              })
            : ""
        }
        confirmLabel={
          blockTarget?.isBlocked ? t("adminPanel.users.unblock") : t("adminPanel.users.block")
        }
        loading={actionLoading}
        onClose={() => setBlockTarget(null)}
        onConfirm={confirmToggleBlock}
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
  const { t } = useTranslation();
  const roleKey =
    roleFilter === "All"
      ? "all"
      : roleFilter === "Buyer"
        ? "buyer"
        : roleFilter === "Seller"
          ? "seller"
          : "agent";
  const inner = (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--b2-soft)] text-[var(--b1-mid)]">
        <Users className="h-6 w-6" />
      </div>
      <p className="font-medium text-[var(--b1)]">
        {noAccounts ? t("adminPanel.users.empty.noAccounts") : t("adminPanel.users.empty.noMatching")}
      </p>
      <p className="max-w-sm text-sm text-[var(--muted)]">
        {noAccounts
          ? t("adminPanel.users.empty.noAccountsHint")
          : t("adminPanel.users.empty.noMatchingHint", {
              searchPart: query
                ? t("adminPanel.users.empty.searchPart", { query })
                : "",
              roleFilter: t(`adminPanel.users.roles.${roleKey}`),
            })}
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
