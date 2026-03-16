import React from "react";
import { useAppSelector } from "../../hooks/reduxHooks";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import BuyerSidebar from "./BuyerSidebar";
import Header from "../Header/Header";
 
interface BuyerLayoutProps {
  children: React.ReactNode;
}
 
const BuyerLayout: React.FC<BuyerLayoutProps> = ({ children }) => {
 
  const { user } = useAppSelector((state) => state.auth);
 
  const unreadCount = useAppSelector(
    (state) =>
      state.buyer.notifications.filter((n) => !n.read).length
  );
 
  return (
    <div className="min-h-screen bg-[var(--b2-soft)] text-[var(--b1)]">
      <Header forceSolid/>
      <div className="mx-auto flex max-w-7xl pt-[68px]">
        <aside className="hidden w-64 flex-shrink-0 border-r border-[var(--b2)] bg-[var(--white)] px-4 py-6 lg:block">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                {user?.name?.charAt(0) || "U"}
              </div>
 
              <p className="text-sm font-medium text-[var(--b1)]">
                {user?.name || "Welcome"}
              </p>
 
              <Link
                to="/buyer/notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[var(--b2-soft)] text-[var(--b1-mid)] shadow-inner shadow-[var(--b2)]/40 ring-1 ring-[var(--b2)] hover:text-[var(--b1)]"
              >
                <Bell className="h-4 w-4" />
 
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-slate-950">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
 
            </div>
          </div>
          <BuyerSidebar />
        </aside>
        <div className="flex min-h-[calc(100vh-68px)] flex-1 flex-col">
          <main className="flex-1 px-4 py-4 lg:px-6 lg:py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
 
export default BuyerLayout;