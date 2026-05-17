import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { CTAButton, SectionWrapper } from "../ui";

const FooterCTASection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="pb-14 sm:pb-16">
      <SectionWrapper>
        <div className="rounded-2xl border border-[var(--b2-soft)] bg-gradient-to-r from-[var(--b1)] to-[var(--b1-mid)] p-6 text-[var(--fg)] shadow-xl sm:p-8 lg:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold">
            {t("homeSections.footerCta.title")}
          </h2>
          <p className="mt-3 max-w-3xl text-sm sm:text-base text-[var(--b2-soft)] leading-relaxed">
            {t("homeSections.footerCta.description")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <CTAButton
              to="/agriculture-land"
              className="border border-[var(--b2)] bg-[var(--b1-mid)] hover:bg-[var(--b1)]"
            >
              {t("homeSections.footerCta.ctaExplore")}
            </CTAButton>
            <CTAButton
              to="/post-property/basic"
              className="border border-[var(--b2)] bg-[var(--b1-mid)] hover:bg-[var(--b1)]"
            >
              {t("homeSections.footerCta.ctaPostFree")}
            </CTAButton>
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
};

export default memo(FooterCTASection);
