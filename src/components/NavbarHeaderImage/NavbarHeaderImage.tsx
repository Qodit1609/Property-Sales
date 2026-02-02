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
      <div className="absolute inset-0 bg-[#347928]/60"></div>

      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <h1 className="text-[#FFFBE6] text-3xl md:text-5xl text-center font-bold">
          Buy Agricultural Land in{" "}
          <span className="text-[#FCCD2A]">Indore</span>
        </h1>
      </div>
    </section>
  );
};

export default NavbarHeaderImage;
