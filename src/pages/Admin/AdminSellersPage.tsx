import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/common";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  fetchAdminListingsAllPages,
  fetchAdminUsers,
} from "../../features/admin/adminSlice";

const AdminSellersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, usersLoading, usersError, listings, listingsLoading, listingsError, listingsPagination } =
    useAppSelector((s) => s.admin);

  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(fetchAdminUsers());
    dispatch(fetchAdminListingsAllPages());
  }, [dispatch]);

  const propertyCountBySeller = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of listings) {
      const sid = p.sellerId;
      if (!sid) continue;
      m.set(sid, (m.get(sid) ?? 0) + 1);
    }
    return m;
  }, [listings]);

  const sellers = useMemo(() => {
    const list = users.filter((u) => u.role === "seller");
    const q = query.trim().toLowerCase();
    const filtered = !q
      ? list
      : list.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            String(u.id).toLowerCase().includes(q)
        );
    return [...filtered].sort((a, b) => {
      const ca = propertyCountBySeller.get(String(a.id)) ?? 0;
      const cb = propertyCountBySeller.get(String(b.id)) ?? 0;
      if (cb !== ca) return cb - ca;
      return a.name.localeCompare(b.name);
    });
  }, [users, query, propertyCountBySeller]);

  const loading = usersLoading || listingsLoading;
  /** Sellers come from /admin/users; listing fetch only affects per-seller counts. */
  const blockingError = usersError;
  const listingsCountError = !usersError && listingsError ? listingsError : null;
  const totalLoaded = listings.length;
  const catalogTotal = listingsPagination?.total ?? totalLoaded;
  const countsMayBePartial = catalogTotal > totalLoaded;

  return (
    <AdminLayout title="Sellers">
      <div className="mx-auto max-w-7xl space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--b1)]">Sellers</h2>
          <p className="text-xs text-[var(--muted)]">
            All accounts with the seller role and how many listings they own.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Search by name, email, or ID…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:max-w-xs text-sm"
          />
          {!loading && countsMayBePartial && (
            <p className="text-[11px] text-amber-700">
              Loaded {totalLoaded} of {catalogTotal} properties; counts may be incomplete. Increase the
              fetch limit if needed.
            </p>
          )}
        </div>

        {loading && (
          <div className="flex items-center gap-2 rounded-xl border border-[var(--b2)] bg-[var(--white)] px-4 py-8 text-sm text-[var(--muted)]">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[var(--b1-mid)] border-t-transparent" />
            Loading sellers…
          </div>
        )}

        {blockingError && !loading && (
          <p className="text-sm text-rose-600">{blockingError}</p>
        )}

        {listingsCountError && !loading && (
          <p className="text-sm text-amber-700">
            Could not load property counts: {listingsCountError}
          </p>
        )}

        {!loading && !blockingError && (
          <div className="overflow-x-auto rounded-xl border border-[var(--b2)] bg-[var(--white)]">
            <table className="min-w-[640px] w-full text-xs text-[var(--b1)]">
              <thead className="sticky top-0 bg-[var(--b2-soft)] text-[11px] uppercase tracking-wide text-[var(--b1)]">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">User ID</th>
                  <th className="px-4 py-3 text-right font-medium">Properties posted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--b2)]">
                {sellers.map((row) => {
                  const n = propertyCountBySeller.get(String(row.id)) ?? 0;
                  return (
                    <tr
                      key={String(row.id)}
                      className="hover:bg-[var(--b2-soft)] transition-colors"
                    >
                      <td className="px-4 py-3 text-xs font-medium text-[var(--b1)]">
                        {row.name || "—"}
                      </td>
                      <td className="px-4 py-3 text-[11px] text-[var(--b1-mid)]">
                        {row.email}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-[var(--b1-mid)]">
                        {String(row.id)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex min-w-[2rem] justify-end rounded-full bg-[var(--b2-soft)] px-2.5 py-1 text-[11px] font-semibold tabular-nums text-[var(--b1)] ring-1 ring-[var(--b2)]">
                          {n}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {sellers.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-10 text-center text-[11px] text-[var(--muted)]"
                    >
                      No seller accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSellersPage;
