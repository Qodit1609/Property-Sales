import React, { useEffect, useRef, useState } from "react";
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

const Header: React.FC<HeaderProps> = ({ forceSolid = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const isAuthenticated = Boolean(token && user);

  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const visibleNavItems = NAV_ITEMS;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50">
        <div
          className={`px-4 sm:px-6 md:px-10 transition-all duration-300 ${
           scrolled || forceSolid
  ? "header-bg shadow-xl backdrop-blur-md"
  : "header-bg/80 backdrop-blur-sm"
          }`}
        >
          <div className="flex h-[68px] items-center justify-between">
            <Link
              to="/"
              className="font-semibold text-lg sm:text-xl lg:text-2xl text-[var(--fg)] tracking-wide"
            >
              BhoomiWala
            </Link>

            {/* Desktop Navigation with Mega Menu */}
            <nav className="hidden lg:flex items-center gap-8">
              {visibleNavItems.map((item) => {
                const isActive = location.pathname === item.href;

                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => item.mega && openMega(item.label)}
                    onMouseLeave={closeMega}
                  >
                    <Link
                      to={item.href}
                      className={`font-medium transition-colors duration-300 ${
                        isActive
                          ? "text-[var(--b2)]"
                          : "text-[var(--fg)]"
                      } hover:text-[var(--b2)]`}
                    >
                      {item.label}
                    </Link>

                    {item.mega && activeMega === item.label && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[950px] bg-[var(--white)] rounded-xl shadow-2xl grid grid-cols-[220px_1fr_260px] overflow-hidden"
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
                                    <a
                                      href="#"
                                      className="hover:text-[var(--b1-mid)] transition"
                                    >
                                      {sub}
                                    </a>
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
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2.5">
              {/* Post Property CTA restored (button only, not in nav) */}
              <Link
                to="/post-property/basic"
                className="hidden sm:flex items-center gap-1.5 bg-[var(--white)] text-[var(--b1)] px-3 py-1.5 rounded-lg text-xs sm:text-sm shadow"
              >
                Post Property
                <span className="text-[9px] bg-[var(--b2)] text-[var(--b1)] px-1.5 py-[1px] rounded">
                  FREE
                </span>
              </Link>

              {/* Contact button keeps existing modal behavior */}
              <Button
                onClick={() => setContactOpen(true)}
                className="hidden sm:flex w-8 h-8 rounded-lg border-2 border-[var(--fg)] items-center justify-center text-[var(--fg)] p-0"
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

              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-3 py-1.5 rounded-full btn-brand text-xs sm:text-sm font-semibold shadow-md transition"
                >
                  Login / Register
                </Link>
              ) : (
                <div
                  className="relative hidden sm:block"
                  onMouseEnter={openLogin}
                  onMouseLeave={closeLogin}
                >
                  <Button className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--fg)] px-3 py-1.5 text-[var(--fg)]">
                    <span className="w-7 h-7 rounded-full border border-[var(--fg)] flex items-center justify-center">
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
                    <span className="text-sm font-medium max-w-[140px] truncate">
                      {user?.name}
                    </span>
                  </Button>

                  {loginOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-[var(--white)] rounded-lg shadow-xl p-3 space-y-2">
                      <Link
                        to={
                          user?.role === "buyer" || user?.role === "user"
                            ? "/buyer/account"
                            : roleDashboardPath(user?.role ?? "buyer")
                        }
                        className="block text-sm text-[var(--b1)] hover:text-[var(--b1-mid)]"
                      >
                        My Account
                      </Link>

                      <Link
                        to={roleDashboardPath(user?.role ?? "buyer")}
                        className="block text-sm text-[var(--b1)] hover:text-[var(--b1-mid)]"
                      >
                        Dashboard
                      </Link>

                      <Button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left block text-sm text-[var(--error)] hover:opacity-80"
                      >
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile menu toggle */}
              <Button
                className="lg:hidden text-[var(--fg)] text-2xl"
                onClick={() => setMenuOpen(true)}
                aria-label="Toggle Menu"
              >
                ☰
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-[var(--b1)]/60"
          onClick={() => setMenuOpen(false)}
        />

        <div
          className={`absolute top-0 right-0 h-full w-[280px] bg-[var(--white)] shadow-2xl transform transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 h-[68px] border-b border-[var(--b2-soft)]">
            <span className="font-semibold text-lg text-[var(--b1)]">
              BhoomiWala
            </span>

            <Button
              onClick={() => setMenuOpen(false)}
              className="text-xl text-[var(--b1)]"
            >
              ✕
            </Button>
          </div>

          <div className="flex flex-col p-6 space-y-6">
            {visibleNavItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-[16px] font-medium text-[var(--b1)] hover:text-[var(--b1-mid)]"
              >
                {item.label}
              </Link>
            ))}

            <div className="border-t border-[var(--b2-soft)] pt-6 space-y-4">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="w-full block text-center border border-[var(--b1-mid)] text-[var(--b1-mid)] py-2 rounded-lg"
                  >
                    Login / Register
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={roleDashboardPath(user?.role ?? "buyer")}
                    onClick={() => setMenuOpen(false)}
                    className="w-full block text-center border border-[var(--b1-mid)] text-[var(--b1-mid)] py-2 rounded-lg"
                  >
                    Dashboard
                  </Link>

                  <Button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full border border-[var(--error)] text-[var(--error)] py-2 rounded-lg"
                  >
                    Logout
                  </Button>
                </>
              )}

              <Button
                onClick={() => {
                  setMenuOpen(false);
                  setContactOpen(true);
                }}
                className="w-full border border-[var(--b1-mid)] text-[var(--b1-mid)] py-2 rounded-lg"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title="Contact Us"
      >
        <ContactPopup />
      </Modal>
    </>
  );
};

export default Header;
