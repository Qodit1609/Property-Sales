import React, { memo } from "react";
import { motion } from "framer-motion";
import type { Testimonial } from "../models/homeTypes";
import { SectionHeading, SectionWrapper } from "../ui";

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
};

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  return (
    <SectionWrapper className="py-12 sm:py-14" id="testimonials">
      <SectionHeading
        eyebrow="Testimonials"
        title="Trusted by farmland buyers and sellers"
        description="Real customer stories from successful farmland discovery and closure journeys."
      />
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <motion.blockquote
            key={testimonial.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="rounded-2xl border border-[var(--b2-soft)] bg-[var(--white)] p-5 shadow-md transition-all duration-300 hover:shadow-xl"
          >
            <p className="text-sm sm:text-base leading-relaxed text-[var(--b1)]">
              "{testimonial.message}"
            </p>
            <footer className="mt-4 border-t border-[var(--b2-soft)] pt-3">
              <p className="font-semibold text-[var(--b1)]">{testimonial.name}</p>
              <p className="text-xs sm:text-sm text-[var(--muted)]">{testimonial.role}</p>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default memo(TestimonialsSection);
