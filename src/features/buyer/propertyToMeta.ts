import type { Property } from "../properties/propertyType";
import type { BuyerPropertyMeta } from "./buyerTypes";

export function propertyToMeta(property: Property): BuyerPropertyMeta {
  return {
    propertyId: property._id,
    title: property.title,
    price: property.price ?? 0,
    image: property.images?.[0],
    location: property.locationText || property.address,
    status:
      property.status ??
      property.availabilityStatus ??
      property.statusDetails?.approvalStatus,
    propertyType: property.propertyType,
  };
}
