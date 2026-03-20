import { useState, useEffect, useRef, type ImgHTMLAttributes } from 'react';
import { getImageUrl, buildCloudinaryUrl, generatePlaceholderImage } from '../../utils/cloudinaryImage';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Image URL - can be full URL, Cloudinary public ID, or unsplash URL */
  src?: string;
  /** Image preset size: thumbnail, small, medium, large, hero */
  preset?: 'thumbnail' | 'small' | 'medium' | 'large' | 'hero';
  /** Enable lazy loading */
  lazy?: boolean;
  /** Fallback image URL or alt text */
  fallback?: string;
  /** Border radius (tailwind classes or custom) */
  radius?: string;
  /** Aspect ratio (e.g., '16/9', '4/3', '1/1') */
  aspectRatio?: string;
  /** Loading state callback */
  onImageLoad?: () => void;
  /** Error state callback */
  onImageError?: () => void;
  /** Container class for wrapper */
  containerClass?: string;
}

/**
 * Optimized Image Component
 * - Handles Cloudinary image optimization
 * - Lazy loading support
 * - Fallback/error handling
 * - Responsive sizing with aspect ratio
 */
export const OptimizedImage = ({
  src,
  preset = 'medium',
  lazy = true,
  fallback,
  radius = 'rounded-lg',
  aspectRatio = '16/9',
  onImageLoad,
  onImageError,
  containerClass = '',
  alt = 'Image',
  className = 'w-full h-full object-cover',
  ...imgProps
}: OptimizedImageProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState<string>(() => {
    if (!src) return generatePlaceholderImage(alt);
    // If it's already a full URL (unsplash, cloudinary, etc.), use as-is
    if (src.startsWith('http')) return src;
    // Otherwise try to build Cloudinary URL
    return getImageUrl(src, preset);
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Lazy load image
  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && imageSrc && imageSrc !== generatePlaceholderImage(alt)) {
            imgRef.current?.setAttribute('src', imageSrc);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [imageSrc, lazy, alt]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setIsError(false);
    onImageLoad?.();
  };

  const handleImageError = () => {
    setIsLoading(false);
    setIsError(true);
    // Use fallback or placeholder
    setImageSrc(fallback || generatePlaceholderImage(alt));
    onImageError?.();
  };

  return (
    <div
      className={`relative overflow-hidden bg-gray-200 ${radius} ${containerClass}`}
      style={{
        aspectRatio,
      }}
    >
      {/* Skeleton/Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse z-10" />
      )}

      {/* Image */}
      <img
        ref={imgRef}
        src={lazy ? undefined : imageSrc}
        data-src={lazy ? imageSrc : undefined}
        alt={alt}
        className={`${className} ${isError ? 'opacity-50' : ''}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        {...imgProps}
      />

      {/* Error overlay */}
      {isError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-xs text-gray-500 z-20">
          <span>Image failed to load</span>
        </div>
      )}
    </div>
  );
};
