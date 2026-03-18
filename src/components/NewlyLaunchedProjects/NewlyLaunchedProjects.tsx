import React, { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import type { Project } from "./ProjectCard";

const staticProjects: Project[] = [
  {
    id: 1,
    name: "Green Valley Residency",
    location: "Bhopal, Madhya Pradesh",
    price: "₹45 Lakhs onwards",
    type: "Apartment",
    builder: "ABC Developers",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Urban Heights Elite",
    location: "Indore, Madhya Pradesh",
    price: "₹62 Lakhs onwards",
    type: "Apartment",
    builder: "Skyline Group",
    image:
      "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Lakeview Villas",
    location: "Pune, Maharashtra",
    price: "₹1.2 Cr onwards",
    type: "Villa",
    builder: "Lakefront Estates",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Sunrise Meadows",
    location: "Bengaluru, Karnataka",
    price: "₹35 Lakhs onwards",
    type: "Plot",
    builder: "Meadowland Properties",
    image:
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Palm Crest Residency",
    location: "Hyderabad, Telangana",
    price: "₹55 Lakhs onwards",
    type: "Apartment",
    builder: "Crest Builders",
    image:
      "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "Royal Orchard Villas",
    location: "Jaipur, Rajasthan",
    price: "₹95 Lakhs onwards",
    type: "Villa",
    builder: "Royal Estates",
    image:
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=900&q=80",
  },
];

const NewlyLaunchedProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(staticProjects);
  }, []);

  return (
    <section className="bg-slate-50">
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

          <p className="text-xs sm:text-sm text-slate-500 max-w-xs sm:max-w-sm">
            Discover modern homes, villas, and plots tailored for your lifestyle.
          </p>
        </div>

        {/* GRID */}
        <div className="grid gap-5 sm:gap-6 
                        grid-cols-1 
                        sm:grid-cols-2 
                        md:grid-cols-2 
                        lg:grid-cols-3 
                        xl:grid-cols-4">
          {projects.map((project) => (
            <div key={project.id} className="h-full">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {projects.length === 0 && (
          <div className="mt-6 text-center text-sm text-slate-500">
            No projects available right now. Please check back soon.
          </div>
        )}
      </div>
    </section>
  );
};

export default NewlyLaunchedProjects;