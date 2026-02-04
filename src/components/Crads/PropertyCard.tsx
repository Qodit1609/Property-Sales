import { useNavigate } from "react-router-dom";
import { Camera, Star, BedDouble, Bath, Sofa } from "lucide-react";
import type { Property, ExtendedProperty } from "../Data/properties";

interface Props {
  property: Property & ExtendedProperty;
}

const PropertyCard = ({ property }: Props) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/properties/${property._id}`)}
      className="bg-[var(--fg)] border border-[var(--b2)] w-full h-[520px] flex flex-col overflow-hidden cursor-pointer hover:shadow-lg active:scale-[0.97] transition-all duration-200"
    >
      <div className="relative">
        <img
          src={property.images[0]}
          alt={property.title}
          className="h-[220px] w-full object-cover"
        />

        {property.status === "approved" && (
          <span className="absolute top-3 left-3 bg-[var(--b1-mid)] text-[var(--white)] text-xs font-semibold px-3 py-1">
            Available
          </span>
        )}

        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/70 text-[var(--white)] text-xs px-2 py-1 rounded-md">
          <Camera size={14} />
          {property.images.length}
        </div>

        <div className="absolute bottom-3 right-3 text-[var(--b2)]">
          <Star size={18} />
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-[var(--b1-mid)]">
          {property.propertyType}
        </p>

        <h2 className="text-2xl text-[var(--b1)] mt-1">
          ₹ {property.price.toLocaleString("en-IN")}
        </h2>

        <h3 className="text-lg mt-1 text-[var(--b1-mid)] line-clamp-2">
          {property.title}
        </h3>

        <p className="text-sm text-[var(--b1)]/70 mt-1 truncate">
          {property.address}
        </p>

        <div className="mt-auto">
          <div className="border-t border-[var(--b2)] my-4" />

          <div className="flex justify-end gap-6 text-sm text-[var(--b1-mid)]">
            <div className="flex items-center gap-1">
              <BedDouble size={14} /> 3
            </div>
            <div className="flex items-center gap-1">
              <Bath size={14} /> 2
            </div>
            <div className="flex items-center gap-1">
              <Sofa size={14} /> 1
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
