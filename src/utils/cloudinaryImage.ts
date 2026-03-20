/**
 * Cloudinary Image URL Generator Utility
 * Generates optimized Cloudinary URLs with transformations
 */

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'pad' | 'thumb';
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
  quality?: 'auto' | 'low' | 'best';
  fetchFormat?: 'auto' | 'webp' | 'jpg' | 'png';
  radius?: number;
  dpr?: number;
}

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dyhbdio6q';

/**
 * Build Cloudinary URL with transformations
 */
export const buildCloudinaryUrl = (
  publicId: string,
  options: ImageTransformOptions = {}
): string => {
  const {
    width,
    height,
    crop = 'fill',
    gravity = 'auto',
    quality = 'auto',
    fetchFormat = 'auto',
    radius,
    dpr = 1,
  } = options;

  // Build transformation string
  const transforms: string[] = [];

  if (width || height) {
    const size = `w_${width || 'auto'},h_${height || 'auto'}`;
    transforms.push(`${size},c_${crop},g_${gravity}`);
  }

  transforms.push(`q_${quality}`);
  transforms.push(`f_${fetchFormat}`);

  if (radius) {
    transforms.push(`r_${radius}`);
  }

  if (dpr > 1) {
    transforms.push(`dpr_${dpr}`);
  }

  // Construct full URL
  const transformString = transforms.length > 0 ? `/${transforms.join('/')}` : '';
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload${transformString}/${publicId}`;
};

/**
 * Preset sizes for different use cases
 */
export const imagePresets = {
  // Thumbnails (card images, small previews)
  thumbnail: (publicId: string): string =>
    buildCloudinaryUrl(publicId, {
      width: 300,
      height: 200,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      fetchFormat: 'auto',
    }),

  // Small size (sidebar, list items)
  small: (publicId: string): string =>
    buildCloudinaryUrl(publicId, {
      width: 400,
      height: 300,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      fetchFormat: 'auto',
    }),

  // Medium size (property cards, main listings)
  medium: (publicId: string): string =>
    buildCloudinaryUrl(publicId, {
      width: 600,
      height: 400,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      fetchFormat: 'auto',
    }),

  // Large size (property details page main image)
  large: (publicId: string): string =>
    buildCloudinaryUrl(publicId, {
      width: 1000,
      height: 700,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      fetchFormat: 'auto',
    }),

  // Hero size (banner, hero section)
  hero: (publicId: string): string =>
    buildCloudinaryUrl(publicId, {
      width: 1920,
      height: 1080,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      fetchFormat: 'auto',
    }),

  // Responsive sizes
  responsive: (
    publicId: string,
    sizes: { mobile: number; tablet: number; desktop: number }
  ): Record<string, string> => ({
    mobile: buildCloudinaryUrl(publicId, {
      width: sizes.mobile,
      height: Math.round(sizes.mobile * 0.75),
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      fetchFormat: 'auto',
    }),
    tablet: buildCloudinaryUrl(publicId, {
      width: sizes.tablet,
      height: Math.round(sizes.tablet * 0.75),
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      fetchFormat: 'auto',
    }),
    desktop: buildCloudinaryUrl(publicId, {
      width: sizes.desktop,
      height: Math.round(sizes.desktop * 0.75),
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      fetchFormat: 'auto',
    }),
  }),
};

/**
 * Generate srcSet for responsive images
 */
export const generateSrcSet = (publicId: string, widths: number[] = [300, 600, 1200]): string => {
  return widths
    .map((width) => {
      const url = buildCloudinaryUrl(publicId, { width, quality: 'auto', fetchFormat: 'auto' });
      return `${url} ${width}w`;
    })
    .join(', ');
};

/**
 * Generate picture source set for WebP and fallback
 */
export const generatePictureSources = (
  publicId: string,
  options: ImageTransformOptions = {}
): { webp: string; fallback: string } => {
  return {
    webp: buildCloudinaryUrl(publicId, { ...options, fetchFormat: 'webp' }),
    fallback: buildCloudinaryUrl(publicId, { ...options, fetchFormat: 'auto' }),
  };
};

/**
 * Handle image loading with fallback
 */
export const getImageUrl = (
  imageSource: string | undefined | null,
  preset: 'thumbnail' | 'small' | 'medium' | 'large' | 'hero' = 'medium'
): string => {
  // If no image source, return placeholder
  if (!imageSource) {
    return generatePlaceholderImage();
  }

  // If it's already a full Cloudinary URL, return as is
  if (imageSource.startsWith('https://res.cloudinary.com/')) {
    return imageSource;
  }

  // If it's a public ID, build URL with preset
  if (imageSource && typeof imageSource === 'string') {
    return imagePresets[preset](imageSource);
  }

  return generatePlaceholderImage();
};

/**
 * Generate SVG placeholder image
 */
export const generatePlaceholderImage = (text = 'Image Not Available'): string => {
  const encoded = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" fill="%23e2e8f0">
      <rect width="600" height="400"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%2394a3b8">${text}</text>
    </svg>`
  );
  return `data:image/svg+xml,${encoded}`;
};

/**
 * Lazy load image detection
 */
export const observeImageLoading = (
  img: HTMLImageElement | null,
  threshold = 0.1
): IntersectionObserver | null => {
  if (!img || !('IntersectionObserver' in window)) {
    return null;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLImageElement;
          if (target.dataset.src) {
            target.src = target.dataset.src;
            observer.unobserve(target);
          }
        }
      });
    },
    { threshold }
  );

  observer.observe(img);
  return observer;
};
