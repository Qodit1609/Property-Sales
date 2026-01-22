import React, { useState } from "react";

/* ---------- Types ---------- */
interface NavItem {
  label: string;
  href: string;
}

/* ---------- Navigation Data ---------- */
const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Farmhouse / Farmland", href: "/farmhouse-farmland" },
  { label: "Agriculture Land", href: "/agriculture-land" },
  { label: "Resort Properties", href: "/resort-properties" },
  { label: "Rent Farmhouse", href: "/rent-farmhouse" },
];

/* ---------- Sub Components ---------- */
const HeaderNav: React.FC<{ items: NavItem[]; isMobile?: boolean }> = ({
  items,
  isMobile = false,
}) => (
  <nav
    className={`${
      isMobile
        ? "flex flex-col gap-4 text-center"
        : "hidden md:flex items-center gap-8"
    } text-white font-medium`}
  >
    {items.map((item) => (
      <a
        key={item.label}
        href={item.href}
        className="hover:text-white/80 transition"
      >
        {item.label}
      </a>
    ))}
  </nav>
);

/* ---------- Main Header ---------- */
const Header: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full flex justify-center">
      <div
        className="
          w-[94%]
          max-w-[1320px]
          bg-gradient-to-r from-[#006557] via-[#00897b] to-[#43cea2]
          shadow-lg
          rounded-b-2xl
          px-4 sm:px-6 md:px-10
        "
      >
        {/* Top Bar */}
        <div className="flex h-[72px] items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 text-white font-bold text-lg sm:text-xl">
            <span className="text-2xl">P</span>
            <span>PropDown</span>
          </div>

          {/* Desktop Nav */}
          <HeaderNav items={NAV_ITEMS} />

          {/* CTA (Desktop) */}
          <a
            href="/contact"
            className="hidden md:inline-flex px-6 py-2 rounded-full bg-white text-[#006557] font-semibold shadow-md hover:bg-[#006557] hover:text-white transition border-2 border-white hover:border-[#006557]"
          >
            Connect With Us
          </a>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden pb-6 pt-4 border-t border-white/20">
            <HeaderNav items={NAV_ITEMS} isMobile />
            <a
              href="/contact"
              className="mt-4 mx-auto flex w-fit px-6 py-2 rounded-full bg-white text-[#006557] font-semibold shadow-md"
            >
              Connect With Us
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
