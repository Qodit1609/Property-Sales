import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, BarChart3, MapPin, PhoneCall, ShieldCheck, Star } from "lucide-react";
import type { Property } from "../../features/properties/propertyType";
import { Button } from "@/components/common";
import Header from "../Header/Header";
import { formatPrice } from "../../utils/propertyFormatters";
import AgentCard from "./AgentCard";
import PropertyFeatureList from "./PropertyFeatureList";
import PropertyFarming from "./PropertyFarming";
import PropertyGallery from "./PropertyGallery";
import PropertyHighlights from "./PropertyHighlights";
import PropertyLegal from "./PropertyLegal";
import PropertyLocation from "./PropertyLocation";
import PropertyExtendedDetails from "./PropertyExtendedDetails";
import PropertyTabs, { type PropertyTab } from "./PropertyTabs";
import PropertyWater from "./PropertyWater";
import {
  formatCompactNumber,
  formatSqftPrice,
  getDisplayAddress,
  getLatLng,
  getOverviewSpecs,
  getPrimaryContact,
  toMapLink,
  yesNoOptional,
} from "./previewUtils";

type Props = {
  property: Property;
};

const PropertyPreview = ({ property }: Props) => {
  const navigate = useNavigate();
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const { phone } = getPrimaryContact(property);
  const mapCoordinates = useMemo(() => getLatLng(property), [property]);
  const mapLink = useMemo(() => toMapLink(property), [property]);
  const mapEmbedUrl = useMemo(() => {
    if (!mapCoordinates) {
      return undefined;
    }

    const { lat, lng } = mapCoordinates;
    return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  }, [mapCoordinates]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowStickyHeader(window.scrollY > 260);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const overviewSpecs = useMemo(() => getOverviewSpecs(property), [property]);
  const features = [
    { label: "Parking", value: yesNoOptional(property.features?.parking ?? property.parking) },
    { label: "Power Backup", value: yesNoOptional(property.features?.powerBackup) },
    { label: "Security", value: yesNoOptional(property.features?.security) },
    {
      label: "Construction Allowed",
      value: yesNoOptional(property.features?.constructionAllowed ?? property.legal?.constructionAllowed),
    },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));
  const investment = [
    {
      label: "ROI",
      value: Number.isFinite(property.analytics?.roiPercent ?? property.roiPercent)
        ? `${property.analytics?.roiPercent ?? property.roiPercent}%`
        : undefined,
    },
    {
      label: "Appreciation Rate",
      value: Number.isFinite(property.analytics?.appreciationRate)
        ? `${property.analytics?.appreciationRate}%`
        : undefined,
    },
    { label: "Price / Sqft", value: formatSqftPrice(property) },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value && item.value !== "\u2014"));
  const topOverviewSpecs = overviewSpecs.slice(0, 4);

  const tabs: PropertyTab[] = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <div className="space-y-5">
          <div>
            <h3 className="text-base font-semibold text-[var(--b1)]">Description</h3>
            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[var(--muted)] sm:text-base">
              {property.description || "\u2014"}
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-[var(--b1)]">Property Specs</h3>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {overviewSpecs.map((spec) => (
                <div
                  key={spec.label}
                  className="rounded-lg border border-[var(--b2-soft)] bg-[var(--b2-soft)]/20 px-3 py-2"
                >
                  <p className="text-xs text-[var(--muted)]">{spec.label}</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--b1)]">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    { id: "features", label: "Features", content: <PropertyFeatureList items={features} /> },
    { id: "location", label: "Location", content: <PropertyLocation property={property} /> },
    { id: "legal", label: "Legal", content: <PropertyLegal property={property} /> },
    { id: "farming", label: "Farming", content: <PropertyFarming property={property} /> },
    { id: "water", label: "Water", content: <PropertyWater property={property} /> },
    { id: "investment", label: "Investment", content: <PropertyFeatureList items={investment} /> },
    { id: "details", label: "Detailed Insights", content: <PropertyExtendedDetails property={property} /> },
  ];

  if (!property) {
    return (
      <div className="pt-24 text-center">
        <p className="text-lg font-semibold text-[var(--b1)]">Property not found</p>
        <Button
          onClick={() => navigate("/")}
          className="mt-4 rounded-full bg-[var(--b1-mid)] px-4 py-2 text-sm text-[var(--fg)]"
        >
          Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[var(--fg)] pt-20 sm:pt-24">
      <Header forceSolid />

      {showStickyHeader && (
        <div className="fixed left-0 right-0 top-[72px] z-40 border-b border-[var(--b2-soft)] bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--b1)]">{property.title}</p>
              <p className="text-xs text-[var(--muted)]">{formatPrice(property.price, property.listingType)}</p>
            </div>
            <Button
              className="bg-[var(--b1)] px-3 py-2 text-xs text-[var(--fg)] hover:bg-[var(--b1-mid)]"
              onClick={() => {
                if (phone) {
                  window.location.href = `tel:${phone}`;
                }
              }}
              disabled={!phone}
            >
              Contact Agent
            </Button>
          </div>
        </div>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6 md:pb-20 lg:px-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
          <div className="space-y-4 sm:space-y-5 lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-[var(--b2-soft)] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
              <div className="border-b border-[var(--b2-soft)] bg-gradient-to-r from-[var(--b2-soft)]/35 via-white to-white p-4 sm:p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[var(--b2-soft)] px-3 py-1 text-xs font-semibold text-[var(--b1)]">
                    {property.propertyType}
                  </span>
                  {property.listingType && (
                    <span className="rounded-full bg-[var(--b2-soft)] px-3 py-1 text-xs font-semibold text-[var(--b1)]">
                      {property.listingType.toUpperCase()}
                    </span>
                  )}
                  {property.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      <Star size={12} className="fill-amber-500 text-amber-500" />
                      Featured
                    </span>
                  )}
                  {property.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      <ShieldCheck size={12} />
                      Verified
                    </span>
                  )}
                </div>

                <h1 className="text-xl font-bold leading-tight text-[var(--b1)] sm:text-3xl">
                  {property.title}
                </h1>

                <p className="mt-2 text-sm text-[var(--muted)] sm:text-base">
                  {property.shortDescription || property.description}
                </p>

                <div className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-full bg-[var(--b2-soft)]/40 px-3 py-1.5 text-sm text-[var(--muted)]">
                  <MapPin size={14} className="shrink-0" />
                  <span className="truncate">{getDisplayAddress(property)}</span>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="flex flex-col gap-4 border-b border-[var(--b2-soft)] pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-2xl font-extrabold text-[var(--b1)] sm:text-3xl">
                      {formatPrice(property.price, property.listingType)}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--muted)]">{formatSqftPrice(property)}</p>
                  </div>
                  <div className="hidden items-center gap-2 sm:flex">
                    {mapLink && (
                      <a
                        href={mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-[var(--b2-soft)] px-3 py-2 text-sm font-semibold text-[var(--b1)] transition hover:bg-[var(--b2-soft)]/40"
                      >
                        View Location
                        <ArrowUpRight size={14} />
                      </a>
                    )}
                    <Button
                      className="rounded-lg bg-[var(--b1)] px-4 py-2 text-sm text-[var(--fg)] shadow-sm hover:bg-[var(--b1-mid)]"
                      onClick={() => {
                        if (phone) {
                          window.location.href = `tel:${phone}`;
                        }
                      }}
                      disabled={!phone}
                    >
                      <PhoneCall size={15} />
                      Contact Agent
                    </Button>
                  </div>
                </div>

                {topOverviewSpecs.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:grid-cols-4 sm:gap-3">
                    {topOverviewSpecs.map((spec) => (
                      <div key={spec.label} className="rounded-xl border border-[var(--b2-soft)] bg-[var(--b2-soft)]/15 p-3">
                        <p className="text-[11px] text-[var(--muted)] sm:text-xs">{spec.label}</p>
                        <p className="mt-1 text-sm font-semibold text-[var(--b1)] sm:text-base">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <PropertyGallery property={property} />
            <PropertyHighlights property={property} />

            <section className="rounded-2xl border border-[var(--b2-soft)] bg-white p-4 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <span className="rounded-full bg-[var(--b2-soft)] px-3 py-1 text-xs font-semibold text-[var(--b1)]">
                  Location Intelligence
                </span>
                <div>
                  <h3 className="text-base font-semibold text-[var(--b1)] sm:text-lg">Location Map</h3>
                  <p className="mt-1 text-xs text-[var(--muted)] sm:text-sm">
                    {mapCoordinates
                      ? `Lat: ${mapCoordinates.lat}, Lng: ${mapCoordinates.lng}`
                      : "Coordinates not available for this property."}
                  </p>
                </div>
                {mapLink && (
                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-lg border border-[var(--b2-soft)] px-3 py-2 text-sm font-semibold text-[var(--b1)] transition hover:bg-[var(--b2-soft)]/40"
                  >
                    Open in Google Maps
                  </a>
                )}
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-[var(--b2-soft)] bg-[var(--b2-soft)]/20">
                {mapEmbedUrl ? (
                  <iframe
                    title={`${property.title} location map`}
                    src={mapEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-64 w-full sm:h-80 lg:h-[430px]"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center px-4 text-center text-sm text-[var(--muted)] sm:h-72">
                    Map preview is unavailable because this listing has no valid latitude/longitude.
                  </div>
                )}
              </div>
            </section>

            <PropertyTabs tabs={tabs} />

            <section className="rounded-2xl border border-[var(--b2-soft)] bg-white p-4 sm:p-6">
              <h3 className="text-base font-semibold text-[var(--b1)]">Analytics</h3>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <AnalyticsStatCard
                  label="Views"
                  value={formatCompactNumber(property.analytics?.views)}
                />
                <AnalyticsStatCard
                  label="Saves"
                  value={formatCompactNumber(property.analytics?.saves)}
                />
                <AnalyticsStatCard
                  label="Contact Clicks"
                  value={formatCompactNumber(property.analytics?.contactClicks)}
                />
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <div className="lg:sticky lg:top-24 lg:space-y-4">
              <AgentCard property={property} />
              <section className="rounded-2xl border border-[var(--b2-soft)] bg-white p-5 sm:p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-[var(--b1)]">
                  <BarChart3 size={18} />
                  Quick Analytics
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                  <li>Views: {formatCompactNumber(property.analytics?.views)}</li>
                  <li>Saves: {formatCompactNumber(property.analytics?.saves)}</li>
                  <li>Contact Clicks: {formatCompactNumber(property.analytics?.contactClicks)}</li>
                </ul>
              </section>
              <section className="rounded-2xl border border-[var(--b2-soft)] bg-white p-5 sm:p-6">
                <h3 className="text-base font-semibold text-[var(--b1)]">Why this property?</h3>
                <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                  <li className="rounded-lg bg-[var(--b2-soft)]/20 px-3 py-2">Clear pricing and transparent details</li>
                  <li className="rounded-lg bg-[var(--b2-soft)]/20 px-3 py-2">Verified owner/agent support for safer transactions</li>
                  <li className="rounded-lg bg-[var(--b2-soft)]/20 px-3 py-2">Complete location, legal, and utility insights in one view</li>
                </ul>
              </section>
            </div>
          </aside>
        </div>
      </section>

      <div className="fixed bottom-3 left-3 right-3 z-40 md:hidden">
        <div className="rounded-2xl border border-[var(--b2-soft)] bg-white/95 p-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.14)] backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[11px] text-[var(--muted)]">Starting from</p>
              <p className="truncate text-sm font-bold text-[var(--b1)]">
                {formatPrice(property.price, property.listingType)}
              </p>
            </div>
            <Button
              className="rounded-xl bg-[var(--b1)] px-4 py-2.5 text-sm text-[var(--fg)] shadow-sm hover:bg-[var(--b1-mid)]"
              onClick={() => {
                if (phone) {
                  window.location.href = `tel:${phone}`;
                }
              }}
              disabled={!phone}
            >
              <PhoneCall size={16} />
              Contact Agent
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPreview;

const AnalyticsStatCard = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="rounded-lg border border-[var(--b2-soft)] bg-[var(--b2-soft)]/20 px-3 py-2">
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-base font-bold text-[var(--b1)]">{value}</p>
    </div>
  );
};

export const PropertyPreviewSkeleton = () => (
  <div className="animate-pulse bg-[var(--fg)] pt-24">
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-20 sm:px-6 lg:grid-cols-3 lg:px-8">
      <div className="space-y-4 lg:col-span-2">
        <div className="h-44 rounded-2xl bg-gray-200" />
        <div className="h-[280px] rounded-2xl bg-gray-200 sm:h-[380px]" />
        <div className="h-32 rounded-2xl bg-gray-200" />
        <div className="h-64 rounded-2xl bg-gray-200" />
        <div className="h-36 rounded-2xl bg-gray-200" />
      </div>
      <div className="space-y-4">
        <div className="h-64 rounded-2xl bg-gray-200" />
        <div className="h-40 rounded-2xl bg-gray-200" />
      </div>
    </div>
  </div>
);
