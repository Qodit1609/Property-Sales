import React, { useState } from "react";

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

const HeaderNav: React.FC<{ items: NavItem[]; isMobile?: boolean }> = ({
  items,
  isMobile = false,
}) => (
  <nav
    className={`${
      isMobile
        ? "flex flex-col gap-4 text-center"
        : "hidden md:flex items-center gap-8"
    } text-white font-medium font-serif`}
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

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full flex justify-center font-serif">
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
        <div className="flex h-[72px] items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-lg sm:text-xl">
            <span className="text-2xl">P</span>
            <span>PropDown</span>
          </div>

          <HeaderNav items={NAV_ITEMS} />

          <a
            href="/contact"
            className="hidden md:inline-flex px-6 py-2 rounded-full bg-white text-[#006557] font-semibold shadow-md hover:bg-[#006557] hover:text-white transition border-2 border-white hover:border-[#006557]"
          >
            Connect With Us
          </a>

          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
          >
            ☰
          </button>
        </div>

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
