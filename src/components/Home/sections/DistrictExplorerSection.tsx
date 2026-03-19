import React, { memo } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { District } from "../models/homeTypes";
import { SectionHeading, SectionWrapper } from "../ui";

type DistrictExplorerSectionProps = {
  districts: District[];
};

const DistrictExplorerSection: React.FC<DistrictExplorerSectionProps> = ({ districts }) => {
  return (
    <SectionWrapper className="py-12 sm:py-14" id="district-explorer">
      <SectionHeading
        eyebrow="Location explorer"
        title="Explore farmland by district"
        description="Discover district-level opportunities and quickly jump into available inventory."
      />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {districts.map((district) => (
          <Link
            key={district.id}
            to={`/agriculture-land?district=${district.slug}`}
            className="group overflow-hidden rounded-2xl border border-[var(--b2-soft)] bg-[var(--white)] shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            aria-label={`Explore farmland listings in ${district.name}`}
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={district.image}
                alt={`Farmland in ${district.name}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-[var(--b1)]">{district.name}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{district.listingsText}</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-[var(--b1-mid)] group-hover:text-[var(--b1)]">
                View listings
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default memo(DistrictExplorerSection);
