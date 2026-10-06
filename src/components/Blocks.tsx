import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { SecHead } from "./Hero";
import { Md } from "./Md";
import { JsonLd } from "./JsonLd";

/**
 * Shared building blocks for long inner pages.
 * All server components; content comes from messages, never hardcoded.
 */

/** Sticky in-page navigation. Each id must match a section id on the page. */
export function PageNav({ label, items }: { label: string; items: [id: string, title: string][] }) {
  return (
    <nav className="subnav" aria-label={label}>
      <div className="wrap">
        <span className="mono dim">{label}</span>
        <ul>{items.map(([id, t]) => <li key={id}><a href={`#${id}`}>{t}</a></li>)}</ul>
      </div>
    </nav>
  );
}

/** Strips inline markdown so JSON-LD gets plain text. */
const plain = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*?([^*]+)\*\*?/g, "$1");

/** Q&A accordion section. With `ld`, also emits FAQPage structured data (use once per page). */
export function FaqBlock({ id, label, title, text, items, ld = true, paper = false }: {
  id?: string; label: string; title: string; text?: ReactNode; items: string[][]; ld?: boolean; paper?: boolean;
}) {
  return (
    <section className={`sec${paper ? " paper" : ""}`} id={id}>
      <div className="wrap">
        <SecHead label={label} title={title} text={text} />
        <div className="faq">
          {items.map(([q, a]) => (
            <details key={q}><summary>{q}</summary><div className="a"><p><Md text={a} /></p></div></details>
          ))}
        </div>
      </div>
      {ld ? <JsonLd data={{
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: plain(a) } })),
      }} /> : null}
    </section>
  );
}

export type RelatedItem = { href: string; k: string; h: string; p: string };

/** Cross-links to related pages (internal linking for readers and search engines). */
export function Related({ label, title, items, more }: { label: string; title: string; items: RelatedItem[]; more: string }) {
  return (
    <section className="sec">
      <div className="wrap">
        <SecHead label={label} title={title} />
        <div className={`cells c${Math.min(items.length, 4)}`}>
          {items.map((c) => (
            <Link className="cell" href={c.href} key={c.href + c.k}><span className="k">{c.k}</span><h3 className="h4">{c.h}</h3><p>{c.p}</p><span className="more">{more} →</span></Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** 5-segment level meter. `level` is 0–5. */
export function Meter({ level, label }: { level: number; label?: string }) {
  return (
    <span className="meter" role="img" aria-label={label ?? `${level}/5`}>
      {[1, 2, 3, 4, 5].map((i) => <i key={i} className={i <= level ? "on" : undefined} />)}
    </span>
  );
}

/**
 * Comparison matrix. Cell tokens: "+" = included (tick), "-" = not included (dash),
 * "#N" = level meter with N of 5 segments, anything else = text (inline markdown allowed).
 * A row with a single cell is a group heading.
 */
export function Matrix({ cols, rows, hl, caption }: { cols: string[]; rows: string[][]; hl?: number; caption?: string }) {
  const cell = (v: string) => {
    if (v === "+") return <span className="mx-y" aria-label="✓">✓</span>;
    if (v === "-") return <span className="mx-n" aria-label="—">—</span>;
    const m = /^#(\d)$/.exec(v);
    if (m) return <Meter level={Number(m[1])} />;
    return <Md text={v} />;
  };
  return (
    <div className="mx-w">
      <table className="matrix">
        {caption ? <caption className="note">{caption}</caption> : null}
        <thead><tr>{cols.map((c, i) => <th key={c + i} scope="col" className={i === hl ? "hl" : undefined}>{c}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, k) => r.length === 1
            ? <tr key={k} className="grp"><th colSpan={cols.length} scope="colgroup">{r[0]}</th></tr>
            : <tr key={k}>{r.map((v, i) => i === 0
              ? <th key={i} scope="row">{v}</th>
              : <td key={i} className={i === hl ? "hl" : undefined}>{cell(v)}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}

/** Big statement strip: key figure + text, used between sections. */
export function Statement({ k, text }: { k: string; text: string }) {
  return (
    <section className="statement">
      <div className="wrap"><span className="label">{k}</span><p className="serif"><Md text={text} /></p></div>
    </section>
  );
}
