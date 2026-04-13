import React, { useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useStore } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { toggleCart } from "../../features/buyer/buyerSlice";
import type { Property } from "../../features/properties/propertyType";
import type { RootState } from "../../app/store";
import { showBuyerActionFeedback } from "./buyerActionFeedback";
import { createNotificationAPI } from "../../features/notifications/notificationAPI";

interface Props {
  property: Property;
  className?: string;
}

const CartButton: React.FC<Props> = ({ property, className = "" }) => {
  const dispatch = useAppDispatch();
  const store = useStore<RootState>();
  const reduceMotion = useReducedMotion();
  const active = useAppSelector((s) => s.buyer.cartIds.includes(property._id));
  const buyerName = useAppSelector((s) => s.auth.user?.name ?? "Buyer");

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const id = property._id;
      const before = store.getState().buyer.cartIds.includes(id);
      dispatch(toggleCart(property));
      const after = store.getState().buyer.cartIds.includes(id);
      if (before !== after) {
        showBuyerActionFeedback(after ? "Added to cart" : "Removed from cart");
        if (after) {
          const rawSellerId = (property as Property & { sellerId?: unknown }).sellerId;
          const sellerId =
            typeof rawSellerId === "string"
              ? rawSellerId
              : rawSellerId && typeof rawSellerId === "object" && "_id" in (rawSellerId as Record<string, unknown>)
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
        }
      }
    },
    [buyerName, dispatch, property, store]
  );

  return (
    <motion.button
      type="button"
      whileHover={reduceMotion ? undefined : { scale: 1.06 }}
      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white shadow-sm backdrop-blur-md ring-1 ring-white/15 transition hover:bg-black/55 ${
        active ? "ring-amber-300/90" : ""
      } ${className}`}
      aria-label="Shortlist in cart"
      aria-pressed={active}
    >
      <ShoppingCart
        size={16}
        className={active ? "text-amber-200" : "text-white"}
      />
    </motion.button>
  );
};

export default CartButton;
