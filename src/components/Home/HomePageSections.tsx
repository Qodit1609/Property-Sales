import React, { Suspense, memo, useEffect, useState } from "react";
import { useHomePageSections } from "@/hooks/useHomePageSections";
import { SectionWrapper } from "./ui";
import { getApprovedTestimonials } from "@/features/testimonials/testimonialApi";
import type { Testimonial } from "./models/homeTypes";
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
  const [approvedTestimonials, setApprovedTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await getApprovedTestimonials();
        if (!mounted) return;
        setApprovedTestimonials(
          data.map((item) => ({
            id: item.id,
            name: item.fullName,
            location: item.location,
            occupation: item.occupation,
            role: item.role,
            rating: item.rating,
            message: item.description,
          }))
        );
      } catch {
        if (mounted) {
          setApprovedTestimonials([]);
        }
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <FarmingPromoSection />

      <Suspense fallback={<SectionFallback />}>
        <FeaturedFarmsSection properties={sections.featuredProperties} />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <DistrictExplorerSection />
      </Suspense>

      <BenefitsSection benefits={sections.benefits} />
      <TestimonialsSection testimonials={approvedTestimonials} />
      <FooterCTASection />
    </>
  );
};

export default memo(HomePageSections);
