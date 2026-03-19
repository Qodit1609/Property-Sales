import { useEffect, useMemo, useState } from "react";
import { defaultHomeSectionsData } from "@/components/Home/data/homeStaticData";
import type { HomeSectionsPayload } from "@/components/Home/models/homeTypes";
import { getHomeSectionsFromAPI } from "@/components/Home/services/homeSectionsService";

const asArrayOrFallback = <T>(value: unknown, fallback: T[]): T[] => {
  return Array.isArray(value) && value.length > 0 ? (value as T[]) : fallback;
};

const mergeWithFallback = (
  payload: Partial<HomeSectionsPayload> | null,
): HomeSectionsPayload => {
  if (!payload) {
    return defaultHomeSectionsData;
  }

  return {
    featuredProperties: asArrayOrFallback(
      payload.featuredProperties,
      defaultHomeSectionsData.featuredProperties,
    ),
    districts: asArrayOrFallback(payload.districts, defaultHomeSectionsData.districts),
    benefits: asArrayOrFallback(payload.benefits, defaultHomeSectionsData.benefits),
    testimonials: asArrayOrFallback(
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
