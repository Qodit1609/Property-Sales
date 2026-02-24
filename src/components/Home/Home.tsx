import { useEffect, useState } from "react";

const Home: React.FC = () => {
  const images = [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1920",
    "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?q=80&w=1920",
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1920",
  ];

  const [current, setCurrent] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[120vh] pt-[80px] pb-[220px]">
      {images.map((img, index) => (
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

      <div className="absolute inset-0 bg-[var(--b1)]/55" />

      <div className="relative z-10 w-[94%] max-w-[1320px] mx-auto px-4 sm:px-6 md:px-10 min-h-[75vh] flex items-center">
        <div className="max-w-2xl w-full text-fg text-center sm:text-left">
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
       {/* filter bar */}
     <div className="absolute left-1/2 bottom-[-45px] z-20 w-full -translate-x-1/2 px-2 sm:px-4">
  <div className="w-full max-w-[1200px] mx-auto bg-[var(--b2-soft)]/95 backdrop-blur-md rounded-3xl shadow-2xl px-3 sm:px-6 py-4 sm:py-6 border border-[var(--b2)]">
    
    <form className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-3 md:gap-4 items-stretch sm:items-center justify-between">
      
      {/* Location */}
      <div className="flex items-center bg-[var(--white)] rounded-lg shadow-sm border border-[var(--b2)] px-3 md:px-3 w-full sm:w-auto flex-1 min-w-full sm:min-w-[140px] md:min-w-[160px] focus-within:ring-2 focus-within:ring-[var(--b2)] transition">
        <span className="mr-2 text-[var(--b2)]">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 8c-4-4-6-6.686-6-9a6 6 0 1112 0c0 2.314-2 5-6 9z" />
          </svg>
        </span>
        <select className="bg-transparent outline-none w-full py-4">
          <option>Location</option>
          <option>Indore</option>
          <option>Bhopal</option>
        </select>
      </div>

      {/* Category */}
      <div className="flex items-center bg-[var(--white)] rounded-lg shadow-sm border border-[var(--b2)] px-3 md:px-3 w-full sm:w-auto flex-1 min-w-full sm:min-w-[140px] md:min-w-[160px] focus-within:ring-2 focus-within:ring-[var(--b2)] transition">
        <span className="mr-2 text-[var(--b2)]">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </span>
        <select className="bg-transparent outline-none w-full py-4">
          <option>Category</option>
          <option>Farmhouse</option>
          <option>Farmland</option>
        </select>
      </div>

      {/* Type */}
      <div className="flex items-center bg-[var(--white)] rounded-lg shadow-sm border border-[var(--b2)] px-3 md:px-3 w-full sm:w-auto flex-1 min-w-full sm:min-w-[120px] md:min-w-[140px] focus-within:ring-2 focus-within:ring-[var(--b2)] transition">
        <span className="mr-2 text-[var(--b2)]">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2z" />
          </svg>
        </span>
        <select className="bg-transparent outline-none w-full py-4">
          <option>Type</option>
          <option>Buy</option>
          <option>Rent</option>
        </select>
      </div>

      {/* Search */}
      <div className="flex items-center bg-[var(--white)] rounded-lg shadow-sm border border-[var(--b2)] px-3 md:px-3 w-full sm:w-auto flex-[2] min-w-full sm:min-w-[160px] focus-within:ring-2 focus-within:ring-[var(--b2)] transition">
        <span className="mr-2 text-[var(--b2)]">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search a Property"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none w-full py-3"
        />
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--b1-mid)] to-[var(--b2)] hover:from-[var(--b1)] hover:to-[var(--b2-soft)] transition text-fg font-semibold flex items-center justify-center gap-2 shadow-md border border-[var(--b2)] focus:ring-2 focus:ring-[var(--b2)]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span>Search</span>
      </button>

    </form>
  </div>
</div>


    </section>
  );
};

export default Home;
