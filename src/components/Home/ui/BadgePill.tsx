import React, { memo } from "react";

type BadgeTone = "default" | "success" | "accent";

type BadgePillProps = {
  children: React.ReactNode;
  tone?: BadgeTone;
};

const toneClass: Record<BadgeTone, string> = {
  default: "bg-[var(--white)] text-[var(--b1)] border-[var(--b2-soft)]",
  success: "bg-[var(--success-bg)] text-[var(--success)] border-[var(--b2)]",
  accent: "bg-[var(--b2-soft)] text-[var(--b1)] border-[var(--b2)]",
};

const BadgePill: React.FC<BadgePillProps> = ({ children, tone = "default" }) => {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${toneClass[tone]}`}>
      {children}
    </span>
  );
};

export default memo(BadgePill);
