import "@/styles/government.css";
import { setRequestLocale } from "next-intl/server";
import { PageMotion } from "@/components/PageMotion";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { content } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import type { Cell, Phase } from "@/lib/types";
import { SubHero, Band, SecHead, Arrow } from "@/components/Hero";
import { PageNav, FaqBlock, Related, Matrix, Statement, type RelatedItem } from "@/components/Blocks";
import { Counter } from "@/components/Counter";
import { Md } from "@/components/Md";

type P = { params: Promise<{ locale: Locale }> };
export async function generateMetadata({ params }: P) { const { locale } = await params; return pageMetadata(locale, "government", "/government"); }

type Jur = { k: string; h: string; laws: string[]; need: string; how: string };
type LifeStep = { who: "ai" | "human" | "both"; t: string; h: string; p: string };
type Risk = { k: string; h: string; shows: string; do: string[]; owner: string };
type Path = { k: string; h: string; fit: string; steps: string[] };
type DocGroup = { h: string; items: string[] };
/* eslint-disable @typescript-eslint/no-explicit-any */

/** Sovereign deployment: an air-gapped enclave inside the agency network. Labels come from messages. */
function SovereignDiagram({ a }: { a: any }) {
  const sysY = [170, 242, 314, 386, 458];
  return (
    <svg className="gov-arch" viewBox="0 0 1000 600" role="img" aria-label={a.aria}>
      <defs>
        <marker id="gov-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 10 5 0 10z" className="gov-a-head" />
        </marker>
      </defs>
      {/* internet, outside */}
      <rect x="700" y="12" width="270" height="48" className="gov-a-ext" />
      <text x="835" y="41" className="gov-a-t gov-a-mute" textAnchor="middle">{a.internet}</text>
      {/* agency network */}
      <rect x="20" y="90" width="960" height="494" className="gov-a-zone" />
      <text x="36" y="114" className="gov-a-k">{a.agency}</text>
      {/* enclave */}
      <rect x="280" y="132" width="420" height="430" className="gov-a-enclave" />
      <text x="296" y="156" className="gov-a-k gov-a-brass">{a.enclave}</text>
      {/* blocked egress */}
      <path d="M600 172 V36 H700" className="gov-a-blocked" />
      <g transform="translate(600 111)" className="gov-a-x"><path d="M-9 -9 9 9 M9 -9 -9 9" /></g>
      <text x="614" y="104" className="gov-a-t gov-a-warn">{a.noEgress}</text>
      {/* agency systems + connectors */}
      {a.systems.map((s: string, i: number) => (
        <g key={s}>
          <rect x="40" y={sysY[i]} width="200" height="50" className="gov-a-node" />
          <text x="140" y={sysY[i] + 30} className="gov-a-t" textAnchor="middle">{s}</text>
          <path d={`M240 ${sysY[i] + 25} H280`} className="gov-a-link" />
          <circle cx="280" cy={sysY[i] + 25} r="4" className="gov-a-dot" />
        </g>
      ))}
      {/* enclave contents */}
      <rect x="300" y="172" width="380" height="50" className="gov-a-node gov-a-hl" />
      <text x="490" y="202" className="gov-a-t" textAnchor="middle">{a.gateway}</text>
      {[[300, 252, a.agents], [495, 252, a.index], [300, 332, a.models], [495, 332, a.audit], [300, 412, a.updates], [495, 412, a.keys]].map(([x, y, t]) => (
        <g key={String(t)}>
          <rect x={Number(x)} y={Number(y)} width="185" height="50" className="gov-a-node" />
          <text x={Number(x) + 92.5} y={Number(y) + 30} className="gov-a-t" textAnchor="middle">{String(t)}</text>
        </g>
      ))}
      <path d="M392 222 V252 M587 222 V252 M392 302 V332 M485 277 H495" className="gov-a-link" />
      {/* audit export, one way */}
      <rect x="740" y="332" width="220" height="50" className="gov-a-node" />
      <text x="850" y="362" className="gov-a-t" textAnchor="middle">{a.siem}</text>
      <rect x="740" y="452" width="220" height="50" className="gov-a-node" />
      <text x="850" y="482" className="gov-a-t" textAnchor="middle">{a.auditors}</text>
      <path d="M680 357 H736" className="gov-a-flow" markerEnd="url(#gov-ah)" />
      <path d="M850 382 V448" className="gov-a-flow" markerEnd="url(#gov-ah)" />
      <text x="708" y="322" className="gov-a-s" textAnchor="middle">{a.export}</text>
      <text x="490" y="530" className="gov-a-s" textAnchor="middle">{a.enclave}</text>
    </svg>
  );
}

export default async function Page({ params }: P) {
  const { locale } = await params;
  setRequestLocale(locale);
  const d = await content(locale, "government");
  const ui = await content(locale, "ui");
  const n = d.nav;
  const navItems: [string, string][] = ["principles", "jurisdictions", "architecture", "lifecycle", "cases", "oversight", "risks", "procurement", "sovereign", "faq"].map((k) => [k, n[k]]);
  const whoLabel: Record<string, string> = { ai: d.life.ai, human: d.life.human, both: d.life.both };

  return (
    <>
      <SubHero
        crumbHome={ui.breadcrumbHome} crumb={d.crumb} title={d.title} lede={d.lede} seed={13}
        meta={d.meta} locale={locale} path="/government"
        actions={<>
          <Link className="btn btn-p" href="/contact">{d.cta1} <Arrow /></Link>
          <Link className="btn btn-g" href="/security">{d.cta2}</Link>
        </>}
      />
      <PageNav label={d.navLabel} items={navItems} />

      <section className="sec" id="principles">
        <div className="wrap">
          <SecHead label={d.principles.label} title={d.principles.title} text={d.principles.text} />
          <div className="cells c4">{d.principles.cells.map((c: Cell) => <div key={c.h}><span className="k">{c.k}</span><h3 className="h4">{c.h}</h3><p>{c.p}</p></div>)}</div>
        </div>
      </section>

      <Statement k={d.statement.k} text={d.statement.text} />

      <section className="sec paper" id="jurisdictions">
        <div className="wrap">
          <SecHead label={d.jur.label} title={d.jur.title} text={d.jur.text} />
          <div className="gov-jur">
            {d.jur.items.map((j: Jur) => (
              <article key={j.k}>
                <header><span className="gov-code">{j.k}</span><h3 className="h4">{j.h}</h3></header>
                <ul className="gov-laws" aria-label={d.jur.lawsLabel}>{j.laws.map((l) => <li key={l} className="chip">{l}</li>)}</ul>
                <div><span className="gov-mini">{d.jur.needLabel}</span><p>{j.need}</p></div>
                <div className="gov-how"><span className="gov-mini">{d.jur.howLabel}</span><p>{j.how}</p></div>
              </article>
            ))}
          </div>
          <p className="note mt-m">{d.jur.note}</p>
        </div>
      </section>

      <section className="sec" id="architecture">
        <div className="gridlines" />
        <div className="wrap" style={{ position: "relative" }}>
          <SecHead label={d.arch.label} title={d.arch.title} text={d.arch.text} />
          <div className="diagram-w gov-dw"><SovereignDiagram a={d.arch} /></div>
          <div className="cells c3 mt-l">{d.arch.points.map(([h, p]: string[]) => <div key={h}><h3 className="h4">{h}</h3><p>{p}</p></div>)}</div>
        </div>
      </section>

      <section className="sec paper" id="lifecycle">
        <div className="wrap">
          <SecHead label={d.life.label} title={d.life.title} text={d.life.text} />
          <p className="note gov-ex">{ui.example}</p>
          <ol className="gov-life">
            {d.life.steps.map((s: LifeStep, i: number) => (
              <li key={s.h} className={`gov-w-${s.who}`}>
                <div className="gov-life-top"><span className="gov-n">{String(i + 1).padStart(2, "0")}</span><span className="gov-who">{whoLabel[s.who]}</span></div>
                <h3 className="h4">{s.h}</h3>
                <p>{s.p}</p>
                <span className="gov-t">{s.t}</span>
              </li>
            ))}
          </ol>
          <div className="split mt-l">
            <h3 className="h3">{d.life.measuresTitle}</h3>
            <div className="qa">{d.life.measures.map(([q, a]: string[]) => <div key={q}><span className="qq">{q}</span><span className="aa">{a}</span></div>)}</div>
          </div>
        </div>
      </section>

      <section className="sec" id="cases">
        <div className="wrap">
          <SecHead label={d.cases.label} title={d.cases.title} text={d.cases.text} />
          <div className="rows">{d.cases.rows.map((r: string[]) => <div key={r[0]}><h3 className="t">{r[0]}</h3><p>{r[1]}</p><span className="x">{r[2]}</span></div>)}</div>
        </div>
      </section>

      <section className="sec paper">
        <div className="wrap">
          <SecHead label={d.languages.label} title={d.languages.title} text={d.languages.text} />
          <div className="facts">{d.languages.facts.map(([v, t]: string[]) => <div key={t}><Counter value={v} /><span>{t}</span></div>)}</div>
        </div>
      </section>

      <section className="sec" id="oversight">
        <div className="wrap">
          <SecHead label={d.oversight.label} title={d.oversight.title} text={d.oversight.text} />
          <Matrix cols={d.oversight.cols} rows={d.oversight.rows} hl={2} caption={d.oversight.caption} />
        </div>
      </section>

      <section className="sec paper" id="risks">
        <div className="wrap">
          <SecHead label={d.risks.label} title={d.risks.title} text={d.risks.text} />
          <div className="gov-risk">
            <div className="gov-risk-h" aria-hidden="true"><span>{d.risks.colRisk}</span><span>{d.risks.colShows}</span><span>{d.risks.colDo}</span><span>{d.risks.colOwner}</span></div>
            {d.risks.items.map((r: Risk) => (
              <article key={r.k}>
                <div><span className="gov-code">{r.k}</span><h3 className="h4">{r.h}</h3></div>
                <p><span className="gov-mini gov-m">{d.risks.colShows}</span>{r.shows}</p>
                <div><span className="gov-mini gov-m">{d.risks.colDo}</span><ul className="ticks">{r.do.map((x) => <li key={x}>{x}</li>)}</ul></div>
                <p className="gov-owner"><span className="gov-mini gov-m">{d.risks.colOwner}</span>{r.owner}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="procurement">
        <div className="wrap">
          <SecHead label={d.procurement.label} title={d.procurement.title} text={d.procurement.text} />
          <div className="cells c3">
            {d.procurement.paths.map((p: Path) => (
              <div key={p.k}>
                <span className="k">{p.k}</span>
                <h3 className="h3">{p.h}</h3>
                <p><b className="gov-fit">{d.procurement.fitLabel}:</b> {p.fit}</p>
                <span className="gov-mini">{d.procurement.stepsLabel}</span>
                <ol className="gov-ol">{p.steps.map((s) => <li key={s}>{s}</li>)}</ol>
              </div>
            ))}
          </div>
          <div className="gov-docs mt-l">
            <div className="gap"><h3 className="h3">{d.procurement.docsTitle}</h3><p className="dim">{d.procurement.docsText}</p></div>
            <div className="gov-docs-g">
              {d.procurement.docs.map((g: DocGroup, i: number) => (
                <div key={g.h}><span className="gov-mini">{String(i + 1).padStart(2, "0")} · {g.h}</span><ul className="ticks">{g.items.map((x) => <li key={x}>{x}</li>)}</ul></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sec paper" id="sovereign">
        <div className="wrap">
          <SecHead label={d.sovereign.label} title={d.sovereign.title} text={<Md text={d.sovereign.text} />} />
          <div className="phases">
            {d.sovereign.phases.map((p: Phase) => (
              <div className="phase" key={p.title}><span className="dur">{p.dur}</span><h3>{p.title}</h3><p>{p.text}</p><div className="out"><b>{d.sovereign.outcome}</b>{p.out}</div></div>
            ))}
          </div>
          <div className="split mt-l">
            <div className="gap">
              <h3 className="h3">{d.sovereign.incTitle}</h3>
              <Link className="btn btn-g" href="/pricing#packages" style={{ justifySelf: "start" }}>{d.sovereign.cta} <Arrow /></Link>
            </div>
            <ul className="ticks">{d.sovereign.inc.map((x: string) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
      </section>

      <FaqBlock id="faq" label={d.faq.label} title={d.faq.title} items={d.faq.items} />

      <Related label={d.related.label} title={d.related.title} items={d.related.items as RelatedItem[]} more={d.related.more} />

      <Band title={d.band.title} text={d.band.text} seed={37}>
        <Link className="btn btn-p" href="/contact">{d.band.cta1} <Arrow /></Link>
        <Link className="btn btn-g" href="/security">{d.band.cta2}</Link>
      </Band>
      <PageMotion />
    </>
  );
}
