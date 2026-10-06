import { currencyByLocale, prices, type Currency } from "@/config/site";
import { localeTags, type Locale } from "@/i18n/routing";

export function money(locale: Locale, amount: number, opts: Intl.NumberFormatOptions = {}): string {
  const currency: Currency = currencyByLocale[locale] ?? "USD";
  return new Intl.NumberFormat(localeTags[locale], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    ...opts,
  }).format(amount);
}

export function moneyCompact(locale: Locale, amount: number): string {
  return money(locale, amount, { notation: "compact", minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

/** Variables available inside every message string as {name}. */
export function priceVars(locale: Locale): Record<string, string> {
  const p = prices[currencyByLocale[locale] ?? "USD"];
  return {
    diagnostic: money(locale, p.diagnostic),
    pilot: money(locale, p.pilot),
    integration: money(locale, p.integration),
    annual: money(locale, p.annual),
    foundation: money(locale, p.foundation),
    enterprise: money(locale, p.enterprise),
    sovereign: money(locale, p.sovereign),
  };
}

export function fill(str: string, vars: Record<string, string | number>): string {
  return str.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}
