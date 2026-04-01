import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Modal from "../Modal/Modal";
import ContactPopup from "../ContactPopup/ContactPopup";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { logout } from "../../features/auth/authSlice";
import type { AppRole } from "../../features/auth/roleTypes";
import { Button } from "@/components/common";
import { normalizeLanguage, preloadLanguage } from "../../i18n";

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

const NAV_LABEL_KEY_MAP: Record<string, string> = {
  Home: "header.home",
  "Farmhouse / Farmland": "header.farmhouseFarmland",
  "Agriculture Land": "header.agricultureLand",
  "Resort Properties": "header.resortProperties",
  "Rent Farmhouse": "header.rentFarmhouse",
};

const SECTION_TITLE_KEY_MAP: Record<string, string> = {
  "Popular Locations": "header.popularLocations",
  "Property Type": "header.propertyType",
  Budget: "header.budget",
  Explore: "header.explore",
  "Land Types": "header.landTypes",
  Investment: "header.investment",
  Locations: "header.locations",
  Guides: "header.guides",
  "Resort Type": "header.resortType",
  Insights: "header.insights",
  Occasion: "header.occasion",
};

const SECTION_ITEM_KEY_MAP: Record<string, string> = {
  Goa: "header.goa",
  Lonavala: "header.lonavala",
  Pune: "header.pune",
  Alibaug: "header.alibaug",
  "Luxury Farmhouse": "header.luxuryFarmhouse",
  "Weekend Farmhouse": "header.weekendFarmhouse",
  "Organic Farm": "header.organicFarm",
  "Under 50L": "header.under50L",
  "Under 1Cr": "header.under1Cr",
  "Under 2Cr": "header.under2Cr",
  "New Listings": "header.newListings",
  "Premium Farms": "header.premiumFarms",
  "Top Deals": "header.topDeals",
  "Organic Land": "header.organicLand",
  "Dry Land": "header.dryLand",
  "Irrigated Land": "header.irrigatedLand",
  "Short Term": "header.shortTerm",
  "Long Term": "header.longTerm",
  Maharashtra: "header.maharashtra",
  Gujarat: "header.gujarat",
  Karnataka: "header.karnataka",
  "Buying Guide": "header.buyingGuide",
  "Legal Documents": "header.legalDocuments",
  "Luxury Resort": "header.luxuryResort",
  "Boutique Resort": "header.boutiqueResort",
  "Beach Resorts": "header.beachResorts",
  "Hill Resorts": "header.hillResorts",
  "Under 5Cr": "header.under5Cr",
  "Under 10Cr": "header.under10Cr",
  "ROI Guide": "header.roiGuide",
  "Investment Tips": "header.investmentTips",
  Wedding: "header.wedding",
  Party: "header.party",
  Weekend: "header.weekend",
  "Under 10k": "header.under10k",
  "Under 25k": "header.under25k",
  Delhi: "header.delhi",
  Mumbai: "header.mumbai",
  Featured: "header.featured",
  Trending: "header.trending",
};

const roleDashboardPath = (role: AppRole) => {
  if (role === "buyer") return "/buyer/dashboard";
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
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const prefersReducedMotion = useReducedMotion();
  const { user, token } = useAppSelector((state) => state.auth);
  const isAuthenticated = Boolean(token && user);
  const activeLanguage = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);

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

  const closeContactModal = () => {
    setContactOpen(false);
  };

  const translateHeaderValue = (value: string) => {
    const key = NAV_LABEL_KEY_MAP[value] ?? SECTION_TITLE_KEY_MAP[value] ?? SECTION_ITEM_KEY_MAP[value];
    return key ? t(key) : value;
  };

  const changeLanguage = (language: "en" | "hi") => {
    if (activeLanguage === language) return;

    void (async () => {
      await preloadLanguage(language);
      await i18n.changeLanguage(language);
    })();
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50">
        <motion.div
          initial={prefersReducedMotion ? false : { y: -24, opacity: 0 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={`px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 transition-all duration-300 ${
           scrolled || forceSolid
  ? "header-bg shadow-xl backdrop-blur-md"
  : "header-bg/80 backdrop-blur-sm"
          }`}
        >
          <div className="mx-auto flex h-14 sm:h-[68px] w-full max-w-[1480px] items-center justify-between gap-2 sm:gap-4">
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
              className="hidden xl:flex min-w-0 flex-1 items-center justify-center gap-4 2xl:gap-8 px-3"
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
                        className={`relative inline-flex whitespace-nowrap pb-1 text-sm 2xl:text-[15px] font-medium transition-colors duration-300 ${
                          isActive
                            ? "text-[var(--b2)]"
                            : "text-[var(--fg)]"
                        } hover:text-[var(--b2)]`}
                      >
                        {translateHeaderValue(item.label)}
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
                          <div className="font-semibold">{t("header.ownerOfferings")}</div>
                          <div>{t("header.articlesNews")}</div>
                        </div>

                        <div className="p-8 grid grid-cols-2 gap-8 text-[var(--b1)]">
                          {item.mega.map((section) => (
                            <div key={section.title}>
                              <h4 className="font-semibold mb-3 text-[14px] uppercase tracking-wide">
                                {translateHeaderValue(section.title)}
                              </h4>
                              <ul className="space-y-2 text-sm">
                                {section.items.map((sub) => (
                                  <li key={sub}>
                                    <button
                                      type="button"
                                      className="hover:text-[var(--b1-mid)] transition"
                                    >
                                      {translateHeaderValue(sub)}
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
                              {t("header.sellOrRentFaster")}
                            </h3>
                            <p className="text-sm text-[var(--brown)] mt-2">
                              {t("header.listPropertyFree")}
                            </p>
                          </div>

                          {/* Preserve routing for Post Property */}
                          <Link
                            to="/post-property/basic"
                            className="mt-4 btn-brand px-4 py-2 rounded-lg shadow text-center"
                          >
                            {t("header.postProperty")}
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
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <div className="inline-flex h-8 min-w-[86px] items-center justify-center gap-0.5 rounded-lg border-2 border-[var(--fg)]/90 bg-transparent px-0.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-[2px]">
                <button
                  type="button"
                  onClick={() => changeLanguage("en")}
                  className={`inline-flex min-h-[26px] min-w-[2rem] items-center justify-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold transition-colors duration-200 ${
                    activeLanguage === "en"
                      ? "bg-[var(--b1-mid)] text-[var(--fg)] shadow-sm ring-1 ring-[var(--fg)]/20"
                      : "text-[var(--fg)]/75 hover:bg-[var(--fg)]/10 hover:text-[var(--fg)]"
                  }`}
                  aria-pressed={activeLanguage === "en"}
                >
                  {t("language.en")}
                </button>
                <span className="shrink-0 text-[var(--fg)]/35 select-none" aria-hidden>
                  |
                </span>
                <button
                  type="button"
                  onClick={() => changeLanguage("hi")}
                  className={`inline-flex min-h-[26px] min-w-[2rem] items-center justify-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold transition-colors duration-200 ${
                    activeLanguage === "hi"
                      ? "bg-[var(--b1-mid)] text-[var(--fg)] shadow-sm ring-1 ring-[var(--fg)]/20"
                      : "text-[var(--fg)]/75 hover:bg-[var(--fg)]/10 hover:text-[var(--fg)]"
                  }`}
                  aria-pressed={activeLanguage === "hi"}
                >
                  {t("language.hi")}
                </button>
              </div>

              {/* Post Property CTA restored (button only, not in nav) */}
              <motion.div whileHover={prefersReducedMotion ? undefined : { y: -1 }} whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}>
                <Link
                  to="/post-property/basic"
                  className="hidden lg:inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border-2 border-[var(--fg)]/90 bg-transparent px-2.5 xl:px-3 text-[13px] text-[var(--fg)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[2px] transition hover:border-[var(--fg)]/70 hover:bg-[var(--fg)]/8"
                >
                  {t("header.postProperty")}
                  <span className="inline-flex h-[18px] min-w-[2rem] items-center justify-center rounded-md border border-[var(--fg)]/25 bg-[var(--b1-mid)] px-1.5 text-[9px] font-bold leading-none tracking-wide text-[var(--fg)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                    {t("header.freeTag")}
                  </span>
                </Link>
              </motion.div>

              {/* Contact button keeps existing modal behavior */}
              <motion.div whileHover={prefersReducedMotion ? undefined : { y: -1, scale: 1.03 }} whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}>
                <Button
                  onClick={() => setContactOpen(true)}
                  className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[var(--fg)]/90 bg-transparent p-0 text-[var(--fg)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[2px] hover:bg-[var(--fg)]/12"
                  aria-label={t("header.openContactForm")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 flex-shrink-0"
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
                    className="hidden lg:inline-flex h-8 items-center justify-center rounded-lg border-2 border-[var(--fg)]/90 bg-transparent px-3 text-[13px] font-semibold leading-none text-[var(--fg)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[2px] transition hover:border-[var(--fg)] hover:bg-[var(--fg)]/12"
                  >
                    {t("header.loginRegister")}
                  </Link>
                </motion.div>
              ) : (
                <div
                  className="relative hidden lg:block"
                  onMouseEnter={openLogin}
                  onMouseLeave={closeLogin}
                >
                  <motion.div whileHover={prefersReducedMotion ? undefined : { y: -1 }} whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}>
                    <Button className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border-2 border-[var(--fg)]/90 bg-transparent px-3 py-0 text-[var(--fg)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[2px] hover:bg-[var(--fg)]/12">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--fg)]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                        </svg>
                      </span>
                      <span className="max-w-[110px] truncate text-xs font-medium leading-none">
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
                            user?.role === "buyer"
                              ? "/buyer/account"
                              : roleDashboardPath(user?.role ?? "buyer")
                          }
                          className="flex h-10 items-center rounded-md px-3 text-sm font-medium text-[var(--b1)] transition-colors hover:bg-[var(--b2-soft)]/50 hover:text-[var(--b1-mid)]"
                        >
                          {t("header.myAccount")}
                        </Link>

                        <Link
                          to={roleDashboardPath(user?.role ?? "buyer")}
                          className="flex h-10 items-center rounded-md px-3 text-sm font-medium text-[var(--b1)] transition-colors hover:bg-[var(--b2-soft)]/50 hover:text-[var(--b1-mid)]"
                        >
                          {t("header.dashboard")}
                        </Link>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex h-10 w-full items-center rounded-md px-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                        >
                          {t("header.logout")}
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
                aria-label={t("header.toggleMenu")}
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
                  aria-label={t("header.closeMenu")}
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
                        {translateHeaderValue(item.label)}
                      </Link>

                      {item.mega && (
                        <Button
                          type="button"
                          onClick={() => toggleMobileSection(item.label)}
                          className="text-[var(--fg)] text-base leading-none"
                          aria-label={t("header.toggleOptions", { item: translateHeaderValue(item.label) })}
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
                                  {translateHeaderValue(section.title)}
                                </div>
                                <ul className="space-y-1">
                                  {section.items.map((sub) => (
                                    <li key={sub} className="text-sm text-[var(--b1-mid)]">
                                      {translateHeaderValue(sub)}
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
                    {t("header.postProperty")}
                  </Link>

                  {!isAuthenticated ? (
                    <>
                      <Link
                        to="/login"
                        onClick={closeMobileMenu}
                        className="flex h-11 w-full items-center justify-center rounded-lg border border-[var(--b1-mid)] px-4 text-center font-medium text-[var(--b1-mid)]"
                      >
                        {t("header.loginRegister")}
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to={roleDashboardPath(user?.role ?? "buyer")}
                        onClick={closeMobileMenu}
                        className="flex h-11 w-full items-center justify-center rounded-lg border border-[var(--b1-mid)] px-4 text-center font-medium text-[var(--b1-mid)]"
                      >
                        {t("header.dashboard")}
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          closeMobileMenu();
                          handleLogout();
                        }}
                        className="flex h-11 w-full items-center justify-center rounded-lg border border-red-500 bg-white px-4 text-center font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                      >
                        {t("header.logout")}
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
                    {t("header.contactUs")}
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
