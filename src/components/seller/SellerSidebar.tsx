import type { ReactNode } from "react";
import { NavLink, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useSellerProfileLocal } from "../../hooks/useSellerProfileLocal";
import { SELLER_NAV_ACCOUNT, SELLER_NAV_MAIN } from "./sellerNav";
import {
  cn,
  SELLER_SIDEBAR_WIDTH_COLLAPSED,
  SELLER_SIDEBAR_WIDTH_EXPANDED,
} from "./sellerUtils";

type NavBlockProps = {
  collapsed: boolean;
  onNavigate?: () => void;
};

function NavBlock({ collapsed, onNavigate }: NavBlockProps) {
  const { t } = useTranslation();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200",
      collapsed ? "justify-center px-2" : "",
      isActive
        ? "border-[var(--b2)] bg-gradient-to-r from-[var(--b2-soft)] to-[var(--white)] text-[var(--b1)] shadow-sm"
        : "border-transparent text-[var(--b1)]/90 hover:border-[var(--b2)]/80 hover:bg-[var(--b2-soft)]/60"
    );

  return (
    <>
      <p
        className={cn(
          "mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]",
          collapsed && "sr-only"
        )}
      >
        {t("sellerPanel.sidebar.workspace")}
      </p>
      <ul className="space-y-1">
        {SELLER_NAV_MAIN.map((item) => {
          const Icon = item.icon;
          const inner = (
            <>
              <Icon className="h-[18px] w-[18px] shrink-0 opacity-90 transition group-hover:scale-[1.03]" />
              {!collapsed ? (
                <span className="truncate">{t(item.labelKey)}</span>
              ) : null}
            </>
          );
          return (
            <li key={item.key}>
              {item.external ? (
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-[var(--b1)]/90 transition hover:border-[var(--b2)]/80 hover:bg-[var(--b2-soft)]/60"
                >
                  {inner}
                </Link>
              ) : (
                <NavLink to={item.to} className={linkClass} onClick={onNavigate} end={item.to === "/seller/dashboard"}>
                  {inner}
                </NavLink>
              )}
            </li>
          );
        })}
      </ul>

      <p
        className={cn(
          "mb-2 mt-6 px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]",
          collapsed && "sr-only"
        )}
      >
        {t("sellerPanel.sidebar.account")}
      </p>
      <ul className="space-y-1">
        {SELLER_NAV_ACCOUNT.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.key}>
              <NavLink to={item.to} className={linkClass} onClick={onNavigate}>
                <Icon className="h-[18px] w-[18px] shrink-0 opacity-90" />
                {!collapsed ? <span className="truncate">{t(item.labelKey)}</span> : null}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </>
  );
}

type SellerSidebarProps = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobile?: boolean;
  onNavigate?: () => void;
};

function SellerAvatar({
  photoUrl,
  name,
  sizeClass,
}: {
  photoUrl?: string | null;
  name: string;
  sizeClass: string;
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "S";
  return (
    <div
      className={cn(
        "shrink-0 overflow-hidden rounded-full border border-[var(--b2)] bg-[var(--b2-soft)] shadow-inner shadow-[var(--b2)]/30",
        sizeClass
      )}
    >
      {photoUrl ? (
        <img src={photoUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-serif text-sm font-semibold text-[var(--b1-mid)]">
          {initial}
        </span>
      )}
    </div>
  );
}

export function SellerSidebar({
  collapsed,
  onToggleCollapsed,
  mobile,
  onNavigate,
}: SellerSidebarProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const storedProfile = useSellerProfileLocal(user?.email);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
    onNavigate?.();
  };

  const width =
    collapsed && !mobile ? SELLER_SIDEBAR_WIDTH_COLLAPSED : SELLER_SIDEBAR_WIDTH_EXPANDED;

  const displayName =
    storedProfile?.displayName?.trim() ||
    user?.name?.trim() ||
    t("sellerPanel.sidebar.sellerFallback");

  const photoUrl = storedProfile?.profilePhotoUrl;

  const headerExpanded = !collapsed || mobile;

  return (
    <motion.aside
      initial={false}
      animate={{ width }}
      transition={{ type: "spring", stiffness: 380, damping: 38 }}
      className={cn(
        "relative flex shrink-0 flex-col border-[var(--b2)] bg-[var(--white)] shadow-[0_0_0_1px_rgba(149,213,178,0.35)]",
        mobile
          ? "h-full w-full border-r"
          : "fixed left-0 top-[68px] z-30 hidden h-[calc(100vh-68px)] border-r md:flex"
      )}
    >
      <div
        className={cn(
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
            className={cn(
              "absolute top-2 z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--b2)] bg-[var(--white)] text-[var(--b1)] shadow-sm transition hover:bg-[var(--b2-soft)]",
              collapsed && !mobile ? "left-1/2 top-3 -translate-x-1/2" : "right-2"
            )}
            aria-label={collapsed ? t("sellerPanel.sidebar.expand") : t("sellerPanel.sidebar.collapse")}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        ) : null}
        <div
          className={cn(
            "flex min-w-0 items-center gap-2",
            headerExpanded && mobile && "min-w-0 flex-1",
            headerExpanded && !mobile && "w-full min-w-0 flex-1 pr-11",
            !headerExpanded && "w-full flex-col items-center"
          )}
        >
          <SellerAvatar
            photoUrl={photoUrl}
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
        <NavBlock collapsed={!mobile && collapsed} onNavigate={onNavigate} />
      </nav>

      <div className="border-t border-[var(--b2)]/80 p-2 pb-4">
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-[var(--error)] transition hover:border-[var(--error)]/30 hover:bg-[var(--error-bg)]",
            collapsed && !mobile ? "justify-center px-2" : ""
          )}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {(!collapsed || mobile) && <span>{t("header.logout")}</span>}
        </button>
      </div>
    </motion.aside>
  );
}

export function SellerMobileOverlay({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[var(--b1)]/40 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: -24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 34 }}
            className="fixed left-0 top-0 z-[70] flex h-full w-[min(88vw,300px)] shadow-2xl md:hidden"
          >
            {children}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
