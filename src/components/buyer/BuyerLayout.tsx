import React from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import { logout } from "../../features/auth/authSlice";
import BuyerSidebar from "./BuyerSidebar";
import BuyerHeaderActions from "./BuyerHeaderActions";

interface BuyerLayoutProps {
  children: React.ReactNode;
}

const BuyerLayout: React.FC<BuyerLayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-[var(--b2-soft)] text-[var(--b1)]">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-64 flex-shrink-0 border-r border-[var(--b2)] bg-[var(--white)] px-4 py-6 lg:block">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Buyer Center
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--b1)]">
                {user?.name ?? "Welcome"}
              </p>
            </div>
          </div>
          <BuyerSidebar />
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-[var(--b2)] bg-[var(--white)]">
            <div className="flex items-center justify-between px-4 py-3 lg:px-6">
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Buyer Dashboard
                </span>
                <span className="text-sm text-[var(--b1)]">
                  Curated land, farmhouse & resort deals for you
                </span>
              </div>
              <BuyerHeaderActions onLogout={handleLogout} />
            </div>
          </header>

          <main className="flex-1 px-4 py-4 lg:px-6 lg:py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BuyerLayout;

