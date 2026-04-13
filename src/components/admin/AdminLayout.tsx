import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronLeft, ChevronRight, LogOut, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { logout } from "../../features/auth/authSlice";
import Header from "../Header/Header";
import { DashboardPageTopBar } from "../common/DashboardPageTopBar";
import { ProfileAvatar } from "../common/ProfileAvatar";
import {
  ADMIN_SIDEBAR_WIDTH_COLLAPSED,
  ADMIN_SIDEBAR_WIDTH_EXPANDED,
} from "./adminLayoutUtils";
import { twMerge } from "tailwind-merge";

function AdminNotificationsBell() {
  const unreadCount = useAppSelector((s) => s.notifications.unreadCount);

  return (
    <Link
      to="/admin/notifications"
      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--b2)]/80 bg-[var(--white)] text-[var(--b1)] shadow-sm transition hover:bg-[var(--b2-soft)] hover:shadow-md"
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5" strokeWidth={1.75} aria-hidden />
      {unreadCount > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--b1)] px-1 text-[10px] font-semibold text-[var(--fg)]">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      ) : null}
    </Link>
  );
}

type AdminShellSidebarProps = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobile?: boolean;
  onNavigate?: () => void;
  displayName: string;
  onLogout: () => void;
};

function AdminShellSidebar({
  collapsed,
  onToggleCollapsed,
  mobile,
  onNavigate,
  displayName,
  onLogout,
}: AdminShellSidebarProps) {
  const headerExpanded = !collapsed || mobile;
  const width =
    collapsed && !mobile ? ADMIN_SIDEBAR_WIDTH_COLLAPSED : ADMIN_SIDEBAR_WIDTH_EXPANDED;

  return (
    <motion.aside
      initial={false}
      animate={{ width }}
      transition={{ type: "spring", stiffness: 380, damping: 38 }}
      className={twMerge(
        "relative flex shrink-0 flex-col border-[var(--b2)] bg-[var(--white)] shadow-[0_0_0_1px_rgba(149,213,178,0.35)]",
        mobile
          ? "flex h-full min-h-0 w-full flex-1 flex-col border-r"
          : "fixed left-0 top-[68px] z-30 hidden h-[calc(100vh-68px)] border-r md:flex"
      )}
    >
      <div
        className={twMerge(
          "relative border-b border-[var(--b2)]/80 bg-gradient-to-br from-[var(--b2-soft)]/90 to-[var(--white)] px-3 py-3",
          collapsed && !mobile
            ? "flex flex-col items-center pb-4 pt-14"
            : "flex min-h-[3.25rem] flex-row items-center gap-2"
        )}
      >
        {!mobile ? (
          <button
            type="button"
            onClick={onToggleCollapsed}
            className={twMerge(
              "absolute top-2 z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--b2)] bg-[var(--white)] text-[var(--b1)] shadow-sm transition hover:bg-[var(--b2-soft)]",
              collapsed && !mobile ? "left-1/2 top-3 -translate-x-1/2" : "right-2"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        ) : null}
        <div
          className={twMerge(
            "flex min-w-0 items-center gap-2",
            headerExpanded && mobile && "min-w-0 flex-1",
            headerExpanded && !mobile && "w-full min-w-0 flex-1 pr-11",
            !headerExpanded && "w-full flex-col items-center"
          )}
        >
          <ProfileAvatar
            name={displayName}
            sizeClass={headerExpanded ? "h-10 w-10" : "h-9 w-9"}
          />
          {headerExpanded ? (
            <p className="min-w-0 flex-1 truncate text-left font-serif text-sm font-semibold leading-tight text-[var(--b1)]">
              {displayName}
            </p>
          ) : null}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <AdminSidebar
          collapsed={!mobile && collapsed}
          onNavigate={onNavigate}
        />
      </nav>

      <div className="border-t border-[var(--b2)]/80 p-2 pb-4">
        <button
          type="button"
          onClick={onLogout}
          className={twMerge(
            "flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-[var(--error)] transition hover:border-[var(--error)]/30 hover:bg-[var(--error-bg)]",
            collapsed && !mobile ? "justify-center px-2" : ""
          )}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {(!collapsed || mobile) && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}

interface AdminLayoutProps {
  title: string;
  /** Page title in the white overview strip; defaults to `title`. */
  topBarTitle?: string;
  topBarSubtitle?: string;
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  title,
  topBarTitle,
  topBarSubtitle,
  children,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = useCallback(() => setCollapsed((c) => !c), []);
  const closeMobile = useCallback(() => setMobileNavOpen(false), []);

  const displayName =
    user?.name?.trim() ||
    user?.email?.trim() ||
    "Admin";

  const overviewTitle = topBarTitle ?? title;
  const overviewSubtitle =
    topBarSubtitle ?? "Track your workspace and tasks at a glance.";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
    setMobileNavOpen(false);
  };

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-b from-[var(--b2-soft)] to-[var(--white)] text-[var(--b1)] antialiased">
      <Header forceSolid />
      <button
        type="button"
        className="fixed left-4 top-[76px] z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--b2)] bg-[var(--white)] text-[var(--b1)] shadow-sm transition hover:bg-[var(--b2-soft)] md:hidden"
        onClick={() => setMobileNavOpen(true)}
        aria-label="Open admin navigation"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      <div className="relative flex min-h-0 flex-1 pt-[68px]">
        <motion.div
          aria-hidden
          initial={false}
          animate={{
            width: collapsed ? ADMIN_SIDEBAR_WIDTH_COLLAPSED : ADMIN_SIDEBAR_WIDTH_EXPANDED,
          }}
          transition={{ type: "spring", stiffness: 380, damping: 38 }}
          className="hidden shrink-0 md:block"
        />
        <AdminShellSidebar
          collapsed={collapsed}
          onToggleCollapsed={toggleCollapsed}
          displayName={displayName}
          onLogout={handleLogout}
        />

        <AnimatePresence>
          {mobileNavOpen ? (
            <>
              <motion.button
                type="button"
                aria-label="Close menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-[var(--b1)]/40 backdrop-blur-sm md:hidden"
                onClick={closeMobile}
              />
              <motion.div
                initial={{ x: -24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -24, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 34 }}
                className="fixed left-0 top-0 z-[70] flex h-full w-[min(88vw,300px)] flex-col border-r border-[var(--b2)] bg-[var(--white)] shadow-2xl md:hidden"
              >
                <div className="flex shrink-0 items-center justify-between border-b border-[var(--b2)] px-4 py-3">
                  <span className="text-sm font-semibold text-[var(--b1)]">Admin menu</span>
                  <button
                    type="button"
                    className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--b2-soft)]"
                    onClick={closeMobile}
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                  <AdminShellSidebar
                    mobile
                    collapsed={false}
                    onToggleCollapsed={() => {}}
                    onNavigate={closeMobile}
                    displayName={displayName}
                    onLogout={handleLogout}
                  />
                </div>
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.22 }}
            className="mx-auto w-full max-w-[min(100%,88rem)] min-h-0 flex-1 overflow-y-auto py-5 pl-14 pr-4 md:px-6 md:py-6 md:pl-6 lg:px-8 lg:py-8"
          >
            <div className="space-y-6">
              <DashboardPageTopBar
                title={overviewTitle}
                subtitle={overviewSubtitle}
                rightSlot={<AdminNotificationsBell />}
              />
              {children}
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
