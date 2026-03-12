import { memo } from "react";

export default memo(function FormActions({
  onBack,
  onNext,
  backLabel = "Back",
  nextLabel = "Next",
  nextDisabled,
  nextLoading,
  rightExtra,
}: {
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextLoading?: boolean;
  rightExtra?: React.ReactNode;
}) {
  return (
    <div className="mt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
      <div>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto rounded-md border border-[var(--b2)] px-4 py-2 text-sm font-semibold text-[var(--b1)] hover:bg-[var(--b2-soft)] transition"
          >
            {backLabel}
          </button>
        )}
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {rightExtra}
        {onNext && (
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled || nextLoading}
            className="w-full sm:w-auto rounded-md bg-[var(--b1-mid)] px-5 py-2 text-sm font-semibold text-[var(--fg)] shadow hover:bg-[var(--b1)] transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {nextLoading ? "Please wait..." : nextLabel}
          </button>
        )}
      </div>
    </div>
  );
});

