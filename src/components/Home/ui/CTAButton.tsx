import React, { memo } from "react";
import { Link } from "react-router-dom";

type CTAButtonProps = {
  children: React.ReactNode;
  to?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  ariaLabel?: string;
};

const baseClass =
  "inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm sm:text-base font-semibold bg-[var(--b1)] text-[var(--fg)] shadow-md transition-all duration-300 hover:bg-[var(--b1-mid)] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b2)] focus-visible:ring-offset-2";

const CTAButton: React.FC<CTAButtonProps> = ({
  children,
  to,
  type = "button",
  className = "",
  onClick,
  ariaLabel,
}) => {
  if (to) {
    return (
      <Link to={to} className={`${baseClass} ${className}`} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={`${baseClass} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export default memo(CTAButton);
