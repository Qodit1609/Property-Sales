import React from "react";
import { useAppSelector } from "../hooks/reduxHooks";
import Header from "../components/Header/Header";

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
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-[var(--b2-soft)] text-[var(--b1)]">
      <Header forceSolid/>
      <div className="pt-[68px] flex min-h-screen">
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
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
      </div>
    </div>
  );
};

export default DashboardLayout;