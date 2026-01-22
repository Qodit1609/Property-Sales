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
  }, [images.length]);

  return (
    <section className="relative min-h-screen overflow-hidden pt-[80px]">
      {/* Background Slider */}
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

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 min-h-[70vh] flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Your Piece of Earth Awaits
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-6">
            Discover premium land investments in Indore.  
            More valuable than gold, more lasting than time.
          </p>

          <a
            href="/publish"
            className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 transition text-white font-semibold px-6 py-3 rounded-xl shadow-lg"
          >
            Publish a Property
          </a>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative z-20 mt-16 sm:mt-24 px-4 sm:px-6">
        <div className="max-w-[1320px] mx-auto bg-gradient-to-r from-[#006557] via-[#00897b] to-[#43cea2] rounded-2xl p-4 sm:p-6 shadow-2xl">
          <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Location */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-white mb-1">
                Location
              </label>
              <select className="px-4 py-3 rounded-xl bg-white/90 text-gray-800 focus:ring-2 focus:ring-[#43cea2]">
                <option>Location</option>
                <option>Indore</option>
                <option>Bhopal</option>
              </select>
            </div>

            {/* Category */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-white mb-1">
                Category
              </label>
              <select className="px-4 py-3 rounded-xl bg-white/90 text-gray-800 focus:ring-2 focus:ring-[#43cea2]">
                <option>Category</option>
                <option>Farmhouse</option>
                <option>Farmland</option>
              </select>
            </div>

            {/* Type */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-white mb-1">
                Type
              </label>
              <select className="px-4 py-3 rounded-xl bg-white/90 text-gray-800 focus:ring-2 focus:ring-[#43cea2]">
                <option>Type</option>
                <option>Buy</option>
                <option>Rent</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="flex flex-col lg:col-span-2">
              <label className="text-xs font-semibold text-white mb-1">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search a Property"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white text-gray-800 pr-14 focus:ring-2 focus:ring-[#43cea2]"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 border border-[#43cea2] text-[#185a9d] rounded-full p-2 shadow-md hover:bg-[#43cea2] hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#43cea2] flex items-center justify-center"
                  aria-label="Search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Home;
