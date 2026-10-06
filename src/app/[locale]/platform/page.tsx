import "@/styles/platform.css";
import { setRequestLocale } from "next-intl/server";
import { PageMotion } from "@/components/PageMotion";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { content } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import type { Cell, Layer, ModelOption, Phase } from "@/lib/types";
import { SubHero, Band, SecHead, Arrow } from "@/components/Hero";
import { PageNav, FaqBlock, Related, Matrix, Statement, type RelatedItem } from "@/components/Blocks";
import { Md } from "@/components/Md";

type P = { params: Promise<{ locale: Locale }> };
export async function generateMetadata({ params }: P) { const { locale } = await params; return pageMetadata(locale, "platform", "/platform"); }

type Arch = {
  diagramLabel: string; cols: string[]; sources: string[]; connectors: string[]; modelCore: string; modelNodes: string[];
  agents: string[]; router: string; routerSub: string; interfaces: string[]; gov: string; govItems: string[];
};
type Group = { k: string; h: string; items: string[] };

/** Data-flow diagram: sources → connectors → organization model → agents → interfaces, governance underneath. */
function ArchDiagram({ a }: { a: Arch }) {
  const srcY = a.sources.map((_, i) => 60 + i * 54);
  const agY = a.agents.map((_, i) => 60 + i * 60);
  const ifY = a.interfaces.map((_, i) => 60 + i * 66);
  const cx = 600, cy = 216, r = 112;
  const nodes = a.modelNodes.map((label, i) => {
    const t = (i / a.modelNodes.length) * Math.PI * 2 - Math.PI / 2;
    return { label, x: cx + r * Math.cos(t), y: cy + r * Math.sin(t) };
  });
  const colX = [120, 355, 600, 865, 1095];
  const govStep = 1120 / a.govItems.length;
  return (
    <div className="diagram-w pf-w">
      <svg viewBox="0 0 1200 530" role="img" aria-label={a.diagramLabel} className="pf">
        {a.cols.map((c, i) => <text key={c} x={[20, 270, 480, 770, 1010][i]} y={34} className="pf-h">{c}</text>)}

        {/* flows */}
        {srcY.map((y) => <path key={`s${y}`} d={`M220 ${y + 21}H270`} className="pf-l pf-mv" />)}
        {[120, 216, 312].map((y) => <path key={`c${y}`} d={`M440 ${y}C462 ${y} 452 ${cy} ${cx - 140} ${cy}`} className="pf-l pf-mv" />)}
        {agY.map((y) => <path key={`a${y}`} d={`M${cx + 140} ${cy}C752 ${cy} 748 ${y + 24} 770 ${y + 24}`} className="pf-l pf-mv" />)}
        <path d={`M${cx + 140} ${cy}C752 ${cy} 748 341 770 341`} className="pf-l" />
        {agY.map((y) => <path key={`b${y}`} d={`M960 ${y + 24}H985`} className="pf-l" />)}
        <path d={`M985 ${agY[0] + 24}V${ifY[ifY.length - 1] + 23}`} className="pf-l" />
        {ifY.map((y) => <path key={`i${y}`} d={`M985 ${y + 23}H1010`} className="pf-l pf-mv" />)}

        {/* 01 sources */}
        {a.sources.map((s, i) => (
          <g key={s}><rect x={20} y={srcY[i]} width={200} height={42} className="pf-b" /><text x={34} y={srcY[i] + 26} className="pf-t">{s}</text></g>
        ))}

        {/* 02 connectors */}
        <rect x={270} y={60} width={170} height={312} className="pf-b" />
        {a.connectors.map((c, i) => (
          <g key={c}><rect x={286} y={76 + i * 58} width={138} height={34} rx={17} className="pf-pill" /><text x={355} y={98 + i * 58} textAnchor="middle" className="pf-s">{c}</text></g>
        ))}

        {/* 03 organization model */}
        <circle cx={cx} cy={cy} r={140} className="pf-ring" />
        {nodes.map((n, i) => {
          const m = nodes[(i + 1) % nodes.length];
          return <line key={`e${i}`} x1={n.x} y1={n.y} x2={m.x} y2={m.y} className="pf-e" />;
        })}
        {nodes.map((n, i) => <line key={`k${i}`} x1={cx} y1={cy} x2={n.x} y2={n.y} className="pf-e pf-e2" />)}
        <circle cx={cx} cy={cy} r={44} className="pf-core" />
        <text x={cx} y={cy + 4} textAnchor="middle" className="pf-ct">{a.modelCore}</text>
        {nodes.map((n) => {
          const right = n.x > cx + 5, left = n.x < cx - 5;
          const above = n.y < cy - r + 10;
          return (
            <g key={n.label}>
              <circle cx={n.x} cy={n.y} r={5} className="pf-n" />
              <text x={n.x + (right ? 10 : left ? -10 : 0)} y={above ? n.y - 11 : n.y + 4} textAnchor={right ? "start" : left ? "end" : "middle"} className="pf-nl">{n.label}</text>
            </g>
          );
        })}

        {/* 04 agents + router */}
        {a.agents.map((s, i) => (
          <g key={s}><rect x={770} y={agY[i]} width={190} height={48} className="pf-b pf-hl" /><circle cx={790} cy={agY[i] + 24} r={4} className="pf-dot" /><text x={804} y={agY[i] + 29} className="pf-t">{s}</text></g>
        ))}
        <path d="M865 288V310" className="pf-l pf-dash" />
        <rect x={770} y={310} width={190} height={62} className="pf-b pf-router" />
        <text x={865} y={337} textAnchor="middle" className="pf-t">{a.router}</text>
        <text x={865} y={357} textAnchor="middle" className="pf-s">{a.routerSub}</text>

        {/* 05 interfaces */}
        {a.interfaces.map((s, i) => (
          <g key={s}><rect x={1010} y={ifY[i]} width={170} height={46} className="pf-b" /><text x={1024} y={ifY[i] + 28} className="pf-t">{s}</text></g>
        ))}

        {/* governance */}
        {colX.map((x) => <path key={`g${x}`} d={`M${x} 384V420`} className="pf-l pf-dash" />)}
        <rect x={20} y={420} width={1160} height={92} className="pf-gov" />
        <text x={40} y={450} className="pf-h pf-gh">{a.gov}</text>
        {a.govItems.map((g, i) => (
          <g key={g}><rect x={40 + i * govStep} y={470} width={8} height={8} className="pf-dot" /><text x={56 + i * govStep} y={478} className="pf-s pf-gi">{g}</text></g>
        ))}
      </svg>
    </div>
  );
}

type Org = { graphLabel: string; nodes: string[][]; edges: string[] };

/** Organization model as an object graph; the highlighted path answers the example question. */
function OrgGraph({ o }: { o: Org }) {
  const W = 200, H = 58;
  const pos = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]].map(([c, r]) => ({ x: 120 + c * 270, y: 54 + r * 166 }));
  const hlNodes = new Set([1, 2, 4, 5, 7]);
  const edges: [number, number, number, boolean][] = [
    [0, 1, 0, false], [1, 2, 1, true], [2, 5, 2, true], [1, 3, 3, false], [1, 4, 4, true],
    [5, 8, 5, false], [4, 7, 6, true], [6, 7, 7, false], [7, 8, 8, false],
  ];
  const clip = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const dx = b.x - a.x, dy = b.y - a.y;
    const t = Math.min(dx ? (W / 2 + 6) / Math.abs(dx) : Infinity, dy ? (H / 2 + 6) / Math.abs(dy) : Infinity);
    return { x: a.x + dx * t, y: a.y + dy * t };
  };
  return (
    <div className="og-w">
      <svg viewBox="0 0 780 440" role="img" aria-label={o.graphLabel} className="og">
        {edges.map(([f, t, l, hl]) => {
          const a = clip(pos[f], pos[t]), b = clip(pos[t], pos[f]);
          return (
            <g key={`${f}-${t}`}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={`og-e${hl ? " hl" : ""}`} />
              <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 + 4} textAnchor="middle" className="og-el">{o.edges[l]}</text>
            </g>
          );
        })}
        {o.nodes.map(([h, s], i) => (
          <g key={h} className={`og-n${hlNodes.has(i) ? " hl" : ""}`}>
            <rect x={pos[i].x - W / 2} y={pos[i].y - H / 2} width={W} height={H} rx={3} />
            <text x={pos[i].x} y={pos[i].y - 3} textAnchor="middle" className="og-h">{h}</text>
            <text x={pos[i].x} y={pos[i].y + 15} textAnchor="middle" className="og-s">{s}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default async function Page({ params }: P) {
  const { locale } = await params;
  setRequestLocale(locale);
  const d = await content(locale, "platform");
  const ui = await content(locale, "ui");
  return (
    <>
      <SubHero
        crumbHome={ui.breadcrumbHome} crumb={d.crumb} title={d.title} lede={d.lede} seed={3}
        meta={d.hero.meta} locale={locale} path="/platform"
        actions={<>
          <Link className="btn btn-p" href="/contact">{d.hero.cta1} <Arrow /></Link>
          <a className="btn btn-g" href="#deploy">{d.hero.cta2}</a>
        </>}
      />
      <PageNav label={d.nav.label} items={d.nav.items} />
      <Statement k={d.statement.k} text={d.statement.text} />

      <section className="sec" id="architecture">
        <div className="wrap">
          <SecHead label={d.arch.label} title={d.arch.title} text={d.arch.text} />
          <ArchDiagram a={d.arch} />
          <div className="pf-sub">
            <h3 className="h3">{d.arch.stackTitle}</h3>
            <p className="dim">{d.arch.stackText}</p>
          </div>
          <div className="stack">
            {d.layers.map((l: Layer) => (
              <div key={l.tag} className={`layer${l.hl ? " hl" : ""}`} style={l.dashed ? { borderStyle: "dashed" } : undefined}>
                <span className="tag">{l.tag}</span>
                <div><h4>{l.h}</h4><p>{l.p}</p></div>
                <div className="chips">{l.chips.map((c: string) => <span className="chip" key={c}>{c}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec paper" id="model">
        <div className="wrap">
          <SecHead label={d.org.label} title={d.org.title} text={d.org.text} />
          <div className="og-grid">
            <div className="gap">
              <OrgGraph o={d.org} />
              <div className="og-q">
                <span className="mono">{d.org.queryK} · {ui.example}</span>
                <p className="serif">{d.org.query}</p>
                <p className="dim">{d.org.queryNote}</p>
              </div>
            </div>
            <dl className="og-pts">
              {d.org.points.map(([h, p]: string[]) => <div key={h}><dt>{h}</dt><dd>{p}</dd></div>)}
            </dl>
          </div>
        </div>
      </section>

      <section className="sec" id="modules">
        <div className="wrap">
          <SecHead label={d.modules.label} title={d.modules.title} text={d.modules.text} />
          <div className="cells c3">
            {d.modules.cells.map((c: Cell) => (
              <div key={c.h}>
                <span className="k">{c.k}</span><h3 className="h4">{c.h}</h3><p>{c.p}</p>
                {c.items ? <div className="pf-use"><span className="k">{d.modules.useK}</span><ul className="ticks">{c.items.map((i) => <li key={i}>{i}</li>)}</ul></div> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec paper" id="agents">
        <div className="wrap">
          <SecHead label={d.agents.label} title={d.agents.title} text={d.agents.text} />
          <div className="split">
            <div className="console">
              <div className="ch"><span><i />{d.agents.consoleTitle}</span><span>{d.agents.consoleNote}</span></div>
              <div className="cb pf-cfg">
                {d.agents.config.map(([k, v]: string[]) => <div key={k}><span className="brass">{k}:</span> {v}</div>)}
              </div>
            </div>
            <ul className="ticks" style={{ alignSelf: "center" }}>{d.agents.items.map((i: string) => <li key={i}>{i}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="sec" id="lifecycle">
        <div className="wrap">
          <SecHead label={d.lifecycle.label} title={d.lifecycle.title} text={d.lifecycle.text} />
          <div className="phases">
            {d.lifecycle.phases.map((p: Phase) => (
              <div className="phase" key={p.title}><span className="dur">{p.dur}</span><h3>{p.title}</h3><p>{p.text}</p><div className="out"><b>{d.lifecycle.outcome}</b>{p.out}</div></div>
            ))}
          </div>
          <div className="split mt-l">
            <div className="gap"><h3 className="h4">{d.lifecycle.guardTitle}</h3><ul className="ticks">{d.lifecycle.guards.map((i: string) => <li key={i}>{i}</li>)}</ul></div>
            <div className="gap"><h3 className="h4">{d.lifecycle.neverTitle}</h3><ul className="ticks crosses">{d.lifecycle.never.map((i: string) => <li key={i}>{i}</li>)}</ul></div>
          </div>
        </div>
      </section>

      <section className="sec paper" id="integrations">
        <div className="wrap">
          <SecHead label={d.integrations.label} title={d.integrations.title} text={d.integrations.text} />
          <div className="cells c4">
            {d.integrations.groups.map((g: Group) => (
              <div key={g.k}><span className="k">{g.k}</span><h3 className="h4">{g.h}</h3><div className="pf-chips">{g.items.map((i) => <span className="chip" key={i}>{i}</span>)}</div></div>
            ))}
          </div>
          <p className="dim mt-m pf-note"><Md text={d.integrations.note} /></p>
        </div>
      </section>

      <section className="sec" id="models">
        <div className="wrap">
          <SecHead label={d.models.label} title={d.models.title} text={d.models.text} />
          <div className="tiers">
            {d.models.options.map((o: ModelOption) => (
              <div key={o.k} className={`tier${o.hl ? " hl" : ""}`}>
                <span className="mono dim">{o.k}</span>
                <h3 className="h4">{o.h}</h3>
                <p className="dim">{o.p}</p>
                <ul className="ticks">{o.items.map((i: string) => <li key={i}>{i}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="split mt-l" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1.3fr)" }}>
            <div className="gap">
              <h3 className="h3">{d.models.routeTitle}</h3>
              <p className="dim">{d.models.routeText}</p>
              <ul className="ticks">{d.models.routeItems.map((i: string) => <li key={i}>{i}</li>)}</ul>
            </div>
            <div className="console" role="figure" aria-label={d.models.consoleTitle}>
              <div className="ch"><span><i />{d.models.consoleTitle}</span><span>{ui.example}</span></div>
              <div className="cb">
                <div className="tbl-w"><table className="tbl pf-route">
                  <thead><tr>{d.models.headers.map((x: string) => <th key={x}>{x}</th>)}</tr></thead>
                  <tbody>{d.models.rows.map((r: string[]) => (
                    <tr key={r[0]}><td>{r[0]}</td><td className="dim">{r[1]}</td><td><span className={`pf-rt${r[4] === "l" ? " loc" : ""}`}>{r[2]}</span></td><td className="dim">{r[3]}</td></tr>
                  ))}</tbody>
                </table></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec paper" id="deploy">
        <div className="wrap">
          <SecHead label={d.deploy.label} title={d.deploy.title} text={d.deploy.text} />
          <Matrix cols={d.deploy.cols} rows={d.deploy.rows} />
          <p className="note mt-s">{d.deploy.note}</p>
          <p className="dim mt-m pf-note"><Md text={d.deploy.residency} /></p>
        </div>
      </section>

      <section className="sec" id="reliability">
        <div className="wrap">
          <SecHead label={d.reliability.label} title={d.reliability.title} text={d.reliability.text} />
          <div className="cells c3">{d.reliability.cells.map((c: Cell) => <div key={c.k}><span className="k">{c.k}</span><h3 className="h4">{c.h}</h3><p>{c.p}</p></div>)}</div>
          <p className="pf-honest mt-m">{d.reliability.honest}</p>
        </div>
      </section>

      <section className="sec paper" id="packages">
        <div className="wrap">
          <SecHead label={d.packages.label} title={d.packages.title} text={d.packages.text} />
          <Matrix cols={d.packages.cols} rows={d.packages.rows} hl={2} />
          <p className="dim mt-m pf-note"><Md text={d.packages.note} /></p>
          <div className="mt-m"><Link className="btn btn-g" href="/pricing#compare">{d.packages.cta} <Arrow /></Link></div>
        </div>
      </section>

      <section className="sec" id="it">
        <div className="wrap">
          <SecHead label={d.it.label} title={d.it.title} text={d.it.text} />
          <div className="qa">{d.it.qa.map(([q, a]: string[]) => <div key={q}><span className="qq">{q}</span><span className="aa"><Md text={a} /></span></div>)}</div>
        </div>
      </section>

      <FaqBlock id="faq" paper label={d.faq.label} title={d.faq.title} text={d.faq.text} items={d.faq.items} />
      <Related label={d.related.label} title={d.related.title} items={d.related.items as RelatedItem[]} more={d.related.more} />

      <Band title={d.band.title} text={d.band.text} seed={23}>
        <Link className="btn btn-p" href="/contact">{d.band.cta1} <Arrow /></Link>
        <Link className="btn btn-g" href="/security">{d.band.cta2}</Link>
      </Band>
      <PageMotion />
    </>
  );
}
