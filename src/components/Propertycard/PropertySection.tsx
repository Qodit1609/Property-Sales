import { useEffect, useRef, useState } from "react";
import PropertyCard from "./PropertyCard";

const PropertySection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);

  const properties = [
    {
      id: 1,
      title: "Luxury farmhouse living just minutes from Indore",
      location: "Simrol, Indore",
      distance: "10 km",
      price: "2,25,00,000",
      area: "14000 sqft",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      status: "available",
      discount: "5% off",
    },
    {
      id: 2,
      title: "Green Valley Farmhouse with modern amenities",
      location: "Hatod, Indore",
      distance: "12 km",
      price: "1,85,00,000",
      area: "12000 sqft",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
      status: "available",
    },
    {
      id: 3,
      title: "Premium farmland near highway connectivity",
      location: "Sanwer Road, Indore",
      distance: "8 km",
      price: "1,40,00,000",
      area: "10000 sqft",
      image: "https://images.unsplash.com/photo-1600585154207-8b2c3e1f8f15",
      status: "available",
    },
    {
      id: 4,
      title: "Weekend farmhouse with lush greenery",
      location: "Mhow, Indore",
      distance: "18 km",
      price: "1,95,00,000",
      area: "16000 sqft",
      image: "https://images.unsplash.com/photo-1599423300746-b62533397364",
      status: "available",
    },
  ];

  useEffect(() => {
    if (showAll) return;

    const container = scrollRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      if (
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth
      ) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += 1;
      }
    }, 15);

    return () => clearInterval(interval);
  }, [showAll]);

  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <p className="text-sm text-green-600">Featured Property</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
            Recommended Properties for You
          </h2>
        </div>
        {!showAll ? (
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto no-scrollbar"
          >
            {properties.map((item) => (
              <PropertyCard key={item.id} property={item} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((item) => (
              <PropertyCard key={item.id} property={item} />
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          {!showAll ? (
            <button
              onClick={() => setShowAll(true)}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg w-full sm:w-auto"
            >
              Show all Property
            </button>
          ) : (
            <button
              onClick={() => setShowAll(false)}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg w-full sm:w-auto"
            >
              ✕ Close
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default PropertySection;
