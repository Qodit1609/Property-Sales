import React, { useState, useMemo } from "react";
import { Trash2 } from "lucide-react";
import type { User } from "../../features/users/userType";

interface UserManagementProps {
  users: User[];
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  onDelete: (id: string | number) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  loading,
  error,
  actionLoading,
  onDelete,
}) => {
  const [query, setQuery] = useState("");

  const filteredUsers = useMemo(() => {
    if (!query) return users;
    const lower = query.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(lower) ||
        u.email.toLowerCase().includes(lower) ||
        (u.role && u.role.toLowerCase().includes(lower))
    );
  }, [users, query]);

  return (
    <section className="space-y-3 rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[var(--b1)]">Users</h2>
          <p className="text-[11px] text-[var(--muted)]">
            Buyers, sellers, agents and admins with moderation controls.
          </p>
        </div>
        {/* search + export */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-md border border-[var(--b2)] px-2 py-1 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-[var(--b1-mid)]"
          />
          <button
            type="button"
            onClick={() => {
              const csv = [
                ["Name", "Email", "Role"],
                ...filteredUsers.map((u) => [u.name, u.email, u.role || ""]),
              ]
                .map((row) => row.join(","))
                .join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "users.csv";
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="inline-flex items-center gap-1 rounded-md bg-[var(--b1-mid)] px-3 py-1 text-xs font-medium text-[var(--fg)] hover:bg-[var(--b1)] transition"
          >
            Export
          </button>
        </div>
      </div>

      {loading && <p className="text-[11px] text-[var(--muted)]">Loading users…</p>}
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
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-[var(--b2-soft)] transition-colors"
              >
                <td className="px-4 py-3 text-xs text-[var(--b1)]">
                  {user.name}
                </td>
                <td className="px-4 py-3 text-[11px] text-[var(--b1-mid)]">
                  {user.email}
                </td>
                <td className="px-4 py-3 text-[11px] text-[var(--b1)]">
                  <span className="inline-flex items-center rounded-full bg-[var(--b2-soft)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--b1)] ring-1 ring-[var(--b2)]">
                    {user.role ?? "N/A"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => onDelete(user.id)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-500/20 disabled:opacity-60"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-[11px] text-[var(--muted)]"
                >
                  No users available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default UserManagement;

