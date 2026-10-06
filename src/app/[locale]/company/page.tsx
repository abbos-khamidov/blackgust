import "@/styles/company.css";
import { setRequestLocale } from "next-intl/server";
import { PageMotion } from "@/components/PageMotion";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { content } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import type { Cell } from "@/lib/types";
import { parentCompany } from "@/config/site";
import { SubHero, SecHead, Band, Arrow } from "@/components/Hero";
import { PageNav, FaqBlock, Related, Matrix, Statement, type RelatedItem } from "@/components/Blocks";
import { Split } from "@/components/Split";
import { Md } from "@/components/Md";
import { Counter } from "@/components/Counter";

type P = { params: Promise<{ locale: Locale }> };
export async function generateMetadata({ params }: P) { const { locale } = await params; return pageMetadata(locale, "company", "/company"); }

type Diagram = {
  aria: string; sourcesTitle: string; sources: string[]; modelTitle: string; model: string[];
  agentsTitle: string; agents: string[]; peopleTitle: string; people: string[]; gov: string;
};

/** "Operating brain": systems → organization model → agents → people, with governance underneath. */
function BrainDiagram({ d }: { d: Diagram }) {
  const srcY = (i: number) => 52 + i * 56;
  const agY = (i: number) => 128 + i * 70;
  return (
    <svg className="co-brain" viewBox="0 0 1000 450" role="img" aria-label={d.aria}>
      <g className="co-ttl">
        <text x="20" y="28">{d.sourcesTitle}</text>
        <text x="300" y="28">{d.modelTitle}</text>
        <text x="610" y="28">{d.agentsTitle}</text>
        <text x="830" y="28">{d.peopleTitle}</text>
      </g>
      <g className="co-edge">
        {d.sources.map((_, i) => <path key={i} d={`M200 ${srcY(i) + 20} C250 ${srcY(i) + 20} 250 220 300 220`} />)}
        {d.agents.map((_, i) => <path key={i} d={`M520 220 C565 220 565 ${agY(i) + 24} 610 ${agY(i) + 24}`} />)}
        {d.agents.map((_, i) => <path key={i} className="co-hot" d={`M770 ${agY(i) + 24} C800 ${agY(i) + 24} 800 220 830 220`} />)}
      </g>
      {d.sources.map((s, i) => (
        <g key={s} className="co-box"><rect x="20" y={srcY(i)} width="180" height="40" /><text x="36" y={srcY(i) + 25}>{s}</text></g>
      ))}
      <g className="co-core">
        <rect x="300" y="100" width="220" height="240" />
        {d.model.map((m, i) => (
          <g key={m}><rect className="co-chip" x="322" y={124 + i * 52} width="176" height="38" /><text x="410" y={148 + i * 52} textAnchor="middle">{m}</text></g>
        ))}
      </g>
      {d.agents.map((a, i) => (
        <g key={a} className="co-box co-agent"><rect x="610" y={agY(i)} width="160" height="48" /><circle cx="630" cy={agY(i) + 24} r="4" /><text x="646" y={agY(i) + 29}>{a}</text></g>
      ))}
      <g className="co-box co-people">
        <rect x="830" y="120" width="150" height="200" />
        {d.people.map((p, i) => <text key={p} x="905" y={180 + i * 40} textAnchor="middle">{p}</text>)}
      </g>
      <g className="co-gov"><rect x="20" y="392" width="960" height="40" /><text x="500" y="417" textAnchor="middle">{d.gov}</text></g>
    </svg>
  );
}

type Rung = { lv: string; h: string; p: string; size: number };
type TItem = { when: string; h: string; p: string };

export default async function Page({ params }: P) {
  const { locale } = await params;
  setRequestLocale(locale);
  const d = await content(locale, "company");
  const ui = await content(locale, "ui");
  const r = d.regions;
  return (
    <>
      <SubHero crumbHome={ui.breadcrumbHome} crumb={d.crumb} title={d.title} lede={d.lede} seed={47} meta={d.heroMeta} locale={locale} path="/company"
        actions={<><Link className="btn btn-p" href="/contact">{d.heroCta1} <Arrow /></Link><a className="btn btn-g" href="#careers">{d.heroCta2}</a></>} />
      <PageNav label={d.onPage} items={d.nav} />

      <section className="sec" id="mission">
        <div className="gridlines" />
        <div className="wrap" style={{ position: "relative" }}>
          <div className="split">
            <div className="gap"><span className="label">{d.why.label}</span><h2 className="serif co-h2"><Split text={d.why.title} /></h2></div>
            <div className="prose dim" style={{ alignSelf: "center" }}>{d.why.paras.map((p: string) => <p key={p}>{p}</p>)}</div>
          </div>
          <div className="mt-l">
            <SecHead label={d.brain.label} title={d.brain.title} text={d.brain.text} />
            <div className="diagram-w co-dw"><BrainDiagram d={d.brain.diagram} /></div>
            <div className="cells c4 mt-m">{d.brain.points.map(([k, p]: string[]) => <div key={k}><span className="k">{k}</span><p>{p}</p></div>)}</div>
            <div className="mt-m"><Link className="btn btn-g" href="/platform">{d.brain.more} <Arrow /></Link></div>
          </div>
          <div className="mt-l">
            <span className="label">{d.factsLabel}</span>
            <div className="facts mt-m">{d.facts.map(([n, t]: string[]) => <div key={t}><Counter value={n} /><span>{t}</span></div>)}</div>
          </div>
        </div>
      </section>

      <section className="sec paper" id="principles">
        <div className="wrap">
          <SecHead label={d.principles.label} title={d.principles.title} text={d.principles.text} />
          <div className="cells c3">{d.principles.cells.map((c: Cell) => <div key={c.h}><span className="k">{c.k}</span><h3 className="h4">{c.h}</h3><p>{c.p}</p></div>)}</div>
        </div>
      </section>

      <section className="sec" id="regions">
        <div className="wrap">
          <SecHead label={r.label} title={r.title} text={r.text} />
          <div className="cells c4 co-regions">
            <div className="co-hq"><span className="k">{r.hq.k}</span><h3 className="h4">{r.hq.h}</h3><p>{r.hq.p}</p></div>
            {r.cells.map((c: Cell) => <div key={c.h}><span className="k">{c.k}</span><h3 className="h4">{c.h}</h3><p>{c.p}</p></div>)}
          </div>
          <h3 className="h3 mt-l">{r.splitTitle}</h3>
          <div className="mt-m"><Matrix cols={r.cols} rows={r.rows} caption={r.note} /></div>
        </div>
      </section>

      <section className="sec paper" id="timeline">
        <div className="wrap">
          <SecHead label={d.timeline.label} title={d.timeline.title} text={d.timeline.text} />
          <ol className="co-tl">
            {d.timeline.items.map((t: TItem) => (
              <li key={t.h}><span className="co-when">{t.when}</span><div><h3 className="h4">{t.h}</h3><p>{t.p}</p></div></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec" id="team">
        <div className="wrap">
          <SecHead label={d.team.label} title={d.team.title} text={d.team.text} />
          <div className="cells c3">{d.team.roles.map((c: Cell) => <div key={c.k}><span className="k">{c.k}</span><h3 className="h4">{c.h}</h3><p>{c.p}</p></div>)}</div>
          <div className="split mt-l">
            <div className="gap"><h3 className="h3">{d.team.ladderTitle}</h3><p className="dim"><Md text={d.team.ladderText} /></p></div>
          </div>
          <div className="ladder mt-m">
            {d.team.ladder.map((l: Rung) => (
              <div key={l.lv}><span className="lv">{l.lv}</span><div className="bar"><i style={{ height: `${l.size}%` }} /></div><h3>{l.h}</h3><p>{l.p}</p></div>
            ))}
          </div>
          <div className="mt-l">
            <span className="label">{d.leadership.label}</span>
            <h3 className="h3 mt-s">{d.leadership.title}</h3>
            <div className="cells c2 mt-m">{d.leadership.people.map((c: Cell) => <div key={c.h}><span className="k">{c.k}</span><h3 className="h4">{c.h}</h3><p>{c.p}</p></div>)}</div>
          </div>
        </div>
      </section>

      <section className="sec paper" id="standards">
        <div className="wrap">
          <SecHead label={d.standards.label} title={d.standards.title} text={d.standards.text} />
          <ol className="steps">{d.standards.steps.map(([b, p]: string[]) => <li key={b}><b>{b}</b><p>{p}</p></li>)}</ol>
        </div>
      </section>

      <section className="sec" id="responsible-ai">
        <div className="wrap">
          <SecHead label={d.responsible.label} title={d.responsible.title} text={d.responsible.text} />
          <div className="cells c3">{d.responsible.cells.map((c: Cell) => <div key={c.h}><span className="k">{c.k}</span><h3 className="h4">{c.h}</h3><p>{c.p}</p></div>)}</div>
          <div className="mt-m"><Link className="btn btn-g" href="/security">{d.responsible.more} <Arrow /></Link></div>
        </div>
      </section>

      <Statement k={d.statement.k} text={d.statement.text} />

      <section className="sec" id="parent">
        <div className="wrap">
          <span className="label">{d.parent.label}</span>
          <div className="parent mt-m">
            <div className="gap"><h2 className="serif" style={{ fontSize: "var(--s-xl)", lineHeight: 1.1 }}>{d.parent.title}</h2><p className="dim" style={{ maxWidth: "62ch" }}>{d.parent.text}</p></div>
            <div className="row">
              <Link className="btn btn-g" href="/aisolution">{d.parent.cta}</Link>
              <a className="btn btn-p" href={parentCompany.url} target="_blank" rel="noopener">{d.parent.ext} <span className="ar" aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="split mt-l">
            <div className="gap"><span className="label">{d.partners.label}</span><h2 className="serif co-h2"><Split text={d.partners.title} /></h2><p className="dim" style={{ maxWidth: "52ch" }}>{d.partners.text}</p></div>
            <div className="cells c2" style={{ alignSelf: "center" }}>{d.partners.cells.map((c: Cell) => <div key={c.h}><span className="k">{c.k}</span><h3 className="h4">{c.h}</h3><p>{c.p}</p></div>)}</div>
          </div>
        </div>
      </section>

      <section className="sec paper" id="careers">
        <div className="wrap">
          <SecHead label={d.careers.label} title={d.careers.title} text={d.careers.text} />
          <div className="split">
            <div className="gap"><h3 className="h4">{d.careers.lookTitle}</h3><ul className="ticks">{d.careers.look.map((i: string) => <li key={i}>{i}</li>)}</ul></div>
            <div className="gap"><h3 className="h4">{d.careers.teachTitle}</h3><ul className="ticks">{d.careers.teach.map((i: string) => <li key={i}>{i}</li>)}</ul></div>
          </div>
          <div className="split mt-l">
            <div className="gap"><h3 className="h3">{d.careers.whyTitle}</h3><p className="dim">{d.careers.why}</p>
              <Link className="btn btn-p mt-s" href="/contact" style={{ justifySelf: "start" }}>{d.careers.cta} <Arrow /></Link></div>
            <ol className="steps co-steps">{d.careers.how.map(([b, p]: string[]) => <li key={b}><b>{b}</b><p>{p}</p></li>)}</ol>
          </div>
        </div>
      </section>

      <FaqBlock id="faq" label={d.faq.label} title={d.faq.title} items={d.faq.items} />
      <Related label={d.related.label} title={d.related.title} more={d.related.more} items={d.related.items as RelatedItem[]} />
      <Band title={d.band.title} text={d.band.text} seed={53}>
        <Link className="btn btn-p" href="/contact">{d.band.cta1} <Arrow /></Link>
        <Link className="btn btn-g" href="/faq">{d.band.cta2}</Link>
      </Band>
      <PageMotion />
    </>
  );
}
