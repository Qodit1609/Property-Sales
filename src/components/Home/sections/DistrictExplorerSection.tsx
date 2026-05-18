import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { isAgricultureLandType } from "@/features/properties/propertyTypeUtils";
import { translateCity } from "@/lib/i18nHelpers";

const DistrictExplorerSection: React.FC = () => {
  const { t } = useTranslation();
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
        const PAGE_SIZE = 100;
        const MAX_PAGES = 5;
        const collectedProperties: Property[] = [];

        for (let page = 1; page <= MAX_PAGES; page += 1) {
          const batch = await fetchPropertiesAPI(page, PAGE_SIZE);
          if (!batch.length) {
            break;
          }

          collectedProperties.push(...batch);

          if (batch.length < PAGE_SIZE) {
            break;
          }
        }

        const mediaData = await fetchPropertyMediaAPI();

        if (!collectedProperties.length) {
          if (mounted) {
            setDynamicDistricts([]);
          }
          return;
        }

        const propertyImagesMap = mapMediaToProperties(mediaData.linked);
        const cloudinaryPool = collectCloudinaryUrlPool(mediaData.linked, mediaData.orphans);

        const districtMap = new Map<string, { count: number; sampleProperty?: Property; name: string }>();

        for (const property of collectedProperties) {
          if (!isAgricultureLandType(property.propertyType)) {
            continue;
          }

          const districtName = getDistrictValue(property);
          if (!districtName) {
            continue;
          }

          const key = districtName.toLowerCase();
          const existing = districtMap.get(key);
          if (existing) {
            existing.count += 1;
            if (!existing.sampleProperty) {
              existing.sampleProperty = property;
            }
          } else {
            districtMap.set(key, { count: 1, sampleProperty: property, name: districtName });
          }
        }

        const computedDistricts: District[] = Array.from(districtMap.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, 4)
          .map((districtData, index) => {
            const property = districtData.sampleProperty;
            const fromApi = property ? propertyImagesMap[property._id] : undefined;
            const cyclic = property
              ? pickCyclicImagesForProperty(property._id, cloudinaryPool, 1)
              : [];
            const image =
              fromApi?.[0] ??
              cyclic[0] ??
              property?.images?.[0] ??
              FALLBACK_PROPERTY_IMAGE;

            return {
              id: `district-${index + 1}`,
              name: districtData.name,
              listingsText: t("homeSections.districtExplorer.listingsCount", {
                count: districtData.count,
              }),
              image,
              slug: slugify(districtData.name),
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
  }, [t]);

  return (
    <SectionWrapper className="py-12 sm:py-14" id="district-explorer">
      <SectionHeading
        eyebrow={t("homeSections.districtExplorer.eyebrow")}
        title={t("homeSections.districtExplorer.title")}
        description={t("homeSections.districtExplorer.description")}
      />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dynamicDistricts.map((district) => (
          <Link
            key={district.id}
            to={`/agriculture-land?district=${encodeURIComponent(district.name)}`}
            className="group overflow-hidden rounded-2xl border border-[var(--b2-soft)] bg-[var(--white)] shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            aria-label={t("homeSections.districtExplorer.ariaExploreDistrict", {
              district: translateCity(district.name),
            })}
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={district.image}
                alt={t("homeSections.districtExplorer.imageAlt", {
                  district: translateCity(district.name),
                })}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-[var(--b1)]">
                {translateCity(district.name)}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{district.listingsText}</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-[var(--b1-mid)] group-hover:text-[var(--b1)]">
                {t("homeSections.districtExplorer.viewListings")}
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
