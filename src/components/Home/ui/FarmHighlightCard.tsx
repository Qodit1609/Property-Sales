import React, { memo } from "react";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import type { FeaturedFarmProperty } from "../models/homeTypes";
import BadgePill from "./BadgePill";
import CTAButton from "./CTAButton";

type FarmHighlightCardProps = {
  property: FeaturedFarmProperty;
};

const FarmHighlightCard: React.FC<FarmHighlightCardProps> = ({ property }) => {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[var(--b2-soft)] bg-[var(--white)] shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={property.image}
          alt={`${property.title} at ${property.location}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          {property.verified ? <BadgePill tone="success">Verified Land</BadgePill> : null}
          <BadgePill>{property.priceLabel}</BadgePill>
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="text-lg font-semibold text-[var(--b1)]">{property.title}</h3>
        <p className="mt-1 flex items-center text-sm text-[var(--muted)]">
          <MapPin className="mr-1 h-4 w-4" aria-hidden="true" />
          {property.location}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <BadgePill tone="accent">Soil: {property.soilQuality}</BadgePill>
          <BadgePill tone="accent">Water: {property.waterAvailability}</BadgePill>
          <BadgePill tone="accent">Size: {property.landSizeAcres} acres</BadgePill>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <CTAButton to="/agriculture-land" className="px-4 py-2 text-sm">
            View Details
          </CTAButton>
          <Link
            to={`/agriculture-land?district=${property.districtSlug}`}
            className="inline-flex items-center text-sm font-medium text-[var(--b1-mid)] transition hover:text-[var(--b1)]"
            aria-label={`Map preview for ${property.title}`}
          >
            Map preview
          </Link>
        </div>
      </div>
    </article>
  );
};

export default memo(FarmHighlightCard);
