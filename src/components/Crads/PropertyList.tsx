import { useRef } from "react";
import PropertyCard from "../Crads/PropertyCard";
import { properties } from "../Data/properties";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PropertyList = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -320,
      behavior: "smooth"
    });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: 320,
      behavior: "smooth"
    });
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 pt-12">
      <button
        onClick={scrollLeft}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10
                   bg-white shadow-md p-2 rounded-full hover:bg-gray-100"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={scrollRight}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10
                   bg-white shadow-md p-2 rounded-full hover:bg-gray-100"
      >
        <ChevronRight size={22} />
      </button>
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar"
      >
        {properties.map((property) => (
          <div key={property.id} className="min-w-[300px]">
            <PropertyCard property={property} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
