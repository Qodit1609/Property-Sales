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
import PropertyCard from "../Crads/PropertyCard";

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
                  <button
                    type="button"
                    onClick={() => dispatch(removeFromCart(property._id))}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--error-bg)] px-3 py-1 text-[11px] font-medium text-[var(--error)] ring-1 ring-[var(--error)]/40 hover:bg-[var(--error-bg)]/80"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Coordinate with the seller or agent directly from here. Keep
                  your communication, visits and documents organized.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-[var(--b1)]">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--b1-mid)] px-3 py-2 font-semibold text-[var(--fg)] shadow ring-1 ring-[var(--b2)] hover:bg-[var(--b1)]"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  Request callback
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--b2-soft)] px-3 py-2 font-medium text-[var(--b1)] ring-1 ring-[var(--b2)] hover:bg-[var(--b2)] hover:text-[var(--b1)]"
                >
                  <CalendarClock className="h-3.5 w-3.5" />
                  Schedule visit
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--b2-soft)] px-3 py-2 font-medium text-[var(--b1)] ring-1 ring-[var(--b2)] hover:bg-[var(--b2)] hover:text-[var(--b1)]"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Send enquiry
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--b2-soft)] px-3 py-2 font-medium text-[var(--b1)] ring-1 ring-[var(--b2)] hover:bg-[var(--b2)] hover:text-[var(--b1)]"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download brochure
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--b2-soft)] px-3 py-2 font-medium text-[var(--b1)] ring-1 ring-[var(--b2)] hover:bg-[var(--b2)] hover:text-[var(--b1)]"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share property
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => dispatch(addToCompare(property))}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--b2-soft)] px-3 py-2 font-medium text-[var(--b1)] ring-1 ring-[var(--b2)] hover:bg-[var(--b2)] hover:text-[var(--b1)]"
                  >
                    <Scale className="h-3.5 w-3.5" />
                    Add to compare
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch(addToWishlist(property))}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--white)] px-3 py-2 font-medium text-[var(--b1)] ring-1 ring-[var(--b2)] hover:bg-[var(--b2-soft)]"
                  >
                    Save for later
                  </button>
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

