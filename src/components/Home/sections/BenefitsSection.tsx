import React, { memo } from "react";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import type { Benefit } from "../models/homeTypes";
import { SectionHeading, SectionWrapper } from "../ui";

type BenefitsSectionProps = {
  benefits: Benefit[];
};

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ benefits }) => {
  return (
    <SectionWrapper className="py-12 sm:py-14" id="benefits">
      <SectionHeading
        eyebrow="Why choose us"
        title="Built for modern farmland transactions"
        description="A focused product experience designed to reduce friction in discovery, due diligence, and closure."
      />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {benefits.map((benefit, index) => (
          <motion.article
            key={benefit.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="rounded-2xl border border-[var(--b2-soft)] bg-[var(--white)] p-5 shadow-md transition-all duration-300 hover:shadow-xl"
          >
            <h3 className="flex items-start text-lg font-semibold text-[var(--b1)]">
              <CheckCircle2 className="mr-2 mt-0.5 h-5 w-5 text-[var(--b1-mid)]" />
              <span>{benefit.title}</span>
            </h3>
            <p className="mt-2 text-sm sm:text-base text-[var(--muted)] leading-relaxed">
              {benefit.description}
            </p>
          </motion.article>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default memo(BenefitsSection);
