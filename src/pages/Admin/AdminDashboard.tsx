import React, { useEffect, useState } from "react";
import { CheckCircle2, Home, ListChecks, Trash2, Users, XCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import DashboardLayout from "../../layout/DashboardLayout";
import {
  approveListing,
  deleteListingById,
  deleteUserById,
  fetchAdminListings,
  fetchAdminUsers,
  rejectListing,
} from "../../features/admin/adminSlice";

type Tab = "overview" | "users" | "listings";

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const {
    users,
    usersLoading,
    usersError,
    listings,
    listingsLoading,
    listingsError,
    actionLoading,
  } = useAppSelector((state) => state.admin);

  // Filter state
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Get unique property types for filter dropdown
  const propertyTypes = Array.from(new Set(listings.map(l => l.propertyType))).filter(Boolean);

  // Filtered listings
  const filteredListings = listings.filter(listing => {
    const typeMatch = filterType === "all" || listing.propertyType === filterType;
    const statusMatch = filterStatus === "all" || listing.status === filterStatus;
    return typeMatch && statusMatch;
  });

  useEffect(() => {
    dispatch(fetchAdminUsers());
    dispatch(fetchAdminListings());
  }, [dispatch]);

  const totalUsers = users.length;
  const totalListings = listings.length;
  const approvedListings = listings.filter((item) => item.status === "approved").length;
  const pendingListings = listings.filter((item) => item.status === "pending").length;
  const rejectedListings = listings.filter((item) => item.status === "rejected").length;

  const handleApprove = (id: string) => {
    dispatch(approveListing(id));
  };

  const handleReject = (id: string) => {
    dispatch(rejectListing(id));
  };

  const handleDeleteListing = (id: string) => {
    dispatch(deleteListingById(id));
  };

  const handleDeleteUser = (userId: string | number) => {
    dispatch(deleteUserById(String(userId)));
  };

  const tabButtonClass = (tab: Tab) =>
    `flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      activeTab === tab
        ? "bg-[var(--b2-soft)] text-[var(--b1)]"
        : "text-[var(--muted)] hover:bg-[var(--b2-soft)]"
    }`;

  const sidebar = (
    <ul className="space-y-1">
      <li>
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={tabButtonClass("overview")}
        >
          <Home size={16} />
          <span>Dashboard</span>
        </button>
      </li>
      <li>
        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={tabButtonClass("users")}
        >
          <Users size={16} />
          <span>Users</span>
        </button>
      </li>
      <li>
        <button
          type="button"
          onClick={() => setActiveTab("listings")}
          className={tabButtonClass("listings")}
        >
          <ListChecks size={16} />
          <span>Listings</span>
        </button>
      </li>
    </ul>
  );

  const mobileTabs = (
    <nav className="md:hidden sticky top-0 z-10 bg-[var(--white)] border-b border-[var(--b2-soft)] mb-4 -mx-4 px-4 py-2 sm:py-3">
      <div className="flex gap-1 overflow-x-auto no-scrollbar min-w-0">
        <button type="button" onClick={() => setActiveTab("overview")} className={`${tabButtonClass("overview")} shrink-0`}>
          <Home size={16} />
          <span>Dashboard</span>
        </button>
        <button type="button" onClick={() => setActiveTab("users")} className={`${tabButtonClass("users")} shrink-0`}>
          <Users size={16} />
          <span>Users</span>
        </button>
        <button type="button" onClick={() => setActiveTab("listings")} className={`${tabButtonClass("listings")} shrink-0`}>
          <ListChecks size={16} />
          <span>Listings</span>
        </button>
      </div>
    </nav>
  );

  const getStatusBadgeClass = (status: string) => {
    if (status === "approved") return "bg-[var(--success-bg)] text-[var(--success)]";
    if (status === "rejected") return "bg-[var(--error-bg)] text-[var(--error)]";
    return "bg-[var(--warning-bg)] text-[var(--warning)]";
  };

  const actionBtnBase =
    "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium disabled:opacity-60";

  const renderOverview = () => (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-[var(--b1)]">Admin Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        <div className="rounded-xl bg-[var(--white)] p-3 sm:p-4 shadow-sm border border-[var(--b2-soft)]">
          <p className="text-[10px] sm:text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Total Users</p>
          <p className="mt-1 sm:mt-2 text-lg sm:text-2xl font-semibold text-[var(--b1)]">{totalUsers}</p>
        </div>
        <div className="rounded-xl bg-[var(--white)] p-3 sm:p-4 shadow-sm border border-[var(--b2-soft)]">
          <p className="text-[10px] sm:text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Total Listings</p>
          <p className="mt-1 sm:mt-2 text-lg sm:text-2xl font-semibold text-[var(--b1)]">{totalListings}</p>
        </div>
        <div className="rounded-xl bg-[var(--white)] p-3 sm:p-4 shadow-sm border border-[var(--b2-soft)]">
          <p className="text-[10px] sm:text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Approved</p>
          <p className="mt-1 sm:mt-2 text-lg sm:text-2xl font-semibold text-[var(--success)]">{approvedListings}</p>
        </div>
        <div className="rounded-xl bg-[var(--white)] p-3 sm:p-4 shadow-sm border border-[var(--b2-soft)]">
          <p className="text-[10px] sm:text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Pending</p>
          <p className="mt-1 sm:mt-2 text-lg sm:text-2xl font-semibold text-[var(--warning)]">{pendingListings}</p>
        </div>
        <div className="rounded-xl bg-[var(--white)] p-3 sm:p-4 shadow-sm border border-[var(--b2-soft)] col-span-2 lg:col-span-1">
          <p className="text-[10px] sm:text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Rejected</p>
          <p className="mt-1 sm:mt-2 text-lg sm:text-2xl font-semibold text-[var(--error)]">{rejectedListings}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <section className="rounded-xl bg-[var(--white)] shadow-sm border border-[var(--b2-soft)] p-4">
          <h2 className="text-sm font-semibold text-[var(--b1)] mb-3 flex items-center gap-2">
            <Users size={16} /> Recent Users
          </h2>
          <div className="space-y-2">
            {users.slice(0, 5).map((user) => (
              <div
                key={user.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-md border border-[var(--b2-soft)] px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--b1)] truncate">{user.name}</p>
                  <p className="text-xs text-[var(--muted)] truncate">{user.email}</p>
                </div>
                <span className="text-[10px] font-semibold uppercase text-[var(--muted)] shrink-0">
                  {user.role ?? "N/A"}
                </span>
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-sm text-[var(--muted)]">No users available.</p>
            )}
          </div>
        </section>

        <section className="rounded-xl bg-[var(--white)] shadow-sm border border-[var(--b2-soft)] p-4">
          <h2 className="text-sm font-semibold text-[var(--b1)] mb-3 flex items-center gap-2">
            <ListChecks size={16} /> Recent Listings
          </h2>
          <div className="space-y-2">
            {listings.slice(0, 5).map((listing) => (
              <div
                key={listing._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-md border border-[var(--b2-soft)] px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--b1)] truncate">{listing.title || "Untitled"}</p>
                  <p className="text-xs text-[var(--muted)]">
                    ₹ {listing.price?.toLocaleString("en-IN") ?? "N/A"}
                  </p>
                </div>
                <span className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full shrink-0 w-fit ${getStatusBadgeClass(listing.status ?? "pending")}`}>
                  {listing.status ?? "N/A"}
                </span>
              </div>
            ))}
            {listings.length === 0 && (
              <p className="text-sm text-[var(--muted)]">No listings available.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );

  const renderUsers = () => (
    <section className="space-y-4">
      <h1 className="text-xl sm:text-2xl font-semibold text-[var(--b1)] flex items-center gap-2">
        <Users size={20} />
        <span>All Users</span>
      </h1>

      {usersLoading && <p className="text-sm text-[var(--muted)]">Loading users...</p>}
      {usersError && <p className="text-sm text-[var(--error)]">{usersError}</p>}

      {/* Mobile: Card layout */}
      <div className="md:hidden space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="rounded-xl border border-[var(--b2-soft)] bg-[var(--white)] p-4 shadow-sm"
          >
            <div className="space-y-2">
              <p className="text-sm font-medium text-[var(--b1)]">{user.name}</p>
              <p className="text-xs text-[var(--muted)] break-all">{user.email}</p>
              <div className="flex items-center justify-between gap-2 pt-2">
                <span className="inline-flex items-center rounded-full bg-[var(--b2-soft)] px-2 py-0.5 text-xs font-medium text-[var(--b1-mid)]">
                  {user.role ?? "N/A"}
                </span>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleDeleteUser(user.id)}
                  className="inline-flex items-center gap-1 rounded-md border border-[var(--error)]/30 bg-[var(--error-bg)] px-3 py-1.5 text-xs font-medium text-[var(--error)] hover:opacity-90 disabled:opacity-60"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <p className="text-sm text-[var(--muted)] text-center py-8">No users found.</p>
        )}
      </div>

      {/* Desktop: Table layout */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-[var(--b2-soft)] bg-[var(--white)] shadow-sm">
        <table className="min-w-full divide-y divide-[var(--b2-soft)] text-sm font-serif">
          <thead className="bg-[var(--b2-soft)]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-[var(--b1)]">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-[var(--b1)]">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-[var(--b1)]">Role</th>
              <th className="px-4 py-3 text-right font-semibold text-[var(--b1)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--b2-soft)]">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-[var(--b2-soft)]/50 transition-colors">
                <td className="px-4 py-3 text-[var(--b1)]">{user.name}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{user.email}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-[var(--b2-soft)] px-2 py-0.5 text-xs font-medium text-[var(--b1-mid)]">
                    {user.role ?? "N/A"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleDeleteUser(user.id)}
                    className="inline-flex items-center gap-1 rounded-md border border-[var(--error)]/30 bg-[var(--error-bg)] px-3 py-1 text-xs font-medium text-[var(--error)] hover:opacity-90 disabled:opacity-60"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-[var(--muted)]">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderListings = () => (
    <section className="space-y-4">
      <h1 className="text-xl sm:text-2xl font-semibold text-[var(--b1)] flex items-center gap-2">
        <ListChecks size={20} />
        <span>All Listings</span>
      </h1>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <label className="text-sm font-medium text-[var(--b1)]">Type:</label>
          <select
            className="border border-[var(--b2-soft)] rounded-lg px-3 py-2 text-sm text-[var(--b1)] bg-[var(--white)] focus:ring-2 focus:ring-[var(--b2)] focus:border-[var(--b1-mid)]"
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
          >
            <option value="all">All</option>
            {propertyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <label className="text-sm font-medium text-[var(--b1)]">Status:</label>
          <select
            className="border border-[var(--b2-soft)] rounded-lg px-3 py-2 text-sm text-[var(--b1)] bg-[var(--white)] focus:ring-2 focus:ring-[var(--b2)] focus:border-[var(--b1-mid)]"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {listingsLoading && <p className="text-sm text-[var(--muted)]">Loading listings...</p>}
      {listingsError && <p className="text-sm text-[var(--error)]">{listingsError}</p>}

      {/* Mobile: Card layout */}
      <div className="md:hidden space-y-3">
        {filteredListings.map((listing) => (
          <div
            key={listing._id}
            className="rounded-xl border border-[var(--b2-soft)] bg-[var(--white)] p-4 shadow-sm"
          >
            <div className="space-y-2">
              <p className="font-medium text-[var(--b1)]">{listing.title || "Untitled"}</p>
              <p className="text-xs text-[var(--muted)] line-clamp-1">{listing.address}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[var(--muted)]">{listing.propertyType}</span>
                <span className="font-medium text-[var(--b1)]">₹ {listing.price?.toLocaleString("en-IN") ?? "N/A"}</span>
              </div>
              <span className={`inline-flex w-fit text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${getStatusBadgeClass(listing.status ?? "pending")}`}>
                {listing.status ?? "pending"}
              </span>
              <div className="flex flex-wrap gap-1 pt-2">
                <button
                  type="button"
                  disabled={actionLoading || listing.status === "approved"}
                  onClick={() => handleApprove(listing._id)}
                  className={`${actionBtnBase} border border-[var(--success)]/50 bg-[var(--success-bg)] text-[var(--success)] hover:opacity-90 ${listing.status === "approved" ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <CheckCircle2 size={14} />
                  Approve
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleReject(listing._id)}
                  className={`${actionBtnBase} border border-[var(--warning)]/50 bg-[var(--warning-bg)] text-[var(--warning)] hover:opacity-90`}
                >
                  <XCircle size={14} />
                  Reject
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleDeleteListing(listing._id)}
                  className={`${actionBtnBase} border border-[var(--error)]/30 bg-[var(--error-bg)] text-[var(--error)] hover:opacity-90`}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredListings.length === 0 && (
          <p className="text-sm text-[var(--muted)] text-center py-8">No listings found.</p>
        )}
      </div>

      {/* Desktop: Table layout */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-[var(--b2-soft)] bg-[var(--white)] shadow-sm">
        <table className="min-w-full divide-y divide-[var(--b2-soft)] text-sm font-serif">
          <thead className="bg-[var(--b2-soft)]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-[var(--b1)]">Property</th>
              <th className="px-4 py-3 text-left font-semibold text-[var(--b1)]">Type</th>
              <th className="px-4 py-3 text-left font-semibold text-[var(--b1)]">Price</th>
              <th className="px-4 py-3 text-left font-semibold text-[var(--b1)]">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-[var(--b1)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--b2-soft)]">
            {filteredListings.map((listing) => (
              <tr key={listing._id} className="hover:bg-[var(--b2-soft)]/50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--b1)]">{listing.title || "Untitled"}</p>
                  <p className="text-xs text-[var(--muted)] line-clamp-1">{listing.address}</p>
                </td>
                <td className="px-4 py-3 text-[var(--b1-mid)]">{listing.propertyType}</td>
                <td className="px-4 py-3 text-[var(--b1)]">₹ {listing.price?.toLocaleString("en-IN") ?? "N/A"}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusBadgeClass(listing.status ?? "pending")}`}>
                    {listing.status ?? "pending"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex flex-wrap justify-end gap-1">
                    <button
                      type="button"
                      disabled={actionLoading || listing.status === "approved"}
                      onClick={() => handleApprove(listing._id)}
                      className={`${actionBtnBase} border border-[var(--success)]/50 bg-[var(--success-bg)] text-[var(--success)] hover:opacity-90 ${listing.status === "approved" ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <CheckCircle2 size={14} />
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleReject(listing._id)}
                      className={`${actionBtnBase} border border-[var(--warning)]/50 bg-[var(--warning-bg)] text-[var(--warning)] hover:opacity-90`}
                    >
                      <XCircle size={14} />
                      Reject
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleDeleteListing(listing._id)}
                      className={`${actionBtnBase} border border-[var(--error)]/30 bg-[var(--error-bg)] text-[var(--error)] hover:opacity-90`}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredListings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-[var(--muted)]">
                  No listings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  let content: React.ReactNode = null;

  if (activeTab === "overview") content = renderOverview();
  if (activeTab === "users") content = renderUsers();
  if (activeTab === "listings") content = renderListings();

  return (
    <DashboardLayout title="Admin Panel" sidebar={sidebar}>
      {mobileTabs}
      {content}
    </DashboardLayout>
  );
};

export default AdminDashboard;

