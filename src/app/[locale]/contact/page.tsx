import "@/styles/contact.css";
import { setRequestLocale } from "next-intl/server";
import { PageMotion } from "@/components/PageMotion";
import type { Locale } from "@/i18n/routing";
import { content } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import type { Cell, Phase } from "@/lib/types";
import { contacts, SITE_URL } from "@/config/site";
import { SubHero, SecHead } from "@/components/Hero";
import { PageNav, FaqBlock, Related, type RelatedItem } from "@/components/Blocks";
import { LeadForm } from "@/components/LeadForm";
import { Md } from "@/components/Md";
import { IconMail, IconWhatsApp, IconPhone, IconPin } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";

type P = { params: Promise<{ locale: Locale }> };
export async function generateMetadata({ params }: P) { const { locale } = await params; return pageMetadata(locale, "contact", "/contact"); }

/* Tashkent office window in UTC hours (09:00–19:00 at GMT+5). */
const OFFICE: [number, number] = [4, 14];
const HQ_OFFSET = 5;

/** Local 09:00–18:00 as UTC segments (split across midnight when needed). */
function bizSegments(offset: number): [number, number][] {
  const s = (((9 - offset) % 24) + 24) % 24;
  const e = s + 9;
  return e <= 24 ? [[s, e]] : [[s, 24], [0, e - 24]];
}

type Zones = { aria: string; axis: string; office: string; biz: string; overlap: string; rows: string[][] };

/** 24-hour UTC chart: each city's business day against Tashkent office hours. */
function ZoneChart({ z }: { z: Zones }) {
  const X0 = 230, H = 30, top = 44, rowH = 38;
  const x = (h: number) => X0 + h * H;
  const height = top + z.rows.length * rowH + 10;
  return (
    <svg className="ct-tz" viewBox={`0 0 ${X0 + 24 * H + 20} ${height}`} role="img" aria-label={z.aria}>
      <rect className="ct-office" x={x(OFFICE[0])} y={top - 10} width={(OFFICE[1] - OFFICE[0]) * H} height={z.rows.length * rowH + 6} />
      <g className="ct-axis">
        <text x={X0 - 14} y="22" textAnchor="end">{z.axis}</text>
        {Array.from({ length: 9 }, (_, i) => i * 3).map((h) => (
          <g key={h}><line x1={x(h)} x2={x(h)} y1="30" y2={height - 6} /><text x={x(h)} y="22" textAnchor="middle">{String(h).padStart(2, "0")}</text></g>
        ))}
      </g>
      {z.rows.map(([name, off], i) => {
        const o = Number(off);
        const y = top + i * rowH;
        const segs = bizSegments(o);
        const label = `${name} · UTC${o >= 0 ? "+" : "−"}${Math.abs(o)}`;
        return (
          <g key={name} className={o === HQ_OFFSET ? "ct-row ct-hq" : "ct-row"}>
            <text x="0" y={y + 13}>{label}</text>
            <line className="ct-track" x1={x(0)} x2={x(24)} y1={y + 9} y2={y + 9} />
            {segs.map(([a, b]) => <rect key={a} className="ct-biz" x={x(a)} y={y + 2} width={(b - a) * H} height="14" />)}
            {segs.map(([a, b]) => {
              const s = Math.max(a, OFFICE[0]), e = Math.min(b, OFFICE[1]);
              return e > s ? <rect key={`o${a}`} className="ct-ov" x={x(s)} y={y + 2} width={(e - s) * H} height="14" /> : null;
            })}
          </g>
        );
      })}
    </svg>
  );
}

export default async function Page({ params }: P) {
  const { locale } = await params;
  setRequestLocale(locale);
  const d = await content(locale, "contact");
  const ui = await content(locale, "ui");
  const wa = `https://wa.me/${contacts.whatsapp.replace(/\D/g, "")}`;
  const ch = d.channels;
  const local = {
    "@context": "https://schema.org", "@type": "ProfessionalService", name: "BlackGust", url: SITE_URL, email: contacts.email, telephone: contacts.phones[0],
    address: { "@type": "PostalAddress", streetAddress: contacts.address.street, addressLocality: contacts.address.city, addressCountry: contacts.address.countryCode },
    geo: { "@type": "GeoCoordinates", latitude: contacts.geo.lat, longitude: contacts.geo.lng },
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: contacts.hours.open, closes: contacts.hours.close }],
  };
  const z = d.zones;
  return (
    <>
      <SubHero crumbHome={ui.breadcrumbHome} crumb={d.crumb} title={d.title} lede={d.lede} seed={61} meta={d.heroMeta} locale={locale} path="/contact" />
      <PageNav label={d.onPage} items={d.nav} />

      <section className="sec" id="request">
        <div className="wrap split">
          <LeadForm f={d.form} locale={locale} />
          <div className="gap">
            <div className="channels">
              <a className="channel" href={`mailto:${contacts.email}`}><span className="ic"><IconMail /></span><span><b>{ch.email.title}</b><span>{contacts.email}</span><br /><small>{ch.email.note}</small></span><span className="go">→</span></a>
              <a className="channel" href={wa} target="_blank" rel="noopener"><span className="ic"><IconWhatsApp /></span><span><b>{ch.whatsapp.title}</b><span className="num">{contacts.whatsappDisplay}</span><br /><small>{ch.whatsapp.note}</small></span><span className="go">↗</span></a>
              <a className="channel" href={`tel:${contacts.phones[0].replace(/\s/g, "")}`}><span className="ic"><IconPhone /></span><span><b>{ch.phone.title}</b><span className="num">{contacts.phones.join(" · ")}</span><br /><small>{ch.phone.note}</small></span><span className="go">→</span></a>
              <a className="channel" href={contacts.mapUrl} target="_blank" rel="noopener"><span className="ic"><IconPin /></span><span><b>{ch.office.title}</b><span>{contacts.address.street}, {contacts.address.city}, {contacts.address.country}</span><br /><small>{ch.office.note} · {ch.office.map}</small></span><span className="go">↗</span></a>
            </div>
            <div className="cells mt-m" style={{ gridTemplateColumns: "1fr" }}>
              <div><span className="k">{d.hoursTitle}</span><p>{d.hours}</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec paper" id="next">
        <div className="wrap">
          <SecHead label={d.next.label} title={d.next.title} text={d.next.text} />
          <div className="phases">
            {d.next.steps.map((p: Phase) => (
              <div className="phase" key={p.title}><span className="dur">{p.dur}</span><h3>{p.title}</h3><p>{p.text}</p><div className="out"><b>{d.next.outcome}</b>{p.out}</div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="prepare">
        <div className="wrap">
          <SecHead label={d.prepare.label} title={d.prepare.title} text={d.prepare.text} />
          <div className="split">
            <ul className="ticks">{d.prepare.items.map((i: string) => <li key={i}>{i}</li>)}</ul>
            <div className="gap">
              <h3 className="h4">{d.prepare.whoTitle}</h3>
              <div className="cells" style={{ gridTemplateColumns: "1fr" }}>
                {d.prepare.who.map((c: Cell) => <div key={c.h}><span className="k">{c.k}</span><h4 className="h4">{c.h}</h4><p><Md text={c.p} /></p></div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec paper" id="time-zones">
        <div className="wrap">
          <SecHead label={z.label} title={z.title} text={z.text} />
          <figure className="ct-tzw">
            <div className="ct-scroll"><ZoneChart z={z} /></div>
            <figcaption className="ct-legend">
              <span><i className="ct-k-office" />{z.office}</span>
              <span><i className="ct-k-biz" />{z.biz}</span>
              <span><i className="ct-k-ov" />{z.overlap}</span>
              <span className="note">{z.note}</span>
            </figcaption>
          </figure>
          <div className="cells c3 mt-m">{z.regions.map((c: Cell) => <div key={c.k}><span className="k">{c.k}</span><h3 className="h4">{c.h}</h3><p>{c.p}</p></div>)}</div>
        </div>
      </section>

      <section className="sec" id="topics">
        <div className="wrap">
          <SecHead label={d.topics.label} title={d.topics.title} text={d.topics.text} />
          <div className="rows ct-topics">
            {d.topics.rows.map(([t, p, s]: string[]) => (
              <div key={t}>
                <span className="t">{t}</span>
                <p>{p}</p>
                <a className="x ct-mail" href={`mailto:${contacts.email}?subject=${encodeURIComponent(s)}`}>
                  <span>{d.topics.cols[2]}: <b>{s}</b></span><span className="u">{contacts.email} →</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqBlock id="faq" label={d.faq.label} title={d.faq.title} items={d.faq.items} paper />
      <Related label={d.related.label} title={d.related.title} more={d.related.more} items={d.related.items as RelatedItem[]} />
      <JsonLd data={local} />
      <PageMotion />
    </>
  );
}
