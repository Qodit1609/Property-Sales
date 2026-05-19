import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { BadgePill, CTAButton, SectionHeading, SectionWrapper } from "../ui";

const FarmingPromoSection: React.FC = () => {
  const { t } = useTranslation();

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
              eyebrow={t("homeSections.farmingPromo.eyebrow")}
              title={t("homeSections.farmingPromo.title")}
              description={t("homeSections.farmingPromo.description")}
            />
            <div className="mt-5 flex flex-wrap gap-2">
              <BadgePill tone="success">{t("homeSections.farmingPromo.badges.verifiedDocs")}</BadgePill>
              <BadgePill tone="accent">{t("homeSections.farmingPromo.badges.farmingFilters")}</BadgePill>
              <BadgePill tone="accent">{t("homeSections.farmingPromo.badges.advisorSupport")}</BadgePill>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <CTAButton to="/agriculture-land">{t("homeSections.farmingPromo.ctaExplore")}</CTAButton>
              <CTAButton
                to="/post-property/basic"
                className="bg-[var(--b1)] text-[var(--b1)] border border-[var(--b2-soft)] hover:bg-[var( --b1-mid)]"
              >
                {t("homeSections.farmingPromo.ctaPostLand")}
              </CTAButton>
            </div>
          </div>
          <div className="order-1 aspect-[4/3] lg:order-2 lg:aspect-auto">
            <img
              src="https://images.financialexpressdigital.com/2025/04/diya-0001-58.jpg?w=1200"
              alt={t("homeSections.farmingPromo.imageAlt")}
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
