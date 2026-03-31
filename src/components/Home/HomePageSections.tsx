import React, { Suspense, memo } from "react";
import { useHomePageSections } from "@/hooks/useHomePageSections";
import { SectionWrapper } from "./ui";
import {
  BenefitsSection,
  FarmingPromoSection,
  FooterCTASection,
  TestimonialsSection,
} from "./sections";

const FeaturedFarmsSection = React.lazy(() => import("./sections/FeaturedFarmsSection"));
const DistrictExplorerSection = React.lazy(
  () => import("./sections/DistrictExplorerSection"),
);

const SectionFallback: React.FC = () => (
  <SectionWrapper className="py-10 sm:py-12">
    <div className="h-48 rounded-2xl border border-[var(--b2-soft)] bg-[var(--white)] shadow-md animate-pulse" />
  </SectionWrapper>
);

const HomePageSections: React.FC = () => {
  const { sections } = useHomePageSections();

  return (
    <>
      <FarmingPromoSection />

      <Suspense fallback={<SectionFallback />}>
        <FeaturedFarmsSection properties={sections.featuredProperties} />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <DistrictExplorerSection districts={sections.districts} />
      </Suspense>

      <BenefitsSection benefits={sections.benefits} />
      <TestimonialsSection testimonials={sections.testimonials} />
      <FooterCTASection />
    </>
  );
};

export default memo(HomePageSections);
