import React from "react";
import { useLocation } from "react-router-dom";

const CONFIG: Record<
  string,
  { title: string; image: string }
> = {
  "/farmhouse": {
    title: "Farmhouse / Farmland",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },
  "/agriculture-land": {
    title: "Agriculture Land",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
  },
  "/resort-properties": {
    title: "Resort Properties",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  },
  "/rent-farmhouse": {
    title: "Rent Farmhouse",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
  },
};

const NavbarHeaderImage: React.FC = () => {
  const { pathname } = useLocation();
  const data = CONFIG[pathname];

  if (!data) return null;

  return (
    <section
      className="relative h-[60vh] md:h-[70vh] bg-cover bg-center"
      style={{ backgroundImage: `url(${data.image})` }}
    >
      <div className="absolute inset-0 bg-[var(--b1-mid)]/60"></div>

      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <h1 className="text-[var(--fg)] text-3xl md:text-5xl text-center font-bold">
          {data.title}
        </h1>
      </div>
    </section>
  );
};

export default NavbarHeaderImage;
