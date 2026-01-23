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

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-[94%] max-w-[1320px] mx-auto px-4 sm:px-6 md:px-10 min-h-[75vh] flex items-center">
        <div className="max-w-2xl w-full text-white text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-snug mb-4">
            Your Piece of <span className="block sm:inline">Earth Awaits</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-6">
            Discover premium land investments in Indore. More valuable than gold,
            more lasting than time.
          </p>

          <a
            href="/publish"
            className="inline-flex items-center justify-center bg-gradient-to-r from-[#006557] via-[#00897b] to-[#43cea2] text-white font-semibold px-6 py-3 rounded-xl shadow-lg"
          >
            Publish a Property
          </a>
        </div>
      </div>

      <div className="absolute left-1/2 bottom-[-45px] z-20 w-full -translate-x-1/2 px-4">
        <div className="w-[94%] max-w-[1200px] mx-auto bg-gradient-to-r from-[#006557] via-[#00897b] to-[#43cea2] rounded-2xl shadow-2xl px-4 sm:px-6 py-5">
          <form className="grid grid-cols-1 sm:grid-cols-2 md:flex gap-3 items-stretch">
            <select className="w-full md:w-[180px] px-4 py-3 rounded-lg bg-white">
              <option>Location</option>
              <option>Indore</option>
              <option>Bhopal</option>
            </select>

            <select className="w-full md:w-[180px] px-4 py-3 rounded-lg bg-white">
              <option>Category</option>
              <option>Farmhouse</option>
              <option>Farmland</option>
            </select>

            <select className="w-full md:w-[160px] px-4 py-3 rounded-lg bg-white">
              <option>Type</option>
              <option>Buy</option>
              <option>Rent</option>
            </select>

            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Search a Property"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 rounded-lg bg-white text-[#006557] font-semibold hover:bg-gray-100 transition"
            >
              🔍 Search
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Home;
