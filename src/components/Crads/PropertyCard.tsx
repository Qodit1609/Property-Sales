import React from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Star, BedDouble, Bath, Sofa } from "lucide-react";

export interface Property {
  id: number;
  image: string;
  price: string;
  title: string;
  location: string;
  sold?: boolean;
  imagesCount: number;
  sqft: string;
  beds: number;
  baths: number;
  receptions: number;
}

interface Props {
  property: Property;
}

const PropertyCard: React.FC<Props> = ({ property }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/property/${property.id}`)}
      className="
        bg-[#FFFBE6] border border-[#C0EBA6]
        overflow-hidden
        cursor-pointer
        hover:shadow-lg
        active:scale-[0.97]
        transition-all duration-200
      "
    >
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="h-[220px] w-full object-cover"
        />

        {property.sold && (
          <span className="absolute top-3 left-3 bg-[#347928] text-white text-xs font-semibold px-3 py-1">
            Available
          </span>
        )}

        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
          <Camera size={14} />
          {property.imagesCount}
        </div>

        <div className="absolute bottom-3 right-3 text-[#FCCD2A]">
          <Star size={18} />
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-[#347928] font-sans">
          Guide price
        </p>

        <h2 className="text-2xl text-gray-900">
          {property.price}
        </h2>

        <h3 className="text-lg font-serif mt-1 text-[#347928]">
          {property.title}
        </h3>

        <p className="text-sm text-gray-600 font-sans mt-1">
          {property.location}
        </p>

        <div className="mt-16 border-t border-[#C0EBA6]"></div>

        <div className="flex justify-end gap-6 text-sm text-[#347928] font-sans mt-4">
          <div className="flex items-center gap-1">
            <BedDouble size={14} />
            {property.beds}
          </div>

          <div className="flex items-center gap-1">
            <Bath size={14} />
            {property.baths}
          </div>

          <div className="flex items-center gap-1">
            <Sofa size={14} />
            {property.receptions}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
