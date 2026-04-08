import { AlertTriangle, CloudRain, Droplets, Mountain } from "lucide-react";
import type { Property } from "../../features/properties/propertyType";
import Badge from "./Badge";
import FeatureList from "./FeatureList";
import InfoItem from "./InfoItem";
import MediaGallery from "./MediaGallery";
import PropertySection from "./PropertySection";
import RiskCard from "./RiskCard";
import { formatPrice } from "../../utils/propertyFormatters";

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
    if (["true", "yes", "1", "available"].includes(normalized)) {
      return true;
    }
    if (["false", "no", "0", "not available"].includes(normalized)) {
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

const renderTagList = (items?: string[]) => {
  if (!items?.length) {
    return <p className="text-sm text-[var(--muted)]">-</p>;
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

const renderFacilityGroup = (title: string, items?: string[]) => (
  <div className="rounded-lg border border-[var(--b2-soft)] bg-[var(--b2-soft)]/20 p-3">
    <p className="text-xs font-semibold text-[var(--muted)]">{title}</p>
    {items?.length ? (
      <ul className="mt-2 space-y-1 text-sm text-[var(--b1)]">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    ) : (
      <p className="mt-2 text-sm text-[var(--muted)]">-</p>
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
  const availability = property.availabilityStatus ?? "Available";
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

  return (
    <div className="space-y-4">
      <PropertySection title="Basic Details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Title" value={property.title} />
          <InfoItem label="Property Type" value={property.propertyType} />
          <InfoItem label="Listing Type" value={property.listingType?.toUpperCase()} />
          <InfoItem label="Description" value={property.description} />
          <InfoItem label="Short Description" value={property.shortDescription} />
          <InfoItem label="Tags" value={property.tags?.length ? property.tags.join(", ") : undefined} />
        </div>
      </PropertySection>

      <PropertySection title="Location Details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Address" value={property.location?.address ?? property.address} />
          <InfoItem label="Locality" value={property.location?.locality} />
          <InfoItem label="City" value={property.location?.city} />
          <InfoItem label="State" value={property.location?.state} />
          <InfoItem label="Pincode" value={property.location?.pincode} />
          <InfoItem label="Map Link" value={mapLink} />
          <InfoItem label="Latitude" value={latitude} />
          <InfoItem label="Longitude" value={longitude} />
          <InfoItem label="GeoJSON Type" value={property.location?.geoJSON?.type} />
          <InfoItem
            label="GeoJSON Coordinates"
            value={property.location?.geoJSON?.coordinates?.length
              ? property.location.geoJSON.coordinates.join(", ")
              : undefined}
          />
          <InfoItem label="City Center Distance" value={locationDistances?.cityCenter} suffix=" km" />
          <InfoItem
            label="Railway Station Distance"
            value={locationDistances?.railwayStation ?? locationDistances?.railway}
            suffix=" km"
          />
          <InfoItem label="Highway Distance" value={locationDistances?.highway} suffix=" km" />
          <InfoItem label="Airport Distance" value={locationDistances?.airport} suffix=" km" />
        </div>
      </PropertySection>

      <PropertySection title="Pricing & Area">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Price" value={formatPrice(property.price, property.listingType)} />
          <InfoItem label="Price / Sqft" value={analytics?.pricePerSqft ?? property.pricePerSqft} />
          <InfoItem label="Area" value={areaValue} suffix={areaUnit ? ` ${areaUnit}` : undefined} />
          <InfoItem label="Land Size" value={property.landSize} suffix={property.landUnit ? ` ${property.landUnit}` : undefined} />
          <InfoItem label="Bedrooms" value={property.bedrooms ?? property.beds} />
          <InfoItem label="Bathrooms" value={property.bathrooms ?? property.baths} />
        </div>
      </PropertySection>

      <PropertySection title="Soil & Farming">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Annual Rainfall" value={rainfall?.annualRainfall} suffix=" mm" />
          <InfoItem label="Irrigation Support" value={parseBoolean(rainfall?.irrigationSupport)} />
          <InfoItem label="Soil Type" value={farming?.soilType} />
          <InfoItem label="Soil Quality Index" value={farming?.soilQualityIndex} />
          <InfoItem label="Soil Report Available" value={parseBoolean(farming?.soilReportAvailable)} />
          <InfoItem
            label="Farming Percentage"
            value={farming?.farmingPercentage ?? farming?.farmingPercent}
            suffix="%"
          />
        </div>
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-[var(--b1)]">Crop Suitability</p>
          {renderTagList(farming?.cropSuitability)}
        </div>
      </PropertySection>

      <PropertySection title="Water Resources">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Borewell Available" value={parseBoolean(water?.borewellAvailable ?? water?.borewell)} />
          <InfoItem label="Borewell Depth" value={water?.borewellDepth} suffix=" ft" />
          <InfoItem label="Water Availability" value={water?.waterAvailability} />
          <InfoItem label="Irrigation System" value={parseBoolean(water?.irrigationSystem ?? water?.irrigation)} />
          <InfoItem label="Water Certificate" value={parseBoolean(water?.waterCertificateAvailable)} />
        </div>
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-[var(--b1)]">Nearby Water Sources</p>
          {renderTagList(water?.nearbyWaterSources ?? water?.nearbySources)}
        </div>
      </PropertySection>

      <PropertySection title="Infrastructure">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Electricity Available" value={parseBoolean(infra?.electricityAvailable)} />
          <InfoItem label="Road Access" value={parseBoolean(infra?.roadAccess)} />
          <InfoItem label="Road Type" value={infra?.roadType} />
          <InfoItem label="Fencing" value={parseBoolean(infra?.fencing)} />
          <InfoItem label="Gated" value={parseBoolean(infra?.gated)} />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {renderFacilityGroup("Schools", facilities?.schools)}
          {renderFacilityGroup("Hospitals", facilities?.hospitals)}
          {renderFacilityGroup("Markets", facilities?.markets)}
          {renderFacilityGroup("Roads", facilities?.roads)}
        </div>
      </PropertySection>

      <PropertySection title="Legal Information">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Land Registry Available" value={parseBoolean(legal?.landRegistryAvailable ?? legal?.landRegistry)} />
          <InfoItem label="Ownership Documents" value={parseBoolean(legal?.ownershipDocuments ?? legal?.ownershipDocs)} />
          <InfoItem label="Encumbrance Free" value={parseBoolean(legal?.encumbranceFree ?? legal?.encumbrance)} />
          <InfoItem label="Land Use Type" value={legal?.landUseType} />
        </div>
      </PropertySection>

      <PropertySection title="Features & Amenities">
        <FeatureList
          items={[
            { label: "Construction Allowed", enabled: parseBoolean(featureFlags?.constructionAllowed) },
            { label: "Farmhouse Built", enabled: parseBoolean(featureFlags?.farmhouseBuilt) },
            { label: "Parking", enabled: parseBoolean(featureFlags?.parking ?? property.parking) },
            { label: "Security", enabled: parseBoolean(featureFlags?.security) },
            { label: "Power Backup", enabled: parseBoolean(featureFlags?.powerBackup) },
          ]}
        />
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-[var(--b1)]">Amenities</p>
          {renderTagList(property.amenities)}
        </div>
      </PropertySection>

      <PropertySection title="Media">
        <MediaGallery
          title={property.title}
          images={media?.images ?? property.images}
          videos={media?.videos ?? property.videos}
          droneView={media?.droneView}
          mapScreenshot={media?.mapScreenshot}
        />
      </PropertySection>

      <PropertySection title="Dealer Information">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Dealer Name" value={dealer.name} />
          <InfoItem label="Dealer Phone" value={dealer.phone} />
          <InfoItem label="Dealer Type" value={dealer.type} />
          <InfoItem label="Dealer Verified" value={parseBoolean(dealer.verified)} />
          <InfoItem label="Seller Name" value={seller.name} />
          <InfoItem label="Seller Phone" value={seller.phone} />
          <InfoItem label="Seller Email" value={seller.email} />
          <InfoItem label="Seller Verified" value={parseBoolean(seller.verified)} />
          <InfoItem label="Owner Name" value={owner.name} />
          <InfoItem label="Owner Phone" value={owner.phone} />
          <InfoItem label="Owner Type" value={owner.type} />
          <InfoItem label="Owner Verified" value={parseBoolean(owner.verified)} />
        </div>
      </PropertySection>

      <PropertySection title="Topography">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Slope" value={topography?.slope} />
          <InfoItem label="Elevation" value={topography?.elevation} suffix=" m" />
        </div>
      </PropertySection>

      <PropertySection title="Climate Risk">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RiskCard
            title="Flood Risk"
            description="Flood-prone area assessment based on backend climate analytics."
            activeRisk={climate?.floodRisk}
            icon={<Droplets size={16} />}
          />
          <RiskCard
            title="Drought Risk"
            description="Drought exposure based on historical weather and water support indicators."
            activeRisk={climate?.droughtRisk}
            icon={<CloudRain size={16} />}
          />
        </div>
      </PropertySection>

      <PropertySection title="Investment Insights">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem
            label="Expected ROI"
            value={parseNumber(investment?.expectedROI ?? property.analytics?.roiPercent)}
            suffix="%"
          />
          <InfoItem
            label="Appreciation Rate"
            value={parseNumber(investment?.appreciationRate ?? property.analytics?.appreciationRate)}
            suffix="%"
          />
        </div>
      </PropertySection>

      <PropertySection title="Analytics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Views" value={analytics?.views} />
          <InfoItem label="Saves" value={analytics?.saves} />
          <InfoItem label="Contact Clicks" value={analytics?.contactClicks} />
          <InfoItem label="ROI %" value={analytics?.roiPercent ?? property.roiPercent} suffix="%" />
          <InfoItem label="Appreciation Rate" value={analytics?.appreciationRate} suffix="%" />
          <InfoItem label="Price / Sqft" value={analytics?.pricePerSqft ?? property.pricePerSqft} />
        </div>
      </PropertySection>

      <PropertySection title="Status">
        <div className="flex items-center gap-2">
          <Mountain size={16} className="text-[var(--b1)]" />
          <span className="text-sm font-medium text-[var(--b1)]">Current Status</span>
          <Badge variant={getStatusVariant(availability)}>{availability}</Badge>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Approval Status" value={property.statusDetails?.approvalStatus} />
          <InfoItem label="Active Listing" value={parseBoolean(property.statusDetails?.isActive)} />
          <InfoItem label="Posted At" value={property.statusDetails?.postedAt} />
        </div>
        {!property.statusDetails?.approvalStatus ? (
          <div className="mt-3 inline-flex items-center gap-2 text-sm text-[var(--muted)]">
            <AlertTriangle size={14} />
            Status metadata is limited for this listing.
          </div>
        ) : null}
      </PropertySection>
    </div>
  );
};

export default PropertyExtendedDetails;
