import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Ruler } from "lucide-react";
import Modal from "../Modal/Modal";
import { Button, PropertyImage } from "@/components/common";
import type { Property } from "../../features/properties/propertyType";
import { formatINRCurrency } from "../../lib/i18nHelpers";
import { formatArea, FALLBACK_PROPERTY_IMAGE } from "../../utils/propertyFormatters";

interface Props {
  open: boolean;
  onClose: () => void;
  property: Property;
  language: string;
}

const PropertyQuickViewModal: React.FC<Props> = ({
  open,
  onClose,
  property,
  language,
}) => {
  const img = property.images?.[0] ?? FALLBACK_PROPERTY_IMAGE;
  const areaValue = property.area ?? property.size ?? property.landSize;
  const areaUnit = property.areaUnit ?? property.landUnit;

  return (
    <Modal open={open} onClose={onClose} title={property.title}>
      <div className="grid gap-4 sm:grid-cols-[1fr_1.1fr]">
        <div className="overflow-hidden rounded-xl border border-[var(--b2-soft)] bg-[var(--b2-soft)]/30">
          <PropertyImage
            src={img}
            alt={property.title}
            className="aspect-[16/10] w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-3 text-[var(--b1)]">
          <p className="text-2xl font-bold tracking-tight">
            {formatINRCurrency(property.price || 0, language)}
          </p>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--b1-mid)]">
            {property.propertyType}
          </p>
          <div className="flex items-start gap-2 text-sm text-[var(--muted)]">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--b1-mid)]" />
            <span>{property.locationText || property.address}</span>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full bg-[var(--b2-soft)] px-3 py-1.5 text-xs font-medium text-[var(--b1)] ring-1 ring-[var(--b2)]">
            <Ruler size={14} />
            {formatArea(areaValue, areaUnit)}
          </div>
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            <Link
              to={`/properties/${property._id}`}
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-lg bg-[var(--b1)] px-4 py-2 text-sm font-medium text-[var(--fg)] transition hover:opacity-95"
            >
              View full details
            </Link>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-lg px-4 py-2"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PropertyQuickViewModal;
