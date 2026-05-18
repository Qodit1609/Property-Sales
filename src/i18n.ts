import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en/translation.json";

type SupportedLanguage = "en" | "hi";

type TranslationModule = {
  default: Record<string, unknown>;
};

const LOCALE_LOADERS: Record<SupportedLanguage, () => Promise<TranslationModule>> = {
  en: async () => ({ default: enTranslation as Record<string, unknown> }),
  hi: () => import("./locales/hi/translation.json"),
};

const LANGUAGE_STORAGE_KEY = "bhoomiwala_lang";

const loadedLanguages = new Set<SupportedLanguage>(["en"]);

const normalizeLanguage = (language: string | undefined): SupportedLanguage =>
  language?.toLowerCase().startsWith("hi") ? "hi" : "en";

const getPersistedLanguage = (): SupportedLanguage | undefined => {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (!stored) return undefined;
    return normalizeLanguage(stored);
  } catch {
    return undefined;
  }
};

const ensureLanguageResources = async (language: string | undefined) => {
  const normalizedLanguage = normalizeLanguage(language);

  if (loadedLanguages.has(normalizedLanguage)) return;

  try {
    const module = await LOCALE_LOADERS[normalizedLanguage]();

    i18n.addResourceBundle(
      normalizedLanguage,
      "translation",
      module.default,
      true,
      true
    );

    loadedLanguages.add(normalizedLanguage);
  } catch (error) {
    console.error(`Failed to load translations for "${normalizedLanguage}"`, error);
  }
};

const preloadLanguage = async (language: string | undefined) => {
  await ensureLanguageResources(language);
};

const persistedLanguage = getPersistedLanguage();

const i18nReady = i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
    },
    ...(persistedLanguage ? { lng: persistedLanguage } : {}),
    fallbackLng: "en",
    supportedLngs: ["en", "hi"],
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    defaultNS: "translation",
    ns: ["translation"],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    returnNull: false,
    returnEmptyString: false,
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
    },
  })
  .then(async () => {
    // Prefer i18n.language over resolvedLanguage here: resolved can be "en" until Hindi bundles exist.
    const targetLanguage = normalizeLanguage(i18n.language);
    document.documentElement.lang = targetLanguage;
    await ensureLanguageResources(targetLanguage);
    await i18n.changeLanguage(targetLanguage);
  });

i18n.on("languageChanged", (language) => {
  const normalizedLanguage = normalizeLanguage(language);
  document.documentElement.lang = normalizedLanguage;
  void ensureLanguageResources(normalizedLanguage);
});

export { normalizeLanguage, preloadLanguage, i18nReady };
export default i18n;
