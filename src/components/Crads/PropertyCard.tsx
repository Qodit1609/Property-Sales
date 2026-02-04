// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Camera, Star, BedDouble, Bath, Sofa } from "lucide-react";

// /* 🔹 Property Interface (API payload based) */
// export interface Property {
//   _id: string;
//   title: string;
//   description: string;
//   price: number;
//   propertyType: string;
//   address: string;
//   images: string[];
//   status: string;
//   location: {
//     type: "Point";
//     coordinates: [number, number];
//   };
// }

// /* 🔹 Props */
// interface Props {
//   property: Property;
// }

// const PropertyCard: React.FC<Props> = ({ property }) => {
//   const navigate = useNavigate();

//   return (
//     <div
//       onClick={() => navigate(`/property/${property._id}`)}
//       className="
//         bg-[#FFFBE6] border border-[#C0EBA6]
//         w-full h-[520px]
//         flex flex-col
//         overflow-hidden
//         cursor-pointer
//         hover:shadow-lg
//         active:scale-[0.97]
//         transition-all duration-200
//       "
//     >
//       {/* 🔹 Image Section */}
//       <div className="relative">
//         <img
//           src={property.images?.[0]}
//           alt={property.title}
//           className="h-[220px] w-full object-cover"
//         />

//         {property.status === "approved" && (
//           <span className="absolute top-3 left-3 bg-[#347928] text-white text-xs font-semibold px-3 py-1">
//             Available
//           </span>
//         )}

//         <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
//           <Camera size={14} />
//           {property.images.length}
//         </div>

//         <div className="absolute bottom-3 right-3 text-[#FCCD2A]">
//           <Star size={18} />
//         </div>
//       </div>

//       {/* 🔹 Content */}
//       <div className="p-4 flex flex-col flex-1">
//         <p className="text-xs text-[#347928] font-sans">
//           {property.propertyType}
//         </p>

//         <h2 className="text-2xl text-gray-900 mt-1">
//           ₹ {property.price.toLocaleString("en-IN")}
//         </h2>

//         {/* 🔒 Title fixed (max 2 lines) */}
//         <h3
//           title={property.title}
//           className="
//             text-lg font-serif mt-1 text-[#347928]
//             line-clamp-2
//           "
//         >
//           {property.title}
//         </h3>

//         {/* 🔒 Address fixed (1 line) */}
//         <p
//           title={property.address}
//           className="
//             text-sm text-gray-600 font-sans mt-1
//             truncate
//           "
//         >
//           {property.address}
//         </p>

//         <div className="mt-auto">
//           <div className="border-t border-[#C0EBA6] my-4"></div>

//           {/* 🔹 Static icons (future me API se aa sakta hai) */}
//           <div className="flex justify-end gap-6 text-sm text-[#347928] font-sans">
//             <div className="flex items-center gap-1">
//               <BedDouble size={14} /> 3
//             </div>

//             <div className="flex items-center gap-1">
//               <Bath size={14} /> 2
//             </div>

//             <div className="flex items-center gap-1">
//               <Sofa size={14} /> 1
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PropertyCard;

import React from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Star, BedDouble, Bath, Car } from "lucide-react";
import  {  isSizeInAcres } from "../Data/properties";
import type { Property } from "../Data/properties";
interface Props {
  property: Property;
}

const PropertyCard: React.FC<Props> = ({ property }) => {
  const navigate = useNavigate();
  const isRent     = property.propertyType === "Rent Farmhouse";
  const sizeAcres  = isSizeInAcres(property.propertyType);

  return (
    <div
      onClick={() => navigate(`/property/${property._id}`)}
      className="bg-[#FFFBE6] border border-[#C0EBA6] w-full h-[520px] flex flex-col overflow-hidden cursor-pointer hover:shadow-lg active:scale-[0.97] transition-all duration-200"
    >
      {/* Image */}
      <div className="relative">
        <img src={property.images?.[0]} alt={property.title} className="h-[220px] w-full object-cover" />

        {property.status === "approved" && (
          <span className="absolute top-3 left-3 bg-[#347928] text-white text-xs font-semibold px-3 py-1">Available</span>
        )}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
          <Camera size={14} /> {property.images.length}
        </div>
        <div className="absolute bottom-3 right-3 text-[#FCCD2A]">
          <Star size={18} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-[#347928] font-sans">{property.propertyType}</p>

        <h2 className="text-2xl text-gray-900 mt-1">
          ₹ {property.price.toLocaleString("en-IN")}
          {isRent && <span className="text-sm font-normal text-gray-500"> /mo</span>}
        </h2>

        <h3 title={property.title} className="text-lg font-serif mt-1 text-[#347928] line-clamp-2">
          {property.title}
        </h3>

        <p title={property.address} className="text-sm text-gray-600 font-sans mt-1 truncate">
          {property.address}
        </p>

        {/* Size badge */}
        <p className="text-xs text-[#347928] font-medium mt-2">
          {property.size.toLocaleString()} {sizeAcres ? "Acres" : "Sq. Ft."}
        </p>

        <div className="mt-auto">
          <div className="border-t border-[#C0EBA6] my-4"></div>

          {/* Real data from the property object */}
          <div className="flex justify-end gap-6 text-sm text-[#347928] font-sans">
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
