import React from "react";
import AdminSidebar from "./AdminSidebar";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import { logout } from "../../features/auth/authSlice";
import { LogOut } from "lucide-react";
import Header from "../Header/Header";

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ title, children }) => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen border-[var(--b2)] bg-[var(--b2-soft)] text-[var(--b1)]">
      <Header />
      <div className="pt-[68px] mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-64 flex-shrink-0 border-r border-[var(--b2)] bg-[var(--white)] px-4 py-5 lg:block">
          <div className="mb-6">
            <p className="text-[15px] font-semibold uppercase tracking-wide text-[var(--muted)]">
              ADMIN
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--b1)]">
              {user?.email ?? "Admin"}
            </p>
          </div>
          <AdminSidebar />
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          
          <main className="flex-1 px-4 py-4 lg:px-6 lg:py-6">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

