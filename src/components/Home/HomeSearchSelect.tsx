import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FC,
  type KeyboardEvent,
} from "react";

export type HomeSearchSelectOption = {
  value: string;
  label: string;
};

type HomeSearchSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: HomeSearchSelectOption[];
  ariaLabel: string;
  disabled?: boolean;
};

const HomeSearchSelect: FC<HomeSearchSelectProps> = ({
  value,
  onChange,
  options,
  ariaLabel,
  disabled = false,
}) => {
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);

  const selectedIndex = useMemo(() => {
    const i = options.findIndex((o) => o.value === value);
    return i >= 0 ? i : 0;
  }, [options, value]);

  const displayLabel = options[selectedIndex]?.label ?? options[0]?.label ?? "";

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    setHighlightIndex(selectedIndex);
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const el = containerRef.current;
      if (!el || el.contains(e.target as Node)) return;
      close();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open, close]);

  const choose = useCallback(
    (index: number) => {
      const opt = options[index];
      if (!opt) return;
      onChange(opt.value);
      close();
      buttonRef.current?.focus();
    },
    [close, onChange, options]
  );

  const onKeyDownButton = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setHighlightIndex(selectedIndex);
        return;
      }
      if (e.key === "ArrowDown") {
        setHighlightIndex((i) => Math.min(options.length - 1, i + 1));
      } else {
        setHighlightIndex((i) => Math.max(0, i - 1));
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open) choose(highlightIndex);
      else setOpen(true);
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        close();
      }
    } else if (e.key === "Tab" && open) {
      close();
    }
  };

  return (
    <div ref={containerRef} className="relative min-w-0 flex-1 w-full">
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        id={`${listId}-trigger`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={onKeyDownButton}
        className="flex w-full min-w-0 cursor-pointer items-center justify-between gap-1 rounded-md bg-transparent py-2 text-left text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-[var(--b2)] focus-visible:ring-offset-0"
      >
        <span className="min-w-0 flex-1 truncate">{displayLabel}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 shrink-0 text-[var(--b2)] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden={true}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && !disabled ? (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={`${listId}-trigger`}
          className="absolute left-0 right-0 z-[60] mt-1 max-h-60 w-full min-w-full overflow-auto rounded-md border border-[var(--b2)] bg-[var(--white)] py-1 shadow-lg outline-none"
        >
          {options.map((opt, index) => {
            const isSelected = opt.value === value;
            const isHighlighted = index === highlightIndex;
            return (
              <li
                key={opt.value === "" ? "__empty__" : opt.value}
                role="option"
                aria-selected={isSelected}
                className={`cursor-pointer px-3 py-2 text-sm font-serif text-[var(--b1)] transition-colors ${
                  isHighlighted
                    ? "bg-[var(--b2-soft)] text-[var(--b1)]"
                    : "hover:bg-[var(--b2-soft)] hover:text-[var(--b1)]"
                }`}
                onMouseEnter={() => setHighlightIndex(index)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(index)}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

export default HomeSearchSelect;
