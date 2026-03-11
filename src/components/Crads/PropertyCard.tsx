import React from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Star, BedDouble, Bath, Car } from "lucide-react";

// ⭐ Redux backend property type (from OLD file)
import type { Property as BackendProperty } from "../../features/properties/propertyType";

// ⭐ UI helper (same as NEW file)
import { isSizeInAcres } from "../Data/properties";

interface Props {
  property: BackendProperty;
}

const PropertyCard: React.FC<Props> = ({ property }) => {
  const navigate = useNavigate();

  // ⭐ Backend → UI mapping (pattern taken from OLD file)
  const mappedProperty = {
    _id: property._id,
    title: property.title,
    address: property.address,
    images: property.images || [],
    price: property.price,
    propertyType: property.propertyType,
    status: property.status,
    size: property.size,
    beds: property.beds,
    baths: property.baths,
    parking: property.parking
  };

  const isRent = mappedProperty.propertyType === "Rent Farmhouse";
  const sizeAcres = isSizeInAcres(mappedProperty.propertyType);

  return (
    <div
      onClick={() => navigate(`/properties/${mappedProperty._id}`)}
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
          src={mappedProperty.images?.[0] || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23e0e0e0' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E"}
          alt={mappedProperty.title}
          className="h-[220px] w-full object-cover"
        />

        {mappedProperty.status === "approved" && (
          <span className="absolute top-3 left-3 bg-[var(--b1)] text-[var(--fg)] text-xs font-semibold px-3 py-1">
            Available
          </span>
        )}

        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
          <Camera size={14} /> {mappedProperty.images.length}
        </div>

        <div className="absolute bottom-3 right-3 text-[var(--b2)]">
          <Star size={18} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-[var(--b1-mid)] font-sans">
          {mappedProperty.propertyType}
        </p>

        <h2 className="text-2xl text-[var(--b1)] mt-1 font-sans">
          ₹ {mappedProperty.price.toLocaleString("en-IN")}
          {isRent && (
            <span className="text-sm font-normal text-gray-500"> /mo</span>
          )}
        </h2>

        <h3
          title={mappedProperty.title}
          className="text-lg font-serif mt-1 text-[var(--b1)] line-clamp-2"
        >
          {mappedProperty.title}
        </h3>

        <p
          title={mappedProperty.address}
          className="text-sm text-gray-600 font-sans mt-1 truncate"
        >
          {mappedProperty.address}
        </p>

        {/* Size */}
        <p className="text-xs text-[var(--b1-mid)] font-medium mt-2 font-sans">
          {mappedProperty.size?.toLocaleString()}{" "}
          {sizeAcres ? "Acres" : "Sq. Ft."}
        </p>

        <div className="mt-auto">
          <div className="border-t border-[var(--b2-soft)] my-4"></div>

          {/* Meta info */}
          <div className="flex justify-end gap-6 text-sm text-[var(--b1-mid)] font-sans">
            <div className="flex items-center gap-1">
              <BedDouble size={14} /> {mappedProperty.beds || "–"}
            </div>
            <div className="flex items-center gap-1">
              <Bath size={14} /> {mappedProperty.baths || "–"}
            </div>
            <div className="flex items-center gap-1">
              <Car size={14} /> {mappedProperty.parking || "–"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
