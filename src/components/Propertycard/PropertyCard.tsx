import React from "react";

const PropertyCard: React.FC<{ property: any }> = ({ property }) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="h-56 w-full object-cover"
        />
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 min-h-[3rem]">
          {property.title}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-1 min-h-[1.25rem]">
          {property.location} • {property.distance}
        </p>

        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">₹ {property.price}</span>
          <span className="text-sm text-gray-500">{property.area}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-4 pt-0 mt-auto">
        <button className="bg-green-700 text-white py-2 rounded-md text-sm">
          View
        </button>
        <button className="bg-orange-600 text-white py-2 rounded-md text-sm">
          Enquire
        </button>
        <button className="bg-blue-800 text-white py-2 rounded-md text-sm">
          Map
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
