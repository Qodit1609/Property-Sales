import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Modal from "../Modal/Modal";
import ContactPopup from "../ContactPopup/ContactPopup";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { logout } from "../../features/auth/authSlice";
import type { AppRole } from "../../features/auth/roleTypes";
import type { Property } from "../../features/properties/propertyType";
import api, { API_ENDPOINTS } from "../../lib/apiClient";
import { mapPropertyListPayload } from "../../features/properties/propertyAPI";
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
        items: [],
      },
      {
        title: "Property Type",
        items: [],
      },
      {
        title: "Budget",
        items: [],
      },
      { title: "Explore", items: [] },
    ],
  },
  {
    label: "Agriculture Land",
    href: "/agriculture-land",
    mega: [
      {
        title: "Land Types",
        items: [],
      },
      { title: "Investment", items: [] },
      {
        title: "Locations",
        items: [],
      },
      { title: "Guides", items: [] },
    ],
  },
  {
    label: "Resort Properties",
    href: "/resort-properties",
    mega: [
      { title: "Resort Type", items: [] },
      { title: "Locations", items: [] },
      { title: "Investment", items: [] },
      { title: "Insights", items: [] },
    ],
  },
  {
    label: "Rent Farmhouse",
    href: "/rent-farmhouse",
    mega: [
      { title: "Occasion", items: [] },
      { title: "Budget", items: [] },
      { title: "Locations", items: [] },
      { title: "Explore", items: [] },
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

const normalizeValue = (value: string): string => value.trim().toLowerCase();

const toTitleCase = (value: string) =>
  value
    .split(" ")
    .map((part) => (part ? `${part.charAt(0).toUpperCase()}${part.slice(1)}` : part))
    .join(" ");

const formatBudgetLabel = (value: number) => {
  if (value >= 1_00_00_000) {
    const cr = Math.round((value / 1_00_00_000) * 10) / 10;
    return `Under ${Number.isInteger(cr) ? cr.toFixed(0) : cr}Cr`;
  }
  if (value >= 1_00_000) {
    const l = Math.round((value / 1_00_000) * 10) / 10;
    return `Under ${Number.isInteger(l) ? l.toFixed(0) : l}L`;
  }
  const k = Math.round((value / 1_000) * 10) / 10;
  return `Under ${Number.isInteger(k) ? k.toFixed(0) : k}k`;
};

const buildBudgetRanges = (prices: number[]): string[] => {
  const unique = Array.from(new Set(prices.filter((price) => Number.isFinite(price) && price > 0))).sort(
    (a, b) => a - b
  );

  if (unique.length === 0) return [];

  const points = [Math.floor(unique.length * 0.33), Math.floor(unique.length * 0.66), unique.length - 1]
    .map((index) => unique[Math.max(0, Math.min(index, unique.length - 1))])
    .filter((value): value is number => Number.isFinite(value));

  return Array.from(new Set(points)).map(formatBudgetLabel).slice(0, 4);
};

const matchesNavCategory = (property: Property, navLabel: string) => {
  const source = normalizeValue(`${property.propertyType ?? ""} ${property.listingType ?? ""}`);

  if (navLabel === "Farmhouse / Farmland") {
    return (
      source.includes("farmhouse") ||
      source.includes("farmland") ||
      source.includes("farm land")
    );
  }

  if (navLabel === "Agriculture Land") {
    return (
      source.includes("agriculture") ||
      source.includes("agricultural") ||
      source.includes("land")
    );
  }

  if (navLabel === "Resort Properties") {
    return source.includes("resort");
  }

  if (navLabel === "Rent Farmhouse") {
    return (
      source.includes("rent farmhouse") ||
      (source.includes("farmhouse") && source.includes("rent"))
    );
  }

  return true;
};

const getFilteredMenuData = (navLabel: string, properties: Property[], fallbackMega: MegaSection[]): MegaSection[] => {
  const scoped = properties.filter((property) => matchesNavCategory(property, navLabel));
  if (scoped.length === 0) return fallbackMega;

  const locations = Array.from(
    new Set(
      scoped
        .map((property) => property.location?.city ?? property.location?.state)
        .filter((value): value is string => Boolean(value && value.trim()))
        .map((value) => toTitleCase(value.trim()))
    )
  ).slice(0, 8);

  const propertyTypes = Array.from(
    new Set(
      scoped
        .map((property) => property.propertyType)
        .filter((value): value is string => Boolean(value && value.trim()))
        .map((value) => toTitleCase(value.trim()))
    )
  ).slice(0, 8);

  const budgets = buildBudgetRanges(scoped.map((property) => property.price));

  const tags = Array.from(
    new Set(
      scoped
        .flatMap((property) => property.tags ?? [])
        .filter((value): value is string => Boolean(value && value.trim()))
        .map((value) => toTitleCase(value.trim()))
    )
  ).slice(0, 8);

  const sectionValueMap = (title: string): string[] => {
    if (title === "Popular Locations" || title === "Locations") {
      return locations;
    }
    if (title === "Property Type" || title === "Land Types" || title === "Resort Type") {
      return propertyTypes;
    }
    if (title === "Budget" || title === "Investment") {
      return budgets;
    }
    return tags;
  };

  const mapped = fallbackMega.map((section) => {
    const dynamicItems = sectionValueMap(section.title);
    return {
      ...section,
      items: dynamicItems.length > 0 ? dynamicItems : section.items,
    };
  });

  const hasDynamicValue = mapped.some((section, index) =>
    section.items.some((item) => !fallbackMega[index].items.includes(item))
  );

  return hasDynamicValue ? mapped : fallbackMega;
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

/** Left-column mega menu art: one distinct illustration per top-level nav item. */
const MegaMenuLeftDecor: React.FC<{
  prefersReducedMotion: boolean | null;
  navLabel: string;
}> = ({ prefersReducedMotion, navLabel }) => {
  const floatY = prefersReducedMotion
    ? undefined
    : {
        y: [0, -4, 0],
      };
  const floatSlow = { duration: 4.5, repeat: Infinity, ease: "easeInOut" as const };
  const floatMed = { duration: 3.8, repeat: Infinity, ease: "easeInOut" as const };

  let inner: React.ReactNode;

  switch (navLabel) {
    case "Agriculture Land":
      inner = (
        <motion.div
          className="w-full max-w-[10rem] 2xl:max-w-[11rem]"
          initial={false}
          animate={floatY}
          transition={floatMed}
        >
          <svg
            viewBox="0 0 140 108"
            className="h-auto w-full overflow-visible drop-shadow-sm"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="112" cy="20" r="10" fill="var(--b2)" opacity={0.92} />
            <path
              d="M0 90 Q40 68 80 82 T140 76 L140 108 L0 108 Z"
              fill="var(--b2)"
              opacity={0.45}
            />
            <path
              d="M0 96 Q55 78 100 90 T140 86 L140 108 L0 108 Z"
              fill="var(--brown)"
              opacity={0.18}
            />
            {[0, 1, 2].map((row) => (
              <g key={row} transform={`translate(0, ${row * 8})`}>
                {[18, 38, 58, 78, 98].map((x) => (
                  <path
                    key={`${row}-${x}`}
                    d={`M${x} ${68 + row * 5} l3 -8 l3 8 z`}
                    fill="var(--b1-mid)"
                    opacity={0.75 - row * 0.12}
                  />
                ))}
              </g>
            ))}
            <path
              d="M8 84 H132"
              stroke="var(--brown)"
              strokeWidth="1"
              opacity={0.35}
              strokeDasharray="4 3"
            />
            <path
              d="M12 92 H128"
              stroke="var(--b1-mid)"
              strokeWidth="0.8"
              opacity={0.25}
            />
          </svg>
        </motion.div>
      );
      break;
    case "Resort Properties":
      inner = (
        <motion.div
          className="w-full max-w-[10rem] 2xl:max-w-[11rem]"
          initial={false}
          animate={floatY}
          transition={floatSlow}
        >
          <svg
            viewBox="0 0 140 108"
            className="h-auto w-full overflow-visible drop-shadow-sm"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="118" cy="18" r="11" fill="var(--b2)" opacity={0.95} />
            <path
              d="M0 88 Q45 60 90 76 T140 70 L140 108 L0 108 Z"
              fill="var(--b2)"
              opacity={0.4}
            />
            <rect
              x="24"
              y="78"
              width="92"
              height="22"
              rx="4"
              fill="var(--b1-mid)"
              opacity={0.22}
            />
            <rect
              x="28"
              y="82"
              width="84"
              height="14"
              rx="2"
              fill="var(--b2)"
              opacity={0.55}
            />
            <rect x="66" y="52" width="4" height="34" fill="var(--b1)" opacity={0.75} />
            <path
              d="M48 52 Q68 32 88 52 Z"
              fill="var(--b1-mid)"
              opacity={0.85}
            />
            <path
              d="M22 48 L32 38 L42 48 L52 36 L62 48 L72 34 L82 48 L92 36 L102 48 L112 38 L122 48"
              fill="none"
              stroke="var(--b1)"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity={0.55}
            />
            <rect x="38" y="58" width="22" height="18" rx="2" fill="var(--b1)" opacity={0.55} />
            <path d="M38 58 L49 48 L60 58 Z" fill="var(--b1-mid)" opacity={0.8} />
          </svg>
        </motion.div>
      );
      break;
    case "Rent Farmhouse":
      inner = (
        <motion.div
          className="w-full max-w-[10rem] 2xl:max-w-[11rem]"
          initial={false}
          animate={
            prefersReducedMotion
              ? undefined
              : { y: [0, -3, 0], rotate: [0, 0.4, 0] }
          }
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            viewBox="0 0 140 108"
            className="h-auto w-full overflow-visible drop-shadow-sm"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="108" cy="24" r="10" fill="var(--b2)" opacity={0.88} />
            <path
              d="M0 90 Q38 64 76 80 T140 72 L140 108 L0 108 Z"
              fill="var(--b2)"
              opacity={0.5}
            />
            <rect x="44" y="56" width="40" height="30" rx="2" fill="var(--b1)" opacity={0.85} />
            <path d="M38 56 L64 36 L90 56 Z" fill="var(--b1-mid)" opacity={0.92} />
            <rect x="58" y="68" width="12" height="18" rx="1" fill="var(--b2-soft)" />
            <rect
              x="88"
              y="38"
              width="34"
              height="38"
              rx="3"
              fill="var(--white)"
              stroke="var(--b1-mid)"
              strokeWidth="1.8"
              opacity={0.95}
            />
            <path
              d="M94 38 h22"
              stroke="var(--b1-mid)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="98" cy="32" r="2" fill="var(--b1-mid)" opacity={0.5} />
            <circle cx="112" cy="32" r="2" fill="var(--b1-mid)" opacity={0.5} />
            {[0, 1, 2].map((i) => (
              <line
                key={i}
                x1="94"
                y1={50 + i * 8}
                x2="116"
                y2={50 + i * 8}
                stroke="var(--brown)"
                strokeWidth="0.9"
                opacity={0.35}
              />
            ))}
          </svg>
        </motion.div>
      );
      break;
    case "Farmhouse / Farmland":
    default:
      inner = (
        <motion.div
          className="w-full max-w-[10rem] 2xl:max-w-[11rem]"
          initial={false}
          animate={floatY}
          transition={floatSlow}
        >
          <svg
            viewBox="0 0 140 108"
            className="h-auto w-full overflow-visible drop-shadow-sm"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="118" cy="22" r="11" fill="var(--b2)" opacity={0.9} />
            <g stroke="var(--b1-mid)" strokeWidth="1.2" opacity={0.35}>
              <line x1="118" y1="10" x2="118" y2="6" />
              <line x1="106" y1="22" x2="102" y2="22" />
              <line x1="130" y1="22" x2="134" y2="22" />
              <line x1="110" y1="12" x2="107" y2="9" />
              <line x1="126" y1="12" x2="129" y2="9" />
              <line x1="110" y1="32" x2="107" y2="35" />
              <line x1="126" y1="32" x2="129" y2="35" />
            </g>
            <path
              d="M0 88 Q35 62 70 78 T140 70 L140 108 L0 108 Z"
              fill="var(--b2)"
              opacity={0.55}
            />
            <path
              d="M0 95 Q50 72 100 85 T140 82 L140 108 L0 108 Z"
              fill="var(--b1-mid)"
              opacity={0.28}
            />
            <rect x="48" y="58" width="44" height="32" rx="2" fill="var(--b1)" opacity={0.88} />
            <path d="M42 58 L70 38 L98 58 Z" fill="var(--b1-mid)" opacity={0.95} />
            <rect x="62" y="72" width="16" height="18" rx="1" fill="var(--b2-soft)" />
          </svg>
        </motion.div>
      );
  }

  return (
    <div
      className="mt-4 flex min-h-[5.5rem] flex-1 flex-col items-center justify-end"
      aria-hidden
    >
      {inner}
    </div>
  );
};

/** Decorative illustration for mega menu right column (between copy and Post Property). */
const MegaMenuSellDecor: React.FC<{ prefersReducedMotion: boolean | null }> = ({
  prefersReducedMotion,
}) => (
  <div
    className="flex min-h-[4.5rem] flex-1 flex-col items-center justify-center py-1"
    aria-hidden
  >
    <motion.div
      className="w-full max-w-[9.5rem] 2xl:max-w-[10.5rem]"
      initial={false}
      animate={
        prefersReducedMotion
          ? undefined
          : {
              scale: [1, 1.04, 1],
              opacity: [0.88, 1, 0.88],
            }
      }
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        viewBox="0 0 120 100"
        className="h-auto w-full overflow-visible drop-shadow-sm"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="28"
          y="44"
          width="64"
          height="46"
          rx="3"
          fill="none"
          stroke="var(--b1-mid)"
          strokeWidth="2.2"
        />
        <path
          d="M22 44 L60 20 L98 44"
          fill="none"
          stroke="var(--b1-mid)"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <rect x="52" y="64" width="16" height="26" rx="1" fill="var(--b1-mid)" opacity={0.28} />
        <motion.g
          initial={false}
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  y: [0, -3, 0],
                }
          }
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="80" cy="18" r="5.5" fill="none" stroke="var(--brown)" strokeWidth="2" />
          <path
            d="M86 18 h10 v6 h-4 v10 h-4 v-6 h-4 v-4 Z"
            fill="var(--brown)"
            opacity={0.88}
          />
        </motion.g>
      </svg>
    </motion.div>
  </div>
);

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
  const [menuProperties, setMenuProperties] = useState<Property[]>([]);

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
    let active = true;

    void (async () => {
      try {
        const response = await api.get(API_ENDPOINTS.PROPERTY.LIST, {
          params: { page: 1, limit: 50 },
        });
        const mapped = mapPropertyListPayload(response.data);
        if (active && mapped.length > 0) {
          setMenuProperties(mapped);
        }
      } catch {
        // Keep existing static mega menu content when API is unavailable.
      }
    })();

    return () => {
      active = false;
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

  const visibleNavItems = NAV_ITEMS.map((item) => {
    if (!item.mega || menuProperties.length === 0) return item;
    return {
      ...item,
      mega: getFilteredMenuData(item.label, menuProperties, item.mega),
    };
  });

  const handleMegaItemClick = (item: NavItem, sectionTitle: string, value: string) => {
    const params = new URLSearchParams();
    params.set("category", normalizeValue(item.label).replace(/\s*\/\s*/g, " ").replace(/\s+/g, "-"));

    if (sectionTitle === "Popular Locations" || sectionTitle === "Locations") {
      params.set("location", value);
    } else if (sectionTitle === "Property Type" || sectionTitle === "Land Types" || sectionTitle === "Resort Type") {
      params.set("type", value);
    } else if (sectionTitle === "Budget" || sectionTitle === "Investment") {
      params.set("budget", value);
    } else {
      params.set("tag", value);
    }

    navigate(`${item.href}?${params.toString()}`);
    setActiveMega(null);
  };

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
                {t("header.brand")}
              </Link>
            </motion.div>

            {/* Desktop Navigation with Mega Menu */}
            <motion.nav
              initial="hidden"
              animate="visible"
              variants={navStagger}
              className="relative hidden xl:flex min-w-0 flex-1 items-center justify-center gap-4 2xl:gap-8 px-3"
            >
              {visibleNavItems.map((item) => {
                const isActive = location.pathname === item.href;

                return (
                  <motion.div
                    key={item.label}
                    variants={navItemMotion}
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
                        <div className="bg-[var(--b2-soft)] p-6 flex flex-col h-full min-h-0 text-[var(--b1)]">
                          <div className="shrink-0 space-y-4">
                            <div className="font-semibold">{t("header.ownerOfferings")}</div>
                            <div>{t("header.articlesNews")}</div>
                          </div>
                          <MegaMenuLeftDecor
                            prefersReducedMotion={prefersReducedMotion}
                            navLabel={item.label}
                          />
                        </div>

                        <div className="p-8 grid grid-cols-2 gap-8 text-[var(--b1)]">
                          {item.mega.map((section) => (
                            <div key={section.title}>
                              <h4 className="font-semibold mb-3 text-[14px] uppercase tracking-wide">
                                {translateHeaderValue(section.title)}
                              </h4>
                              <ul className="space-y-2 text-sm">
                                {(section.items ?? []).map((sub) => (
                                  <li key={sub}>
                                    <button
                                      type="button"
                                      className="hover:text-[var(--b1-mid)] transition"
                                      onClick={() => handleMegaItemClick(item, section.title, sub)}
                                    >
                                      {translateHeaderValue(sub)}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        <div className="bg-[var(--b2-soft)] p-6 flex flex-col h-full min-h-0 justify-between gap-3">
                          <div className="shrink-0">
                            <h3 className="font-semibold text-lg text-[var(--b1)]">
                              {t("header.sellOrRentFaster")}
                            </h3>
                            <p className="text-sm text-[var(--brown)] mt-2">
                              {t("header.listPropertyFree")}
                            </p>
                          </div>

                          <MegaMenuSellDecor prefersReducedMotion={prefersReducedMotion} />

                          {/* Preserve routing for Post Property */}
                          <Link
                            to="/post-property/basic"
                            className="shrink-0 btn-brand px-4 py-2 rounded-lg shadow text-center"
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
                              : user?.role === "seller"
                                ? "/seller/profile"
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
                  {t("header.brand")}
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
                                  {(section.items ?? []).map((sub) => (
                                    <li key={sub}>
                                      <button
                                        type="button"
                                        className="text-sm text-[var(--b1-mid)]"
                                        onClick={() => {
                                          closeMobileMenu();
                                          handleMegaItemClick(item, section.title, sub);
                                        }}
                                      >
                                        {translateHeaderValue(sub)}
                                      </button>
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
