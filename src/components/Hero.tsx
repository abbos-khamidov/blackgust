import type { ReactNode } from "react";
import { GustCanvas } from "./GustCanvas";
import { Split } from "./Split";
import { Link } from "@/i18n/navigation";
import type { GustOptions } from "@/lib/motion/gust";
import type { Locale } from "@/i18n/routing";
import { localizedUrl } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

/**
 * Inner-page hero: breadcrumb, split headline, lede, wind field behind.
 * Optional: `meta` key/value rows and `actions` (buttons) under the lede;
 * `locale` + `path` also emit BreadcrumbList structured data.
 */
export function SubHero({ crumbHome, crumb, title, lede, seed, meta, actions, locale, path }: {
  crumbHome: string; crumb: string; title: string; lede: ReactNode; seed: number;
  meta?: string[][]; actions?: ReactNode; locale?: Locale; path?: string;
}) {
  const opts: GustOptions = { density: 1300, seed, warm: 80 };
  return (
    <section className="hero hero-sub">
      <GustCanvas options={opts} />
      <div className="veil" />
      <div className="wrap">
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">{crumbHome}</Link><span>/</span><span aria-current="page">{crumb}</span>
        </nav>
        <div className="hero-grid">
          <h1><Split text={title} /></h1>
          <div>
            <p className="lede">{lede}</p>
            {actions ? <div className="row mt-m">{actions}</div> : null}
            {meta ? <ul className="meta">{meta.map(([k, v]) => <li key={k}><span>{k}</span><b>{v}</b></li>)}</ul> : null}
          </div>
        </div>
      </div>
      {locale && path ? <JsonLd data={{
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: crumbHome, item: localizedUrl(locale, "/") },
          { "@type": "ListItem", position: 2, name: crumb, item: localizedUrl(locale, path) },
        ],
      }} /> : null}
    </section>
  );
}

export function Band({ title, text, children, seed }: { title: string; text: ReactNode; children: ReactNode; seed: number }) {
  return (
    <section className="band">
      <GustCanvas options={{ density: 1400, brass: 0.14, seed, warm: 90 }} />
      <div className="veil" style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(7,8,10,.95) 30%,rgba(7,8,10,.4))" }} />
      <div className="wrap">
        <h2><Split text={title} /></h2>
        <div className="gap">
          <p className="dim">{text}</p>
          <div className="row">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function SecHead({ label, title, text }: { label: string; title: string; text?: ReactNode }) {
  return (
    <div className="sec-head">
      <span className="label">{label}</span>
      <div>
        <h2><Split text={title} /></h2>
        {text ? <p>{text}</p> : null}
      </div>
    </div>
  );
}

export const Arrow = () => <span className="ar" aria-hidden="true">→</span>;
