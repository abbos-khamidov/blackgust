import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

type Tree = { [k: string]: unknown };
const isObj = (v: unknown): v is Tree => !!v && typeof v === "object" && !Array.isArray(v);

/** Locale messages over English: a key missing in a translation falls back to English instead of crashing the page. */
function withFallback(base: Tree, over: Tree): Tree {
  const out: Tree = { ...base };
  for (const [k, v] of Object.entries(over)) out[k] = isObj(v) && isObj(base[k]) ? withFallback(base[k] as Tree, v) : v;
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const messages = (await import(`../messages/${locale}.json`)).default;
  if (locale === routing.defaultLocale) return { locale, messages };
  const en = (await import(`../messages/en.json`)).default;
  return { locale, messages: withFallback(en, messages) };
});
