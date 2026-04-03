import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Property } from "../../features/properties/propertyType";
import WishlistButton from "./WishlistButton";
import CompareButton from "./CompareButton";
import CartButton from "./CartButton";
import SharePropertyButton from "./SharePropertyButton";
import PropertyQuickViewModal from "./PropertyQuickViewModal";

interface Props {
  property: Property;
  className?: string;
  /** When false, hides quick view (e.g. property detail preview already shows full page). */
  showQuickView?: boolean;
}

const BuyerActions: React.FC<Props> = ({
  property,
  className = "",
  showQuickView = true,
}) => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const reduceMotion = useReducedMotion();
  const [quickOpen, setQuickOpen] = useState(false);

  return (
    <>
      <div
        className={`pointer-events-auto z-20 flex flex-col items-stretch gap-1.5 ${className}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center gap-1 rounded-full bg-black/25 px-1.5 py-1 shadow-inner backdrop-blur-md ring-1 ring-white/10">
          <WishlistButton property={property} />
          <CompareButton property={property} />
          <CartButton property={property} />
          {showQuickView && (
            <motion.button
              type="button"
              whileHover={reduceMotion ? undefined : { scale: 1.06 }}
              whileTap={reduceMotion ? undefined : { scale: 0.96 }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setQuickOpen(true);
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white shadow-sm ring-1 ring-white/15 hover:bg-black/55"
              aria-label="Quick view"
            >
              <Eye size={16} />
            </motion.button>
          )}
          <SharePropertyButton property={property} />
        </div>
      </div>

      {showQuickView && (
        <PropertyQuickViewModal
          open={quickOpen}
          onClose={() => setQuickOpen(false)}
          property={property}
          language={language}
        />
      )}
    </>
  );
};

export default BuyerActions;
