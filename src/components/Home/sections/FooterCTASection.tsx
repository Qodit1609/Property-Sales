import React, { memo } from "react";
import { CTAButton, SectionWrapper } from "../ui";

const FooterCTASection: React.FC = () => {
  return (
    <section className="pb-14 sm:pb-16">
      <SectionWrapper>
        <div className="rounded-2xl border border-[var(--b2-soft)] bg-gradient-to-r from-[var(--b1)] to-[var(--b1-mid)] p-6 text-[var(--fg)] shadow-xl sm:p-8 lg:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Ready to find your next farmland investment?
          </h2>
          <p className="mt-3 max-w-3xl text-sm sm:text-base text-[var(--b2-soft)] leading-relaxed">
            Explore verified listings, compare farming-specific metrics, and connect
            directly with land owners and advisors for confident closure.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <CTAButton
              to="/agriculture-land"
              className="border border-[var(--b2)] bg-[var(--b1-mid)] hover:bg-[var(--b1)]"
            >
              Start exploring
            </CTAButton>
            <CTAButton
              to="/post-property/basic"
              className="border border-[var(--b2)] bg-[var(--b1-mid)] hover:bg-[var(--b1)]"
            >
              Post land for free
            </CTAButton>
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
};

export default memo(FooterCTASection);
