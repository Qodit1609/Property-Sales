import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import Header from "../Header/Header";
import { SellerMobileOverlay, SellerSidebar } from "./SellerSidebar";
import { SellerTopBar } from "./SellerTopBar";

type SellerShellLayoutProps = {
  children: ReactNode;
};

function SellerShellLayout({ children }: SellerShellLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => setCollapsed((c) => !c), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="min-h-screen bg-[var(--b2-soft)] text-[var(--b1)]">
      <Header forceSolid />
      <div className="flex min-h-[calc(100vh-68px)] pt-[68px]">
        <SellerSidebar collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />

        <SellerMobileOverlay open={mobileOpen} onClose={closeMobile}>
          <SellerSidebar
            collapsed={false}
            onToggleCollapsed={() => {}}
            mobile
            onNavigate={closeMobile}
          />
        </SellerMobileOverlay>

        <div className="flex min-w-0 flex-1 flex-col">
          <SellerTopBar onOpenMobileNav={() => setMobileOpen(true)} />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.22 }}
            className="mx-auto w-full max-w-[min(100%,88rem)] flex-1 overflow-y-auto px-4 py-5 sm:px-5 md:px-6 md:py-6 lg:px-8 lg:py-8"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
}

export default SellerShellLayout;
