import React, { memo, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { FeaturedFarmProperty } from "../models/homeTypes";
import { SectionHeading, SectionWrapper } from "../ui";
import { fetchPropertiesAPI } from "@/features/properties/propertyAPI";
import type { Property } from "@/features/properties/propertyType";
import PropertyCard from "@/components/Cards/PropertyCard";

type FeaturedFarmsSectionProps = {
  properties: FeaturedFarmProperty[];
};

const FeaturedFarmsSection: React.FC<FeaturedFarmsSectionProps> = ({ properties: _properties }) => {
  const [apiProperties, setApiProperties] = useState<Property[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadTopFarmingProperties = async () => {
      try {
        const response = await fetchPropertiesAPI(1, 50);
        if (mounted) {
          setApiProperties(response);
        }
      } catch {
        if (mounted) {
          setApiProperties([]);
        }
      }
    };

    loadTopFarmingProperties();

    return () => {
      mounted = false;
    };
  }, []);

  const topFarmingProperties = useMemo<Array<{ property: Property; farmingPercentage: number }>>(() => {
    const toNumber = (value: unknown): number | null => {
      if (typeof value === "number" && Number.isFinite(value)) {
        return value;
      }
      if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
      }
      return null;
    };

    return apiProperties
      .map((property) => {
        const farmingPercentage =
          toNumber(property.soilAndFarming?.farmingPercentage ?? property.soilAndFarming?.farmingPercent) ?? null;
        if (farmingPercentage === null) {
          return null;
        }
        return { property, farmingPercentage };
      })
      .filter(
        (item): item is { property: Property; farmingPercentage: number } => item !== null,
      )
      .sort((a, b) => {
        return b.farmingPercentage - a.farmingPercentage;
      })
      .slice(0, 4);
  }, [apiProperties]);

  return (
    <SectionWrapper className="py-12 sm:py-14" id="featured-farms">
      <SectionHeading
        eyebrow="Featured farms"
        title="Handpicked farming land opportunities"
        description="Compare high-potential farmland parcels with practical metrics to make faster and safer buying decisions."
      />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {topFarmingProperties.map(({ property, farmingPercentage }, index) => (
          <motion.div
            key={property._id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className="relative"
          >
            <div className="pointer-events-none absolute left-3 top-3 z-30 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 shadow-sm">
              Farming %: {farmingPercentage}
            </div>
            <PropertyCard property={property} />
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default memo(FeaturedFarmsSection);
