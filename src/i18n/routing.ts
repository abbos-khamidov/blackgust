import { defineRouting } from "next-intl/routing";

export const locales = ["en", "de", "fr", "es", "pt", "zh", "ja", "ko"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  // English lives at the root (blackgust.com/platform), others are prefixed (/de/platform)
  localePrefix: "as-needed",
  localeDetection: false,
});

/** Native names for the language switcher */
export const localeNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  pt: "Português",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
};

/** BCP-47 tags used for hreflang and Intl formatting */
export const localeTags: Record<Locale, string> = {
  en: "en",
  de: "de",
  fr: "fr",
  es: "es",
  pt: "pt-BR",
  zh: "zh-Hans",
  ja: "ja",
  ko: "ko",
};
