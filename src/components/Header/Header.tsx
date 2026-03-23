import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import ContactPopup from "../ContactPopup/ContactPopup";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { logout } from "../../features/auth/authSlice";
import type { UserRole } from "../../features/users/userType";
import { Button } from "@/components/common";

interface MegaSection {
  title: string;
  items: string[];
}

interface NavItem {
  label: string;
  href: string;
  mega?: MegaSection[];
}

interface HeaderProps {
  forceSolid?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Farmhouse / Farmland",
    href: "/farmhouse",
    mega: [
      {
        title: "Popular Locations",
        items: ["Goa", "Lonavala", "Pune", "Alibaug"],
      },
      {
        title: "Property Type",
        items: ["Luxury Farmhouse", "Weekend Farmhouse", "Organic Farm"],
      },
      {
        title: "Budget",
        items: ["Under 50L", "Under 1Cr", "Under 2Cr"],
      },
      { title: "Explore", items: ["New Listings", "Premium Farms", "Top Deals"] },
    ],
  },
  {
    label: "Agriculture Land",
    href: "/agriculture-land",
    mega: [
      {
        title: "Land Types",
        items: ["Organic Land", "Dry Land", "Irrigated Land"],
      },
      { title: "Investment", items: ["Short Term", "Long Term"] },
      {
        title: "Locations",
        items: ["Maharashtra", "Gujarat", "Karnataka"],
      },
      { title: "Guides", items: ["Buying Guide", "Legal Documents"] },
    ],
  },
  {
    label: "Resort Properties",
    href: "/resort-properties",
    mega: [
      { title: "Resort Type", items: ["Luxury Resort", "Boutique Resort"] },
      { title: "Locations", items: ["Beach Resorts", "Hill Resorts"] },
      { title: "Investment", items: ["Under 5Cr", "Under 10Cr"] },
      { title: "Insights", items: ["ROI Guide", "Investment Tips"] },
    ],
  },
  {
    label: "Rent Farmhouse",
    href: "/rent-farmhouse",
    mega: [
      { title: "Occasion", items: ["Wedding", "Party", "Weekend"] },
      { title: "Budget", items: ["Under 10k", "Under 25k"] },
      { title: "Locations", items: ["Delhi", "Mumbai", "Pune"] },
      { title: "Explore", items: ["Featured", "Trending"] },
    ],
  },
];

const roleDashboardPath = (role: UserRole) => {
  if (role === "buyer" || role === "user") return "/buyer/dashboard";
  if (role === "seller") return "/seller/dashboard";
  if (role === "agent") return "/agent/dashboard";
  return "/admin";
};

const navStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
};

const navItemMotion = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const Header: React.FC<HeaderProps> = ({ forceSolid = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const prefersReducedMotion = useReducedMotion();
  const { user, token } = useAppSelector((state) => state.auth);
  const isAuthenticated = Boolean(token && user);

  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [mobileActiveSections, setMobileActiveSections] = useState<string[]>([]);
  const [loginOpen, setLoginOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loginTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMega = (label: string) => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    setActiveMega(label);
  };

  const closeMega = () => {
    megaTimer.current = setTimeout(() => {
      setActiveMega(null);
    }, 600);
  };

  const openLogin = () => {
    if (loginTimer.current) clearTimeout(loginTimer.current);
    setLoginOpen(true);
  };

  const closeLogin = () => {
    loginTimer.current = setTimeout(() => {
      setLoginOpen(false);
    }, 600);
  };

  const closeMobileMenu = () => {
    setMenuOpen(false);
    setMobileActiveSections([]);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    return () => {
      if (megaTimer.current) clearTimeout(megaTimer.current);
      if (loginTimer.current) clearTimeout(loginTimer.current);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
        setActiveMega(null);
        setLoginOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const visibleNavItems = NAV_ITEMS;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  const toggleMobileSection = (label: string) => {
    setMobileActiveSections((prev) =>
      prev.includes(label) ? prev.filter((value) => value !== label) : [...prev, label]
    );
  };

  const closeContactModal = useCallback(() => {
    setContactOpen(false);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50">
        <motion.div
          initial={prefersReducedMotion ? false : { y: -24, opacity: 0 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={`px-3 sm:px-6 lg:px-10 transition-all duration-300 ${
           scrolled || forceSolid
  ? "header-bg shadow-xl backdrop-blur-md"
  : "header-bg/80 backdrop-blur-sm"
          }`}
        >
          <div className="flex h-14 sm:h-[68px] items-center justify-between gap-2 sm:gap-4">
            <motion.div
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : { scale: 1.03, transition: { duration: 0.2 } }
              }
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            >
              <Link
              to="/"
                className="font-semibold text-base sm:text-xl lg:text-2xl text-[var(--fg)] tracking-wide whitespace-nowrap"
              >
                BhoomiWala
              </Link>
            </motion.div>

            {/* Desktop Navigation with Mega Menu */}
            <motion.nav
              initial="hidden"
              animate="visible"
              variants={navStagger}
              className="hidden xl:flex items-center gap-6 2xl:gap-8"
            >
              {visibleNavItems.map((item) => {
                const isActive = location.pathname === item.href;

                return (
                  <motion.div
                    key={item.label}
                    variants={navItemMotion}
                    className="relative"
                    onMouseEnter={() => item.mega && openMega(item.label)}
                    onMouseLeave={closeMega}
                  >
                    <motion.div
                      whileHover={prefersReducedMotion ? undefined : { y: -1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        to={item.href}
                        className={`relative inline-flex pb-1 font-medium transition-colors duration-300 ${
                          isActive
                            ? "text-[var(--b2)]"
                            : "text-[var(--fg)]"
                        } hover:text-[var(--b2)]`}
                      >
                        {item.label}
                        {isActive && (
                          <motion.span
                            layoutId="active-nav-pill"
                            className="absolute left-0 right-0 -bottom-0.5 h-0.5 rounded-full bg-[var(--b2)]"
                          />
                        )}
                      </Link>
                    </motion.div>

                    <AnimatePresence>
                      {item.mega && activeMega === item.label && (
                        <motion.div
                          initial={prefersReducedMotion ? false : { opacity: 0, y: 14, scale: 0.98 }}
                          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
                          transition={{ duration: 0.24, ease: "easeOut" }}
                          className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[min(950px,92vw)] max-h-[75vh] overflow-y-auto bg-[var(--white)] rounded-xl shadow-2xl grid grid-cols-[200px_1fr_230px] 2xl:grid-cols-[220px_1fr_260px] overflow-hidden border border-[var(--b2-soft)]/70"
                          onMouseEnter={() => openMega(item.label)}
                          onMouseLeave={closeMega}
                        >
                        <div className="bg-[var(--b2-soft)] p-6 space-y-4 text-[var(--b1)]">
                          <div className="font-semibold">OWNER OFFERINGS</div>
                          <div>Articles &amp; News</div>
                        </div>

                        <div className="p-8 grid grid-cols-2 gap-8 text-[var(--b1)]">
                          {item.mega.map((section) => (
                            <div key={section.title}>
                              <h4 className="font-semibold mb-3 text-[14px] uppercase tracking-wide">
                                {section.title}
                              </h4>
                              <ul className="space-y-2 text-sm">
                                {section.items.map((sub) => (
                                  <li key={sub}>
                                    <button
                                      type="button"
                                      className="hover:text-[var(--b1-mid)] transition"
                                    >
                                      {sub}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        <div className="bg-[var(--b2-soft)] p-6 flex flex-col justify-between">
                          <div>
                            <h3 className="font-semibold text-lg text-[var(--b1)]">
                              Sell or rent faster
                            </h3>
                            <p className="text-sm text-[var(--brown)] mt-2">
                              List your property now for FREE
                            </p>
                          </div>

                          {/* Preserve routing for Post Property */}
                          <Link
                            to="/post-property/basic"
                            className="mt-4 btn-brand px-4 py-2 rounded-lg shadow text-center"
                          >
                            Post Property
                          </Link>
                        </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.nav>

            {/* Right Section */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Post Property CTA restored (button only, not in nav) */}
              <motion.div whileHover={prefersReducedMotion ? undefined : { y: -1 }} whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}>
                <Link
                  to="/post-property/basic"
                  className="hidden md:inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--white)] px-4 text-sm text-[var(--b1)] shadow"
                >
                  Post Property
                  <span className="inline-flex h-5 items-center justify-center rounded bg-[var(--b2)] px-1.5 text-[10px] leading-none text-[var(--b1)]">
                    FREE
                  </span>
                </Link>
              </motion.div>

              {/* Contact button keeps existing modal behavior */}
              <motion.div whileHover={prefersReducedMotion ? undefined : { y: -1, scale: 1.03 }} whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}>
                <Button
                  onClick={() => setContactOpen(true)}
                  className="hidden md:flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[var(--fg)] p-0 text-[var(--fg)]"
                  aria-label="Open contact form"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6.6 10.8c1.5 3 3.6 5.1 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.3 1 .3 2.1.5 3.2.5.7 0 1.2.5 1.2 1.2V21c0 .7-.5 1.2-1.2 1.2C10.6 22.2 1.8 13.4 1.8 2.2 1.8 1.5 2.3 1 3 1h3.6c.7 0 1.2.5 1.2 1.2 0 1.1.2 2.2.5 3.2.1.4 0 .9-.3 1.2l-2.4 2.4z" />
                  </svg>
                </Button>
              </motion.div>

              {!isAuthenticated ? (
                <motion.div whileHover={prefersReducedMotion ? undefined : { y: -1 }} whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}>
                  <Link
                    to="/login"
                    className="hidden md:inline-flex px-3 py-1.5 rounded-full btn-brand text-xs sm:text-sm font-semibold shadow-md transition"
                  >
                    Login / Register
                  </Link>
                </motion.div>
              ) : (
                <div
                  className="relative hidden md:block"
                  onMouseEnter={openLogin}
                  onMouseLeave={closeLogin}
                >
                  <motion.div whileHover={prefersReducedMotion ? undefined : { y: -1 }} whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}>
                    <Button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border-2 border-[var(--fg)] px-4 py-0 text-[var(--fg)]">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--fg)]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                        </svg>
                      </span>
                      <span className="max-w-[140px] truncate text-sm font-medium leading-none">
                        {user?.name}
                      </span>
                    </Button>
                  </motion.div>

                  <AnimatePresence initial={false}>
                    {loginOpen && (
                      <motion.div
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
                        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-[var(--b2-soft)]/70 bg-[var(--white)] p-2 shadow-xl"
                        onMouseEnter={openLogin}
                        onMouseLeave={closeLogin}
                      >
                        <Link
                          to={
                            user?.role === "buyer" || user?.role === "user"
                              ? "/buyer/account"
                              : roleDashboardPath(user?.role ?? "buyer")
                          }
                          className="flex h-10 items-center rounded-md px-3 text-sm font-medium text-[var(--b1)] transition-colors hover:bg-[var(--b2-soft)]/50 hover:text-[var(--b1-mid)]"
                        >
                          My Account
                        </Link>

                        <Link
                          to={roleDashboardPath(user?.role ?? "buyer")}
                          className="flex h-10 items-center rounded-md px-3 text-sm font-medium text-[var(--b1)] transition-colors hover:bg-[var(--b2-soft)]/50 hover:text-[var(--b1-mid)]"
                        >
                          Dashboard
                        </Link>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex h-10 w-full items-center rounded-md px-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile menu toggle */}
              <Button
                className="xl:hidden text-[var(--fg)] text-2xl p-1 leading-none"
                onClick={() => setMenuOpen(true)}
                aria-label="Toggle Menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-header-menu"
              >
                ☰
              </Button>
            </div>
          </div>
        </motion.div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 xl:hidden"
          >
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[var(--b1)]/60"
              onClick={closeMobileMenu}
            />

            <motion.div
              id="mobile-header-menu"
              initial={prefersReducedMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="absolute top-0 right-0 h-full w-[min(92vw,360px)] bg-[var(--white)] shadow-2xl flex flex-col"
            >
              <div className="relative flex items-center px-5 sm:px-6 h-14 sm:h-[68px] border-b border-[var(--b2-soft)]">
                <span className="font-semibold text-lg text-[var(--b1)]">
                  BhoomiWala
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeMobileMenu}
                  className="absolute right-5 sm:right-6 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--b2-soft)] bg-[var(--white)] text-[var(--b1)] hover:bg-[var(--b2-soft)]/60 transition-colors p-0"
                  aria-label="Close menu"
                >
                  <span className="text-xl leading-none font-semibold" aria-hidden="true">
                    ×
                  </span>
                </Button>
              </div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={navStagger}
                className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5"
              >
                {visibleNavItems.map((item) => (
                  <motion.div key={item.label} variants={navItemMotion} className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        to={item.href}
                        onClick={closeMobileMenu}
                        className="text-[16px] font-medium text-[var(--b1)] hover:text-[var(--b1-mid)]"
                      >
                        {item.label}
                      </Link>

                      {item.mega && (
                        <Button
                          type="button"
                          onClick={() => toggleMobileSection(item.label)}
                          className="text-[var(--b1)] text-base leading-none"
                          aria-label={`Toggle ${item.label} options`}
                          aria-expanded={mobileActiveSections.includes(item.label)}
                        >
                          {mobileActiveSections.includes(item.label) ? "−" : "+"}
                        </Button>
                      )}
                    </div>

                    <AnimatePresence initial={false}>
                      {item.mega && mobileActiveSections.includes(item.label) && (
                        <motion.div
                          initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pl-3 space-y-3 border-l border-[var(--b2-soft)]">
                            {item.mega.map((section) => (
                              <div key={section.title} className="space-y-1.5">
                                <div className="text-xs uppercase tracking-wide font-semibold text-[var(--brown)]">
                                  {section.title}
                                </div>
                                <ul className="space-y-1">
                                  {section.items.map((sub) => (
                                    <li key={sub} className="text-sm text-[var(--b1-mid)]">
                                      {sub}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}

                <motion.div variants={navItemMotion} className="border-t border-[var(--b2-soft)] pt-6 space-y-4">
                  <Link
                    to="/post-property/basic"
                    onClick={closeMobileMenu}
                    className="flex h-11 w-full items-center justify-center rounded-lg bg-[var(--b1)] px-4 text-center font-medium text-[var(--white)]"
                  >
                    Post Property
                  </Link>

                  {!isAuthenticated ? (
                    <>
                      <Link
                        to="/login"
                        onClick={closeMobileMenu}
                        className="flex h-11 w-full items-center justify-center rounded-lg border border-[var(--b1-mid)] px-4 text-center font-medium text-[var(--b1-mid)]"
                      >
                        Login / Register
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to={roleDashboardPath(user?.role ?? "buyer")}
                        onClick={closeMobileMenu}
                        className="flex h-11 w-full items-center justify-center rounded-lg border border-[var(--b1-mid)] px-4 text-center font-medium text-[var(--b1-mid)]"
                      >
                        Dashboard
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          closeMobileMenu();
                          handleLogout();
                        }}
                        className="flex h-11 w-full items-center justify-center rounded-lg border border-red-500 bg-white px-4 text-center font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                      >
                        Logout
                      </button>
                    </>
                  )}

                  <Button
                    onClick={() => {
                      closeMobileMenu();
                      window.requestAnimationFrame(() => {
                        setContactOpen(true);
                      });
                    }}
                    className="h-11 w-full rounded-lg border border-[var(--b1-mid)] bg-[var(--b1-mid)] px-4 text-white transition-all duration-200 hover:opacity-90"
                  >
                    Contact Us
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        open={contactOpen}
        onClose={closeContactModal}
      >
        <ContactPopup onClose={closeContactModal} />
      </Modal>
    </>
  );
};

export default Header;
