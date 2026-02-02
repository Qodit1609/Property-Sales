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
    <footer className="bg-gradient-to-r from-[#2f6f25] via-[#347928] to-[#2f6f25] text-[#FFFBE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 text-center lg:text-left">
          <div className="flex flex-col items-center lg:items-start">
            <img
              src="https://dummyimage.com/200x80/347928/ffffff&text=1+Bigha"
              alt="1bigha logo"
              className="h-14 mb-4"
            />
            <p className="text-sm text-[#FFFBE6]/90 max-w-xs">
              The easiest way to find, buy, and invest in your dream land.
            </p>
          </div>

          <div className="flex flex-col items-center lg:items-start">
            <h3 className="text-lg font-semibold mb-4 tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li
                  key={item.label}
                  className="text-sm text-[#FFFBE6]/80 hover:text-[#FCCD2A] transition cursor-pointer"
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center lg:items-start max-w-xs mx-auto lg:mx-0">
            <h3 className="text-lg font-semibold mb-4 tracking-wide">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-[#FFFBE6]/80">
              <li className="flex items-center justify-center lg:justify-start gap-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/732/732200.png"
                  className="w-4 h-4"
                />
                info@1bigha.com
              </li>

              <li className="flex items-center justify-center lg:justify-start gap-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/724/724664.png"
                  className="w-4 h-4"
                />
                +91 9039055488
              </li>

              <li className="flex items-start justify-center lg:justify-start gap-2 text-center lg:text-left">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                  className="w-4 h-4 mt-1"
                />
                <span>
                  Gwali Palasia, Mhow Indore, M.P.
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center lg:items-start">
            <h3 className="text-lg font-semibold mb-4 tracking-wide">
              Follow Us
            </h3>
            <div className="flex justify-center lg:justify-start gap-4">
              {socialIcons.map((icon) => (
                <a
                  key={icon.alt}
                  href="#"
                  aria-label={icon.alt}
                  className="bg-[#FFFBE6] p-2 rounded-full shadow hover:ring-2 hover:ring-[#FCCD2A] hover:scale-110 transition"
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
      </div>

      <div className="border-t border-[#FFFBE6]/20 py-4 text-center text-xs sm:text-sm text-[#FFFBE6]/80 px-4">
        © 2025 1bigha.com · All Rights Reserved · Developed by{" "}
        <span className="text-[#FCCD2A] font-semibold">
          Nexolvia
        </span>
      </div>
    </footer>
  );
};

export default Footer;
