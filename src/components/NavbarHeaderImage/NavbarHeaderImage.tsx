import React from "react";
import { useLocation } from "react-router-dom";

type HeaderConfig = {
  title: string;
  image: string;
};

const HEADER_CONFIG: Record<string, HeaderConfig> = {
  "/farmhouse": {
    title: "Buy Farmhouse in Indore",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
  },
  "/agriculture-land": {
    title: "Buy Agricultural Land in Indore",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
  },
  "/resort-properties": {
    title: "Resort Properties in Madhya Pradesh",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
  },
  "/rent-farmhouse": {
    title: "Rent a Farmhouse Near Indore",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
  },
};

const DEFAULT_HEADER: HeaderConfig = {
  title: "Explore Properties",
  image:
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
};

const NavbarHeaderImage: React.FC = () => {
  const { pathname } = useLocation();

  const { title, image } = HEADER_CONFIG[pathname] ?? DEFAULT_HEADER;

  const parts = title.split("Indore");

  return (
    <section
      className="relative h-[70vh] bg-cover bg-center transition-all duration-500"
      style={{ backgroundImage: `url('${image}')` }}
    >
      <div className="absolute inset-0 bg-[var(--b1)]/70" />

      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <h1 className="text-[var(--fg)] text-3xl md:text-5xl text-center font-serif font-bold">
          {parts.length > 1 ? (
            <>
              {parts[0]}
              <span className="text-[var(--b2)]">Indore</span>
              {parts[1]}
            </>
          ) : (
            title
          )}
        </h1>
      </div>
    </section>
  );
};

export default NavbarHeaderImage;