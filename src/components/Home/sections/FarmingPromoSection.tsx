import React, { memo } from "react";
import { motion } from "framer-motion";
import { BadgePill, CTAButton, SectionHeading, SectionWrapper } from "../ui";

const FarmingPromoSection: React.FC = () => {
  return (
    <SectionWrapper className="py-12 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden rounded-2xl border border-[var(--b2-soft)] bg-gradient-to-r from-[var(--white)] via-[var(--b2-soft)] to-[var(--white)] shadow-md"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="order-2 p-6 sm:p-8 lg:order-1">
            <SectionHeading
              eyebrow="Farmland investment"
              title="High-potential agricultural opportunities for long-term value"
              description="Discover verified farmland listings with practical data around soil profile, irrigation access, and district-level growth demand."
            />
            <div className="mt-5 flex flex-wrap gap-2">
              <BadgePill tone="success">Verified documentation</BadgePill>
              <BadgePill tone="accent">Farming-specific filters</BadgePill>
              <BadgePill tone="accent">Advisor support</BadgePill>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <CTAButton to="/agriculture-land">Explore farmland</CTAButton>
              <CTAButton
                to="/post-property/basic"
                className="bg-[var(--b1)] text-[var(--b1)] border border-[var(--b2-soft)] hover:bg-[var( --b1-mid)]"
              >
                Post your land
              </CTAButton>
            </div>
          </div>
          <div className="order-1 aspect-[4/3] lg:order-2 lg:aspect-auto">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT94qPx6PaZ4ImbjlocymFqskbQgAhI5mR8yg&s"
              alt="Aerial view of cultivated farmland"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
};

export default memo(FarmingPromoSection);
