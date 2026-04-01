import React, { useEffect } from "react";
import { Home } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminStats from "../../components/admin/AdminStats";
import PropertyModeration from "../../components/admin/PropertyModeration";
import AccountManagement from "../../components/admin/AccountManagement";
import {
  approveListing,
  deleteListingById,
  deleteUserById,
  fetchAdminListings,
  fetchAdminUsers,
  rejectListing,
} from "../../features/admin/adminSlice";

type Tab = "overview" | "users" | "listings";

interface AdminDashboardProps {
  initialTab?: Tab;
  /** Sidebar section title (e.g. "Users" on /admin/users). */
  layoutTitle?: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialTab,
  layoutTitle,
}) => {
  const dispatch = useAppDispatch();
  const activeTab: Tab = initialTab ?? "overview";

  const {
    users,
    usersLoading,
    usersError,
    listings,
    listingsLoading,
    listingsError,
    actionLoading,
  } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminUsers());
    dispatch(fetchAdminListings());
  }, [dispatch]);

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

  const renderOverview = () => (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[var(--b2)]/60 bg-[var(--white)] p-5 shadow-[0_2px_16px_rgba(27,67,50,0.07)] sm:p-6">
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-gradient-to-br from-[var(--b2-soft)]/90 to-transparent"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--b1-mid)] to-[var(--b1)] text-white shadow-lg shadow-[var(--b1)]/25">
              <Home className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <h1 className="font-sans text-xl font-semibold tracking-tight text-[var(--b1)] sm:text-2xl">
                Overview
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
                Portfolio health across listings and user accounts at a glance.
              </p>
            </div>
          </div>
        </div>
      </header>

      <AdminStats accounts={users} listings={listings} />
    </div>
  );

  const renderUsers = () => (
    <AccountManagement
      accounts={users}
      loading={usersLoading}
      error={usersError}
      actionLoading={actionLoading}
      onDelete={handleDeleteUser}
    />
  );

  const renderListings = () => (
    <PropertyModeration
      listings={listings}
      loading={listingsLoading}
      error={listingsError}
      actionLoading={actionLoading}
      onApprove={handleApprove}
      onReject={handleReject}
      onDelete={handleDeleteListing}
    />
  );

  let content: React.ReactNode = null;

  if (activeTab === "overview") content = renderOverview();
  if (activeTab === "users") content = renderUsers();
  if (activeTab === "listings") content = renderListings();

  return (
    <AdminLayout title={layoutTitle ?? "Admin Panel"}>{content}</AdminLayout>
  );
};

export default AdminDashboard;

