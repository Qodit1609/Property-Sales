import React, { useMemo } from "react";
import {
  MessageCircle,
  PhoneCall,
  CalendarClock,
  Download,
  Share2,
  Trash2,
  Scale,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  addToCompare,
  addToWishlist,
  clearCart,
  removeFromCart,
} from "../../features/buyer/buyerSlice";
import { useBuyerResolvedProperties } from "../../hooks/useBuyerResolvedProperties";
import PropertyCard from "../Cards/PropertyCard";
import CartGrid from "./CartGrid";
import { Button } from "@/components/common";

const Cart: React.FC = () => {
  const dispatch = useAppDispatch();
  const cartIds = useAppSelector((s) => s.buyer.cartIds);
  const { properties: cart, loading } = useBuyerResolvedProperties(cartIds);

  const totalValue = useMemo(
    () => cart.reduce((sum, p) => sum + (p.price || 0), 0),
    [cart]
  );

  if (cartIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--b2)] bg-[var(--white)] px-8 py-16 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--b1)]">
          Your property cart is empty
        </h2>
        <p className="mt-2 max-w-md text-sm text-[var(--muted)]">
          Shortlist farmland, farmhouse or resort listings to manage visits and
          enquiries in one place.
        </p>
        <Link
          to="/buyer/dashboard"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--b1)] px-5 py-2 text-sm font-semibold text-[var(--fg)] transition hover:opacity-95"
        >
          Explore listings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[var(--b1)]">
            Shortlisted properties
          </h2>
          <p className="text-xs text-[var(--muted)]">
            {cartIds.length} {cartIds.length === 1 ? "property" : "properties"} in
            your cart
            {loading ? " · Loading latest data…" : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[var(--b2-soft)] px-3 py-1 text-[11px] font-medium text-[var(--b1)] ring-1 ring-[var(--b2)]">
            Portfolio value: ₹ {totalValue.toLocaleString("en-IN")}
          </span>
          <Button
            type="button"
            variant="ghost"
            onClick={() => dispatch(clearCart())}
            className="rounded-full px-3 py-1 text-[11px] text-[var(--error)] ring-1 ring-[var(--error)]/30 hover:bg-[var(--error-bg)]"
          >
            Clear cart
          </Button>
        </div>
      </div>

      <CartGrid>
        {cart.map((property) => (
          <div
            key={property._id}
            className="grid gap-4 rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm md:grid-cols-[minmax(0,2.5fr)_minmax(0,1.5fr)]"
          >
            <div className="rounded-xl border border-[var(--b2-soft)] bg-[var(--white)] p-2">
              <PropertyCard property={property} />
            </div>

            <div className="flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--b1-mid)]">
                    Negotiation workspace
                  </p>

                  <Button
                    type="button"
                    onClick={() => dispatch(removeFromCart(property._id))}
                    variant="ghost"
                    className="rounded-full bg-[var(--error-bg)] px-3 py-1 text-[11px] font-medium text-[var(--error)] ring-1 ring-[var(--error)]/40 hover:bg-[var(--error-bg)]/80"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </Button>
                </div>

                <p className="text-xs text-slate-400">
                  Coordinate with the seller or agent directly from here. Keep
                  your communication, visits and documents organized.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-[var(--b1)]">
                <Button
                  type="button"
                  variant="primary"
                  className="justify-center px-3 py-2"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  Request callback
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="justify-center px-3 py-2"
                >
                  <CalendarClock className="h-3.5 w-3.5" />
                  Schedule visit
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="justify-center px-3 py-2"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Send enquiry
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="justify-center px-3 py-2"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download brochure
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="justify-center px-3 py-2"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share property
                </Button>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => dispatch(addToCompare(property))}
                    variant="outline"
                    className="flex-1 justify-center px-3 py-2"
                  >
                    <Scale className="h-3.5 w-3.5" />
                    Add to compare
                  </Button>

                  <Button
                    type="button"
                    onClick={() => dispatch(addToWishlist(property))}
                    variant="ghost"
                    className="flex-1 justify-center px-3 py-2"
                  >
                    Save for later
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CartGrid>
    </div>
  );
};

export default Cart;
