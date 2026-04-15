import React from "react";
import { Star } from "lucide-react";

type StarRatingProps = {
  value: number;
  onChange?: (rating: number) => void;
  max?: number;
  sizeClassName?: string;
  className?: string;
  readOnly?: boolean;
  filledClassName?: string;
  emptyClassName?: string;
};

const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  max = 5,
  sizeClassName = "h-4 w-4",
  className = "",
  readOnly = false,
  filledClassName = "fill-[var(--primary)] text-[var(--primary)]",
  emptyClassName = "text-[var(--b2)]",
}) => {
  const safeValue = Math.max(1, Math.min(max, value || 1));
  const canInteract = !readOnly && typeof onChange === "function";

  return (
    <div
      className={`flex items-center gap-1 ${className}`.trim()}
      role={canInteract ? "radiogroup" : "img"}
      aria-label={`${safeValue} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const filled = starValue <= safeValue;
        if (!canInteract) {
          return (
            <Star
              key={starValue}
              className={`${sizeClassName} ${filled ? filledClassName : emptyClassName}`}
              aria-hidden="true"
            />
          );
        }

        return (
          <button
            key={starValue}
            type="button"
            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => onChange(starValue)}
            role="radio"
            aria-checked={safeValue === starValue}
            aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
          >
            <Star
              className={`${sizeClassName} ${filled ? filledClassName : emptyClassName}`}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
