import { LandPlot, Sprout, TrendingUp, Compass, BedDouble, Bath } from "lucide-react";
import type { Property } from "../../features/properties/propertyType";
import { formatArea } from "../../utils/propertyFormatters";

type PropertyHighlightsProps = {
  property: Property;
};

const highlightCardClass =
  "rounded-xl border border-[var(--b2-soft)] bg-white px-4 py-3 shadow-sm";

const PropertyHighlights = ({ property }: PropertyHighlightsProps) => {
  const area = formatArea(property.area ?? property.size ?? property.landSize, property.areaUnit ?? property.landUnit);
  const landSize = formatArea(property.landSize ?? property.area, property.landUnit ?? property.areaUnit);
  const beds = property.bedrooms ?? property.beds;
  const baths = property.bathrooms ?? property.baths;
  const facing = property.features?.facing ?? property.facing;
  const roi = property.analytics?.roiPercent ?? property.roiPercent;
  const soilType = property.soilAndFarming?.soilType ?? property.soilType;

  const cards = [
    { label: "Area", value: area, icon: LandPlot },
    { label: "Land Size", value: landSize, icon: LandPlot },
    {
      label: "Bedrooms / Bathrooms",
      value: beds || baths ? `${beds ?? 0} / ${baths ?? 0}` : "",
      icon: beds || baths ? BedDouble : Bath,
    },
    { label: "Facing", value: facing ? String(facing) : "", icon: Compass },
    { label: "ROI", value: Number.isFinite(roi) ? `${roi}%` : "", icon: TrendingUp },
    { label: "Soil Type", value: soilType ?? "", icon: Sprout },
  ].filter((card) => card.value.trim().length > 0);

  return (
    <section className="rounded-2xl border border-[var(--b2-soft)] bg-white p-4 sm:p-5">
      <h2 className="text-lg font-semibold text-[var(--b1)]">Key Highlights</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className={highlightCardClass}>
            <p className="flex items-center gap-2 text-xs text-[var(--muted)]">
              <card.icon size={14} />
              {card.label}
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--b1)]">{card.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertyHighlights;
