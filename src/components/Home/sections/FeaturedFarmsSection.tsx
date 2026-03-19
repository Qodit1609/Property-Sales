import React, { memo } from "react";
import { motion } from "framer-motion";
import type { FeaturedFarmProperty } from "../models/homeTypes";
import { FarmHighlightCard, SectionHeading, SectionWrapper } from "../ui";

type FeaturedFarmsSectionProps = {
  properties: FeaturedFarmProperty[];
};

const FeaturedFarmsSection: React.FC<FeaturedFarmsSectionProps> = ({ properties }) => {
  return (
    <SectionWrapper className="py-12 sm:py-14" id="featured-farms">
      <SectionHeading
        eyebrow="Featured farms"
        title="Handpicked farming land opportunities"
        description="Compare high-potential farmland parcels with practical metrics to make faster and safer buying decisions."
      />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {properties.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
          >
            <FarmHighlightCard property={property} />
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default memo(FeaturedFarmsSection);
