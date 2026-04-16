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

const FeaturedFarmsSection: React.FC<FeaturedFarmsSectionProps> = () => {
  const [apiProperties, setApiProperties] = useState<Property[]>([]);
  const [currentTime] = useState(() => Date.now());

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

  const topFarmingProperties = useMemo<Array<{ property: Property; daysRemaining: number }>>(() => {
    return apiProperties
      .map((property) => {
        const isFeatured = Boolean(property.isFeatured ?? property.featured ?? property.statusDetails?.featured);
        if (!isFeatured || !property.featuredExpiryDate) {
          return null;
        }
        const diff = new Date(property.featuredExpiryDate).getTime() - currentTime;
        if (diff <= 0) return null;
        const daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return { property, daysRemaining };
      })
      .filter(
        (item): item is { property: Property; daysRemaining: number } => item !== null,
      )
      .sort((a, b) => a.daysRemaining - b.daysRemaining)
      .slice(0, 4);
  }, [apiProperties, currentTime]);

  return (
    <SectionWrapper className="py-12 sm:py-14" id="featured-farms">
      <SectionHeading
        eyebrow="Featured"
        title="Featured properties BhoomiWala Assured Highly recommended"
        description="Only active featured properties are shown here."
      />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {topFarmingProperties.map(({ property, daysRemaining }, index) => (
          <motion.div
            key={property._id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className="relative"
          >
            <PropertyCard property={property} />
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default memo(FeaturedFarmsSection);
