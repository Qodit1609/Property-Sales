import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";

type I18nLanguageBoundaryProps = {
  children: ReactNode;
};

/** Forces subtree remount on language change so memoized views refresh translated text. */
const I18nLanguageBoundary = ({ children }: I18nLanguageBoundaryProps) => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;

  return <div key={language}>{children}</div>;
};

export default I18nLanguageBoundary;
