import React, { memo } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = "left",
}) => {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <header className={`max-w-3xl ${alignClass}`}>
      {eyebrow ? (
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-[var(--b1-mid)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--b1)]">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm sm:text-base text-[var(--muted)] leading-relaxed">
          {description}
        </p>
      ) : null}
    </header>
  );
};

export default memo(SectionHeading);
