import React from "react";
import { useTranslation } from "react-i18next";
import type { Property } from "../../features/properties/propertyType";
import WishlistButton from "./WishlistButton";
import CompareButton from "./CompareButton";
import CartButton from "./CartButton";
import SharePropertyButton from "./SharePropertyButton";

interface Props {
  property: Property;
  className?: string;
}

const BuyerActions: React.FC<Props> = ({ property, className = "" }) => {
  const { t } = useTranslation();
  return (
    <div
      className={`pointer-events-auto z-20 flex flex-col items-stretch gap-1.5 ${className}`}
      aria-label={t("buyerPanel.actions.shareProperty")}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-center gap-1 rounded-full bg-black/25 px-1.5 py-1 shadow-inner backdrop-blur-md ring-1 ring-white/10">
        <WishlistButton property={property} />
        <CompareButton property={property} />
        <CartButton property={property} />
        <SharePropertyButton property={property} />
      </div>
    </div>
  );
};

export default BuyerActions;
