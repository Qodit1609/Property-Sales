import React from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Star, BedDouble, Bath, Car } from "lucide-react";
import { isSizeInAcres } from "../Data/properties";
import type { Property } from "../Data/properties";

interface Props {
  property: Property;
}

const PropertyCard: React.FC<Props> = ({ property }) => {
  const navigate = useNavigate();
  const isRent = property.propertyType === "Rent Farmhouse";
  const sizeAcres = isSizeInAcres(property.propertyType);

  return (
    <div
      onClick={() => navigate(`/properties/${property._id}`)}
      className="
        bg-[var(--white)]
        border border-[var(--b2-soft)]
        w-full h-[520px]
        flex flex-col overflow-hidden cursor-pointer
        hover:shadow-lg active:scale-[0.97]
        transition-all duration-200
      "
    >
      {/* Image */}
      <div className="relative">
        <img
          src={property.images?.[0]}
          alt={property.title}
          className="h-[220px] w-full object-cover"
        />

        {property.status === "approved" && (
          <span className="absolute top-3 left-3 bg-[var(--b1)] text-[var(--fg)] text-xs font-semibold px-3 py-1">
            Available
          </span>
        )}

        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
          <Camera size={14} /> {property.images.length}
        </div>

        <div className="absolute bottom-3 right-3 text-[var(--b2)]">
          <Star size={18} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-[var(--b1-mid)] font-sans">
          {property.propertyType}
        </p>

        <h2 className="text-2xl text-[var(--b1)] mt-1 font-sans">
          ₹ {property.price.toLocaleString("en-IN")}
          {isRent && (
            <span className="text-sm font-normal text-gray-500"> /mo</span>
          )}
        </h2>

        <h3
          title={property.title}
          className="text-lg font-serif mt-1 text-[var(--b1)] line-clamp-2"
        >
          {property.title}
        </h3>

        <p
          title={property.address}
          className="text-sm text-gray-600 font-sans mt-1 truncate"
        >
          {property.address}
        </p>

        {/* Size */}
        <p className="text-xs text-[var(--b1-mid)] font-medium mt-2 font-sans">
          {property.size.toLocaleString()}{" "}
          {sizeAcres ? "Acres" : "Sq. Ft."}
        </p>

        <div className="mt-auto">
          <div className="border-t border-[var(--b2-soft)] my-4"></div>

          {/* Meta info */}
          <div className="flex justify-end gap-6 text-sm text-[var(--b1-mid)] font-sans">
            <div className="flex items-center gap-1">
              <BedDouble size={14} /> {property.beds || "–"}
            </div>
            <div className="flex items-center gap-1">
              <Bath size={14} /> {property.baths || "–"}
            </div>
            <div className="flex items-center gap-1">
              <Car size={14} /> {property.parking || "–"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
