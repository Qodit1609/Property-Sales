import React, { useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { useStore } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { toggleWishlist } from "../../features/buyer/buyerSlice";
import type { Property } from "../../features/properties/propertyType";
import type { RootState } from "../../app/store";
import { showBuyerActionFeedback } from "./buyerActionFeedback";

interface Props {
  property: Property;
  className?: string;
  "aria-label"?: string;
}

const WishlistButton: React.FC<Props> = ({
  property,
  className = "",
  "aria-label": ariaLabel = "Wishlist",
}) => {
  const dispatch = useAppDispatch();
  const store = useStore<RootState>();
  const reduceMotion = useReducedMotion();
  const active = useAppSelector((s) => s.buyer.wishlistIds.includes(property._id));

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const id = property._id;
      const before = store.getState().buyer.wishlistIds.includes(id);
      dispatch(toggleWishlist(property));
      const after = store.getState().buyer.wishlistIds.includes(id);
      if (before !== after) {
        showBuyerActionFeedback(
          after ? "Added to wishlist" : "Removed from wishlist"
        );
      }
    },
    [dispatch, property, store]
  );

  return (
    <motion.button
      type="button"
      whileHover={reduceMotion ? undefined : { scale: 1.06 }}
      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white shadow-sm backdrop-blur-md ring-1 ring-white/15 transition hover:bg-black/55 ${className}`}
      aria-label={ariaLabel}
      aria-pressed={active}
    >
      <Heart
        size={16}
        className={active ? "fill-red-500 text-red-500" : "text-white"}
      />
    </motion.button>
  );
};

export default WishlistButton;
