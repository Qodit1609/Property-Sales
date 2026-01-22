import React from "react";

interface Property {
  id: number;
  title: string;
  location: string;
  distance: string;
  price: string;
  area: string;
  image: string;
  status?: string;
  discount?: string;
}

interface Props {
  property: Property;
}

const PropertyCard: React.FC<Props> = ({ property }) => {
  return (
    <div className="w-[340px] flex-shrink-0 bg-white rounded-2xl shadow-md overflow-hidden">
     
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="h-56 w-full object-cover"
        />

        {property.status && (
          <span className="absolute top-3 left-3 bg-green-700 text-white text-xs px-3 py-1 rounded-full">
            {property.status}
          </span>
        )}

        {property.discount && (
          <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs px-3 py-1 rounded-bl-lg">
            {property.discount}
          </span>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900 line-clamp-2">
          {property.title}
        </h3>

        <p className="text-sm text-gray-600">
          {property.location} • {property.distance}
        </p>

        <div className="flex items-center gap-4">
          <span className="font-bold text-lg">₹ {property.price}</span>
          <span className="text-sm text-gray-600">{property.area}</span>
        </div>
      </div>

      <div className="flex gap-2 p-4 pt-0">
        <button className="flex-1 bg-green-700 text-white py-2 rounded-md text-sm">
          View Details
        </button>
        <button className="flex-1 bg-orange-600 text-white py-2 rounded-md text-sm">
          Enquire
        </button>
        <button className="flex-1 bg-blue-800 text-white py-2 rounded-md text-sm">
          Map
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
