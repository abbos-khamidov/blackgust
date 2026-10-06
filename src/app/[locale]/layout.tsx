import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing, localeTags, type Locale } from "@/i18n/routing";
import { SITE_URL, SITE_NAME, contacts, parentCompany } from "@/config/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MotionRoot } from "@/components/MotionRoot";
import { JsonLd } from "@/components/JsonLd";
import { Analytics } from "@/components/Analytics";
// Self-hosted fonts (no request to Google; Latin subsets load by unicode-range; CJK falls back to system fonts, see globals.css)
import "@fontsource/spectral/300.css";
import "@fontsource/spectral/300-italic.css";
import "@fontsource/spectral/400.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "../globals.css";


export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
};

export const viewport: Viewport = { themeColor: "#07080A", colorScheme: "dark", viewportFit: "cover" };

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const all = await getMessages();
  const clientMessages = { nav: all.nav, ui: all.ui };

  const org = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization", "@id": `${SITE_URL}/#org`, name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/icon.png`,
        email: contacts.email,
        address: { "@type": "PostalAddress", streetAddress: contacts.address.street, addressLocality: contacts.address.city, addressCountry: contacts.address.countryCode },
        contactPoint: [{ "@type": "ContactPoint", contactType: "sales", email: contacts.email, telephone: contacts.phones[0], availableLanguage: ["en", "de", "fr", "es", "pt", "zh", "ja", "ko"] }],
        parentOrganization: { "@type": "Organization", "@id": `${parentCompany.url}/#org`, name: parentCompany.name, url: parentCompany.url, sameAs: [parentCompany.wikidata, parentCompany.blog] },
      },
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME, publisher: { "@id": `${SITE_URL}/#org` }, inLanguage: routing.locales.map((l) => localeTags[l]) },
    ],
  };

  return (
    <html lang={localeTags[locale as Locale]}>
      <body>
        <NextIntlClientProvider locale={locale} messages={clientMessages}>
          <Header />
          <main id="main">{children}</main>
          <Footer locale={locale} />
          <MotionRoot />
        </NextIntlClientProvider>
        <JsonLd data={org} />
        <Analytics />
      </body>
    </html>
  );
}
