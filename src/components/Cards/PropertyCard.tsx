import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Camera,
  Heart,
  ChevronLeft,
  ChevronRight,
  BedDouble,
  Bath,
  Car,
  Ruler
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/common";

import type { Property as BackendProperty } from "../../features/properties/propertyType";
import { isSizeInAcres } from "../Data/properties";
import {
  formatINRCurrency,
  translateDynamic,
  type LocalizedValue,
} from "../../lib/i18nHelpers";

interface Props {
  property: BackendProperty;
}

const PropertyCard: React.FC<Props> = ({ property }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [index, setIndex] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
  const language = i18n.resolvedLanguage ?? i18n.language;

  const handleImageError = useCallback(
    (src: string) => setBrokenImages((prev) => new Set(prev).add(src)),
    []
  );

  const sourceProperty = property as unknown as Record<string, unknown>;
  const toLocalizedValue = (value: unknown, fallback: string): LocalizedValue => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === "string" || typeof value === "number") return value;
    if (typeof value === "object" && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }
    return fallback;
  };

  const mappedProperty: {
    _id: string;
    title: LocalizedValue;
    address: LocalizedValue;
    images: string[];
    price: number;
    propertyType: LocalizedValue;
    size: number;
    beds: number | string | null;
    baths: number | string | null;
    parking: number | string | null;
  } = {
    _id: property._id,
    title: toLocalizedValue(sourceProperty.title, t("propertyCard.untitledProperty")),
    address: toLocalizedValue(sourceProperty.address, t("propertyCard.locationNotAvailable")),
    images: property.images || [],
    price: property.price || 0,
    propertyType: toLocalizedValue(sourceProperty.propertyType, t("propertyCard.propertyFallbackType")),
    size: property.size || 0,
    beds: property.beds || null,
    baths: property.baths || null,
    parking: property.parking || null
  };

  const images =
    mappedProperty.images.length > 0
      ? mappedProperty.images
      : ["no-image"];

  const translatedPropertyType = translateDynamic(mappedProperty.propertyType, language);
  const translatedTitle = translateDynamic(mappedProperty.title, language);
  const translatedAddress = translateDynamic(mappedProperty.address, language);
  const sizeBasisPropertyType =
    typeof mappedProperty.propertyType === "string"
      ? mappedProperty.propertyType
      : translatedPropertyType;
  const isRent = translatedPropertyType
    .toLowerCase()
    .includes("rent");

  const sizeAcres = isSizeInAcres(sizeBasisPropertyType);
  const tag = isRent ? t("propertyCard.rentTag") : t("propertyCard.saleTag");

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const next = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div
      onClick={() => navigate(`/properties/${mappedProperty._id}`)}
      className="group flex h-full flex-col rounded-xl bg-[var(--white)] shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-[var(--b2-soft)] hover:border-[var(--b1-mid)] cursor-pointer"
    >
      {/* IMAGE */}
      <div className="relative h-44 sm:h-52 overflow-hidden bg-gray-100 rounded-t-xl">

        <AnimatePresence mode="wait">
          {images[index] === "no-image" || brokenImages.has(images[index]) ? (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm bg-gray-100">
              {t("propertyCard.imageNotAvailable")}
            </div>
          ) : (
            <motion.img
              key={images[index]}
              src={images[index]}
              alt={translatedTitle}
              loading="lazy"
              onError={() => handleImageError(images[index])}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) next();
                if (info.offset.x > 50) prev();
              }}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </AnimatePresence>

        {/* TAG */}
        <span className="absolute left-3 top-3 rounded-full bg-[var(--b1)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--fg)] shadow-sm">
          {tag}
        </span>

        {/* ❤️ HEART */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 transition"
        >
          <Heart
            size={18}
            className={`transition ${
              liked
                ? "fill-red-500 text-red-500"
                : "text-white"
            }`}
          />
        </button>

        {/* PRICE */}
        <span className="absolute bottom-3 left-3 rounded-md bg-[var(--white)] px-3 py-1 text-sm font-semibold text-[var(--b1)] shadow">
          {formatINRCurrency(mappedProperty.price, language)}
        </span>

        {/* IMAGE COUNT */}
        <div className="absolute bottom-3 right-14 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs text-white">
          <Camera size={13} />
          {mappedProperty.images.length}
        </div>

        {/* ARROWS */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 bg-white/80 backdrop-blur"
            >
              <ChevronLeft size={16} />
            </Button>

            <Button
              variant="ghost"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 bg-white/80 backdrop-blur"
            >
              <ChevronRight size={16} />
            </Button>
          </>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col gap-2 p-4">

        {/* TYPE */}
        <p className="text-[11px] uppercase tracking-wide text-[var(--b1-mid)] font-sans">
          {translatedPropertyType}
        </p>

        {/* TITLE */}
        <h3 className="text-[15px] font-semibold text-[var(--b1)] line-clamp-2 font-[Playfair_Display]">
          {translatedTitle}
        </h3>

        {/* ADDRESS */}
        <p className="mt-1 text-[13px] text-[var(--muted)] truncate font-sans">
          {translatedAddress}
        </p>

        {/* FEATURES */}
        <div className="mt-3 flex items-center gap-4 text-xs text-[var(--muted)] font-sans">
          {mappedProperty.beds && (
            <div className="flex items-center gap-1">
              <BedDouble size={14} />
              {mappedProperty.beds}
            </div>
          )}

          {mappedProperty.baths && (
            <div className="flex items-center gap-1">
              <Bath size={14} />
              {mappedProperty.baths}
            </div>
          )}

          {mappedProperty.parking && (
            <div className="flex items-center gap-1">
              <Car size={14} />
              {mappedProperty.parking}
            </div>
          )}

          {mappedProperty.size > 0 && (
            <div className="flex items-center gap-1">
              <Ruler size={14} />
              {mappedProperty.size}
              {sizeAcres
                ? ` ${t("propertyCard.sizeUnitAc")}`
                : ` ${t("propertyCard.sizeUnitSqft")}`}
            </div>
          )}
        </div>

        {/* BUTTON */}
        <div className="mt-auto pt-4">
          <Button
            type="button"
            size="sm"
            className="w-full bg-[var(--b1)] text-[var(--fg)] py-2 rounded-md font-medium hover:bg-[var(--b1-mid)] transition"
          >
            {t("propertyCard.viewDetails")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;

/* ================= SKELETON ================= */

export const PropertyCardSkeleton = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-[var(--white)] shadow-md border border-[var(--b2-soft)] animate-pulse">
      
      <div className="h-44 sm:h-52 bg-gray-200"></div>

      <div className="p-4 flex flex-col flex-1">
        <div className="h-3 w-24 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 w-1/2 bg-gray-200 rounded mb-4"></div>

        <div className="flex gap-4 mb-4">
          <div className="h-3 w-12 bg-gray-200 rounded"></div>
          <div className="h-3 w-12 bg-gray-200 rounded"></div>
          <div className="h-3 w-12 bg-gray-200 rounded"></div>
        </div>

        <div className="mt-auto">
          <div className="border-t border-gray-200 my-3"></div>
          <div className="h-9 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};