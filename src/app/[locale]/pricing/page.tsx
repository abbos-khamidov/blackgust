import { setRequestLocale } from "next-intl/server";
import { PageMotion } from "@/components/PageMotion";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { content } from "@/lib/content";
import { localizedUrl, pageMetadata } from "@/lib/seo";
import { prices, currencyByLocale, SITE_URL } from "@/config/site";
import type { Cell, Tier } from "@/lib/types";
import { SubHero, Band, SecHead, Arrow } from "@/components/Hero";
import { PageNav, FaqBlock, Related, Matrix, Statement } from "@/components/Blocks";
import { JsonLd } from "@/components/JsonLd";
import { Md } from "@/components/Md";

type P = { params: Promise<{ locale: Locale }> };
export async function generateMetadata({ params }: P) { const { locale } = await params; return pageMetadata(locale, "pricing", "/pricing"); }

type Pkg = { id: "foundation" | "enterprise" | "sovereign"; level: string; name: string; for: string; price: string; note: string; scope: string[][]; items: string[]; cta: string; hl?: boolean };
type Level = { lv: string; h: string; p: string };

export default async function Page({ params }: P) {
  const { locale } = await params;
  setRequestLocale(locale);
  const d = await content(locale, "pricing");
  const ui = await content(locale, "ui");
  const currency = currencyByLocale[locale];

  const offers = {
    "@context": "https://schema.org", "@type": "Service", "@id": `${SITE_URL}/#platform`,
    name: "BlackGust platform", serviceType: "Enterprise AI platform with forward-deployed engineers",
    provider: { "@id": `${SITE_URL}/#org` }, url: localizedUrl(locale, "/pricing"),
    areaServed: ["Europe", "North America", "South America", "China", "Japan", "South Korea", "Australia"],
    offers: d.packages.items.map((p: Pkg) => ({
      "@type": "Offer", name: `BlackGust ${p.name}`, description: p.for, price: prices[currency][p.id], priceCurrency: currency,
      priceSpecification: { "@type": "UnitPriceSpecification", price: prices[currency][p.id], priceCurrency: currency, unitText: "YEAR" },
      url: `${localizedUrl(locale, "/pricing")}#packages`,
    })),
  };

  return (
    <>
      <SubHero crumbHome={ui.breadcrumbHome} crumb={d.crumb} title={d.title} lede={d.lede} seed={41} meta={d.heroMeta} locale={locale} path="/pricing"
        actions={<><a className="btn btn-p" href="#packages">{d.heroCta1} <Arrow /></a><Link className="btn btn-g" href="/contact">{d.heroCta2}</Link></>} />
      <PageNav label={d.navLabel} items={d.nav} />

      <section className="sec" id="packages">
        <div className="gridlines" />
        <div className="wrap" style={{ position: "relative" }}>
          <SecHead label={d.packages.label} title={d.packages.title} text={d.packages.text} />
          <div className="pk">
            {d.packages.items.map((p: Pkg) => (
              <article key={p.id} id={p.id} className={p.hl ? "hl" : undefined}>
                {p.hl ? <span className="tag">{d.packages.popular}</span> : null}
                <span className={`mono ${p.hl ? "brass" : "dim"}`}>{p.level}</span>
                <h3>{p.name}</h3>
                <p className="for">{p.for}</p>
                <div className="price">{p.price}<small>{d.packages.per}</small></div>
                <p className="dim" style={{ fontSize: ".9rem" }}>{p.note}</p>
                <div className="scope" aria-label={d.packages.scopeTitle}>
                  {p.scope.map(([k, v]) => <div key={k}><span>{k}</span><b>{v}</b></div>)}
                </div>
                <ul className="ticks">{p.items.map((i) => <li key={i}>{i}</li>)}</ul>
                <Link className={`btn ${p.hl ? "btn-p" : "btn-g"}`} href="/contact">{p.cta} <Arrow /></Link>
              </article>
            ))}
          </div>
          <p className="note mt-m">{d.packages.foot}</p>
        </div>
      </section>

      <section className="sec" id="change">
        <div className="wrap">
          <SecHead label={d.change.label} title={d.change.title} text={d.change.text} />
          <div className="ladder">
            {d.change.levels.map((l: Level, i: number) => (
              <div key={l.lv}>
                <span className="lv">{l.lv}</span>
                <div className="bar"><i style={{ height: `${[34, 67, 100][i]}%` }} /></div>
                <h3>{l.h}</h3>
                <p>{l.p}</p>
              </div>
            ))}
          </div>
          <div className="mt-l">
            <Matrix cols={d.change.cols} rows={d.change.rows} hl={2} caption={d.change.matrixCaption} />
          </div>
        </div>
      </section>

      <Statement k={d.statement.k} text={d.statement.text} />

      <section className="sec paper" id="compare">
        <div className="wrap">
          <SecHead label={d.compare.label} title={d.compare.title} text={d.compare.text} />
          <Matrix cols={d.compare.cols} rows={d.compare.rows} hl={2} caption={d.compare.caption} />
        </div>
      </section>

      <section className="sec" id="start">
        <div className="wrap">
          <SecHead label={d.start.label} title={d.start.title} text={d.start.text} />
          <div className="tiers">
            {d.start.steps.map((t: Tier) => (
              <div key={t.title} className={`tier${t.hl ? " hl" : ""}`}>
                <span className={`mono ${t.hl ? "brass" : "dim"}`}>{t.step}</span>
                <h3 className="h3">{t.title}</h3>
                <div className="price num">{t.price}</div>
                <p className="dim">{t.note}</p>
                <ul className="ticks">{t.items.map((i: string) => <li key={i}>{i}</li>)}</ul>
                <Link className={`btn ${t.hl ? "btn-p" : "btn-g"}`} href="/contact" style={{ marginTop: "auto", justifySelf: "start", alignSelf: "flex-start" }}>{t.cta}{t.hl ? <> <Arrow /></> : null}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec paper" id="included">
        <div className="wrap">
          <SecHead label={d.included.label} title={d.included.title} text={d.included.text} />
          <div className="cells c3">{d.included.cells.map((c: Cell) => <div key={c.k}><span className="k">{c.k}</span><h3 className="h4">{c.h}</h3><p>{c.p}</p></div>)}</div>
          <div className="split mt-l">
            <h3 className="h3">{d.included.excludedTitle}</h3>
            <ul className="ticks crosses">{d.included.excluded.map((x: string) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="sec" id="factors">
        <div className="wrap">
          <SecHead label={d.factors.label} title={d.factors.title} text={d.factors.text} />
          <div className="qa">{d.factors.qa.map(([q, a]: string[]) => <div key={q}><span className="qq">{q}</span><span className="aa">{a}</span></div>)}</div>
        </div>
      </section>

      <section className="sec" id="payback">
        <div className="wrap">
          <SecHead label={d.roi.label} title={d.roi.title} text={d.roi.text} />
          <div className="split" style={{ gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)" }}>
            <div className="console">
              <div className="ch"><span><i />{d.roi.consoleTitle}</span><span>{d.roi.consoleNote}</span></div>
              <div className="cb">
                <div className="tbl-w"><table className="tbl">
                  <thead><tr>{d.roi.headers.map((x: string, i: number) => <th key={x} className={i ? "r" : undefined}>{x}</th>)}</tr></thead>
                  <tbody>{d.roi.rows.map((r: string[], k: number) => <tr key={r[0]}><td>{r[0]}</td><td className="r">{r[1]}</td><td className={`r${k === d.roi.rows.length - 1 ? " brass" : ""}`}>{r[2]}</td></tr>)}</tbody>
                </table></div>
                <p className="note">{d.roi.note}</p>
              </div>
            </div>
            <div className="qa" style={{ alignSelf: "center" }}>
              {d.roi.rule.map(([k, v]: string[]) => <div key={k} style={{ gridTemplateColumns: "1fr" }}><span className="qq">{k}</span><span className="aa">{v}</span></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="sec paper" id="terms">
        <div className="wrap">
          <SecHead label={d.terms.label} title={d.terms.title} text={d.terms.text} />
          <div className="qa">{d.terms.qa.map(([q, a]: string[]) => <div key={q}><span className="qq">{q}</span><span className="aa"><Md text={a} /></span></div>)}</div>
        </div>
      </section>

      <FaqBlock id="faq" label={d.faq.label} title={d.faq.title} items={d.faq.items} />
      <Related label={d.related.label} title={d.related.title} more={d.related.more} items={d.related.items} />

      <Band title={d.band.title} text={d.band.text} seed={43}>
        <Link className="btn btn-p" href="/contact">{d.band.cta1} <Arrow /></Link>
      </Band>
      <JsonLd data={offers} />
      <PageMotion />
    </>
  );
}
