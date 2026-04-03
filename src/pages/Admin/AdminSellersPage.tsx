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
      <div className="mx-auto max-w-7xl space-y-5">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-[var(--b1)] sm:text-2xl">
            Sellers
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">
            Accounts with the seller role and how many listings each has posted.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Search by name, email, or ID…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border-[var(--b2)] text-sm shadow-sm sm:max-w-md"
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
          <>
            <div className="space-y-3 md:hidden">
              {sellers.map((row) => {
                const n = propertyCountBySeller.get(String(row.id)) ?? 0;
                return (
                  <article
                    key={String(row.id)}
                    className="rounded-xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm"
                  >
                    <p className="font-semibold text-[var(--b1)]">
                      {row.name || "—"}
                    </p>
                    <p className="mt-1 break-all text-sm text-[var(--b1-mid)]">
                      {row.email}
                    </p>
                    <p className="mt-2 font-mono text-xs text-[var(--muted)]">
                      ID: {String(row.id)}
                    </p>
                    <div className="mt-3 flex items-center justify-between border-t border-[var(--b2)]/80 pt-3">
                      <span className="text-xs font-medium text-[var(--muted)]">
                        Properties posted
                      </span>
                      <span className="inline-flex min-w-[2rem] justify-center rounded-full bg-[var(--b2-soft)] px-2.5 py-1 text-sm font-semibold tabular-nums text-[var(--b1)] ring-1 ring-[var(--b2)]">
                        {n}
                      </span>
                    </div>
                  </article>
                );
              })}
              {sellers.length === 0 && (
                <p className="rounded-xl border border-dashed border-[var(--b2)] py-12 text-center text-sm text-[var(--muted)]">
                  No seller accounts found.
                </p>
              )}
            </div>

            <div className="hidden overflow-x-auto rounded-xl border border-[var(--b2)] bg-[var(--white)] shadow-inner md:block">
              <table className="min-w-[640px] w-full text-sm text-[var(--b1)]">
                <thead className="sticky top-0 z-10 bg-gradient-to-r from-[var(--b2-soft)] to-[var(--white)] text-xs font-semibold uppercase tracking-wider shadow-sm">
                  <tr>
                    <th className="px-4 py-3.5 text-left">Name</th>
                    <th className="px-4 py-3.5 text-left">Email</th>
                    <th className="px-4 py-3.5 text-left">User ID</th>
                    <th className="px-4 py-3.5 text-right">Properties posted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--b2)]/80">
                  {sellers.map((row, index) => {
                    const n = propertyCountBySeller.get(String(row.id)) ?? 0;
                    return (
                      <tr
                        key={String(row.id)}
                        className={[
                          "transition-colors hover:bg-[var(--b2-soft)]/70",
                          index % 2 === 1 ? "bg-[var(--b2-soft)]/20" : "",
                        ].join(" ")}
                      >
                        <td className="px-4 py-3.5 font-medium text-[var(--b1)]">
                          {row.name || "—"}
                        </td>
                        <td className="max-w-[200px] truncate px-4 py-3.5 text-[var(--b1-mid)]">
                          {row.email}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs text-[var(--b1-mid)]">
                          {String(row.id)}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <span className="inline-flex min-w-[2rem] justify-end rounded-full bg-[var(--b2-soft)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--b1)] ring-1 ring-[var(--b2)]">
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
                        className="px-4 py-12 text-center text-[var(--muted)]"
                      >
                        No seller accounts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSellersPage;
