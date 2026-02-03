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

  const selectClass =
    "w-full px-4 py-3 rounded-lg bg-white text-[#1B4332] border border-[#95D5B2] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#95D5B2]";

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

      <div className="absolute inset-0 bg-[#1B4332]/70" />

      <div className="relative z-10 w-[94%] max-w-[1320px] mx-auto px-4 sm:px-6 md:px-10 min-h-[75vh] flex items-center">
        <div className="max-w-2xl w-full text-white text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-snug mb-4">
            Your Piece of <span className="block sm:inline text-[#95D5B2]">Earth Awaits</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[#D8F3DC] mb-6">
            Discover premium land investments in Indore. More valuable than gold, more lasting than time.
          </p>
          <a
            href="/publish"
            className="inline-flex items-center justify-center bg-[#2D6A4F] hover:bg-[#1B4332] transition text-white font-semibold px-6 py-3 rounded-xl shadow-lg"
          >
            Publish a Property
          </a>
        </div>
      </div>

      <div className="absolute left-1/2 bottom-[-45px] z-20 w-full -translate-x-1/2 px-4">
        <div className="w-[94%] max-w-[1200px] mx-auto bg-[#D8F3DC] rounded-2xl shadow-2xl px-4 sm:px-6 py-5">
          <form className="grid grid-cols-1 sm:grid-cols-2 md:flex gap-3 items-stretch">
            <select className={`${selectClass} md:w-[180px]`}>
              <option className="bg-white text-[#1B4332]">Location</option>
              <option className="bg-white text-[#1B4332]">Indore</option>
              <option className="bg-white text-[#1B4332]">Bhopal</option>
            </select>

            <select className={`${selectClass} md:w-[180px]`}>
              <option className="bg-white text-[#1B4332]">Category</option>
              <option className="bg-white text-[#1B4332]">Farmhouse</option>
              <option className="bg-white text-[#1B4332]">Farmland</option>
            </select>

            <select className={`${selectClass} md:w-[160px]`}>
              <option className="bg-white text-[#1B4332]">Type</option>
              <option className="bg-white text-[#1B4332]">Buy</option>
              <option className="bg-white text-[#1B4332]">Rent</option>
            </select>

            <input
              type="text"
              placeholder="Search a Property"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-white text-[#1B4332] border border-[#95D5B2] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#95D5B2]"
            />

            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 rounded-lg bg-[#2D6A4F] hover:bg-[#1B4332] transition text-white font-semibold flex items-center justify-center gap-2"
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
              Search
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Home;
