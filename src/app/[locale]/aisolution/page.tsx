import "@/styles/aisolution.css";
import { setRequestLocale } from "next-intl/server";
import { PageMotion } from "@/components/PageMotion";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { content } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { parentCompany, SITE_URL } from "@/config/site";
import type { Cell } from "@/lib/types";
import { SubHero, Band, SecHead, Arrow } from "@/components/Hero";
import { PageNav, FaqBlock, Related, type RelatedItem } from "@/components/Blocks";
import { Counter } from "@/components/Counter";
import { JsonLd } from "@/components/JsonLd";
import { Md } from "@/components/Md";

type P = { params: Promise<{ locale: Locale }> };
export async function generateMetadata({ params }: P) { const { locale } = await params; return pageMetadata(locale, "aisolution", "/aisolution"); }

/** Parent-company page: a crawlable, contextual, dofollow link to aisolution.uz for entity SEO. */
export default async function Page({ params }: P) {
  const { locale } = await params;
  setRequestLocale(locale);
  const d = await content(locale, "aisolution");
  const ui = await content(locale, "ui");
  const schema = {
    "@context": "https://schema.org", "@type": "Organization", "@id": `${parentCompany.url}/#org`, name: parentCompany.name, url: parentCompany.url,
    sameAs: [parentCompany.wikidata, parentCompany.blog, parentCompany.telegram],
    subOrganization: { "@id": `${SITE_URL}/#org` },
  };
  const ext = <span className="ar" aria-hidden="true">↗</span>;

  return (
    <>
      <SubHero
        crumbHome={ui.breadcrumbHome} crumb={d.crumb} title={d.title} lede={d.lede} seed={67}
        meta={d.heroMeta} locale={locale} path="/aisolution"
        actions={<>
          <a className="btn btn-p" href={parentCompany.url} target="_blank" rel="noopener">{d.about.cta} {ext}</a>
          <Link className="btn btn-g" href="/contact">{d.band.cta2}</Link>
        </>}
      />
      {d.nav ? <PageNav label={d.onPage} items={d.nav} /> : null}

      <section className="sec" id="about">
        <div className="wrap">
          <div className="split">
            <div className="gap"><span className="label">{d.about.label}</span><h2 className="serif" style={{ fontSize: "var(--s-2xl)", lineHeight: 1.05 }}>{d.about.title}</h2></div>
            <div className="gap" style={{ alignSelf: "center" }}>
              <div className="prose dim">{d.about.paras.map((p: string) => <p key={p}>{p}</p>)}</div>
              <div className="row mt-s">
                <a className="btn btn-g" href={parentCompany.url} target="_blank" rel="noopener">{d.about.cta} {ext}</a>
                <a className="btn btn-g" href={parentCompany.blog} target="_blank" rel="noopener">{d.about.blog}</a>
              </div>
            </div>
          </div>
          <div className="facts mt-l">{d.facts.map(([n, t]: string[]) => <div key={t}><Counter value={n} /><span>{t}</span></div>)}</div>
        </div>
      </section>

      {d.relation ? (
        <section className="sec paper" id="relationship">
          <div className="wrap">
            <SecHead label={d.relation.label} title={d.relation.title} text={d.relation.text} />
            <figure className="ais-tree" aria-label={d.relation.aria}>
              <div className="ais-root">{d.relation.root}</div>
              <span className="ais-stem" aria-hidden="true" />
              <ul className="ais-shared">{d.relation.shared.map((s: string) => <li key={s}>{s}</li>)}</ul>
              <div className="ais-brands">
                {d.relation.brands.map(([name, market, terms]: string[], i: number) => (
                  <div key={name} className={i === 1 ? "ais-brand ais-hl" : "ais-brand"}>
                    <b>{name}</b><span>{market}</span><span className="ais-terms">{terms}</span>
                  </div>
                ))}
              </div>
            </figure>
            <div className="cells c3 mt-l">{d.relation.cells.map((c: Cell) => <div key={c.h}><span className="k">{c.k}</span><h3 className="h4">{c.h}</h3><p>{c.p}</p></div>)}</div>
          </div>
        </section>
      ) : null}

      {d.uz ? (
        <section className="sec" id="uzbekistan">
          <div className="wrap">
            <SecHead label={d.uz.label} title={d.uz.title} />
            <div className="cells c4">{d.uz.cells.map((c: Cell) => <div key={c.h}><span className="k">{c.k}</span><h3 className="h4">{c.h}</h3><p>{c.p}</p></div>)}</div>
          </div>
        </section>
      ) : null}

      {d.why ? (
        <section className="sec paper" id="why">
          <div className="wrap">
            <SecHead label={d.why.label} title={d.why.title} text={d.why.text} />
            <div className="split">
              <ul className="ticks">{d.why.items.map((x: string) => <li key={x}>{x}</li>)}</ul>
              {d.partner ? (
                <div className="ais-partner">
                  <span className="label">{d.partner.label}</span>
                  <h3 className="h3">{d.partner.title}</h3>
                  <p><Md text={d.partner.text} /></p>
                  {d.partner.href ? <Link className="btn btn-g" href={d.partner.href}>{d.partner.more} <Arrow /></Link> : null}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <section className="sec" id="which">
        <div className="wrap">
          <SecHead label={d.which.label} title={d.which.title} text={d.which.text} />
          <div className="rows">
            {d.which.rows.map((r: string[]) => (
              <div key={r[0]}><h3 className="t">{r[0]}</h3><p>{r[1]}</p>
                {r[2] === "aisolution.uz" ? <a className="x u" href={parentCompany.url} target="_blank" rel="noopener">{r[2]} ↗</a> : <Link className="x u" href="/">{r[2]}</Link>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {d.faq ? <FaqBlock id="faq" label={d.faq.label} title={d.faq.title} items={d.faq.items} paper /> : null}
      {d.related ? <Related label={d.related.label} title={d.related.title} items={d.related.items as RelatedItem[]} more={d.related.more} /> : null}

      <Band title={d.band.title} text={d.band.text} seed={71}>
        <a className="btn btn-p" href={parentCompany.url} target="_blank" rel="noopener">{d.band.cta1} {ext}</a>
        <Link className="btn btn-g" href="/contact">{d.band.cta2}</Link>
      </Band>
      <JsonLd data={schema} />
      <PageMotion />
    </>
  );
}
