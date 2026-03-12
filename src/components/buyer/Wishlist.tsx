import React from "react";
import { HeartCrack, MoveRight, ShoppingCart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  moveWishlistToCart,
  removeFromWishlist,
} from "../../features/buyer/buyerSlice";
import PropertyCard from "../Crads/PropertyCard";

const Wishlist: React.FC = () => {
  const dispatch = useAppDispatch();
  const { wishlist } = useAppSelector((state) => state.buyer);

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--b2)] bg-[var(--white)] px-8 py-16 text-center shadow-sm">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--b2-soft)] text-[var(--error)]">
          <HeartCrack className="h-7 w-7" />
        </div>
        <h2 className="text-lg font-semibold text-[var(--b1)]">
          No saved properties yet
        </h2>
        <p className="mt-2 max-w-md text-sm text-[var(--muted)]">
          Start exploring curated agriculture lands, farmhouses and resorts. Tap
          the heart icon on any property to save it for later.
        </p>
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
            You have {wishlist.length} properties in your wishlist.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {wishlist.map((property) => (
          <div
            key={property._id}
            className="group relative overflow-hidden rounded-2xl border border-[var(--b2)] bg-[var(--white)] shadow-sm transition-transform hover:-translate-y-1"
          >
            <div className="p-3 pb-0">
              <PropertyCard property={property} />
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-[var(--b2-soft)] bg-[var(--b2-soft)] px-4 py-3">
              <button
                type="button"
                onClick={() => dispatch(removeFromWishlist(property._id))}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--white)] px-3 py-1 text-[11px] font-medium text-[var(--muted)] ring-1 ring-[var(--b2)] hover:bg-[var(--b2-soft)]"
              >
                <HeartCrack className="h-3.5 w-3.5" />
                Remove
              </button>
              <button
                type="button"
                onClick={() => dispatch(moveWishlistToCart(property._id))}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-slate-950 shadow ring-1 ring-emerald-400 hover:bg-emerald-400"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Move to cart
                <MoveRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;

