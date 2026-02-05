import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Modal from "../Modal/Modal";
import ContactPopup from "../ContactPopup/ContactPopup";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Farmhouse / Farmland", href: "/farmhouse" },
  { label: "Agriculture Land", href: "/agriculture-land" },
  { label: "Resort Properties", href: "/resort-properties" },
  { label: "Rent Farmhouse", href: "/rent-farmhouse" },
];

const HeaderNav: React.FC<{
  items: NavItem[];
  isMobile?: boolean;
  onNavigate?: () => void;
}> = ({ items, isMobile = false, onNavigate }) => {
  const location = useLocation();
  const [hovered, setHovered] = useState<string | null>(null);
  const activePath = hovered ?? location.pathname;

  return (
    <nav
      className={`${
        isMobile
          ? "flex flex-col gap-6 items-center px-6"
          : "hidden md:flex items-center gap-8"
      } font-medium`}
    >
      {items.map((item) => {
        const isActive = activePath === item.href;

        return (
          <Link
            key={item.label}
            to={item.href}
            onClick={onNavigate}
            onMouseEnter={() => setHovered(item.href)}
            onMouseLeave={() => setHovered(null)}
            className={`relative inline-block pb-1 transition-colors duration-300 ${
              isActive ? "text-brand" : "text-fg"
            } hover:text-brand after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[var(--b2)] after:transition-transform after:duration-300 after:origin-center ${
              isActive ? "after:scale-x-100" : "after:scale-x-0"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full flex justify-center">
        <div className="w-[94%] max-w-[1320px] header-bg shadow-lg rounded-b-2xl px-4 sm:px-6 md:px-10">
          <div className="flex h-[72px] items-center justify-between">
            <div className="flex items-center gap-2 text-fg font-bold text-lg sm:text-xl">
              <span className="text-2xl text-brand">P</span>
              <span>PropDown</span>
            </div>

            <HeaderNav items={NAV_ITEMS} />

            <button
              onClick={() => setContactOpen(true)}
              className="hidden md:inline-flex px-6 py-2 rounded-full btn-brand font-semibold shadow-md transition"
            >
              Get Started
            </button>

            <button
              className="md:hidden text-fg text-2xl"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
            >
              ☰
            </button>
          </div>

          {menuOpen && (
            <div className="md:hidden mt-4 pb-8 border-t border-white/30">
              <div className="max-w-md mx-auto pt-6">
                <HeaderNav
                  items={NAV_ITEMS}
                  isMobile
                  onNavigate={() => setMenuOpen(false)}
                />
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setContactOpen(true);
                  }}
                  className="mt-8 mx-auto block px-10 py-3 rounded-full btn-brand font-semibold shadow-md transition"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

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
