import { useEffect, useState } from "react";
import { CAROUSEL_IMAGES, CAROUSEL_INTERVAL } from "./constants";

const HeroSection: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, CAROUSEL_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-[75vh] flex items-center">
      {/* Background carousel */}
      {CAROUSEL_IMAGES.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-[var(--b1)]/55" />

      {/* Content */}
      <div className="relative z-10 w-[94%] max-w-[1320px] mx-auto px-4 sm:px-6 md:px-10 w-full">
        <div className="max-w-2xl text-fg text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-snug mb-4">
            Your Piece of{" "}
            <span className="block sm:inline text-[var(--b2)]">
              Earth Awaits
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[var(--b2-soft)] mb-6">
            Discover premium land investments in Indore. More valuable than gold,
            more lasting than time.
          </p>

          <a
            href="#"
            className="inline-flex items-center justify-center bg-[var(--b1-mid)] hover:bg-[var(--b1)] transition text-fg font-semibold px-6 py-3 rounded-xl shadow-lg"
          >
            Publish a Property
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
