import React, { memo, useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { District } from "../models/homeTypes";
import { SectionHeading, SectionWrapper } from "../ui";
import { fetchPropertiesAPI } from "@/features/properties/propertyAPI";
import { fetchPropertyMediaAPI } from "@/features/media/mediaAPI";
import { mapMediaToProperties } from "@/utils/mapMediaToProperties";
import {
  collectCloudinaryUrlPool,
  pickCyclicImagesForProperty,
} from "@/utils/propertyImagePool";
import { FALLBACK_PROPERTY_IMAGE } from "@/utils/propertyFormatters";
import type { Property } from "@/features/properties/propertyType";

type DistrictExplorerSectionProps = {
  districts: District[];
};

const DistrictExplorerSection: React.FC<DistrictExplorerSectionProps> = ({ districts }) => {
  const [dynamicDistricts, setDynamicDistricts] = useState<District[]>([]);

  useEffect(() => {
    let mounted = true;

    const getDistrictValue = (property: Property): string => {
      const raw = (property as unknown as Record<string, unknown>).district;
      if (typeof raw === "string" && raw.trim()) {
        return raw.trim();
      }
      return (
        property.location?.city?.trim() ??
        property.location?.locality?.trim() ??
        property.locationText?.split(",").at(-1)?.trim() ??
        ""
      );
    };

    const slugify = (value: string) =>
      value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const loadDistricts = async () => {
      try {
        const [properties, mediaData] = await Promise.all([
          fetchPropertiesAPI(1, 50),
          fetchPropertyMediaAPI(),
        ]);

        if (!properties.length) {
          if (mounted) {
            setDynamicDistricts([]);
          }
          return;
        }

        const propertyImagesMap = mapMediaToProperties(mediaData.linked);
        const cloudinaryPool = collectCloudinaryUrlPool(mediaData.linked, mediaData.orphans);

        const districtMap = new Map<string, { count: number; sampleProperty: Property }>();

        for (const property of properties) {
          const districtName = getDistrictValue(property);
          if (!districtName) {
            continue;
          }

          const key = districtName.toLowerCase();
          const existing = districtMap.get(key);
          if (existing) {
            existing.count += 1;
          } else {
            districtMap.set(key, { count: 1, sampleProperty: property });
          }
        }

        const computedDistricts: District[] = Array.from(districtMap.entries())
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 4)
          .map(([_, value], index) => {
            const property = value.sampleProperty;
            const districtName = getDistrictValue(property);
            const fromApi = propertyImagesMap[property._id];
            const cyclic = pickCyclicImagesForProperty(property._id, cloudinaryPool, 1);
            const image =
              fromApi?.[0] ??
              cyclic[0] ??
              property.images?.[0] ??
              FALLBACK_PROPERTY_IMAGE;

            return {
              id: `district-${index + 1}`,
              name: districtName,
              listingsText: `${value.count}+ farming lands`,
              image,
              slug: slugify(districtName),
            };
          });

        if (mounted) {
          setDynamicDistricts(computedDistricts);
        }
      } catch {
        if (mounted) {
          setDynamicDistricts([]);
        }
      }
    };

    loadDistricts();

    return () => {
      mounted = false;
    };
  }, []);

  const renderedDistricts = dynamicDistricts.length ? dynamicDistricts : districts;

  return (
    <SectionWrapper className="py-12 sm:py-14" id="district-explorer">
      <SectionHeading
        eyebrow="Location explorer"
        title="Explore farmland by district"
        description="Discover district-level opportunities and quickly jump into available inventory."
      />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {renderedDistricts.map((district) => (
          <Link
            key={district.id}
            to={`/agriculture-land?district=${district.slug}`}
            className="group overflow-hidden rounded-2xl border border-[var(--b2-soft)] bg-[var(--white)] shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            aria-label={`Explore farmland listings in ${district.name}`}
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={district.image}
                alt={`Farmland in ${district.name}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-[var(--b1)]">{district.name}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{district.listingsText}</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-[var(--b1-mid)] group-hover:text-[var(--b1)]">
                View listings
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default memo(DistrictExplorerSection);
