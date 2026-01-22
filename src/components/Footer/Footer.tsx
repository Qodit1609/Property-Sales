import React from "react";

type LinkItem = {
  label: string;
};

type IconItem = {
  src: string;
  alt: string;
};

const Footer: React.FC = () => {
  const quickLinks: LinkItem[] = [
    { label: "Home" },
    { label: "About" },
    { label: "Blogs" },
    { label: "Farm House" },
    { label: "Farmland" },
    { label: "Rental" },
  ];

  const socialIcons: IconItem[] = [
    { src: "/instagram.png", alt: "Instagram" },
    { src: "/facebook.png", alt: "Facebook" },
    { src: "/whatsapp.png", alt: "WhatsApp" },
    { src: "/youtube.png", alt: "YouTube" },
  ];

  return (
    <footer className="bg-green-800 text-sm w-full">
      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        {/* Logo & Tagline */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <img
            src="/logo.png"
            alt="1bigha"
            className="h-14 mb-3 mx-auto md:mx-0"
          />
          <p className="text-green-200 max-w-xs">
            Easiest way to find your dream land
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
          <ul className="space-y-2">
            {quickLinks.map((item) => (
              <li
                key={item.label}
                className="text-green-200 hover:text-white cursor-pointer transition text-base"
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-white font-semibold mb-4 text-lg">Contact Us</h3>
          <ul className="space-y-3 text-green-200 text-base">
            <li className="flex items-center gap-2">
              <img src="/mail.png" alt="Email" className="w-4 h-4" />
              info@1bigha.com
            </li>
            <li className="flex items-center gap-2">
              <img src="/phone.png" alt="Phone" className="w-4 h-4" />
              +91 9039055488
            </li>
            <li className="flex items-start gap-2">
              <img src="/location.png" alt="Location" className="w-4 h-4 mt-1" />
              1Bigha Gwali Palasia, Mhow Indore M.P.
            </li>
          </ul>
          {/* Social Icons */}
          <div className="flex gap-3 mt-4">
            {socialIcons.map((icon) => (
              <a
                key={icon.alt}
                href="#"
                className="bg-white p-2 rounded-full cursor-pointer hover:scale-110 transition border border-green-200 shadow-sm"
                aria-label={icon.alt}
              >
                <img
                  src={icon.src}
                  alt={icon.alt}
                  className="w-5 h-5"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-green-300 text-center py-3 text-green-900 text-xs sm:text-sm">
        © 2025 - 1bigha.com - All Rights Reserved | Developed by{' '}
        <span className="font-semibold">Nexolvia</span>
      </div>
    </footer>
  );
};

export default Footer;
