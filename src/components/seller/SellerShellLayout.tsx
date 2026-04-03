import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "../Header/Header";
import { useAppSelector } from "../../hooks/reduxHooks";
import { touchSellerSession } from "../../lib/sellerProfileStorage";
import {
  SELLER_SIDEBAR_WIDTH_COLLAPSED,
  SELLER_SIDEBAR_WIDTH_EXPANDED,
} from "./sellerUtils";
import { SellerMobileOverlay, SellerSidebar } from "./SellerSidebar";

type SellerShellLayoutProps = {
  children: ReactNode;
};

function SellerShellLayout({ children }: SellerShellLayoutProps) {
  const { t } = useTranslation();
  const user = useAppSelector((s) => s.auth.user);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => setCollapsed((c) => !c), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    touchSellerSession(user?.email);
  }, [user?.email]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--b2-soft)] text-[var(--b1)]">
      <Header forceSolid />
      <button
        type="button"
        className="fixed left-4 top-[76px] z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--b2)] bg-[var(--white)] text-[var(--b1)] shadow-sm transition hover:bg-[var(--b2-soft)] md:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label={t("sellerPanel.topbar.menu")}
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>
      <div className="relative flex min-h-0 flex-1 pt-[68px]">
        {/* Reserves horizontal space for fixed desktop sidebar so main content does not sit underneath */}
        <motion.div
          aria-hidden
          initial={false}
          animate={{
            width: collapsed ? SELLER_SIDEBAR_WIDTH_COLLAPSED : SELLER_SIDEBAR_WIDTH_EXPANDED,
          }}
          transition={{ type: "spring", stiffness: 380, damping: 38 }}
          className="hidden shrink-0 md:block"
        />
        <SellerSidebar collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />

        <SellerMobileOverlay open={mobileOpen} onClose={closeMobile}>
          <SellerSidebar
            collapsed={false}
            onToggleCollapsed={() => {}}
            mobile
            onNavigate={closeMobile}
          />
        </SellerMobileOverlay>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.22 }}
            className="mx-auto w-full max-w-[min(100%,88rem)] min-h-0 flex-1 overflow-y-auto py-5 pl-14 pr-4 md:px-6 md:py-6 lg:px-8 lg:py-8"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
}

export default SellerShellLayout;
