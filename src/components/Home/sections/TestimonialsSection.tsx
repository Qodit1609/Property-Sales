import React, { memo, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Testimonial } from "../models/homeTypes";
import { SectionHeading, SectionWrapper } from "../ui";
import StarRating from "@/components/testimonial/StarRating";

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
};

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const { t } = useTranslation();
  const intervalRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocusedWithin, setIsFocusedWithin] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const shouldReduceMotion = useReducedMotion();
  const AUTO_PLAY_MS = 4200;

  useEffect(() => {
    const t = setTimeout(() => setActiveIndex(0), 0);
    return () => clearTimeout(t);
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonials.length <= 1 || isHovered || isFocusedWithin) return;

    intervalRef.current = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((previous) => (previous + 1) % testimonials.length);
    }, AUTO_PLAY_MS);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [AUTO_PLAY_MS, isFocusedWithin, isHovered, testimonials.length]);

  if (!testimonials.length) return null;

  const activeTestimonial = testimonials[activeIndex];

  const initials = (activeTestimonial.name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const changeSlide = (step: 1 | -1) => {
    setDirection(step);
    setActiveIndex((previous) => (previous + step + testimonials.length) % testimonials.length);
  };

  const jumpToSlide = (nextIndex: number) => {
    if (nextIndex === activeIndex) return;
    setDirection(nextIndex > activeIndex ? 1 : -1);
    setActiveIndex(nextIndex);
  };

  const testimonialKey = `homeSections.testimonials.items.${activeTestimonial.id}`;
  const safeMessage =
    t(`${testimonialKey}.message`, {
      defaultValue:
        activeTestimonial.message?.trim() ||
        t("homeSections.testimonials.emptyMessageFallback"),
    }) || t("homeSections.testimonials.emptyMessageFallback");
  const displayOccupation = t(`${testimonialKey}.occupation`, {
    defaultValue:
      activeTestimonial.occupation || t("homeSections.testimonials.defaultOccupation"),
  });
  const displayLocation = activeTestimonial.location
    ? t(`${testimonialKey}.location`, {
        defaultValue: activeTestimonial.location,
      })
    : "";

  const pageTransition = shouldReduceMotion
    ? { duration: 0.01 }
    : { duration: 0.52, ease: [0.22, 1, 0.36, 1] as const };

  const swipeConfidenceThreshold = 80;

  // ✅ Proper variants (fix for TS2322)
  const variants = {
    initial: (step: number) =>
      shouldReduceMotion
        ? { opacity: 0 }
        : {
            opacity: 0,
            y: step > 0 ? 34 : -34,
            scale: 0.992,
            filter: "blur(4px)",
          },

    animate: shouldReduceMotion
      ? { opacity: 1 }
      : {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        },

    exit: (step: number) =>
      shouldReduceMotion
        ? { opacity: 0 }
        : {
            opacity: 0,
            y: step > 0 ? -28 : 28,
            scale: 0.994,
            filter: "blur(3px)",
          },
  };

  return (
    <SectionWrapper className="py-12 sm:py-14" id="testimonials">
      <SectionHeading
        eyebrow={t("homeSections.testimonials.eyebrow")}
        title={t("homeSections.testimonials.title")}
        description={t("homeSections.testimonials.description")}
      />

      <div
        className="relative mx-auto mt-10 w-full max-w-6xl px-2 sm:mt-12 sm:px-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocusCapture={() => setIsFocusedWithin(true)}
        onBlurCapture={() => setIsFocusedWithin(false)}
      >
        <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-[radial-gradient(circle_at_top,rgba(46,125,50,0.12),transparent_68%)]" />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.blockquote
            key={activeTestimonial.id}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            drag={testimonials.length > 1 ? "x" : false}
            dragElastic={0.18}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              const swipe = Math.abs(info.offset.x) * info.velocity.x;
              if (swipe < -swipeConfidenceThreshold) changeSlide(1);
              if (swipe > swipeConfidenceThreshold) changeSlide(-1);
            }}
            className="relative min-h-[240px] overflow-hidden rounded-[26px] border border-[var(--b2-soft)] bg-[var(--white)] px-5 py-6 shadow-[0_20px_42px_rgba(15,23,42,0.09)] sm:min-h-[260px] sm:px-8"
            role="region"
            aria-roledescription="carousel"
            aria-label={t("homeSections.testimonials.carouselAriaLabel")}
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") changeSlide(1);
              if (event.key === "ArrowLeft") changeSlide(-1);
            }}
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-5xl font-semibold leading-none text-[var(--b2-soft)]">"</p>
              <p className="text-xs font-medium tracking-wide text-[var(--muted)]">
                {activeIndex + 1} / {testimonials.length}
              </p>
            </div>

            <div className="mb-4 min-h-[96px] text-sm leading-relaxed text-[var(--b1)] sm:min-h-[108px] sm:text-[15px]">
              {safeMessage}
            </div>

            <footer className="border-t border-[var(--b2-soft)] pt-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--b2-soft)] text-sm font-semibold text-[var(--b1)]">
                  {initials}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[var(--b1)]">
                    {activeTestimonial.name}
                  </p>
                  <p className="truncate text-xs text-[var(--muted)] sm:text-sm">
                    {displayOccupation}
                    {displayLocation ? ` • ${displayLocation}` : ""}
                  </p>
                </div>

                <div className="ml-auto">
                  <StarRating
                    value={activeTestimonial.rating ?? 5}
                    readOnly
                    filledClassName="fill-[#F5B301] text-[#F5B301]"
                    emptyClassName="text-[var(--b2)]"
                  />
                </div>
              </div>
            </footer>
          </motion.blockquote>
        </AnimatePresence>

        {testimonials.length > 1 ? (
          <div className="mt-5 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => changeSlide(-1)}
              aria-label={t("homeSections.testimonials.prevAriaLabel")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--b2-soft)] bg-[var(--white)] text-[var(--b1)] transition-colors hover:bg-[var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b1)]"
            >
              &#8249;
            </button>

            <div className="flex items-center gap-1.5 px-1">
              {testimonials.map((testimonial, index) => (
                <motion.button
                  key={testimonial.id}
                  type="button"
                  aria-label={t("homeSections.testimonials.goToAriaLabel", { index: index + 1 })}
                  onClick={() => jumpToSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeIndex
                      ? "w-8 bg-[var(--b1)]"
                      : "w-2 bg-[var(--b2-soft)]"
                  }`}
                  animate={index === activeIndex ? { scale: 1.05 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => changeSlide(1)}
              aria-label={t("homeSections.testimonials.nextAriaLabel")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--b2-soft)] bg-[var(--white)] text-[var(--b1)] transition-colors hover:bg-[var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b1)]"
            >
              &#8250;
            </button>
          </div>
        ) : null}
      </div>
    </SectionWrapper>
  );
};

export default memo(TestimonialsSection);