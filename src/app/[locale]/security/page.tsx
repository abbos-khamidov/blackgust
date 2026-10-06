import "@/styles/security.css";
import { setRequestLocale } from "next-intl/server";
import { PageMotion } from "@/components/PageMotion";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { content } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import type { Cell } from "@/lib/types";
import { SubHero, Band, SecHead, Arrow } from "@/components/Hero";
import { PageNav, FaqBlock, Related, Matrix, Statement, type RelatedItem } from "@/components/Blocks";
import { Md } from "@/components/Md";

type P = { params: Promise<{ locale: Locale }> };
export async function generateMetadata({ params }: P) { const { locale } = await params; return pageMetadata(locale, "security", "/security"); }

type Mode = { id: "cloud" | "private" | "onprem" | "airgap"; k: string; h: string; p: string; leaves: string; mask: string; keys: string };
type Threat = { k: string; h: string; vec: string; mit: string[] };
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Trust-boundary diagram for one deployment mode. The dashed rectangle is the client's perimeter;
 * what crosses it (and whether it may) is the point of the picture. Labels come from messages.
 */
function FlowDiagram({ f, m }: { f: any; m: Mode }) {
  const cloud = m.id === "cloud";
  const air = m.id === "airgap";
  const perW = cloud ? 178 : 352;
  const keyX = cloud ? 204 : 28;
  const a = `sx-${m.id}-a`;
  const b = `sx-${m.id}-b`;
  const region: string[] = f.region.split(" · ");
  return (
    <svg className="sec-x-fl" viewBox="0 0 520 300" role="img" aria-label={f.aria.replace("{mode}", m.h)}>
      <defs>
        <marker id={a} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" className="sec-x-f-head" /></marker>
        <marker id={b} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" className="sec-x-f-heada" /></marker>
      </defs>

      {/* client perimeter (double line for an air-gapped enclave) */}
      <rect x="8" y="8" width={perW} height="284" className="sec-x-f-per" />
      {air ? <rect x="13" y="13" width={perW - 10} height="274" className="sec-x-f-air" /> : null}
      <text x="22" y="32" className={`sec-x-f-k${air ? " sec-x-f-sa" : ""}`}>{f.perimeter}</text>

      {/* BlackGust Cloud region, outside the client perimeter */}
      {cloud ? <>
        <rect x="192" y="8" width="176" height="284" className="sec-x-f-reg" />
        {region.map((l, i) => <text key={l} x="204" y={32 + i * 14} className="sec-x-f-k">{l}</text>)}
      </> : null}

      {/* nodes */}
      <rect x="24" y="52" width="150" height="40" className="sec-x-f-node" />
      <text x="99" y="76" className="sec-x-f-t" textAnchor="middle">{f.nodes.users}</text>
      <rect x="24" y="208" width="150" height="40" className="sec-x-f-node" />
      <text x="99" y="232" className="sec-x-f-t" textAnchor="middle">{f.nodes.systems}</text>
      <rect x="200" y="118" width="144" height="60" className="sec-x-f-node sec-x-f-hl" />
      <text x="272" y="152" className="sec-x-f-t" textAnchor="middle">{f.nodes.platform}</text>
      <rect x="200" y="208" width="144" height="40" className={`sec-x-f-node${cloud ? " sec-x-f-opt" : ""}`} />
      <text x="272" y="232" className="sec-x-f-t" textAnchor="middle">{f.nodes.local}</text>

      {/* inside flows: users and connectors into the platform, platform to local models */}
      <path d="M174 72 H182 V138 H198" className="sec-x-f-link" markerEnd={`url(#${a})`} />
      <path d="M174 228 H182 V158 H198" className="sec-x-f-link" markerEnd={`url(#${a})`} />
      <path d="M272 178 V206" className="sec-x-f-link" markerEnd={`url(#${a})`} />

      {/* frontier model API, always outside */}
      <g className={air ? "sec-x-f-off" : undefined}>
        <rect x="384" y="118" width="128" height="60" className={`sec-x-f-node${m.id === "cloud" ? "" : " sec-x-f-opt"}`} />
        <text x="448" y="152" className="sec-x-f-t" textAnchor="middle">{f.nodes.frontier}</text>
      </g>
      {air ? <>
        <path d="M344 148 H384" className="sec-x-f-blocked" />
        <path d="M357 141 371 155 M371 141 357 155" className="sec-x-f-x" />
        <text x="448" y="106" className="sec-x-f-warn" textAnchor="middle">{f.blocked}</text>
      </> : <>
        <path d="M344 148 H382" className={cloud ? "sec-x-f-flow" : "sec-x-f-flow sec-x-f-opt"} markerEnd={`url(#${b})`} />
        <text x="448" y="106" className="sec-x-f-s sec-x-f-sa" textAnchor="middle">{cloud ? f.masked : f.optional}</text>
      </>}

      {/* where the keys live */}
      <g transform={`translate(${keyX} 266)`}>
        <circle cx="7" cy="7" r="5" className="sec-x-f-key" />
        <path d="M12 7 H28 M23 7 V12 M28 7 V11" className="sec-x-f-key" />
        <text x="36" y="11" className="sec-x-f-k sec-x-f-sa">{f.keysLabel}</text>
      </g>
    </svg>
  );
}

export default async function Page({ params }: P) {
  const { locale } = await params;
  setRequestLocale(locale);
  const d = await content(locale, "security");
  const ui = await content(locale, "ui");
  const n = d.nav;
  // [section id, nav key]
  const navItems: [string, string][] = [
    ["data", "data"], ["flows", "flows"], ["controls", "matrix"], ["threats", "threats"], ["agents", "agents"], ["identity", "identity"],
    ["audit", "audit"], ["incident", "incident"], ["lifecycle", "lifecycle"], ["regulation", "regulation"], ["diligence", "diligence"], ["faq", "faq"],
  ].map(([id, k]) => [id, n[k]]);
  const f = d.flows;
  const recClass: Record<string, string> = { decision: "sec-x-hold", approved_by: "sec-x-ok" };

  return (
    <>
      <SubHero
        crumbHome={ui.breadcrumbHome} crumb={d.crumb} title={d.title} lede={d.lede} seed={17}
        meta={d.meta} locale={locale} path="/security"
        actions={<>
          <Link className="btn btn-p" href="/contact#request">{d.cta1} <Arrow /></Link>
          <Link className="btn btn-g" href="/contact">{d.cta2}</Link>
        </>}
      />
      <PageNav label={d.navLabel} items={navItems} />

      {/* 1 · data: the six first questions */}
      <section className="sec" id="data">
        <div className="wrap">
          <SecHead label={d.data.label} title={d.data.title} text={d.data.text} />
          <div className="qa sec-x-qa">{d.data.qa.map(([q, a]: string[]) => <div key={q}><h3 className="qq">{q}</h3><p className="aa">{a}</p></div>)}</div>
        </div>
      </section>

      {/* 2 · data flows per deployment mode */}
      <section className="sec paper sec-x-acc" id="flows">
        <div className="wrap">
          <SecHead label={f.label} title={f.title} text={f.text} />
          <div className="sec-x-modes">
            {f.modes.map((m: Mode) => (
              <article key={m.id} id={`mode-${m.id}`}>
                <div className="sec-x-mode-h"><span className="sec-x-code">{m.k}</span><h3 className="h4">{m.h}</h3></div>
                <p>{m.p}</p>
                <div className="diagram-w sec-x-fd"><FlowDiagram f={f} m={m} /></div>
                <dl className="sec-x-dl">
                  <div><dt>{f.leavesLabel}</dt><dd>{m.leaves}</dd></div>
                  <div><dt>{f.maskLabel}</dt><dd>{m.mask}</dd></div>
                  <div><dt>{f.keysLabel}</dt><dd>{m.keys}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3 · controls by deployment option */}
      <section className="sec" id="controls">
        <div className="gridlines" />
        <div className="wrap" style={{ position: "relative" }}>
          <SecHead label={d.matrix.label} title={d.matrix.title} text={d.matrix.text} />
          <Matrix cols={d.matrix.cols} rows={d.matrix.rows} caption={d.matrix.caption} />
        </div>
      </section>

      {/* 4 · threat model */}
      <section className="sec paper" id="threats">
        <div className="wrap">
          <SecHead label={d.threats.label} title={d.threats.title} text={d.threats.text} />
          <div className="sec-x-thr">
            <div className="sec-x-thr-h" aria-hidden="true"><span>{d.threats.label}</span><span>{d.threats.vecLabel}</span><span>{d.threats.mitLabel}</span></div>
            {d.threats.items.map((t: Threat) => (
              <article key={t.k}>
                <div><span className="sec-x-code">{t.k}</span><h3 className="h4">{t.h}</h3></div>
                <p><span className="sec-x-mini sec-x-m">{d.threats.vecLabel}</span>{t.vec}</p>
                <div><span className="sec-x-mini sec-x-m">{d.threats.mitLabel}</span><ul className="ticks">{t.mit.map((x) => <li key={x}>{x}</li>)}</ul></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Statement k={d.agents.label} text={d.agents.text} />

      {/* 5 · agents: limits + policy log */}
      <section className="sec" id="agents">
        <div className="wrap">
          <SecHead label={d.agents.label} title={d.agents.title} />
          <div className="sec-x-cc">
            <div><h3 className="h4">{d.agents.canTitle}</h3><ul className="ticks">{d.agents.can.map((i: string) => <li key={i}>{i}</li>)}</ul></div>
            <div><h3 className="h4">{d.agents.cannotTitle}</h3><ul className="ticks crosses">{d.agents.cannot.map((i: string) => <li key={i}>{i}</li>)}</ul></div>
          </div>
          <div className="console sec-x-con mt-l">
            <div className="ch"><span><i />{d.agents.logTitle}</span><span>{ui.example}</span></div>
            <div className="cb">
              <div className="tbl-w"><table className="tbl">
                <thead><tr>{d.agents.logHeaders.map((h: string) => <th key={h} scope="col">{h}</th>)}</tr></thead>
                <tbody>{d.agents.log.map(([t, ag, act, sev, dec]: string[]) => (
                  <tr key={t}><td>{t}</td><td>{ag}</td><td>{act}</td><td><span className={`sev ${sev}`}>{dec}</span></td></tr>
                ))}</tbody>
              </table></div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 · identity and access */}
      <section className="sec paper" id="identity">
        <div className="wrap">
          <SecHead label={d.identity.label} title={d.identity.title} text={d.identity.text} />
          <div className="cells c3">{d.identity.cells.map((c: Cell) => <div key={c.k}><span className="k">{c.k}</span><h3 className="h4">{c.h}</h3><p>{c.p}</p></div>)}</div>
        </div>
      </section>

      {/* 7 · audit and monitoring */}
      <section className="sec sec-x-acc" id="audit">
        <div className="wrap">
          <SecHead label={d.audit.label} title={d.audit.title} text={d.audit.text} />
          <div className="split">
            <div className="console sec-x-con">
              <div className="ch"><span><i />{d.audit.consoleTitle}</span><span>{ui.example}</span></div>
              <div className="cb">
                <dl className="sec-x-rec">
                  {d.audit.record.map(([k, v]: string[]) => <div key={k} className={recClass[k]}><dt>{k}</dt><dd>{v}</dd></div>)}
                </dl>
              </div>
            </div>
            <div>
              <ul className="ticks">{d.audit.items.map((x: string) => <li key={x}>{x}</li>)}</ul>
              <div className="sec-x-siem"><span className="sec-x-mini">{d.audit.siemTitle}</span><p>{d.audit.siem}</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* 8 · incident response */}
      <section className="sec paper sec-x-acc" id="incident">
        <div className="wrap">
          <SecHead label={d.incident.label} title={d.incident.title} text={d.incident.text} />
          <ol className="sec-x-inc">
            {d.incident.steps.map(([h, p]: string[], i: number) => (
              <li key={h}><span className="sec-x-code">{String(i + 1).padStart(2, "0")}</span><h3 className="h4">{h}</h3><p>{p}</p></li>
            ))}
          </ol>
          <div className="sec-x-sla">
            <h3 className="h3">{d.incident.slaTitle}</h3>
            <Matrix cols={d.incident.slaCols} rows={d.incident.sla} hl={2} />
            <p className="note mt-m"><Md text={d.incident.slaNote} /></p>
          </div>
        </div>
      </section>

      {/* 9 · data lifecycle */}
      <section className="sec sec-x-acc" id="lifecycle">
        <div className="gridlines" />
        <div className="wrap" style={{ position: "relative" }}>
          <SecHead label={d.lifecycle.label} title={d.lifecycle.title} text={d.lifecycle.text} />
          <ol className="sec-x-life">
            {d.lifecycle.stages.map((s: Cell) => (
              <li key={s.k}><span className="sec-x-life-n">{s.k}</span><div><h3 className="h4">{s.h}</h3><p>{s.p}</p></div></li>
            ))}
          </ol>
        </div>
      </section>

      {/* 10 · regulatory alignment */}
      <section className="sec paper" id="regulation">
        <div className="wrap">
          <SecHead label={d.regulation.label} title={d.regulation.title} text={d.regulation.text} />
          <Matrix cols={d.regulation.cols} rows={d.regulation.rows} caption={d.regulation.caption} />
        </div>
      </section>

      {/* 11 · due diligence */}
      <section className="sec sec-x-acc" id="diligence">
        <div className="wrap">
          <SecHead label={d.diligence.label} title={d.diligence.title} text={d.diligence.text} />
          <div className="cells c3">{d.diligence.items.map((c: Cell) => <div key={c.k}><span className="k">{c.k}</span><h3 className="h4">{c.h}</h3><p>{c.p}</p></div>)}</div>
          <div className="sec-x-honest">
            <p>{d.diligence.honest}</p>
            <Link className="btn btn-p" href="/contact#request">{d.diligence.cta} <Arrow /></Link>
          </div>
        </div>
      </section>

      <FaqBlock id="faq" label={d.faq.label} title={d.faq.title} items={d.faq.items} paper />

      <Related label={d.related.label} title={d.related.title} items={d.related.items as RelatedItem[]} more={d.related.more} />

      <Band title={d.band.title} text={d.band.text} seed={29}>
        <Link className="btn btn-p" href="/contact#request">{d.band.cta1} <Arrow /></Link>
        <Link className="btn btn-g" href="/government">{d.band.cta2}</Link>
      </Band>
      <PageMotion />
    </>
  );
}
