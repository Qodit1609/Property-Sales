import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart, MapPin, Ruler, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/common";

import type { Property as BackendProperty } from "../../features/properties/propertyType";
import { formatINRCurrency } from "../../lib/i18nHelpers";
import {
  FALLBACK_PROPERTY_IMAGE,
  formatArea,
  truncateText,
} from "../../utils/propertyFormatters";

interface Props {
  property: BackendProperty;
}

const PropertyCard: React.FC<Props> = ({ property }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const language = i18n.resolvedLanguage ?? i18n.language;

  const primaryImage = property.images?.[0] || FALLBACK_PROPERTY_IMAGE;
  const areaValue = property.area ?? property.size ?? property.landSize;
  const areaUnit = property.areaUnit ?? property.landUnit;
  const shortDescription = truncateText(
    property.shortDescription || property.description,
    120
  );
  const cleanDescription = shortDescription
    .replace(
      /\s*[-|,]\s*\d[\d,]*(?:\.\d+)?\s*(?:sq\.?\s*ft|sqft|square\s*feet?)\b/gi,
      ""
    )
    .replace(/\s*[-|,]\s*₹\s*\d[\d,]*(?:\.\d+)?\b/gi, "")
    .replace(/\s*[-|,]\s*$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  const isRent = property.listingType === "rent";
  const tag = isRent ? t("propertyCard.rentTag") : t("propertyCard.saleTag");
  const showFeatured = property.featured || property.tags?.includes("Featured");
  const showVerified = property.verified || property.tags?.includes("Verified");

  return (
    <div
      onClick={() => navigate(`/properties/${property._id}`)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--b2-soft)] bg-[var(--white)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[var(--b1-mid)] hover:ring-1 hover:ring-[var(--b1-mid)]/15 cursor-pointer"
    >
      <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden bg-gray-100">
        <img
          src={imageFailed ? FALLBACK_PROPERTY_IMAGE : primaryImage}
          alt={property.title}
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-[var(--b1)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--fg)] shadow-sm">
          {tag}
        </span>

        {showFeatured && (
          <span className="absolute top-3 left-20 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
            <Star size={11} className="fill-amber-500 text-amber-500" />
            Featured
          </span>
        )}

        {showVerified && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
            <ShieldCheck size={11} />
            Verified
          </span>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className={`absolute bottom-12 right-3 p-2 rounded-full backdrop-blur-md transition ${
            liked ? "bg-red-100/95" : "bg-black/35 hover:bg-black/55"
          }`}
          aria-label="Toggle favourite"
        >
          <Heart
            size={18}
            className={`transition ${
              liked ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </button>

        <span className="absolute bottom-3 left-3 rounded-md bg-white/95 px-3 py-1 text-sm font-bold text-[var(--b1)] shadow">
          {formatINRCurrency(property.price || 0, language)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-[11px] uppercase tracking-wide text-[var(--b1-mid)] font-semibold">
          {property.propertyType}
        </p>

        <h3 className="text-[15px] font-semibold text-[var(--b1)] line-clamp-2 leading-6">
          {property.title}
        </h3>

        <div className="flex items-center gap-1.5 text-[13px] text-[var(--muted)]">
          <MapPin size={14} className="shrink-0 text-[var(--b1-mid)]" />
          <p className="truncate">{property.locationText || property.address}</p>
        </div>

        <div className="mt-1 flex items-center justify-start">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--b2-soft)] px-3 py-1.5 text-xs font-medium text-[var(--b1)] border border-[var(--b2)]">
              <Ruler size={14} />
              {formatArea(areaValue, areaUnit)}
          </div>
        </div>

        {cleanDescription && (
          <p className="text-[13px] leading-5 text-[var(--muted)] line-clamp-2">
            {cleanDescription}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-[var(--b2-soft)]/80">
          <Button
            type="button"
            size="sm"
            className="w-full rounded-lg bg-[var(--b1)] py-2.5 text-[var(--fg)] font-semibold tracking-wide hover:bg-[var(--b1-mid)] transition"
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
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--b2-soft)] bg-[var(--white)] shadow-sm animate-pulse">
      <div className="h-48 sm:h-52 md:h-56 bg-gray-200"></div>

      <div className="p-4 flex flex-col flex-1">
        <div className="mb-3 h-3 w-20 rounded bg-gray-200"></div>
        <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
        <div className="mb-4 h-3 w-2/3 rounded bg-gray-200"></div>

        <div className="mb-4 flex gap-3">
          <div className="h-3 w-16 rounded bg-gray-200"></div>
          <div className="h-3 w-16 rounded bg-gray-200"></div>
        </div>
        <div className="mb-4 h-3 w-full rounded bg-gray-200"></div>
        <div className="mb-2 h-3 w-5/6 rounded bg-gray-200"></div>

        <div className="mt-auto">
          <div className="my-3 border-t border-gray-200"></div>
          <div className="h-9 rounded-md bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};