import React from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { logout } from "../features/auth/authSlice";

interface DashboardLayoutProps {
  title: string;
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  sidebar,
  children,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen flex bg-[var(--b2-soft)] text-[var(--b1)]">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-[var(--white)] border-r border-[var(--b2)] flex-col">
        <div className="px-6 py-4 border-b border-[var(--b2)]">
          <h2 className="text-lg font-semibold">{title}</h2>
          {user && (
            <p className="mt-1 text-xs text-[var(--muted)]">
              Signed in as <span className="font-medium">{user.email}</span>
            </p>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {sidebar}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-[var(--white)] border-b border-[var(--b2)] flex items-center justify-between px-4 md:px-6">
          <div className="md:hidden">
            <h2 className="text-base font-semibold">{title}</h2>
          </div>

          <div className="flex-1" />

          {user && (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs text-[var(--muted)]">
                {user.role?.toUpperCase()}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center rounded-md border border-[var(--b1-mid)] bg-[var(--white)] px-3 py-1.5 text-xs font-medium text-[var(--b1)] shadow-sm hover:bg-[var(--b1-mid)] hover:text-[var(--fg)] transition"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;