import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, Ruler, ShieldCheck, Star } from "lucide-react";
import { Button, PropertyImage } from "@/components/common";

import type { Property as BackendProperty } from "../../features/properties/propertyType";
import BuyerActions from "../buyer/BuyerActions";
import { formatINRCurrency } from "../../lib/i18nHelpers";
import {
  FALLBACK_PROPERTY_IMAGE,
  formatArea,
  truncateText,
} from "../../utils/propertyFormatters";
import { useAppSelector } from "../../hooks/reduxHooks";
import {
  selectCloudinaryUrlPool,
  selectMediaLoading,
  selectPropertyImagesMap,
} from "../../features/media/mediaSelectors";
import { pickCyclicImagesForProperty } from "../../utils/propertyImagePool";

interface Props {
  property: BackendProperty;
  /** When omitted, uses Redux map from GET /api/media?tag=property (single fetch). */
  propertyImagesMap?: Record<string, string[]>;
  mediaLoading?: boolean;
}

const PropertyCard: React.FC<Props> = ({
  property,
  propertyImagesMap: propertyImagesMapProp,
  mediaLoading: mediaLoadingProp,
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const user = useAppSelector((s) => s.auth.user);
  const isBuyer = Boolean(user?.role === "buyer");

  const mapFromStore = useAppSelector(selectPropertyImagesMap);
  const cloudinaryPool = useAppSelector(selectCloudinaryUrlPool);
  const loadingFromStore = useAppSelector(selectMediaLoading);
  const propertyImagesMap = propertyImagesMapProp ?? mapFromStore;
  const mediaLoading = mediaLoadingProp ?? loadingFromStore;

  const cardImages = useMemo(() => {
    const fromApi = propertyImagesMap[property._id];
    if (fromApi?.length) {
      return fromApi;
    }
    const cyclic = pickCyclicImagesForProperty(property._id, cloudinaryPool, 3);
    if (cyclic.length) {
      return cyclic;
    }
    if (property.images?.length) {
      return property.images;
    }
    return [FALLBACK_PROPERTY_IMAGE];
  }, [property._id, property.images, propertyImagesMap, cloudinaryPool]);

  const primaryImage = cardImages[0] ?? FALLBACK_PROPERTY_IMAGE;
  const showImageSkeleton =
    mediaLoading &&
    !propertyImagesMap[property._id]?.length &&
    !cloudinaryPool.length &&
    !property.images?.length;
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
      tabIndex={0}
      aria-label={`${property.title}. ${t("propertyCard.viewDetails")}.`}
      onClick={() => navigate(`/properties/${property._id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/properties/${property._id}`);
        }
      }}
      className="group relative flex h-full w-full min-h-[20rem] sm:min-h-[22rem] md:min-h-[24rem] flex-col overflow-hidden rounded-2xl border border-[var(--b2-soft)] bg-[var(--white)] shadow-sm outline-none transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:border-[var(--b1-mid)] focus-visible:-translate-y-1 focus-visible:border-[var(--b1-mid)] focus-visible:shadow-xl focus-visible:ring-2 focus-visible:ring-[var(--b1-mid)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--white)] cursor-pointer"
    >
      {/* Top accent: visible on hover/focus; avoids “missing” top edge when parent clips translate */}
      <span
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[3px] rounded-t-2xl bg-gradient-to-r from-[var(--b1)] via-[var(--b1-mid)] to-[var(--b1)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        aria-hidden
      />
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-gray-100 min-h-[10.5rem] sm:min-h-[11.5rem]">
        {showImageSkeleton ? (
          <div className="h-full w-full animate-pulse bg-gray-200" aria-hidden />
        ) : cardImages.length > 1 ? (
          <div className="relative h-full w-full">
            <PropertyImage
              src={primaryImage}
              alt={property.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <PropertyImage
              src={cardImages[1]}
              alt=""
              className="pointer-events-none absolute inset-0 z-10 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          </div>
        ) : (
          <PropertyImage
            src={primaryImage}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
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

        {isBuyer && (
          <div className="absolute bottom-12 left-1/2 z-20 w-[min(100%,18rem)] -translate-x-1/2 px-2">
            <BuyerActions property={property} className="w-full" />
          </div>
        )}

        <span className="absolute bottom-3 left-3 rounded-md bg-white/95 px-3 py-1 text-sm font-bold text-[var(--b1)] shadow">
          {formatINRCurrency(property.price || 0, language)}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
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
    <div className="flex h-full w-full min-h-[20rem] sm:min-h-[22rem] md:min-h-[24rem] flex-col overflow-hidden rounded-2xl border border-[var(--b2-soft)] bg-[var(--white)] shadow-sm animate-pulse">
      <div className="aspect-[16/10] w-full shrink-0 min-h-[10.5rem] sm:min-h-[11.5rem] bg-gray-200"></div>

      <div className="flex min-h-0 flex-1 flex-col p-4">
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