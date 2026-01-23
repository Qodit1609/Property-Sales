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
    {
      src: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
      alt: "Instagram",
    },
    {
      src: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
      alt: "Facebook",
    },
    {
      src: "https://cdn-icons-png.flaticon.com/512/733/733585.png",
      alt: "WhatsApp",
    },
    {
      src: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
      alt: "YouTube",
    },
  ];

  return (
    <footer className="w-full text-white bg-gradient-to-r from-[#006557] via-[#00897b] to-[#43cea2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <img
              src="https://dummyimage.com/200x80/006557/ffffff&text=1+Bigha"
              alt="1bigha logo"
              className="h-14 mb-4"
            />
            <p className="text-sm text-white/90 max-w-xs">
              Easiest way to find your dream land
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li
                  key={item.label}
                  className="text-sm text-white/90 hover:text-white transition cursor-pointer"
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>

            <ul className="space-y-3 text-sm text-white/90">
              <li className="flex items-center gap-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/732/732200.png"
                  alt="Email"
                  className="w-4 h-4"
                />
                info@1bigha.com
              </li>

              <li className="flex items-center gap-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/724/724664.png"
                  alt="Phone"
                  className="w-4 h-4"
                />
                +91 9039055488
              </li>

              <li className="flex items-start gap-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                  alt="Location"
                  className="w-4 h-4 mt-1"
                />
                <span>
                  1Bigha Gwali Palasia, Mhow Indore, M.P.
                </span>
              </li>
            </ul>

            <div className="flex gap-4 mt-5">
              {socialIcons.map((icon) => (
                <a
                  key={icon.alt}
                  href="#"
                  aria-label={icon.alt}
                  className="bg-white p-2 rounded-full shadow-md hover:scale-110 transition"
                >
                  <img
                    src={icon.src}
                    alt={icon.alt}
                    className="w-5 h-5 object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black/10 text-center py-3 text-xs sm:text-sm text-white/90">
        © 2025 - 1bigha.com - All Rights Reserved | Developed by{" "}
        <span className="font-semibold text-white">Nexolvia</span>
      </div>
    </footer>
  );
};

export default Footer;
