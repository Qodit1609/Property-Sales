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

    if (fromApi?.length) return fromApi;

    const cyclic = pickCyclicImagesForProperty(property._id, cloudinaryPool, 3);

    if (cyclic.length) return cyclic;

    if (property.images?.length) return property.images;

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
    120,
  );

  const cleanDescription = shortDescription
    .replace(
      /\s*[-|,]\s*\d[\d,]*(?:\.\d+)?\s*(?:sq\.?\s*ft|sqft|square\s*feet?)\b/gi,
      "",
    )
    .replace(/\s*[-|,]\s*₹\s*\d[\d,]*(?:\.\d+)?\b/gi, "")
    .replace(/\s*[-|,]\s*$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  const isRent = property.listingType === "rent";

  const tag = isRent ? t("propertyCard.rentTag") : t("propertyCard.saleTag");

  const showFeatured = property.featured || property.tags?.includes("Featured");

  const showVerified = property.verified || property.tags?.includes("Verified");
  const availability = (property.availabilityStatus ?? "").toString().trim().toLowerCase();
  const isInactiveByStatus = property.statusDetails?.isActive === false;
  const isDeactivated =
    availability === "deactivated" || availability === "inactive" || isInactiveByStatus;
  const isSold = availability === "sold" || availability === "unavailable";
  const isBlocked = isDeactivated || isSold;
  const deactivatedMessage = t("propertyCard.deactivatedBySeller");
  const handleOpenProperty = () => {
    if (isBlocked) return;
    navigate(`/properties/${property._id}`);
  };

  return (
    <div
      tabIndex={isBlocked ? -1 : 0}
      aria-label={`${property.title}. ${t("propertyCard.viewDetails")}.`}
      onClick={handleOpenProperty}
      onKeyDown={(e) => {
        if (isBlocked) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpenProperty();
        }
      }}
      className={`group relative flex h-full w-full min-h-[20rem] flex-col overflow-hidden rounded-2xl border border-[var(--b2-soft)] bg-[var(--white)] shadow-sm outline-none transition sm:min-h-[22rem] md:min-h-[24rem] ${
        isBlocked
          ? "cursor-not-allowed"
          : "cursor-pointer hover:-translate-y-1 hover:border-[var(--b1-mid)] hover:shadow-xl"
      }`}
    >
      <span
        className="
        absolute inset-x-0 top-0
        z-20 h-[3px]
        rounded-t-2xl
        bg-gradient-to-r
        from-[var(--b1)]
        via-[var(--b1-mid)]
        to-[var(--b1)]
        opacity-0
        transition
        group-hover:opacity-100
        "
      />

      <div
        className="
      relative aspect-[16/10]
      w-full shrink-0
      overflow-hidden
      bg-gray-100
      "
      >
        {isDeactivated ? (
          <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-black/35 px-4 text-center">
            <p className="text-sm font-bold text-white md:text-base">{deactivatedMessage}</p>
          </div>
        ) : null}
        {isSold ? (
          <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-black/35 px-4 text-center">
            <p className="animate-pulse text-4xl font-black uppercase tracking-[0.14em] text-red-500 drop-shadow-[0_6px_16px_rgba(0,0,0,0.65)] md:text-5xl">
              {t("propertyCard.sold")}
            </p>
          </div>
        ) : null}
        {showImageSkeleton ? (
          <div
            className="
          h-full w-full
          animate-pulse
          bg-gray-200
          "
          />
        ) : (
          <PropertyImage
            src={primaryImage}
            alt={property.title}
            className={`h-full w-full object-cover transition-transform duration-500 ${
              isBlocked ? "blur-[2px]" : "group-hover:scale-105"
            }`}
          />
        )}

        <div
          className="
        absolute inset-x-0
        bottom-0 h-24
        bg-gradient-to-t
        from-black/35
        to-transparent
        "
        />

        <span
          className="
        absolute left-3 top-3
        rounded-full
        bg-[var(--b1)]
        px-3 py-1
        text-[11px]
        font-semibold
        text-[var(--fg)]
        "
        >
          {tag}
        </span>

        {showFeatured && (
          <span
            className="
          absolute top-3 left-20
          bg-amber-100
          px-2 py-1
          rounded-full
          text-xs
          text-amber-700
          "
          >
            <Star size={11} />
            {t("propertyCard.featured")}
          </span>
        )}

        {showVerified && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
            <ShieldCheck size={11} />
            {t("propertyCard.verified")}
          </span>
        )}

        {isBuyer && (
          <div
            className="
          absolute bottom-3
          left-1/2
          -translate-x-1/2
          w-[18rem]
          "
          >
            <BuyerActions property={property} />
          </div>
        )}
      </div>

      <div className={`flex flex-col gap-3 p-4 ${isBlocked ? "blur-[1px]" : ""}`}>
        <p
          className="
        text-[11px]
        uppercase
        text-[var(--b1-mid)]
        font-semibold
        "
        >
          {t(`postProperty.options.propertyType.${property.propertyType}`, {
            defaultValue: property.propertyType,
          })}
        </p>

        <p
          className="
        text-lg font-bold
        text-[var(--b1)]
        "
        >
          {formatINRCurrency(property.price || 0, language)}
        </p>

        <h3 className="text-[15px] font-semibold text-[var(--b1)] line-clamp-2 min-h-[48px] leading-6">
          {property.title}
        </h3>

        <div className="flex items-start gap-2 text-sm text-[var(--muted)] min-h-[40px]">
          <MapPin size={14} />
          <p className="line-clamp-2">
            {property.locationText || property.address}
          </p>
        </div>

        <div
          className="
        inline-flex items-center
        gap-2 bg-[var(--b2-soft)]
        px-3 py-1
        rounded-full
        text-xs
        "
        >
          <Ruler size={14} />
          {formatArea(areaValue, areaUnit)}
        </div>

        <div className="min-h-[44px]" >
             {cleanDescription && (
          <p
            className="
          text-sm text-[var(--muted)] line-clamp-2
          ">
            {cleanDescription}
          </p>
        )}
        </div>

     

        <Button
          disabled={isBlocked}
          className="
          mt-auto
          w-full
          bg-[var(--b1)]
          text-white
          "
        >
          {isDeactivated ? deactivatedMessage : t("propertyCard.viewDetails")}
        </Button>
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
