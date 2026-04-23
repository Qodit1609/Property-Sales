import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

/** Layout shell for wishlist property cards (responsive grid). */
const WishlistGrid: React.FC<Props> = ({ children, className = "" }) => (
  <div
    className={`grid gap-4 md:grid-cols-2 xl:grid-cols-3 ${className}`}
  >
    {children}
  </div>
);

export default WishlistGrid;
