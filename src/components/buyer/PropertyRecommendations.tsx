import React, { useMemo } from "react";
import { Sparkles, MapPin, Flame } from "lucide-react";
import { useAppSelector } from "../../hooks/reduxHooks";
import PropertyCard from "../Cards/PropertyCard";
import type { Property } from "../../features/properties/propertyType";

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  properties: Property[];
  empty: string;
}

const RecommendationSection: React.FC<SectionProps> = ({
  icon,
  title,
  subtitle,
  properties,
  empty,
}) => (
  <div className="rounded-2xl border border-[var(--b2-soft)] bg-gradient-to-b from-white to-[var(--b2-soft)]/25 p-4 shadow-sm">
    <div className="mb-3 flex items-start gap-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--b2-soft)] text-[var(--b1-mid)] ring-1 ring-[var(--b2)]">
        {icon}
      </span>
      <div>
        <h3 className="text-sm font-semibold text-[var(--b1)]">{title}</h3>
        <p className="text-[11px] text-[var(--muted)]">{subtitle}</p>
      </div>
    </div>
    {properties.length === 0 ? (
      <p className="rounded-xl bg-[var(--white)]/80 px-3 py-6 text-center text-xs text-[var(--muted)] ring-1 ring-[var(--b2-soft)]">
        {empty}
      </p>
    ) : (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {properties.map((p) => (
          <PropertyCard key={p._id} property={p} />
        ))}
      </div>
    )}
  </div>
);

interface Props {
  /** Optional anchor property for “similar” heuristics when on detail flows. */
  anchor?: Property | null;
  className?: string;
}

const PropertyRecommendations: React.FC<Props> = ({
  anchor = null,
  className = "",
}) => {
  const catalog = useAppSelector((s) => s.properties.data);

  const approved = useMemo(
    () => catalog.filter((p) => p.status === "approved" || !p.status),
    [catalog]
  );

  const similar = useMemo(() => {
    if (!anchor) {
      return approved.slice(0, 3);
    }
    const sameType = approved.filter(
      (p) =>
        p._id !== anchor._id &&
        p.propertyType?.toLowerCase() === anchor.propertyType?.toLowerCase()
    );
    return (sameType.length ? sameType : approved).filter((p) => p._id !== anchor._id).slice(0, 3);
  }, [anchor, approved]);

  const nearby = useMemo(() => {
    if (!anchor?.location?.city && !anchor?.address) {
      return approved.slice(0, 3);
    }
    const city = anchor.location?.city?.toLowerCase();
    const match = approved.filter((p) => {
      if (anchor && p._id === anchor._id) return false;
      if (!city) return true;
      return p.location?.city?.toLowerCase() === city || p.address?.toLowerCase().includes(city);
    });
    return match.slice(0, 3);
  }, [anchor, approved]);

  const trending = useMemo(
    () =>
      approved
        .filter((p) => p.featured || p.tags?.includes("Featured"))
        .slice(0, 3),
    [approved]
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <RecommendationSection
        icon={<Sparkles className="h-4 w-4" />}
        title="Similar properties"
        subtitle="Same property type & profile as your selection when available."
        properties={similar}
        empty="Browse listings to populate similar recommendations from live inventory."
      />
      <RecommendationSection
        icon={<MapPin className="h-4 w-4" />}
        title="Nearby properties"
        subtitle="Heuristic match by city / locality from API data."
        properties={nearby}
        empty="Location metadata will refine this section as listings include coordinates."
      />
      <RecommendationSection
        icon={<Flame className="h-4 w-4" />}
        title="Trending & featured"
        subtitle="Highlighted inventory from your current catalog."
        properties={trending.length ? trending : approved.slice(0, 3)}
        empty="No featured tags yet — showing top listings instead."
      />
    </div>
  );
};

export default PropertyRecommendations;
