import React from "react";
import { Link } from "react-router-dom";

type LinkItem = {
  label: string;
  href: string;
};

type IconItem = {
  src: string;
  alt: string;
};

const Footer: React.FC = () => {
  const quickLinks: LinkItem[] = [ 
    { label: "Home", href: "/" },
    { label: "Farmhouse / Farmland", href: "/farmhouse" },
    { label: "Agriculture Land", href: "/agriculture-land" },
    { label: "Resort Properties", href: "/resort-properties" },
    { label: "Rent Farmhouse", href: "/rent-farmhouse" },
    { label: "About", href: "/" },
    { label: "Blogs", href: "/" },
  ];

  const socialIcons: IconItem[] = [
    { src: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png", alt: "Instagram" },
    { src: "https://cdn-icons-png.flaticon.com/512/733/733547.png", alt: "Facebook" },
    { src: "https://cdn-icons-png.flaticon.com/512/733/733585.png", alt: "WhatsApp" },
    { src: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png", alt: "YouTube" },
  ];

  const ICON_BOX = "w-8 h-8 sm:w-9 sm:h-9";
  const ICON_IMG = "w-4 h-4 sm:w-5 sm:h-5";

  return (
    <footer className="footer-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 text-center lg:text-left">
          
          {/* LOGO */}
          <div className="flex flex-col items-center lg:items-start">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="
                mb-4
                px-4 py-2
                text-2xl font-bold text-fg
                rounded-lg
                bg-white/20
                backdrop-blur-md
                hover:bg-white/30
                transition
              "
            >
              Bhoomi Wala
            </Link>

            <p className="text-sm text-fg/80 max-w-xs">
              The easiest way to find, buy, and invest in your dream land.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="flex flex-col items-center lg:items-start">
            <h3 className="text-base font-semibold mb-4 tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="text-sm text-fg/80 hover:text-fg transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="flex flex-col items-center lg:items-start max-w-xs mx-auto lg:mx-0">
            <h3 className="text-base font-semibold mb-4 tracking-wide">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-fg/80">
              <li className="flex items-center justify-center lg:justify-start gap-2">
                <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" className="w-4 h-4" />
                info@1bigha.com
              </li>
              <li className="flex items-center justify-center lg:justify-start gap-2">
                <img src="https://cdn-icons-png.flaticon.com/512/724/724664.png" className="w-4 h-4" />
                +91 9039055488
              </li>
              <li className="flex items-start justify-center lg:justify-start gap-2 text-center lg:text-left">
                <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" className="w-4 h-4 mt-1" />
                <span>Gwali Palasia, Mhow Indore, M.P.</span>
              </li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div className="flex flex-col items-center lg:items-start">
            <h3 className="text-base font-semibold mb-4 tracking-wide">
              Follow Us
            </h3>

            <div className="flex justify-center lg:justify-start gap-3 sm:gap-4">
              {socialIcons.map((icon) => (
                <a
                  key={icon.alt}
                  href="#"
                  aria-label={icon.alt}
                  className={`
                    flex items-center justify-center
                    bg-[var(--b2)] rounded-md
                    ${ICON_BOX}
                    shadow-sm
                    transition-all duration-300
                    hover:scale-110 hover:shadow-md
                  `}
                >
                  <img src={icon.src} alt={icon.alt} className={ICON_IMG} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-white/30 py-4 text-center text-xs sm:text-sm text-fg/80 px-4">
        © 2026 abc.com · All Rights Reserved · Developed by{" "}
        <span className="text-fg font-semibold">TRH</span>
      </div>
    </footer>
  );
};

export default Footer;