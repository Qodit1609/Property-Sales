import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to manage Cloudinary configuration
 * Retrieves cloud name from environment or API
 */
export const useCloudinaryConfig = () => {
  const [cloudName, setCloudName] = useState<string>('bhumi');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initConfig = async () => {
      try {
        setLoading(true);
        
        // Try to get from environment first (Vite uses import.meta.env)
        const envCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        
        if (envCloudName) {
          setCloudName(envCloudName);
          setLoading(false);
          return;
        }

        // Fallback to default (configured in backend)
        setCloudName('bhumi');
        setLoading(false);
      } catch (err) {
        console.error('Error loading Cloudinary config:', err);
        setError(err instanceof Error ? err.message : 'Failed to load config');
        setCloudName('dyhbdio6q'); // Use default
        setLoading(false);
      }
    };

    initConfig();
  }, []);

  return { cloudName, loading, error };
};

/**
 * Hook to get image URL from Cloudinary
 * Supports both public IDs and full URLs
 */
export const useCloudinaryImage = (
  imageSource?: string | null,
  defaultPreset: 'thumbnail' | 'small' | 'medium' | 'large' | 'hero' = 'medium'
) => {
  const { cloudName } = useCloudinaryConfig();
  
  const getImageUrl = useCallback(
    (preset = defaultPreset): string => {
      if (!imageSource) {
        return generatePlaceholderImage();
      }

      // If it's already a full Cloudinary URL, return as is
      if (imageSource.startsWith('https://res.cloudinary.com/')) {
        return imageSource;
      }

      // Build URL from public ID
      const presetDimensions: Record<string, { w: number; h: number }> = {
        thumbnail: { w: 300, h: 200 },
        small: { w: 400, h: 300 },
        medium: { w: 600, h: 400 },
        large: { w: 1000, h: 700 },
        hero: { w: 1920, h: 1080 },
      };

      const { w, h } = presetDimensions[preset];
      return `https://res.cloudinary.com/${cloudName}/image/upload/w_${w},h_${h},c_fill,g_auto,q_auto,f_auto/${imageSource}`;
    },
    [imageSource, cloudName, defaultPreset]
  );

  const getSrcSet = useCallback(
    (widths = [300, 600, 1200]): string => {
      if (!imageSource) return '';

      const isFullUrl = imageSource.startsWith('https://res.cloudinary.com/');
      const publicId = isFullUrl ? imageSource : imageSource;

      return widths
        .map((width) => {
          const url = `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${Math.round(
            width * 0.75
          )},c_fill,g_auto,q_auto,f_auto/${publicId}`;
          return `${url} ${width}w`;
        })
        .join(', ');
    },
    [imageSource, cloudName]
  );

  return {
    imageUrl: getImageUrl(),
    getImageUrl,
    getSrcSet,
  };
};

/**
 * Generate SVG placeholder
 */
const generatePlaceholderImage = (): string => {
  const encoded = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" fill="%23e2e8f0">
      <rect width="600" height="400"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%2394a3b8">Image Not Available</text>
    </svg>`
  );
  return `data:image/svg+xml,${encoded}`;
};
