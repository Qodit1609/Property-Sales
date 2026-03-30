import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import Button from "../Button/Button";

type ImageSliderProps = {
  images: string[];
  alt: string;
  fallbackImage: string;
  className?: string;
  showThumbnails?: boolean;
  autoPlayMs?: number;
};

const SWIPE_THRESHOLD_PX = 42;

const ImageSlider = ({
  images,
  alt,
  fallbackImage,
  className = "",
  showThumbnails = true,
  autoPlayMs = 0,
}: ImageSliderProps) => {
  const [index, setIndex] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
  const touchStartX = useRef<number | null>(null);
  const keyboardScopeRef = useRef<HTMLDivElement | null>(null);

  const safeImages = useMemo(() => {
    if (!images.length) {
      return [fallbackImage];
    }
    return images;
  }, [images, fallbackImage]);

  const displayIndex =
    safeImages.length === 0 ? 0 : Math.min(index, safeImages.length - 1);

  useEffect(() => {
    if (autoPlayMs <= 0 || safeImages.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % safeImages.length);
    }, autoPlayMs);

    return () => window.clearInterval(intervalId);
  }, [autoPlayMs, safeImages.length]);

  const goNext = () =>
    setIndex((prev) => {
      const len = safeImages.length;
      if (len <= 1) return 0;
      const cur = Math.min(prev, len - 1);
      return (cur + 1) % len;
    });
  const goPrev = () =>
    setIndex((prev) => {
      const len = safeImages.length;
      if (len <= 1) return 0;
      const cur = Math.min(prev, len - 1);
      return cur === 0 ? len - 1 : cur - 1;
    });

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null || safeImages.length <= 1) {
      return;
    }

    const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) {
      return;
    }

    if (delta < 0) {
      goNext();
      return;
    }

    goPrev();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (safeImages.length <= 1) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
  };

  const activeSource = safeImages[displayIndex];
  const shouldShowFallback = brokenImages.has(activeSource);

  return (
    <div
      ref={keyboardScopeRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`outline-none ${className}`}
      aria-label="Property image gallery"
    >
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative h-[260px] overflow-hidden rounded-2xl bg-gray-100 sm:h-[340px] lg:h-[430px]"
      >
        <img
          src={shouldShowFallback ? fallbackImage : activeSource}
          alt={`${alt} - image ${displayIndex + 1}`}
          loading={displayIndex === 0 ? "eager" : "lazy"}
          fetchPriority={displayIndex === 0 ? "high" : "auto"}
          onError={() =>
            setBrokenImages((prev) => new Set(prev).add(activeSource))
          }
          className="h-full w-full object-cover"
        />

        {safeImages.length > 1 && (
          <>
            <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between px-2 sm:px-3">
              <Button
                type="button"
                onClick={goPrev}
                className="h-9 w-9 rounded-full bg-white/90 p-0 text-[var(--b1)] shadow-md hover:bg-white sm:h-10 sm:w-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </Button>
              <Button
                type="button"
                onClick={goNext}
                className="h-9 w-9 rounded-full bg-white/90 p-0 text-[var(--b1)] shadow-md hover:bg-white sm:h-10 sm:w-10"
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </Button>
            </div>

            <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
              <Images size={13} />
              {displayIndex + 1} / {safeImages.length}
            </div>
          </>
        )}
      </div>

      {showThumbnails && safeImages.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {safeImages.map((source, imageIndex) => {
            const thumbFallback = brokenImages.has(source);
            return (
              <button
                key={`${source}-${imageIndex}`}
                type="button"
                onClick={() => setIndex(imageIndex)}
                className={`shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  imageIndex === displayIndex
                    ? "border-[var(--b1-mid)]"
                    : "border-transparent"
                }`}
                aria-label={`Show image ${imageIndex + 1}`}
              >
                <img
                  src={thumbFallback ? fallbackImage : source}
                  alt={`${alt} thumbnail ${imageIndex + 1}`}
                  loading="lazy"
                  onError={() =>
                    setBrokenImages((prev) => new Set(prev).add(source))
                  }
                  className="h-14 w-20 object-cover sm:h-16 sm:w-24"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
