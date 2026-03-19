import React, { memo } from "react";

type SectionWrapperProps = {
  children: React.ReactNode;
  className?: string;
  as?: "section" | "div";
  id?: string;
};

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  className = "",
  as = "section",
  id,
}) => {
  const Component = as;
  return (
    <Component id={id} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </Component>
  );
};

export default memo(SectionWrapper);
