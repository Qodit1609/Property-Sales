import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DEFAULT_SERVICES } from "./serviceMockData";
import type { ServiceSectionProps } from "./ServiceSection.types";

const cardSpring = { type: "spring" as const, stiffness: 420, damping: 28 };

const headerMotion = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-12% 0px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const gridContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const gridItem = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 380, damping: 32 },
  },
};

const ServiceSection: React.FC<ServiceSectionProps> = ({ services: servicesProp }) => {
  const services = servicesProp ?? DEFAULT_SERVICES;

  const initialActiveIndex = useMemo(() => {
    const i = services.findIndex((s) => s.active);
    return i >= 0 ? i : 0;
  }, [services]);

  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setActiveIndex(initialActiveIndex);
  }, [initialActiveIndex]);

  return (
    <motion.section
      className="relative overflow-hidden bg-[#F8F9F1] py-16 px-4"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(45,106,79,0.08),transparent)]" />

      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <motion.div {...headerMotion} className="mb-12">
          <div className="mb-4 flex items-center justify-center gap-6">
            <div className="h-px w-28 bg-[#2D6A4F]/40" />
            <p className="font-medium tracking-wide text-[#2D6A4F]">OUR SERVICES</p>
            <div className="h-px w-28 bg-[#2D6A4F]/40" />
          </div>

          <p className="mx-auto max-w-3xl text-base leading-relaxed text-[#6D4C41] transition-colors duration-300 md:text-lg">
            We provide end-to-end real estate solutions focused on farmhouses,
            villas, resort properties, and agricultural land, ensuring
            transparency, expert guidance, and long-term value for every client.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4"
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-8% 0px" }}
        >
          {services.map((service, index) => {
            const isActive = activeIndex === index;
            const isHovered = hoveredIndex === index;
            const cardKey = service.id ?? `service-${index}`;

            return (
              <motion.div key={cardKey} variants={gridItem} className="h-full min-w-0">
                <motion.article
                  layout
                  role="button"
                  tabIndex={0}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setActiveIndex(index)}
                  onMouseMove={(e) => {
                    const el = e.currentTarget;
                    const r = el.getBoundingClientRect();
                    const x = ((e.clientX - r.left) / r.width) * 100;
                    const y = ((e.clientY - r.top) / r.height) * 100;
                    el.style.setProperty("--pointer-x", `${x}%`);
                    el.style.setProperty("--pointer-y", `${y}%`);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveIndex(index);
                    }
                  }}
                  className={[
                    "group relative flex h-full min-h-[280px] cursor-pointer flex-col overflow-hidden rounded-2xl border p-6 text-left sm:p-8",
                    "border-white/20 shadow-lg backdrop-blur-md transition-[box-shadow,background-color,color,transform] duration-300 ease-out",
                    "hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F9F1]",
                    "hover:shadow-[0_16px_48px_-12px_rgba(27,67,50,0.35)]",
                    isActive
                      ? "bg-[#1B4332] text-white ring-2 ring-[#95D5B2] ring-offset-2 ring-offset-[#F8F9F1]"
                      : "bg-[#D8F3DC]/85 text-[#1B4332]",
                  ].join(" ")}
                  animate={{
                    scale: isActive ? 1.02 : 1,
                  }}
                  whileHover={{
                    scale: isActive ? 1.05 : 1.03,
                    y: -6,
                  }}
                  transition={cardSpring}
                >
                  {/* Hover gradient (inactive cards); active cards get a soft shine on hover */}
                  <div
                    className={[
                      "pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] transition-opacity duration-500 ease-out",
                      isActive
                        ? "opacity-0 group-hover:opacity-25"
                        : "opacity-0 group-hover:opacity-100",
                    ].join(" ")}
                    aria-hidden
                  />

                  <div className="relative z-10 flex min-h-0 flex-1 flex-col">
                    <motion.div
                      className={[
                        "mb-6 inline-flex origin-center text-[#2D6A4F] transition-colors duration-300",
                        isActive
                          ? "text-[#95D5B2]"
                          : "group-hover:text-[#95D5B2]",
                      ].join(" ")}
                      animate={{
                        rotate: isHovered ? -8 : 0,
                        scale: isHovered ? 1.1 : 1,
                      }}
                      transition={cardSpring}
                    >
                      {service.icon}
                    </motion.div>

                    <h3
                      className={[
                        "mb-3 text-xl font-semibold transition-colors duration-300",
                        isActive
                          ? "text-white"
                          : "text-[#1B4332] group-hover:text-white",
                      ].join(" ")}
                    >
                      {service.title}
                    </h3>

                    <p
                      className={[
                        "mb-6 min-h-0 flex-1 text-sm leading-relaxed transition-colors duration-300",
                        isActive
                          ? "text-[#95D5B2]"
                          : "text-[#6D4C41] group-hover:text-[#E8F5E9]",
                      ].join(" ")}
                    >
                      {service.description}
                    </p>

                    <span
                      className={[
                        "mt-auto inline-flex items-center gap-1 text-sm font-semibold transition-colors duration-300",
                        isActive
                          ? "text-[#D8F3DC]"
                          : "text-[#2D6A4F] group-hover:text-[#D8F3DC]",
                      ].join(" ")}
                    >
                      Check it
                      <motion.span
                        className="inline-block"
                        animate={{ x: isHovered ? 8 : 0 }}
                        transition={cardSpring}
                      >
                        →
                      </motion.span>
                    </span>
                  </div>

                  {/* Cursor-adjacent glow (follows card hover) */}
                  <div
                    className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(120px 80px at var(--pointer-x, 50%) var(--pointer-y, 50%), rgba(149,213,178,0.35), transparent 70%)",
                    }}
                    aria-hidden
                  />
                </motion.article>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ServiceSection;
export type { Service, ServiceSectionProps } from "./ServiceSection.types";
