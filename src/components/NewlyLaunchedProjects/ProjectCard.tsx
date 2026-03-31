import React from "react";
import { Button } from "@/components/common";
import Card from "@/components/common/Card/Card";

export type Project = {
  id: string;
  title?: string;
  propertyType?: string;
  city?: string;
  price?: number;
  coverImage?: string;
  dealerName?: string;
  postedTime?: string;
};

type ProjectCardProps = {
  project: Project;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const formattedPrice =
    typeof project.price === "number" ? `₹${project.price.toLocaleString("en-IN")}` : undefined;
  const formattedPostedDate = project.postedTime
    ? new Date(project.postedTime).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : undefined;

  return (
    <Card className="h-full flex flex-col rounded-xl border border-[var(--b2-soft)] shadow-md hover:shadow-xl hover:scale-[1.02] hover:border-[var(--b1-mid)] transition-all duration-300">
      
      {/* IMAGE */}
      <div className="relative rounded-t-xl overflow-hidden">
        <Card.Image
          src={project.coverImage}
          alt={project.title}
          className="h-40 sm:h-44 md:h-52 w-full object-cover"
        />

        {/* TAG */}
        {project.propertyType && (
          <div className="absolute left-2 top-2 sm:left-3 sm:top-3 rounded-full bg-[var(--b1)] px-2.5 py-1 sm:px-3 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-[var(--fg)] shadow-sm">
            {project.propertyType}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <Card.Content className="flex-1 flex flex-col p-3 sm:p-4">

        {/* TITLE */}
        {project.title && (
          <h3 className="text-sm sm:text-base font-semibold text-[var(--b1)] line-clamp-2 font-[Playfair_Display]">
            {project.title}
          </h3>
        )}

        {/* CITY */}
        {project.city && (
          <p className="text-[11px] sm:text-xs text-[var(--muted)] font-sans mt-1 truncate">
            {project.city}
          </p>
        )}

        {/* PRICE + DEALER */}
        <div className="mt-2 flex items-start sm:items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-wide text-[var(--muted)]/80 font-sans">
              Starting from
            </p>
            {formattedPrice && (
              <p className="text-xs sm:text-sm font-semibold text-[var(--b1)] truncate">
                {formattedPrice}
              </p>
            )}
          </div>

          {project.dealerName && (
            <span className="shrink-0 whitespace-nowrap rounded-full bg-[var(--b2-soft)] px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-medium text-[var(--b1)] border border-[var(--b2)]">
              {project.dealerName}
            </span>
          )}
        </div>

        {formattedPostedDate && (
          <p className="text-[10px] sm:text-[11px] text-[var(--muted)] mt-2">
            Posted: {formattedPostedDate}
          </p>
        )}

        {/* BUTTON */}
        <div className="mt-auto pt-3 sm:pt-4">
          <Button
            type="button"
            size="sm"
            className="w-full text-xs sm:text-sm bg-[var(--b1)] text-[var(--fg)] py-2 rounded-md font-medium hover:bg-[var(--b1-mid)] transition"
          >
            View Details
          </Button>
        </div>

      </Card.Content>
    </Card>
  );
};

export default ProjectCard;

/* ================= SKELETON ================= */

export const ProjectCardSkeleton = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-[var(--white)] shadow-md border border-[var(--b2-soft)] animate-pulse">
      
      <div className="h-40 sm:h-44 md:h-52 bg-gray-200"></div>

      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 w-1/2 bg-gray-200 rounded mb-4"></div>

        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="h-8 w-20 sm:w-24 bg-gray-200 rounded"></div>
          <div className="h-6 w-14 sm:w-16 bg-gray-200 rounded-full"></div>
        </div>

        <div className="mt-auto">
          <div className="border-t border-gray-200 my-3"></div>
          <div className="h-9 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};