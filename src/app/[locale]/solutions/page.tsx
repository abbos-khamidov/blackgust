import "@/styles/solutions.css";
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
export async function generateMetadata({ params }: P) { const { locale } = await params; return pageMetadata(locale, "solutions", "/solutions"); }

type UseCase = { h: string; p: string; s?: string[]; m?: string };
type Group = { f: string; m?: string; cases: UseCase[] };
type Industry = Cell & { does?: string; changes?: string };
type Person = { k: string; h: string; items: string[][] };
type Flow = { aria: string; heads: string[]; modules: string[]; links: number[][]; pk: string[][]; legend: string[] };

const pad = (i: number) => String(i + 1).padStart(2, "0");

/** Use case → module → package map. Functions on the left, modules in the middle, packages on the right. Labels from messages. */
function ModuleMap({ functions, packages, f }: { functions: string[]; packages: string[]; f: Flow }) {
  const W = 1000, NW = 230, NH = 36, top = 56, bottom = 470;
  const span = bottom - top - NH;
  const ys = (n: number) => Array.from({ length: n }, (_, i) => top + (n > 1 ? (span * i) / (n - 1) : span / 2));
  const fy = ys(functions.length), my = ys(f.modules.length), py = ys(packages.length);
  const xM = (W - NW) / 2, xP = W - NW;
  const curve = (x1: number, y1: number, x2: number, y2: number) => {
    const c = (x2 - x1) / 2;
    return `M${x1} ${y1} C${x1 + c} ${y1} ${x2 - c} ${y2} ${x2} ${y2}`;
  };
  const node = (x: number, y: number, label: string, cls: string, key: string) => (
    <g key={key}>
      <rect x={x} y={y} width={NW} height={NH} className={cls} />
      <text x={x + NW / 2} y={y + NH / 2 + 5} className="sol-m-t" textAnchor="middle">{label}</text>
    </g>
  );
  return (
    <svg className="sol-map" viewBox={`0 0 ${W} ${bottom + 10}`} role="img" aria-label={f.aria}>
      {[0, xM, xP].map((x, i) => <text key={x} x={x + NW / 2} y={28} className="sol-m-k" textAnchor="middle">{f.heads[i]}</text>)}
      {functions.map((_, i) => (f.links[i] ?? []).map((m) => (
        <path key={`f${i}m${m}`} d={curve(NW, fy[i] + NH / 2, xM, (my[m] ?? 0) + NH / 2)} className="sol-m-l" />
      )))}
      {f.modules.map((_, m) => (f.pk[m] ?? []).map((v, p) => v === "-" ? null : (
        <path key={`m${m}p${p}`} d={curve(xM + NW, my[m] + NH / 2, xP, py[p] + NH / 2)} className={v === "~" ? "sol-m-l sol-m-opt" : "sol-m-l sol-m-in"} />
      )))}
      {functions.map((t, i) => node(0, fy[i], t, "sol-m-n", `fn${i}`))}
      {f.modules.map((t, i) => node(xM, my[i], t, "sol-m-n sol-m-mod", `md${i}`))}
      {packages.map((t, i) => node(xP, py[i], t, i === 1 ? "sol-m-n sol-m-hl" : "sol-m-n", `pk${i}`))}
    </svg>
  );
}

export default async function Page({ params }: P) {
  const { locale } = await params;
  setRequestLocale(locale);
  const d = await content(locale, "solutions");
  const ui = await content(locale, "ui");
  const groups: Group[] = d.library?.groups ?? [];
  const nav: [string, string][] = d.nav ?? [];
  const flow: Flow | undefined = d.mapping?.flow;

  return (
    <>
      <SubHero
        crumbHome={ui.breadcrumbHome} crumb={d.crumb} title={d.title} lede={d.lede} seed={11}
        meta={d.meta} locale={locale} path="/solutions"
        actions={<>
          <Link className="btn btn-p" href="/contact">{d.cta1} <Arrow /></Link>
          <Link className="btn btn-g" href="/platform">{d.cta2}</Link>
        </>}
      />
      <PageNav label={d.navLabel} items={nav} />

      <section className="sec" id="functions">
        <div className="wrap">
          <SecHead label={d.functions.label} title={d.functions.title} text={<Md text={d.functions.text} />} />
          <div className="rows sol-fn">
            {d.functions.rows.map((r: string[]) => <div key={r[0]}><h3 className="t">{r[0]}</h3><p>{r[1]}</p><span className="x">{r[2]}</span></div>)}
          </div>
        </div>
      </section>

      <Statement k={d.statement.k} text={d.statement.text} />

      <section className="sec paper" id="anatomy">
        <div className="wrap">
          <SecHead label={d.anatomy.label} title={d.anatomy.title} text={d.anatomy.text} />
          <figure className="sol-flow-f" aria-label={d.anatomy.aria}>
            <ol className="sol-flow">
              {d.anatomy.nodes.map(([h, p]: string[], i: number) => (
                <li key={h} className={i === 3 ? "sol-hl" : undefined}>
                  <span className="sol-n">{pad(i)}</span>
                  <h3 className="h4">{h}</h3>
                  <p>{p}</p>
                </li>
              ))}
            </ol>
            <figcaption className="sol-loop"><span>↺ {d.anatomy.loop}</span></figcaption>
          </figure>
          <ul className="ticks sol-cols mt-l">{d.anatomy.items.map((x: string) => <li key={x}>{x}</li>)}</ul>
        </div>
      </section>

      <section className="sec" id="library">
        <div className="wrap">
          <SecHead label={d.library.label} title={d.library.title} text={<Md text={d.library.text} />} />
          <div className="sol-lib">
            {groups.map((g, gi) => (
              <div className="sol-lg" key={g.f} id={`lib-${gi + 1}`}>
                <header>
                  <span className="sol-n">{pad(gi)}</span>
                  <h3 className="h3">{g.f}</h3>
                  {g.m ? <p className="sol-gm"><span className="sol-mini">{d.library.metric}</span>{g.m}</p> : null}
                </header>
                <div className="sol-cases">
                  {g.cases.map((c) => (
                    <article key={c.h}>
                      <h4>{c.h}</h4>
                      <p>{c.p}</p>
                      {c.s?.length ? (
                        <div className="sol-sys"><span className="sol-mini">{d.library.systems}</span><ul>{c.s.map((s) => <li key={s} className="chip">{s}</li>)}</ul></div>
                      ) : null}
                      {c.m ? <p className="sol-cm"><span className="sol-mini">{d.library.metric}</span>{c.m}</p> : null}
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec paper" id="industries">
        <div className="wrap">
          <SecHead label={d.industries.label} title={d.industries.title} text={d.industries.text} />
          <div className="cells c3 sol-ind">
            {d.industries.cells.map((c: Industry) => (
              <div key={c.k}>
                <span className="k">{c.k}</span>
                <h3 className="h4">{c.h}</h3>
                {c.items?.length ? <div><span className="sol-mini">{d.industries.problems}</span><ul className="ticks">{c.items.map((i) => <li key={i}>{i}</li>)}</ul></div> : null}
                {c.does ? <div><span className="sol-mini">{d.industries.does}</span><p>{c.does}</p></div> : null}
                {c.changes ? <div className="sol-chg"><span className="sol-mini">{d.industries.changes}</span><p>{c.changes}</p></div> : null}
                {c.href ? <Link className="more" href={c.href}>{d.industries.more} →</Link> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {d.day ? (
        <section className="sec" id="day">
          <div className="gridlines" />
          <div className="wrap" style={{ position: "relative" }}>
            <SecHead label={d.day.label} title={d.day.title} text={d.day.text} />
            <div className="sol-day">
              {(d.day.people as Person[]).map((p) => (
                <div className="console" key={p.k}>
                  <div className="ch"><span><i />{p.k}</span><span>{ui.example}</span></div>
                  <div className="cb">
                    <h3 className="sol-role">{p.h}</h3>
                    <ol className="sol-tl">
                      {p.items.map(([t, x]) => <li key={t}><time>{t}</time><p>{x}</p></li>)}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {d.mapping ? (
        <section className="sec paper" id="mapping">
          <div className="wrap">
            <SecHead label={d.mapping.label} title={d.mapping.title} text={d.mapping.text} />
            {flow ? (
              <>
                <div className="sol-mapw"><ModuleMap functions={groups.map((g) => g.f)} packages={d.mapping.cols.slice(2)} f={flow} /></div>
                <ul className="sol-legend">
                  <li><i className="sol-lg-in" />{flow.legend[0]}</li>
                  <li><i className="sol-lg-opt" />{flow.legend[1]}</li>
                </ul>
              </>
            ) : null}
            <div className="mt-l"><Matrix cols={d.mapping.cols} rows={d.mapping.rows} hl={3} /></div>
            <p className="note mt-m sol-note"><Md text={d.mapping.note} /></p>
          </div>
        </section>
      ) : null}

      <section className="sec" id="pilot">
        <div className="wrap">
          <SecHead label={d.pilot.label} title={d.pilot.title} text={d.pilot.text} />
          <div className="cells c3">{d.pilot.cells.map((c: Cell, i: number) => <div key={c.h}><span className="k">{pad(i)} · {c.k}</span><h3 className="h4">{c.h}</h3><p>{c.p}</p></div>)}</div>
        </div>
      </section>

      {d.regions ? (
        <section className="sec paper" id="regions">
          <div className="wrap">
            <SecHead label={d.regions.label} title={d.regions.title} text={d.regions.text} />
            <Matrix cols={d.regions.cols} rows={d.regions.rows} />
            <p className="note mt-m sol-note"><Md text={d.regions.note} /></p>
          </div>
        </section>
      ) : null}

      {d.faq ? <FaqBlock id="faq" label={d.faq.label} title={d.faq.title} items={d.faq.items} /> : null}
      {d.related ? <Related label={d.related.label} title={d.related.title} items={d.related.items as RelatedItem[]} more={d.related.more} /> : null}

      <Band title={d.band.title} text={d.band.text} seed={31}>
        <Link className="btn btn-p" href="/contact">{d.band.cta1} <Arrow /></Link>
        <Link className="btn btn-g" href="/pricing">{d.band.cta2}</Link>
      </Band>
      <PageMotion />
    </>
  );
}
