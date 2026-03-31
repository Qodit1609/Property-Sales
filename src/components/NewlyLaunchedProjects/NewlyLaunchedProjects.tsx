import React, { useEffect } from "react";
import ProjectCard, { ProjectCardSkeleton } from "./ProjectCard";
import type { Project } from "./ProjectCard";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchNewProperties } from "../../store/slices/newPropertiesSlice";

const NewlyLaunchedProjects: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.newProperties);

  useEffect(() => {
    dispatch(fetchNewProperties());
  }, [dispatch]);

  const projects: Project[] = data.map((property) => ({
    id: property.id,
    title: property.title,
    propertyType: property.propertyType,
    city: property.city,
    price: property.price,
    coverImage: property.coverImage,
    dealerName: property.dealerName,
    postedTime: property.postedTime,
  }));

  return (
    <section className="bg-[var(--fg)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-12">
        
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Newly Launched Projects
            </p>
            <h2 className="mt-1 text-lg sm:text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
              Explore the latest real estate developments
            </h2>
          </div>
        </div>

        {/* GRID */}
        <div className="grid gap-5 sm:gap-6 
                        grid-cols-1 
                        sm:grid-cols-2 
                        md:grid-cols-2 
                        lg:grid-cols-3 
                        xl:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div key={`project-skeleton-${index}`} className="h-full">
                  <ProjectCardSkeleton />
                </div>
              ))
            : projects.map((project) => (
                <div key={project.id} className="h-full">
                  <ProjectCard project={project} />
                </div>
              ))}
        </div>

        {error && (
          <div className="mt-6 text-center text-sm text-red-500">
            Error: {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && projects.length === 0 && (
          <div className="mt-6 text-center text-sm text-slate-500">
            No projects available right now. Please check back soon.
          </div>
        )}
      </div>
    </section>
  );
};

export default NewlyLaunchedProjects;