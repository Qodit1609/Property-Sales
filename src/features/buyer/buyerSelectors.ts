import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { Property } from "../properties/propertyType";

const selectBuyer = (state: RootState) => state.buyer;

export const selectWishlistIds = createSelector(
  selectBuyer,
  (b) => b.wishlistIds
);
export const selectCompareIds = createSelector(selectBuyer, (b) => b.compareIds);
export const selectCartIds = createSelector(selectBuyer, (b) => b.cartIds);
export const selectRecentIds = createSelector(selectBuyer, (b) => b.recentIds);
export const selectBuyerEntities = createSelector(selectBuyer, (b) => b.entities);

export function selectIsInWishlist(state: RootState, id: string): boolean {
  return state.buyer.wishlistIds.includes(id);
}
export function selectIsInCompare(state: RootState, id: string): boolean {
  return state.buyer.compareIds.includes(id);
}
export function selectIsInCart(state: RootState, id: string): boolean {
  return state.buyer.cartIds.includes(id);
}

/** Build a minimal Property from entity meta for loading states. */
export function metaToFallbackProperty(
  id: string,
  entities: RootState["buyer"]["entities"]
): Property | null {
  const m = entities[id];
  if (!m) return null;
  return {
    _id: m.propertyId,
    title: m.title,
    description: "",
    address: m.location ?? "",
    locationText: m.location,
    price: m.price,
    images: m.image ? [m.image] : [],
    propertyType: m.propertyType ?? "Property",
    status: m.status,
    availabilityStatus: m.status,
  };
}

export function mergeMetaIntoProperty(
  partial: Property,
  entities: RootState["buyer"]["entities"]
): Property {
  const m = entities[partial._id];
  if (!m) return partial;
  return {
    ...partial,
    title: partial.title || m.title,
    price: partial.price ?? m.price,
    images: partial.images?.length ? partial.images : m.image ? [m.image] : [],
    locationText: partial.locationText ?? m.location,
    address: partial.address || m.location || "",
    propertyType: partial.propertyType || m.propertyType || "Property",
    status: partial.status ?? m.status,
    availabilityStatus: partial.availabilityStatus ?? m.status,
  };
}

export { propertyToMeta } from "./propertyToMeta";
