import { AlertTriangle, CloudRain, Droplets, Mountain } from "lucide-react";
import type { Property } from "../../features/properties/propertyType";
import { useTranslation } from "react-i18next";
import Badge from "./Badge";
import FeatureList from "./FeatureList";
import InfoItem from "./InfoItem";
import MediaGallery from "./MediaGallery";
import PropertySection from "./PropertySection";
import RiskCard from "./RiskCard";
import {
  translateAmenityValue,
  translateDynamicList,
  formatPriceLocalized,
  translateListingType,
  translatePersonType,
  translatePropertyType,
  translateSoilType,
  translateStatusValue,
} from "./previewUtils";

type PropertyExtendedDetailsProps = {
  property: Property;
};

const parseBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    if (value === 1) {
      return true;
    }
    if (value === 0) {
      return false;
    }
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "yes", "1", "available", "हाँ", "हां", "उपलब्ध"].includes(normalized)) {
      return true;
    }
    if (["false", "no", "0", "not available", "नहीं", "ना", "उपलब्ध नहीं"].includes(normalized)) {
      return false;
    }
  }

  return undefined;
};

const parseNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : undefined;
  }
  return undefined;
};

const renderTagList = (items?: string[], emptyText = "-") => {
  if (!items?.length) {
    return <p className="text-sm text-[var(--muted)]">{emptyText}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-[var(--b2-soft)] bg-[var(--b2-soft)]/20 px-3 py-1 text-xs font-semibold text-[var(--b1)]"
        >
          {item}
        </span>
      ))}
    </div>
  );
};

const renderFacilityGroup = (title: string, items?: string[], emptyText = "-") => (
  <div className="rounded-lg border border-[var(--b2-soft)] bg-[var(--b2-soft)]/20 p-3">
    <p className="text-xs font-semibold text-[var(--muted)]">{title}</p>
    {items?.length ? (
      <ul className="mt-2 space-y-1 text-sm text-[var(--b1)]">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    ) : (
      <p className="mt-2 text-sm text-[var(--muted)]">{emptyText}</p>
    )}
  </div>
);

const getStatusVariant = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === "available") {
    return "success" as const;
  }
  if (normalized === "pending") {
    return "warning" as const;
  }
  return "danger" as const;
};

const PropertyExtendedDetails = ({ property }: PropertyExtendedDetailsProps) => {
  const { t } = useTranslation();
  const locationDistances = property.location?.distances;
  const infra = property.infrastructure;
  const facilities = infra?.nearbyFacilities ?? property.location?.nearbyFacilities;
  const farming = property.soilAndFarming;
  const rainfall =
    typeof farming?.rainfallData === "string" ? undefined : farming?.rainfallData;
  const water = property.waterResources;
  const legal = property.legal;
  const featureFlags = property.features;
  const media = property.media;
  const topography = property.topography;
  const climate = property.climateRisk;
  const investment = property.investment;
  const availability = property.availabilityStatus ?? t("propertyPreview.labels.available");
  const mapLink = property.location?.googleMapLink ?? property.mapLink;
  const coordinates = property.location?.coordinates;
  const latitude = Array.isArray(coordinates)
    ? coordinates[1]
    : coordinates?.lat;
  const longitude = Array.isArray(coordinates)
    ? coordinates[0]
    : coordinates?.lng;
  const analytics = property.analytics;
  const dealer = property.dealer ?? {};
  const seller = property.seller ?? {};
  const owner = property.ownerDetails ?? {};
  const areaValue = property.area ?? property.size ?? property.landSize;
  const areaUnit = property.areaUnit ?? property.landUnit;
  const translatedAmenities = translateDynamicList(property.amenities);
  const translatedTags = translateDynamicList(property.tags);
  const translatedCropSuitability = translateDynamicList(farming?.cropSuitability);
  const translatedNearbyWaterSources = translateDynamicList(water?.nearbyWaterSources ?? water?.nearbySources);
  const translatedAvailability = translateStatusValue(availability) ?? availability;
  const translatedApprovalStatus = translateStatusValue(property.statusDetails?.approvalStatus);

  return (
    <div className="space-y-4">
      <PropertySection title={t("propertyPreview.detail.basicDetails")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label={t("propertyPreview.detail.title")} value={property.title} />
          <InfoItem label={t("propertyPreview.detail.propertyType")} value={translatePropertyType(property.propertyType)} />
          <InfoItem label={t("propertyPreview.detail.listingType")} value={translateListingType(property.listingType)} />
          <InfoItem label={t("propertyPreview.sections.description")} value={property.description} />
          <InfoItem label={t("propertyPreview.detail.shortDescription")} value={property.shortDescription} />
          <InfoItem label={t("propertyPreview.detail.tags")} value={translatedTags?.length ? translatedTags.join(", ") : undefined} />
        </div>
      </PropertySection>

      <PropertySection title={t("propertyPreview.detail.locationDetails")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label={t("propertyPreview.labels.address")} value={property.location?.address ?? property.address} />
          <InfoItem label={t("propertyPreview.detail.locality")} value={property.location?.locality} />
          <InfoItem label={t("propertyPreview.labels.city")} value={property.location?.city} />
          <InfoItem label={t("propertyPreview.labels.state")} value={property.location?.state} />
          <InfoItem label={t("propertyPreview.labels.pincode")} value={property.location?.pincode} />
          <InfoItem label={t("propertyPreview.detail.mapLink")} value={mapLink} />
          <InfoItem label={t("propertyPreview.detail.latitude")} value={latitude} />
          <InfoItem label={t("propertyPreview.detail.longitude")} value={longitude} />
          <InfoItem label={t("propertyPreview.detail.geoJsonType")} value={property.location?.geoJSON?.type} />
          <InfoItem
            label={t("propertyPreview.detail.geoJsonCoordinates")}
            value={property.location?.geoJSON?.coordinates?.length
              ? property.location.geoJSON.coordinates.join(", ")
              : undefined}
          />
          <InfoItem label={t("propertyPreview.detail.cityCenterDistance")} value={locationDistances?.cityCenter} suffix=" km" />
          <InfoItem
            label={t("propertyPreview.detail.railwayStationDistance")}
            value={locationDistances?.railwayStation ?? locationDistances?.railway}
            suffix=" km"
          />
          <InfoItem label={t("propertyPreview.detail.highwayDistance")} value={locationDistances?.highway} suffix=" km" />
          <InfoItem label={t("propertyPreview.detail.airportDistance")} value={locationDistances?.airport} suffix=" km" />
        </div>
      </PropertySection>

      <PropertySection title={t("propertyPreview.detail.pricingArea")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label={t("propertyPreview.detail.price")} value={formatPriceLocalized(property.price, property.listingType)} />
          <InfoItem label={t("propertyPreview.labels.pricePerSqft")} value={analytics?.pricePerSqft ?? property.pricePerSqft} />
          <InfoItem label={t("propertyPreview.labels.area")} value={areaValue} suffix={areaUnit ? ` ${areaUnit}` : undefined} />
          <InfoItem label={t("propertyPreview.labels.landSize")} value={property.landSize} suffix={property.landUnit ? ` ${property.landUnit}` : undefined} />
          <InfoItem label={t("propertyPreview.detail.bedrooms")} value={property.bedrooms ?? property.beds} />
          <InfoItem label={t("propertyPreview.detail.bathrooms")} value={property.bathrooms ?? property.baths} />
        </div>
      </PropertySection>

      <PropertySection title={t("propertyPreview.detail.soilFarming")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label={t("propertyPreview.detail.annualRainfall")} value={rainfall?.annualRainfall} suffix=" mm" />
          <InfoItem label={t("propertyPreview.detail.irrigationSupport")} value={parseBoolean(rainfall?.irrigationSupport)} />
          <InfoItem label={t("propertyPreview.labels.soilType")} value={translateSoilType(farming?.soilType)} />
          <InfoItem label={t("propertyPreview.labels.soilQualityIndex")} value={farming?.soilQualityIndex} />
          <InfoItem label={t("propertyPreview.detail.soilReportAvailable")} value={parseBoolean(farming?.soilReportAvailable)} />
          <InfoItem
            label={t("propertyPreview.detail.farmingPercentage")}
            value={farming?.farmingPercentage ?? farming?.farmingPercent}
            suffix="%"
          />
        </div>
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-[var(--b1)]">{t("propertyPreview.labels.cropSuitability")}</p>
          {renderTagList(translatedCropSuitability, t("propertyPreview.labels.notAvailable"))}
        </div>
      </PropertySection>

      <PropertySection title={t("propertyPreview.detail.waterResources")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label={t("propertyPreview.detail.borewellAvailable")} value={parseBoolean(water?.borewellAvailable ?? water?.borewell)} />
          <InfoItem label={t("propertyPreview.detail.borewellDepth")} value={water?.borewellDepth} suffix=" ft" />
          <InfoItem label={t("propertyPreview.labels.waterAvailability")} value={water?.waterAvailability} />
          <InfoItem label={t("propertyPreview.detail.irrigationSystem")} value={parseBoolean(water?.irrigationSystem ?? water?.irrigation)} />
          <InfoItem label={t("propertyPreview.detail.waterCertificate")} value={parseBoolean(water?.waterCertificateAvailable)} />
        </div>
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-[var(--b1)]">{t("propertyPreview.detail.nearbyWaterSources")}</p>
          {renderTagList(translatedNearbyWaterSources, t("propertyPreview.labels.notAvailable"))}
        </div>
      </PropertySection>

      <PropertySection title={t("propertyPreview.detail.infrastructure")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label={t("propertyPreview.detail.electricityAvailable")} value={parseBoolean(infra?.electricityAvailable)} />
          <InfoItem label={t("propertyPreview.detail.roadAccess")} value={parseBoolean(infra?.roadAccess)} />
          <InfoItem label={t("propertyPreview.detail.roadType")} value={infra?.roadType} />
          <InfoItem label={t("propertyPreview.detail.fencing")} value={parseBoolean(infra?.fencing)} />
          <InfoItem label={t("propertyPreview.detail.gated")} value={parseBoolean(infra?.gated)} />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {renderFacilityGroup(t("propertyPreview.labels.schools"), facilities?.schools, t("propertyPreview.labels.notAvailable"))}
          {renderFacilityGroup(t("propertyPreview.labels.hospitals"), facilities?.hospitals, t("propertyPreview.labels.notAvailable"))}
          {renderFacilityGroup(t("propertyPreview.labels.markets"), facilities?.markets, t("propertyPreview.labels.notAvailable"))}
          {renderFacilityGroup(t("propertyPreview.detail.roads"), facilities?.roads, t("propertyPreview.labels.notAvailable"))}
        </div>
      </PropertySection>

      <PropertySection title={t("propertyPreview.detail.legalInformation")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label={t("propertyPreview.detail.landRegistryAvailable")} value={parseBoolean(legal?.landRegistryAvailable ?? legal?.landRegistry)} />
          <InfoItem label={t("propertyPreview.detail.ownershipDocuments")} value={parseBoolean(legal?.ownershipDocuments ?? legal?.ownershipDocs)} />
          <InfoItem label={t("propertyPreview.detail.encumbranceFree")} value={parseBoolean(legal?.encumbranceFree ?? legal?.encumbrance)} />
          <InfoItem label={t("propertyPreview.labels.landUseType")} value={legal?.landUseType} />
        </div>
      </PropertySection>

      <PropertySection title={t("propertyPreview.detail.featuresAmenities")}>
        <FeatureList
          items={[
            { label: t("propertyPreview.labels.constructionAllowed"), enabled: parseBoolean(featureFlags?.constructionAllowed) },
            { label: t("propertyPreview.detail.farmhouseBuilt"), enabled: parseBoolean(featureFlags?.farmhouseBuilt) },
            { label: t("propertyPreview.labels.parking"), enabled: parseBoolean(featureFlags?.parking ?? property.parking) },
            { label: t("propertyPreview.labels.security"), enabled: parseBoolean(featureFlags?.security) },
            { label: t("propertyPreview.labels.powerBackup"), enabled: parseBoolean(featureFlags?.powerBackup) },
          ]}
        />
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-[var(--b1)]">{t("propertyPreview.detail.amenities")}</p>
          {renderTagList(translatedAmenities?.map((item) => translateAmenityValue(item) ?? item), t("propertyPreview.labels.notAvailable"))}
        </div>
      </PropertySection>

      <PropertySection title={t("propertyPreview.detail.media")}>
        <MediaGallery
          title={property.title}
          images={media?.images ?? property.images}
          videos={media?.videos ?? property.videos}
          droneView={media?.droneView}
          mapScreenshot={media?.mapScreenshot}
        />
      </PropertySection>

      <PropertySection title={t("propertyPreview.detail.dealerInformation")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label={t("propertyPreview.detail.dealerName")} value={dealer.name} />
          <InfoItem label={t("propertyPreview.detail.dealerPhone")} value={dealer.phone} />
          <InfoItem label={t("propertyPreview.detail.dealerType")} value={translatePersonType(dealer.type)} />
          <InfoItem label={t("propertyPreview.detail.dealerVerified")} value={parseBoolean(dealer.verified)} />
          <InfoItem label={t("propertyPreview.detail.sellerName")} value={seller.name} />
          <InfoItem label={t("propertyPreview.detail.sellerPhone")} value={seller.phone} />
          <InfoItem label={t("propertyPreview.detail.sellerEmail")} value={seller.email} />
          <InfoItem label={t("propertyPreview.detail.sellerVerified")} value={parseBoolean(seller.verified)} />
          <InfoItem label={t("propertyPreview.detail.ownerName")} value={owner.name} />
          <InfoItem label={t("propertyPreview.detail.ownerPhone")} value={owner.phone} />
          <InfoItem label={t("propertyPreview.detail.ownerType")} value={translatePersonType(owner.type)} />
          <InfoItem label={t("propertyPreview.detail.ownerVerified")} value={parseBoolean(owner.verified)} />
        </div>
      </PropertySection>

      <PropertySection title={t("propertyPreview.detail.topography")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label={t("propertyPreview.detail.slope")} value={topography?.slope} />
          <InfoItem label={t("propertyPreview.detail.elevation")} value={topography?.elevation} suffix=" m" />
        </div>
      </PropertySection>

      <PropertySection title={t("propertyPreview.detail.climateRisk")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RiskCard
            title={t("propertyPreview.detail.floodRisk")}
            description={t("propertyPreview.messages.floodRiskDescription")}
            activeRisk={climate?.floodRisk}
            icon={<Droplets size={16} />}
          />
          <RiskCard
            title={t("propertyPreview.detail.droughtRisk")}
            description={t("propertyPreview.messages.droughtRiskDescription")}
            activeRisk={climate?.droughtRisk}
            icon={<CloudRain size={16} />}
          />
        </div>
      </PropertySection>

      <PropertySection title={t("propertyPreview.detail.investmentInsights")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem
            label={t("propertyPreview.detail.expectedRoi")}
            value={parseNumber(investment?.expectedROI ?? property.analytics?.roiPercent)}
            suffix="%"
          />
          <InfoItem
            label={t("propertyPreview.labels.appreciationRate")}
            value={parseNumber(investment?.appreciationRate ?? property.analytics?.appreciationRate)}
            suffix="%"
          />
        </div>
      </PropertySection>

      <PropertySection title={t("propertyPreview.sections.analytics")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label={t("propertyPreview.labels.views")} value={analytics?.views} />
          <InfoItem label={t("propertyPreview.labels.saves")} value={analytics?.saves} />
          <InfoItem label={t("propertyPreview.labels.contactClicks")} value={analytics?.contactClicks} />
          <InfoItem label={t("propertyPreview.detail.roiPercent")} value={analytics?.roiPercent ?? property.roiPercent} suffix="%" />
          <InfoItem label={t("propertyPreview.labels.appreciationRate")} value={analytics?.appreciationRate} suffix="%" />
          <InfoItem label={t("propertyPreview.labels.pricePerSqft")} value={analytics?.pricePerSqft ?? property.pricePerSqft} />
        </div>
      </PropertySection>

      <PropertySection title={t("propertyPreview.detail.status")}>
        <div className="flex items-center gap-2">
          <Mountain size={16} className="text-[var(--b1)]" />
          <span className="text-sm font-medium text-[var(--b1)]">{t("propertyPreview.detail.currentStatus")}</span>
          <Badge variant={getStatusVariant(availability)}>{translatedAvailability}</Badge>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label={t("propertyPreview.detail.approvalStatus")} value={translatedApprovalStatus} />
          <InfoItem label={t("propertyPreview.detail.activeListing")} value={parseBoolean(property.statusDetails?.isActive)} />
          <InfoItem label={t("propertyPreview.detail.postedAt")} value={property.statusDetails?.postedAt} />
        </div>
        {!property.statusDetails?.approvalStatus ? (
          <div className="mt-3 inline-flex items-center gap-2 text-sm text-[var(--muted)]">
            <AlertTriangle size={14} />
            {t("propertyPreview.messages.statusMetadataLimited")}
          </div>
        ) : null}
      </PropertySection>
    </div>
  );
};

export default PropertyExtendedDetails;
