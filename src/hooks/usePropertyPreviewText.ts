import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Property } from "../features/properties/propertyType";
import { normalizeLanguage } from "../i18n";
import { translateDynamic, type LocalizedValue } from "../lib/i18nHelpers";
import { resolveFreeTextForLanguage } from "../lib/translateText";

export type PropertyPreviewText = {
  title: string;
  description: string;
  shortDescription: string;
  address: string;
  city: string;
  state: string;
  locality: string;
  isTranslating: boolean;
};

const resolveLocalizedField = (value: LocalizedValue, language: string): string =>
  translateDynamic(value, language);

const getRawAddress = (property: Property): string =>
  property.location?.address?.trim() ||
  property.address?.trim() ||
  property.locationText?.trim() ||
  "";

const getRawDisplayAddress = (property: Property): string => {
  const address = getRawAddress(property);
  if (address) {
    return address;
  }

  const parts = [
    property.location?.locality,
    property.location?.city,
    property.location?.state,
  ]
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter(Boolean);

  return parts.join(", ");
};

const isLocalizedObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

export const usePropertyPreviewText = (property: Property): PropertyPreviewText => {
  const { i18n } = useTranslation();
  const language = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);

  const sources = useMemo(
    () => ({
      title: property.title?.trim() ?? "",
      description: property.description?.trim() ?? "",
      shortDescription: (property.shortDescription || property.description || "").trim(),
      address: getRawDisplayAddress(property),
      city: property.location?.city?.trim() ?? "",
      state: property.location?.state?.trim() ?? "",
      locality: property.location?.locality?.trim() ?? "",
    }),
    [
      property._id,
      property.title,
      property.description,
      property.shortDescription,
      property.address,
      property.locationText,
      property.location?.address,
      property.location?.city,
      property.location?.state,
      property.location?.locality,
    ],
  );

  const [text, setText] = useState<PropertyPreviewText>({
    ...sources,
    isTranslating: false,
  });

  useEffect(() => {
    let cancelled = false;

    const localizedTitle = resolveLocalizedField(property.title as LocalizedValue, language);
    const localizedDescription = resolveLocalizedField(
      property.description as LocalizedValue,
      language,
    );
    const localizedShortDescription = resolveLocalizedField(
      (property.shortDescription || property.description) as LocalizedValue,
      language,
    );
    const localizedAddress = resolveLocalizedField(
      (property.location?.address ?? property.address ?? getRawDisplayAddress(property)) as LocalizedValue,
      language,
    );

    const hasLocalizedObjects =
      isLocalizedObject(property.title) ||
      isLocalizedObject(property.description) ||
      isLocalizedObject(property.shortDescription);

    if (hasLocalizedObjects) {
      setText({
        title: localizedTitle || sources.title,
        description: localizedDescription || sources.description,
        shortDescription: localizedShortDescription || sources.shortDescription,
        address: localizedAddress || sources.address,
        city:
          resolveLocalizedField(property.location?.city as LocalizedValue, language) || sources.city,
        state:
          resolveLocalizedField(property.location?.state as LocalizedValue, language) || sources.state,
        locality:
          resolveLocalizedField(property.location?.locality as LocalizedValue, language) ||
          sources.locality,
        isTranslating: false,
      });
      return;
    }

    const applyEnglish = () => {
      setText({
        ...sources,
        isTranslating: false,
      });
    };

    if (language === "en") {
      applyEnglish();
      return;
    }

    setText((prev) => ({
      ...prev,
      ...sources,
      isTranslating: true,
    }));

    void (async () => {
      try {
        const [title, description, shortDescription, address, city, state, locality] =
          await Promise.all([
            resolveFreeTextForLanguage(sources.title, language),
            resolveFreeTextForLanguage(sources.description, language),
            resolveFreeTextForLanguage(sources.shortDescription, language),
            resolveFreeTextForLanguage(sources.address, language),
            resolveFreeTextForLanguage(sources.city, language),
            resolveFreeTextForLanguage(sources.state, language),
            resolveFreeTextForLanguage(sources.locality, language),
          ]);

        if (!cancelled) {
          setText({
            title: title || sources.title,
            description: description || sources.description,
            shortDescription: shortDescription || sources.shortDescription,
            address: address || sources.address,
            city: city || sources.city,
            state: state || sources.state,
            locality: locality || sources.locality,
            isTranslating: false,
          });
        }
      } catch {
        if (!cancelled) {
          setText({
            ...sources,
            isTranslating: false,
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [language, property, sources]);

  return text;
};
