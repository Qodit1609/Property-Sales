import React from "react";
import AdminSidebar from "./AdminSidebar";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import { logout } from "../../features/auth/authSlice";
import { LogOut } from "lucide-react";

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
    <div className="min-h-screen bg-[var(--b2-soft)] text-[var(--b1)]">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-64 flex-shrink-0 border-r border-[var(--b2)] bg-[var(--white)] px-4 py-5 lg:block">
          <div className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
              Admin Console
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--b1)]">
              {user?.email ?? "Admin"}
            </p>
          </div>
          <AdminSidebar />
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-[var(--b2)] bg-[var(--white)]">
            <div className="flex items-center justify-between px-4 py-3 lg:px-6">
              <div>
                <h1 className="text-base font-semibold text-[var(--b1)]">
                  {title}
                </h1>
                <p className="text-[11px] text-[var(--muted)]">
                  Modern moderation cockpit for properties and users.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1 rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-1.5 text-xs font-medium text-[var(--error)] hover:bg-[var(--error-bg)] transition"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </header>

          <main className="flex-1 px-4 py-4 lg:px-6 lg:py-6">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

