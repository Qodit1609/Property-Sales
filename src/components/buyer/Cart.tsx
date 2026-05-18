import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
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
import { formatBuyerCurrency } from "../../lib/buyerI18n";

const Cart: React.FC = () => {
  const { t, i18n } = useTranslation();
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
          {t("buyerPanel.cartPage.emptyTitle")}
        </h2>
        <p className="mt-2 max-w-md text-sm text-[var(--muted)]">
          {t("buyerPanel.cartPage.emptyBody")}
        </p>
        <Link
          to="/buyer/dashboard"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--b1)] px-5 py-2 text-sm font-semibold text-[var(--fg)] transition hover:opacity-95"
        >
          {t("buyerPanel.cartPage.exploreCta")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[var(--b1)]">
            {t("buyerPanel.cartPage.shortlistedTitle")}
          </h2>
          <p className="text-xs text-[var(--muted)]">
            {t("buyerPanel.cartPage.countSummary", {
              count: cartIds.length,
              unit: cartIds.length === 1 ? t("common.property") : t("common.properties"),
            })}
            {loading ? t("buyerPanel.cartPage.loadingData") : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[var(--b2-soft)] px-3 py-1 text-[11px] font-medium text-[var(--b1)] ring-1 ring-[var(--b2)]">
            {t("buyerPanel.cartPage.portfolioValue", {
              value: formatBuyerCurrency(totalValue, i18n.language).replace(/^\u20B9\s?/, ""),
            })}
          </span>
          <Button
            type="button"
            variant="ghost"
            onClick={() => dispatch(clearCart())}
            className="rounded-full px-3 py-1 text-[11px] text-[var(--error)] ring-1 ring-[var(--error)]/30 hover:bg-[var(--error-bg)]"
          >
            {t("buyerPanel.cartPage.clearCart")}
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
                    {t("buyerPanel.cartPage.negotiationWorkspace")}
                  </p>

                  <Button
                    type="button"
                    onClick={() => dispatch(removeFromCart(property._id))}
                    variant="ghost"
                    className="rounded-full bg-[var(--error-bg)] px-3 py-1 text-[11px] font-medium text-[var(--error)] ring-1 ring-[var(--error)]/40 hover:bg-[var(--error-bg)]/80"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {t("buyerPanel.dashboard.remove")}
                  </Button>
                </div>

                <p className="text-xs text-slate-400">
                  {t("buyerPanel.cartPage.negotiationHint")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-[var(--b1)]">
                <Button
                  type="button"
                  variant="primary"
                  className="justify-center px-3 py-2"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  {t("buyerPanel.cartPage.requestCallback")}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="justify-center px-3 py-2"
                >
                  <CalendarClock className="h-3.5 w-3.5" />
                  {t("buyerPanel.cartPage.scheduleVisit")}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="justify-center px-3 py-2"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  {t("buyerPanel.cartPage.sendEnquiry")}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="justify-center px-3 py-2"
                >
                  <Download className="h-3.5 w-3.5" />
                  {t("buyerPanel.cartPage.downloadBrochure")}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="justify-center px-3 py-2"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  {t("buyerPanel.cartPage.shareProperty")}
                </Button>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => dispatch(addToCompare(property))}
                    variant="outline"
                    className="flex-1 justify-center px-3 py-2"
                  >
                    <Scale className="h-3.5 w-3.5" />
                    {t("buyerPanel.cartPage.addToCompare")}
                  </Button>

                  <Button
                    type="button"
                    onClick={() => dispatch(addToWishlist(property))}
                    variant="ghost"
                    className="flex-1 justify-center px-3 py-2"
                  >
                    {t("buyerPanel.cartPage.saveForLater")}
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
