import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Menu, X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { useAppSelector } from "../../hooks/reduxHooks";
import Header from "../Header/Header";

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
}

function AdminNotificationsBell({
  className,
}: {
  className?: string;
}) {
  const hasUnread = useAppSelector((s) =>
    s.admin.notifications.some((n) => !n.read)
  );

  return (
    <Link
      to="/admin/notifications"
      className={
        className ??
        "relative inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-[#1A4731] transition hover:bg-[var(--b2-soft)] hover:text-[var(--b1)]"
      }
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5" strokeWidth={2} aria-hidden />
      {hasUnread ? (
        <span
          className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[var(--white)]"
          aria-hidden
        />
      ) : null}
    </Link>
  );
}

function SidebarHeader({
  title,
  email,
}: {
  title: string;
  email: string;
}) {
  return (
    <div className="mb-6 border-b border-[var(--b2)]/80 pb-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#704C3E]">
            {title}
          </p>
          <p className="mt-1.5 truncate font-sans text-sm font-medium text-[#1A4731]">
            {email}
          </p>
        </div>
        <AdminNotificationsBell />
      </div>
    </div>
  );
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ title, children }) => {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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

  const email = user?.email ?? "Admin";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--b2-soft)] to-[var(--white)] font-sans text-[var(--b1)] antialiased">
      <Header forceSolid />
      <div className="mx-auto flex min-h-[calc(100vh-68px)] max-w-[1600px] pt-[68px]">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 flex-shrink-0 border-r border-[var(--b2)]/90 bg-[var(--white)]/95 px-4 py-6 shadow-sm backdrop-blur-sm lg:block xl:w-72">
          <SidebarHeader title={title} email={email} />
          <AdminSidebar />
        </aside>

        {/* Mobile drawer */}
        {mobileNavOpen ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] lg:hidden"
              aria-label="Close menu"
              onClick={() => setMobileNavOpen(false)}
            />
            <aside className="fixed left-0 top-0 z-50 flex h-full w-[min(300px,88vw)] flex-col border-r border-[var(--b2)] bg-[var(--white)] shadow-2xl lg:hidden">
              <div className="flex items-center justify-between border-b border-[var(--b2)] px-4 py-3">
                <span className="text-sm font-semibold text-[var(--b1)]">
                  Admin menu
                </span>
                <button
                  type="button"
                  className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--b2-soft)]"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div
                id="admin-mobile-nav"
                className="flex-1 overflow-y-auto px-4 py-5"
              >
                <SidebarHeader title={title} email={email} />
                <AdminSidebar onNavigate={() => setMobileNavOpen(false)} />
              </div>
            </aside>
          </>
        ) : null}

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="sticky top-[68px] z-30 flex items-center gap-3 border-b border-[var(--b2)]/80 bg-[var(--white)]/90 px-4 py-3 shadow-sm backdrop-blur-md lg:hidden">
            <button
              type="button"
              className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--b2)] bg-[var(--b2-soft)] text-[var(--b1)] transition hover:bg-[var(--b2)]"
              onClick={() => setMobileNavOpen(true)}
              aria-expanded={mobileNavOpen}
              aria-controls="admin-mobile-nav"
              aria-label="Open admin navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--b1)]">
                {title}
              </p>
              <p className="truncate text-xs text-[var(--muted)]">{email}</p>
            </div>
            <AdminNotificationsBell className="relative inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--b2)]/80 bg-[var(--b2-soft)]/80 text-[#1A4731] transition hover:bg-[var(--b2-soft)]" />
          </div>

          <main className="flex-1 px-4 py-5 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

