import type { ReactNode } from "react";

type PropertySectionProps = {
  title: string;
  children: ReactNode;
  description?: string;
};

const PropertySection = ({ title, description, children }: PropertySectionProps) => {
  return (
    <section className="rounded-2xl border border-[var(--b2-soft)] bg-white p-4 sm:p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-[var(--b1)] sm:text-lg">{title}</h3>
        {description ? <p className="mt-1 text-sm text-[var(--muted)]">{description}</p> : null}
      </div>
      {children}
    </section>
  );
};

export default PropertySection;
