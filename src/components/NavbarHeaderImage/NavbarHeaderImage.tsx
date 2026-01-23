import React from "react";

const NavbarHeaderImage: React.FC = () => {
  return (
    <section
      className="relative h-[70vh] bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6')",
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-white text-3xl md:text-5xl  text-center">
          Buy Agricultural Land in Indore
        </h1>
      </div>
    </section>
  );
};

export default NavbarHeaderImage;
