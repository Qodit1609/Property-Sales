import React from "react";
import { HeartCrack, MoveRight, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  moveWishlistToCart,
  removeFromWishlist,
} from "../../features/buyer/buyerSlice";
import { useBuyerResolvedProperties } from "../../hooks/useBuyerResolvedProperties";
import PropertyCard from "../Cards/PropertyCard";
import WishlistGrid from "./WishlistGrid";
import { Button } from "@/components/common";
import { createNotificationAPI } from "../../features/notifications/notificationAPI";

const Wishlist: React.FC = () => {
  const dispatch = useAppDispatch();
  const wishlistIds = useAppSelector((s) => s.buyer.wishlistIds);
  const buyerName = useAppSelector((s) => s.auth.user?.name ?? "Buyer");
  const { properties: wishlist, loading } = useBuyerResolvedProperties(wishlistIds);

  if (wishlistIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--b2)] bg-[var(--white)] px-8 py-16 text-center shadow-sm">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--b2-soft)] text-[var(--error)]">
          <HeartCrack className="h-7 w-7" />
        </div>
        <h2 className="text-lg font-semibold text-[var(--b1)]">
          No saved properties yet
        </h2>
        <p className="mt-2 max-w-md text-sm text-[var(--muted)]">
          Start exploring curated agriculture lands, farmhouses and resorts. Use
          the heart on any property card to save it for later.
        </p>
        <Link
          to="/buyer/dashboard"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--b1)] px-5 py-2 text-sm font-semibold text-[var(--fg)] transition hover:opacity-95"
        >
          Discover properties
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[var(--b1)]">
            Saved properties
          </h2>
          <p className="text-xs text-[var(--muted)]">
            You have {wishlistIds.length} properties in your wishlist.
            {loading ? " Refreshing details…" : ""}
          </p>
        </div>
      </div>

      <WishlistGrid>
        {wishlist.map((property) => (
          <div
            key={property._id}
            className="group relative overflow-hidden rounded-2xl border border-[var(--b2)] bg-[var(--white)] shadow-sm transition-transform hover:-translate-y-1"
          >
            <div className="p-3 pb-0">
              <PropertyCard property={property} />
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-[var(--b2-soft)] bg-[var(--b2-soft)] px-4 py-3">
              <Button
                type="button"
                onClick={() => dispatch(removeFromWishlist(property._id))}
                variant="ghost"
                className="rounded-full px-3 py-1 text-[11px] font-medium text-[var(--muted)] ring-1 ring-[var(--b2)] hover:bg-[var(--b2-soft)]"
              >
                <HeartCrack className="h-3.5 w-3.5" />
                Remove
              </Button>

              <Button
                type="button"
                onClick={() => {
                  dispatch(moveWishlistToCart(property._id));
                  const rawSellerId = (property as { sellerId?: unknown }).sellerId;
                  const sellerId =
                    typeof rawSellerId === "string"
                      ? rawSellerId
                      : rawSellerId &&
                        typeof rawSellerId === "object" &&
                        "_id" in (rawSellerId as Record<string, unknown>)
                      ? String((rawSellerId as { _id?: string })._id ?? "")
                      : "";
                  if (sellerId) {
                    void createNotificationAPI({
                      title: "Property added to cart",
                      message: `${buyerName} added ${property.title ?? "your property"} to cart.`,
                      type: "cart",
                      receiverId: sellerId,
                      propertyId: property._id,
                    });
                  }
                }}
                variant="primary"
                className="rounded-full px-3 py-1 text-[11px] font-semibold"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Move to cart
                <MoveRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </WishlistGrid>
    </div>
  );
};

export default Wishlist;
