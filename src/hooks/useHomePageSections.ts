import { useEffect, useMemo, useState } from "react";
import { defaultHomeSectionsData } from "@/components/Home/data/homeStaticData";
import type { HomeSectionsPayload } from "@/components/Home/models/homeTypes";
import { getHomeSectionsFromAPI } from "@/components/Home/services/homeSectionsService";

const mergeArrayWithDefaults = <T extends { id: string }>(value: unknown, fallback: T[]): T[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback;
  }

  const items = value as T[];
  if (items.length >= fallback.length) {
    return items;
  }

  const existingIds = new Set(items.map((item) => item.id));
  const merged = [...items];

  for (const fallbackItem of fallback) {
    if (merged.length >= fallback.length) {
      break;
    }
    if (!existingIds.has(fallbackItem.id)) {
      merged.push(fallbackItem);
    }
  }

  return merged;
};

const mergeWithFallback = (
  payload: Partial<HomeSectionsPayload> | null,
): HomeSectionsPayload => {
  if (!payload) {
    return defaultHomeSectionsData;
  }

  return {
    featuredProperties: mergeArrayWithDefaults(
      payload.featuredProperties,
      defaultHomeSectionsData.featuredProperties,
    ),
    districts: mergeArrayWithDefaults(payload.districts, defaultHomeSectionsData.districts),
    benefits: mergeArrayWithDefaults(payload.benefits, defaultHomeSectionsData.benefits),
    testimonials: mergeArrayWithDefaults(
      payload.testimonials,
      defaultHomeSectionsData.testimonials,
    ),
  };
};

export const useHomePageSections = () => {
  const [payload, setPayload] = useState<Partial<HomeSectionsPayload> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await getHomeSectionsFromAPI();
        if (mounted) {
          setPayload(data);
        }
      } catch {
        if (mounted) {
          setError("Failed to load home sections from backend.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const sections = useMemo(() => mergeWithFallback(payload), [payload]);

  return { sections, loading, error };
};
