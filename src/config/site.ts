/**
 * Single source of truth for contacts, prices and partner links.
 * Edit here — every page and every language picks it up.
 */
import type { Locale } from "@/i18n/routing";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://blackgust.com";
export const SITE_NAME = "BlackGust";

export const contacts = {
  email: "hello@blackgust.com",
  whatsapp: "+998939492000", // digits only, used for wa.me
  whatsappDisplay: "+998 93 949 20 00",
  phones: ["+998 93 949 20 00", "+998 77 061 22 00", "+998 98 877 02 03"],
  address: {
    street: "184 Bogibo‘ston St.",
    city: "Tashkent",
    country: "Uzbekistan",
    countryCode: "UZ",
  },
  geo: { lat: 41.2995, lng: 69.2401 },
  mapUrl: "https://www.google.com/maps/search/?api=1&query=41.2995,69.2401",
  hours: { days: "Mo-Sa", open: "09:00", close: "19:00", tz: "GMT+5" },
};

/** Parent company — the backlink target for SEO */
export const parentCompany = {
  name: "AISolution",
  url: "https://aisolution.uz",
  blog: "https://blog.aisolution.uz",
  wikidata: "https://www.wikidata.org/wiki/Q140288424",
  telegram: "https://t.me/aisolutionuz",
};

export type Currency = "USD" | "EUR";

export const currencyByLocale: Record<Locale, Currency> = {
  en: "USD",
  es: "USD",
  pt: "USD",
  zh: "USD",
  ja: "USD",
  ko: "USD",
  fr: "EUR",
  de: "EUR",
};

/**
 * Fixed list prices per currency (no live FX conversion).
 * Annual platform packages: foundation (= annual, the entry price), enterprise, sovereign.
 */
export const prices: Record<Currency, { diagnostic: number; pilot: number; integration: number; annual: number; foundation: number; enterprise: number; sovereign: number }> = {
  USD: { diagnostic: 1490, pilot: 9990, integration: 15000, annual: 90000, foundation: 90000, enterprise: 250000, sovereign: 490000 },
  EUR: { diagnostic: 1390, pilot: 9290, integration: 13900, annual: 84000, foundation: 84000, enterprise: 230000, sovereign: 450000 },
};

/** Illustrative demo figures used in the Executive console and the live model (in the page currency). */
export const demo = {
  total: 2_840_000,
  branches: [1_126_400, 809_700, 512_000, 391_900],
  approvalThreshold: 500_000,
};
