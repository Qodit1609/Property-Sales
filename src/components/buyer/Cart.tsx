import React from "react";
import {
  MessageCircle,
  PhoneCall,
  CalendarClock,
  Download,
  Share2,
  Trash2,
  Scale,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  addToCompare,
  addToWishlist,
  removeFromCart,
} from "../../features/buyer/buyerSlice";
import PropertyCard from "../Cards/PropertyCard";
import { Button } from "@/components/common";

const Cart: React.FC = () => {
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((state) => state.buyer);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--b2)] bg-[var(--white)] px-8 py-16 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--b1)]">
          Your property cart is empty
        </h2>
        <p className="mt-2 max-w-md text-sm text-[var(--muted)]">
          Add farmland, farmhouse or resort listings to your cart to manage
          negotiations, visits and enquiries in one place.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[var(--b1)]">
            Property cart
          </h2>
          <p className="text-xs text-[var(--muted)]">
            {cart.length} properties ready for negotiation and site visits.
          </p>
        </div>
      </div>

      <div className="space-y-4">
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
      </div>
    </div>
  );
};

export default Cart;