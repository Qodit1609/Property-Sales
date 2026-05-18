import { useEffect, useState, type ReactNode } from "react";
import { NavLink, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  LineChart,
  Megaphone,
  MessageSquare,
  Bell,
  MessageCircleMore,
  Settings,
  UserRound,
  Building2,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useSellerProfileLocal } from "../../hooks/useSellerProfileLocal";
import { type SellerNavItem } from "./sellerNav";
import {
  cn,
  SELLER_SIDEBAR_WIDTH_COLLAPSED,
  SELLER_SIDEBAR_WIDTH_EXPANDED,
} from "./sellerUtils";
import api from "@/lib/apiClient";
import CustomAlert from "@/components/common/CustomAlert";
import { translateSellerNavLabel } from "@/lib/sellerI18n";

type SidebarNavItem = SellerNavItem & { label?: string };

type NavBlockProps = {
  collapsed: boolean;
  onNavigate?: () => void;
  workspaceTitle?: string;
  mainItems: SidebarNavItem[];
  accountItems: SidebarNavItem[];
};

function NavBlock({ collapsed, onNavigate, workspaceTitle, mainItems, accountItems }: NavBlockProps) {
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
        {workspaceTitle
          ? translateSellerNavLabel(workspaceTitle)
          : t("sellerPanel.sidebar.workspace")}
      </p>
      <ul className="space-y-1">
        {mainItems.map((item) => {
          const Icon = item.icon;
          const inner = (
            <>
              <Icon className="h-[18px] w-[18px] shrink-0 opacity-90 transition group-hover:scale-[1.03]" />
              {!collapsed ? (
                <span className="truncate">
                  {item.label
                    ? translateSellerNavLabel(item.label, item.to)
                    : t(item.labelKey)}
                </span>
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
        {accountItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.key}>
              <NavLink to={item.to} className={linkClass} onClick={onNavigate}>
                <Icon className="h-[18px] w-[18px] shrink-0 opacity-90" />
                {!collapsed ? (
                  <span className="truncate">
                    {item.label
                      ? translateSellerNavLabel(item.label, item.to)
                      : t(item.labelKey)}
                  </span>
                ) : null}
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
    setLogoutAlertOpen(false);
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
  const [workspaceTitle, setWorkspaceTitle] = useState<string | undefined>();
  const [mainItems, setMainItems] = useState<SidebarNavItem[]>([]);
  const [accountItems, setAccountItems] = useState<SidebarNavItem[]>([]);
  const [logoutAlertOpen, setLogoutAlertOpen] = useState(false);

  const headerExpanded = !collapsed || mobile;

  useEffect(() => {
    let active = true;

    const ICON_MAP = {
      layoutdashboard: LayoutDashboard,
      dashboard: LayoutDashboard,
      building2: Building2,
      properties: Building2,
      users: Users,
      leads: Users,
      linechart: LineChart,
      analytics: LineChart,
      messagesquare: MessageSquare,
      messages: MessageSquare,
      messagecirclemore: MessageCircleMore,
      testimonial: MessageCircleMore,
      bell: Bell,
      notifications: Bell,
      megaphone: Megaphone,
      promotions: Megaphone,
      userround: UserRound,
      profile: UserRound,
      settings: Settings,
    } as const;

    const mapSidebarItems = (items: unknown) =>
      (Array.isArray(items) ? items : [])
        .map(
          (item: {
            title?: string;
            label?: string;
            name?: string;
            icon?: string;
            route?: string;
            path?: string;
            to?: string;
            href?: string;
            url?: string;
          }) => {
            const iconKey = (item.icon ?? "").replace(/[\s_-]/g, "").toLowerCase();
            return {
              key: item.route ?? item.path ?? item.to ?? item.href ?? item.url ?? item.title ?? item.label ?? item.name ?? "item",
              to: item.route ?? item.path ?? item.to ?? item.href ?? item.url ?? "",
              icon: ICON_MAP[iconKey as keyof typeof ICON_MAP] ?? LayoutDashboard,
              labelKey: "sellerPanel.nav.dashboard",
              label: item.title ?? item.label ?? item.name ?? "",
            };
          }
        )
        .filter((item: SidebarNavItem) => item.to && item.label);

    const loadSidebar = async () => {
      try {
        const response = await api.get("/sidebar/seller");
        const payload = response.data?.data ?? response.data;
        if (!payload || !active) return;

        const sections =
          payload?.sidebar?.sections ??
          payload?.sections ??
          [];

        const workspaceSection = (Array.isArray(sections) ? sections : []).find(
          (section: { sectionTitle?: string }) =>
            String(section?.sectionTitle ?? "").trim().toLowerCase() !== "account"
        );
        const accountSection = (Array.isArray(sections) ? sections : []).find(
          (section: { sectionTitle?: string }) =>
            String(section?.sectionTitle ?? "").trim().toLowerCase() === "account"
        );

        const rawMainItems =
          workspaceSection?.items ??
          payload?.items ??
          payload?.menuItems ??
          payload?.menu_items ??
          payload?.sidebarItems ??
          payload?.sidebar_items ??
          payload?.links ??
          (Array.isArray(payload) ? payload : []);

        const rawAccountItems =
          accountSection?.items ??
          payload?.accountItems ??
          payload?.account_items ??
          payload?.account ??
          payload?.profileItems ??
          payload?.profile_items;

        setMainItems(mapSidebarItems(rawMainItems));
        setAccountItems(mapSidebarItems(rawAccountItems));

        const title =
          workspaceSection?.sectionTitle ??
          payload?.sectionTitle ??
          payload?.title ??
          payload?.section_title;
        if (title) {
          setWorkspaceTitle(title);
        }
      } catch (error) {
        console.error("Failed to load seller sidebar:", error);
      }
    };

    loadSidebar();
    return () => {
      active = false;
    };
  }, []);

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
        <NavBlock
          collapsed={!mobile && collapsed}
          onNavigate={onNavigate}
          workspaceTitle={workspaceTitle}
          mainItems={mainItems}
          accountItems={accountItems}
        />
      </nav>

      <div className="border-t border-[var(--b2)]/80 p-2 pb-4">
        <button
          type="button"
          onClick={() => setLogoutAlertOpen(true)}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-[var(--error)] transition hover:border-[var(--error)]/30 hover:bg-[var(--error-bg)]",
            collapsed && !mobile ? "justify-center px-2" : ""
          )}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {(!collapsed || mobile) && <span>{t("header.logout")}</span>}
        </button>
      </div>
      <CustomAlert
        open={logoutAlertOpen}
        title={t("header.confirmLogout")}
        message={t("header.confirmLogoutMessage")}
        showCancel
        onCancel={() => setLogoutAlertOpen(false)}
        onConfirm={handleLogout}
      />
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
  const { t } = useTranslation();
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label={t("header.closeMenu")}
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
