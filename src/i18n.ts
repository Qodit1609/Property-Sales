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

const loadedLanguages = new Set<SupportedLanguage>(["en"]);

const normalizeLanguage = (language: string | undefined): SupportedLanguage =>
  language?.toLowerCase().startsWith("hi") ? "hi" : "en";

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

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
    },
    lng: "en",
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
      lookupLocalStorage: "bhoomiwala_lang",
    },
  })
  .then(() => {
    const initialLanguage = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);
    document.documentElement.lang = initialLanguage;
    return ensureLanguageResources(initialLanguage);
  });

i18n.on("languageChanged", (language) => {
  const normalizedLanguage = normalizeLanguage(language);
  document.documentElement.lang = normalizedLanguage;
  void ensureLanguageResources(normalizedLanguage);
});

export { normalizeLanguage, preloadLanguage };
export default i18n;
