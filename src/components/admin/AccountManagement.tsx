import React, { useState, useMemo } from "react";
import { Trash2 } from "lucide-react";
import { Button, Input } from "@/components/common";

import type { ManagedAccount } from "../../features/auth/roleTypes";

interface AccountManagementProps {
  accounts: ManagedAccount[];
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  onDelete: (id: string | number) => void;
}

const AccountManagement: React.FC<AccountManagementProps> = ({
  accounts,
  loading,
  error,
  actionLoading,
  onDelete,
}) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return accounts;
    const lower = query.toLowerCase();
    return accounts.filter(
      (u) =>
        u.name.toLowerCase().includes(lower) ||
        u.email.toLowerCase().includes(lower) ||
        (u.role && u.role.toLowerCase().includes(lower))
    );
  }, [accounts, query]);

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[var(--b1)]">Accounts</h2>
          <p className="text-[11px] text-[var(--muted)]">
            Buyers, sellers, agents and admins with moderation controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Search accounts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-48 text-sm"
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

              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "accounts.csv";
              a.click();
              URL.revokeObjectURL(url);
            }}
            variant="primary"
            className="text-xs px-3 py-1"
          >
            Export
          </Button>
        </div>
      </div>

      {loading && (
        <p className="text-[11px] text-[var(--muted)]">Loading accounts…</p>
      )}
      {error && <p className="text-[11px] text-rose-400">{error}</p>}

      <div className="overflow-x-auto rounded-xl border border-[var(--b2)] bg-[var(--white)]">
        <table className="min-w-[720px] w-full text-xs text-[var(--b1)]">
          <thead className="sticky top-0 bg-[var(--b2-soft)] text-[11px] uppercase tracking-wide text-[var(--b1)]">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Role</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--b2)]">
            {filtered.map((row) => (
              <tr
                key={String(row.id)}
                className="hover:bg-[var(--b2-soft)] transition-colors"
              >
                <td className="px-4 py-3 text-xs text-[var(--b1)]">
                  {row.name}
                </td>

                <td className="px-4 py-3 text-[11px] text-[var(--b1-mid)]">
                  {row.email}
                </td>

                <td className="px-4 py-3 text-[11px] text-[var(--b1)]">
                  <span className="inline-flex items-center rounded-full bg-[var(--b2-soft)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--b1)] ring-1 ring-[var(--b2)]">
                    {row.role ?? "N/A"}
                  </span>
                </td>

                <td className="px-4 py-3 text-right">
                  <Button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => onDelete(row.id)}
                    variant="outline"
                    className="text-rose-600 border-rose-500/40 hover:bg-rose-500/20 text-[11px] px-3 py-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-[11px] text-[var(--muted)]"
                >
                  No accounts available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountManagement;
