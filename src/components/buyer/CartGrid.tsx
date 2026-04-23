import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

/** Vertical stack for cart rows (shortlisted property workspaces). */
const CartGrid: React.FC<Props> = ({ children, className = "" }) => (
  <div className={`space-y-4 ${className}`}>{children}</div>
);

export default CartGrid;
