import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  initialUserRoleFilter?: "all" | "buyer" | "seller" | "agent" | "user";
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialTab,
  layoutTitle,
  initialUserRoleFilter,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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

  const handleStatsCardClick = (
    section: "listings" | "users",
    label: string
  ) => {
    if (section === "listings") {
      const mapping: Record<string, string> = {
        "Total properties": "",
        Approved: "approved",
        "Pending review": "pending",
        Rejected: "rejected",
      };
      const status = mapping[label] ?? "";
      navigate(status ? `/admin/properties?status=${status}` : "/admin/properties");
      return;
    }

    const mapping: Record<string, string> = {
      "Total accounts": "",
      Buyers: "user",
      Sellers: "seller",
      Agents: "agent",
    };
    const role = mapping[label] ?? "";
    navigate(role ? `/admin/users?role=${role}` : "/admin/users");
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <AdminStats
        accounts={users}
        listings={listings}
        onCardClick={handleStatsCardClick}
      />
    </div>
  );

  const renderUsers = () => (
    <AccountManagement
      accounts={users}
      loading={usersLoading}
      error={usersError}
      actionLoading={actionLoading}
      onDelete={handleDeleteUser}
      initialRoleFilter={initialUserRoleFilter}
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
    <AdminLayout
      title={layoutTitle ?? "Admin Panel"}
      topBarTitle={activeTab === "overview" ? "Overview" : undefined}
      topBarSubtitle={
        activeTab === "overview"
          ? "Portfolio health across listings and user accounts at a glance."
          : undefined
      }
    >
      {content}
    </AdminLayout>
  );
};

export default AdminDashboard;

