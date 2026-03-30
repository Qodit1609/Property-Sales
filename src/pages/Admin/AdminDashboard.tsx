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
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialTab }) => {
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

  // For now show all listings; filters can be reintroduced without changing API.
  const filteredListings = listings;

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
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--b2-soft)] text-emerald-500">
            <Home size={16} />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-[var(--b1)]">
              Admin overview
            </h1>
            <p className="text-[11px] text-[var(--muted)]">
              Portfolio health across inventory and accounts.
            </p>
          </div>
        </div>
      </div>

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
      listings={filteredListings}
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

  return <AdminLayout title="Admin Panel">{content}</AdminLayout>;
};

export default AdminDashboard;

