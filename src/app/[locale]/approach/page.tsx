import "@/styles/approach.css";
import { setRequestLocale } from "next-intl/server";
import { PageMotion } from "@/components/PageMotion";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { content } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import type { Cell, Phase } from "@/lib/types";
import { SubHero, Band, SecHead, Arrow } from "@/components/Hero";
import { PageNav, FaqBlock, Related, Matrix, Statement } from "@/components/Blocks";
import { Split } from "@/components/Split";
import { Md } from "@/components/Md";

type P = { params: Promise<{ locale: Locale }> };
export async function generateMetadata({ params }: P) { const { locale } = await params; return pageMetadata(locale, "approach", "/approach"); }

type Doc = { k: string; h: string; size: string; p: string; items: string[] };
type Region = { k: string; h: string; ref: string; onsite: string; remote: string };
type GanttRow = [label: string, start: number, end: number, milestone: number];

/* Business-hour windows in UTC for the time-zone strips (reference cities, standard time).
   [client start, client end, our start, our end]; our team works from Tashkent (UTC+5). */
const TZ: [number, number, number, number][] = [
  [8, 17, 4, 13],   // Central Europe 09–18 CET · Tashkent 09–18
  [14, 23, 9, 17],  // US Eastern 09–18 · Tashkent shifted 14–22
  [0, 9, 4, 13],    // Japan 09–18 JST · Tashkent 09–18
];

/** Week-by-week Gantt of a typical diagnostic + pilot. */
function Gantt({ t }: { t: { aria: string; week: string; groups: string[]; rows: GanttRow[]; demo: string } }) {
  const W = 1000, L = 300, weeks = 11, cw = (W - L) / weeks, top = 54, rh = 34;
  const n = t.rows.length + 1;
  const H = top + n * rh + 10;
  const x = (w: number) => L + (w - 1) * cw;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.aria} className="ap-gantt-svg">
      {Array.from({ length: weeks + 1 }, (_, i) => (
        <line key={i} x1={L + i * cw} x2={L + i * cw} y1={22} y2={H - 6} className={i === 3 ? "ap-g-div" : "ap-g-grid"} />
      ))}
      <text x={x(1) + 6} y={14} className="ap-g-grp">{t.groups[0]}</text>
      <text x={x(4) + 6} y={14} className="ap-g-grp">{t.groups[1]}</text>
      {Array.from({ length: weeks }, (_, i) => (
        <text key={i} x={x(i + 1) + cw / 2} y={42} textAnchor="middle" className="ap-g-wk">{`${t.week} ${i + 1}`}</text>
      ))}
      {t.rows.map(([label, s, e, m], i) => {
        const y = top + i * rh;
        return (
          <g key={label}>
            <line x1={0} x2={W} y1={y + rh} y2={y + rh} className="ap-g-grid" />
            <text x={0} y={y + rh / 2 + 5} className="ap-g-lbl">{label}</text>
            {m ? (
              <rect x={x(e) + cw - 9} y={y + rh / 2 - 7} width={14} height={14} transform={`rotate(45 ${x(e) + cw - 2} ${y + rh / 2})`} className="ap-g-ms" />
            ) : (
              <rect x={x(s) + 4} y={y + rh / 2 - 7} width={(e - s + 1) * cw - 8} height={14} rx={2} className={s >= 4 ? "ap-g-bar p" : "ap-g-bar"} />
            )}
          </g>
        );
      })}
      <text x={0} y={top + t.rows.length * rh + rh / 2 + 5} className="ap-g-lbl">{t.demo}</text>
      {Array.from({ length: 8 }, (_, i) => (
        <circle key={i} cx={x(i + 4) + cw / 2} cy={top + t.rows.length * rh + rh / 2} r={5} className="ap-g-demo" />
      ))}
    </svg>
  );
}

/** 24-hour UTC strip: client hours, our hours, overlap. */
function TzStrip({ w, legend, axis }: { w: [number, number, number, number]; legend: string[]; axis: string }) {
  const [cs, ce, os, oe] = w;
  const ovS = Math.max(cs, os), ovE = Math.min(ce, oe);
  const pct = (h: number) => `${(h / 24) * 100}%`;
  return (
    <div className="ap-tz" aria-hidden="true">
      <div className="ap-tz-row"><span>{legend[0]}</span><i className="ap-tz-c" style={{ left: pct(cs), width: pct(ce - cs) }} /></div>
      <div className="ap-tz-row"><span>{legend[1]}</span><i className="ap-tz-o" style={{ left: pct(os), width: pct(oe - os) }} /></div>
      <div className="ap-tz-row"><span>{legend[2]}</span>{ovE > ovS ? <i className="ap-tz-v" style={{ left: pct(ovS), width: pct(ovE - ovS) }} /> : null}</div>
      <div className="ap-tz-ax"><span>00</span><span>06</span><span>12</span><span>18</span><span>24 {axis}</span></div>
    </div>
  );
}

export default async function Page({ params }: P) {
  const { locale } = await params;
  setRequestLocale(locale);
  const d = await content(locale, "approach");
  const ui = await content(locale, "ui");
  const sev: Record<string, string> = { c: "sev c", w: "sev w", o: "sev o" };
  return (
    <>
      <SubHero
        crumbHome={ui.breadcrumbHome} crumb={d.crumb} title={d.title} lede={d.lede} seed={5}
        meta={d.meta} locale={locale} path="/approach"
        actions={<>
          <Link className="btn btn-p" href="/contact">{d.cta1} <Arrow /></Link>
          <Link className="btn btn-g" href="/pricing#compare">{d.cta2}</Link>
        </>}
      />
      <PageNav label={d.navLabel} items={d.nav} />

      <section className="sec" id="fde">
        <div className="gridlines" />
        <div className="wrap" style={{ position: "relative" }}>
          <SecHead label={d.fde.label} title={d.fde.title} text={d.fde.text} />
          <div className="cells c3">{d.fde.cells.map((c: Cell) => <div key={c.h}><span className="k">{c.k}</span><h3 className="h4">{c.h}</h3><p>{c.p}</p></div>)}</div>
        </div>
      </section>

      <Statement k={d.statement.k} text={d.statement.text} />

      <section className="sec paper" id="timeline">
        <div className="wrap">
          <SecHead label={d.timeline.label} title={d.timeline.title} text={d.timeline.text} />
          <div className="ap-gantt"><Gantt t={d.timeline} /></div>
          <div className="ap-legend">
            <span><i className="ap-lg-bar" />{d.timeline.legend[0]}</span>
            <span><i className="ap-lg-ms" />{d.timeline.legend[1]}</span>
            <span><i className="ap-lg-demo" />{d.timeline.legend[2]}</span>
            <span className="note">{d.timeline.note}</span>
          </div>
        </div>
      </section>

      <section className="sec" id="phases">
        <div className="wrap">
          <SecHead label={d.phases.label} title={d.phases.title} text={d.phases.text} />
          <div className="phases">
            {d.phases.items.map((p: Phase) => (
              <div className="phase" key={p.title}>
                <span className="dur">{p.dur}</span><h3>{p.title}</h3>
                <ul>{(p.list ?? []).map((i: string) => <li key={i}>{i}</li>)}</ul>
                <div className="out"><b>{d.phases.youGet}</b>{p.out}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec paper" id="deliverables">
        <div className="wrap">
          <SecHead label={d.deliverables.label} title={d.deliverables.title} text={d.deliverables.text} />
          <div className="cells c4 ap-docs">
            {d.deliverables.docs.map((doc: Doc) => (
              <article className="ap-doc" key={doc.h}>
                <div className="ap-doc-top"><span className="k">{doc.k}</span><span className="note">{doc.size} {d.deliverables.pages}</span></div>
                <h3 className="h4">{doc.h}</h3>
                <p>{doc.p}</p>
                <div className="ap-doc-toc">
                  <span className="note">{d.deliverables.contents}</span>
                  <ol>{doc.items.map((i) => <li key={i}>{i}</li>)}</ol>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="governance">
        <div className="wrap">
          <SecHead label={d.governance.label} title={d.governance.title} text={d.governance.text} />
          <ol className="steps">
            {d.governance.steps.map(([b, p]: string[]) => <li key={b}><b>{b}</b><p><Md text={p} /></p></li>)}
          </ol>
        </div>
      </section>

      <section className="sec paper" id="roles">
        <div className="wrap">
          <SecHead label={d.roles.label} title={d.roles.title} text={d.roles.text} />
          <div className="tbl-w"><table className="tbl ap-roles">
            <thead><tr>{d.roles.headers.map((x: string) => <th key={x}>{x}</th>)}</tr></thead>
            <tbody>{d.roles.rows.map((r: string[]) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
          </table></div>
          <div className="ap-sub">
            <h3 className="h3">{d.roles.raciTitle}</h3>
            <p className="dim"><Md text={d.roles.raciText} /></p>
          </div>
          <div className="ap-raci"><Matrix cols={d.roles.raciCols} rows={d.roles.raci} hl={5} /></div>
        </div>
      </section>

      <section className="sec" id="impact">
        <div className="wrap split" style={{ alignItems: "center" }}>
          <div className="gap">
            <span className="label">{d.impact.label}</span>
            <h2 className="serif" style={{ fontSize: "var(--s-2xl)", lineHeight: 1.05 }}><Split text={d.impact.title} /></h2>
            <p className="dim" style={{ maxWidth: "52ch" }}>{d.impact.text}</p>
            <ul className="ticks">{d.impact.items.map((i: string) => <li key={i}>{i}</li>)}</ul>
          </div>
          <div className="console" role="figure" aria-label={d.impact.consoleTitle}>
            <div className="ch"><span><i />{d.impact.consoleTitle}</span><span>{ui.example}</span></div>
            <div className="cb">
              <div className="tbl-w"><table className="tbl">
                <thead><tr>{d.impact.headers.map((x: string, i: number) => <th key={x} className={i ? "r" : undefined}>{x}</th>)}</tr></thead>
                <tbody>
                  {d.impact.rows.map((r: string[]) => (
                    <tr key={r[0]}><td>{r[0]}</td><td className="r">{r[1]}</td><td className="r">{r[2]}</td><td className="r"><span className={sev[r[4]]}>{r[3]}</span></td></tr>
                  ))}
                </tbody>
              </table></div>
              <div className="src">{d.impact.sources.map((s: string) => <span key={s}>{s}</span>)}</div>
              <div className="ans"><p>{d.impact.agent}</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec paper" id="change">
        <div className="wrap">
          <SecHead label={d.change.label} title={d.change.title} text={d.change.text} />
          <div className="cells c4">{d.change.cells.map((c: Cell) => <div key={c.h}><span className="k">{c.k}</span><h3 className="h4">{c.h}</h3><p>{c.p}</p></div>)}</div>
          <ul className="ticks ap-cols mt-m">{d.change.items.map((i: string) => <li key={i}>{i}</li>)}</ul>
        </div>
      </section>

      <section className="sec" id="scale">
        <div className="wrap">
          <SecHead label={d.scale.label} title={d.scale.title} text={d.scale.text} />
          <Matrix cols={d.scale.cols} rows={d.scale.rows} hl={2} />
          <p className="dim mt-m"><Md text={d.scale.note} /></p>
        </div>
      </section>

      <section className="sec paper" id="regions">
        <div className="wrap">
          <SecHead label={d.regions.label} title={d.regions.title} text={d.regions.text} />
          <div className="cells c3">
            {d.regions.cells.map((c: Region, i: number) => (
              <div key={c.k}>
                <span className="k">{c.k}</span>
                <h3 className="h4">{c.h}</h3>
                <TzStrip w={TZ[i]} legend={d.regions.legend} axis={d.regions.axis} />
                <span className="note">{c.ref}</span>
                <p><b className="ap-lead">{d.regions.onsite}.</b> {c.onsite}</p>
                <p><b className="ap-lead">{d.regions.remote}.</b> {c.remote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="risks">
        <div className="wrap">
          <SecHead label={d.risks.label} title={d.risks.title} text={d.risks.text} />
          <div className="qa">{d.risks.items.map(([q, a]: string[]) => <div key={q}><span className="qq">{q}</span><span className="aa"><Md text={a} /></span></div>)}</div>
        </div>
      </section>

      <section className="sec paper" id="needs">
        <div className="wrap">
          <div className="split">
            <div className="gap">
              <span className="label">{d.needs.label}</span>
              <h2 className="serif" style={{ fontSize: "var(--s-2xl)", lineHeight: 1.05 }}><Split text={d.needs.title} /></h2>
              <p className="dim" style={{ maxWidth: "52ch" }}>{d.needs.text}</p>
            </div>
            <ul className="ticks" style={{ alignSelf: "center" }}>{d.needs.items.map((i: string) => <li key={i}>{i}</li>)}</ul>
          </div>
          <div className="split ap-no">
            <div className="gap">
              <span className="label">{d.no.label}</span>
              <h2 className="serif" style={{ fontSize: "var(--s-2xl)", lineHeight: 1.05 }}><Split text={d.no.title} /></h2>
            </div>
            <ul className="ticks crosses" style={{ alignSelf: "center" }}>{d.no.items.map((i: string) => <li key={i}>{i}</li>)}</ul>
          </div>
        </div>
      </section>

      <FaqBlock id="faq" label={d.faq.label} title={d.faq.title} items={d.faq.items} />
      <Related label={d.related.label} title={d.related.title} items={d.related.items} more={d.related.more} />

      <Band title={d.band.title} text={d.band.text} seed={29}>
        <Link className="btn btn-p" href="/contact">{d.band.cta1} <Arrow /></Link>
        <Link className="btn btn-g" href="/pricing">{d.band.cta2}</Link>
      </Band>
      <PageMotion />
    </>
  );
}
