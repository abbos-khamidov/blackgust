import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionState } from "./state";

/**
 * Scroll choreography for one page. Everything runs inside a gsap.context so a route change
 * reverts inline styles and kills every ScrollTrigger it created.
 * Content is fully visible without JS; only elements below the fold are pre-hidden.
 */
export function initPageMotion(root: HTMLElement): () => void {
  gsap.registerPlugin(ScrollTrigger);
  const vh = () => window.innerHeight;
  const below = (el: Element) => el.getBoundingClientRect().top > vh() * 0.92;
  const desk = window.matchMedia("(min-width: 900px)").matches;
  const fine = window.matchMedia("(pointer:fine)").matches;
  const cleanups: (() => void)[] = [];

  const ctx = gsap.context(() => {
    /* hero: load sequence + parallax */
    const hero = root.querySelector<HTMLElement>(".hero");
    if (hero) {
      const cv = hero.querySelector("canvas");
      const wrap = hero.querySelector(".wrap");
      const words = hero.querySelectorAll("h1 .wi");
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      if (cv) tl.from(cv, { opacity: 0, scale: 1.06, duration: 1.6, ease: "power2.out" }, 0);
      tl.from(words, { yPercent: 115, rotate: 3, duration: 1.15, stagger: 0.045 }, 0.1)
        .from(hero.querySelectorAll(".badge,.crumb"), { y: 12, opacity: 0, duration: 0.8 }, 0.05)
        .from(hero.querySelectorAll(".lede"), { y: 24, opacity: 0, duration: 1 }, 0.35)
        .from(hero.querySelectorAll(".row .btn"), { y: 18, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.5)
        .from(hero.querySelectorAll(".meta li"), { y: 10, opacity: 0, duration: 0.7, stagger: 0.06 }, 0.65);
      gsap
        .timeline({ scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } })
        .to(cv, { yPercent: 22, scale: 1.12, ease: "none" }, 0)
        .to(wrap, { yPercent: -18, opacity: 0.15, ease: "none" }, 0)
        .to(hero.querySelector(".veil"), { opacity: 1, ease: "none" }, 0);
    }

    /* headline masked word reveal (words are pre-split by <Split/>) */
    gsap.utils.toArray<HTMLElement>(".sec-head h2, .band h2, .sec h2.serif, .faq-group h2").forEach((h) => {
      if (!below(h)) return;
      const w = h.querySelectorAll(".wi");
      if (!w.length) return;
      gsap.from(w, { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.035, scrollTrigger: { trigger: h, start: "top 88%" } });
    });
    gsap.utils.toArray<HTMLElement>(".sec-head p, .sec-head .label, .split > .gap > .label").forEach((p) => {
      if (!below(p)) return;
      gsap.from(p, { y: 20, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: p, start: "top 90%" } });
    });

    /* grids: staggered rise */
    gsap.utils.toArray<HTMLElement>(".cells, .rows, .ticks, .qa, .tiers, .pk, .faq, .facts, .phases, .tbl tbody, .matrix tbody, .channels, .steps, .ladder").forEach((g) => {
      if (g.closest(".console") || g.closest(".viz")) return;
      const kids = Array.from(g.children).filter(below);
      if (!kids.length) return;
      gsap.set(kids, { y: 34, opacity: 0 });
      ScrollTrigger.create({
        trigger: g, start: "top 86%", once: true,
        onEnter: () => gsap.to(kids, { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.07 }),
      });
    });

    /* paper sections: card expands to full bleed */
    gsap.utils.toArray<HTMLElement>(".sec.paper").forEach((s) => {
      gsap.fromTo(s, { clipPath: "inset(5% 3.5% 0% 3.5% round 18px)" }, {
        clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none",
        scrollTrigger: { trigger: s, start: "top bottom", end: "top 25%", scrub: true },
      });
      const w = s.querySelector(".wrap");
      if (w) gsap.fromTo(w, { y: 60 }, { y: 0, ease: "none", scrollTrigger: { trigger: s, start: "top bottom", end: "top 25%", scrub: true } });
    });

    /* depth parallax */
    gsap.utils.toArray<HTMLElement>(".gridlines").forEach((g) => {
      gsap.fromTo(g, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: g.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });
    gsap.utils.toArray<HTMLElement>(".band").forEach((b) => {
      const c = b.querySelector("canvas");
      if (c) gsap.fromTo(c, { yPercent: -14, scale: 1.15 }, { yPercent: 14, scale: 1.15, ease: "none", scrollTrigger: { trigger: b, start: "top bottom", end: "bottom top", scrub: true } });
    });

    /* phases: progress rail */
    gsap.utils.toArray<HTMLElement>(".phases").forEach((ph) => {
      const rail = document.createElement("i");
      rail.className = "rail";
      ph.appendChild(rail);
      cleanups.push(() => rail.remove());
      gsap.fromTo(rail, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: ph, start: "top 80%", end: "bottom 55%", scrub: 0.6 } });
      Array.from(ph.querySelectorAll(".phase")).forEach((p, i) => {
        ScrollTrigger.create({ trigger: ph, start: `top+=${i * 60} 70%`, onEnter: () => p.classList.add("lit"), onLeaveBack: () => p.classList.remove("lit") });
      });
    });

    /* level meters and ladder bars fill when they enter */
    gsap.utils.toArray<HTMLElement>(".meter, .ladder").forEach((m) => {
      if (!below(m)) return;
      const segs = m.querySelectorAll(".meter i.on, .bar i");
      if (!segs.length) return;
      gsap.from(segs, { scaleX: m.classList.contains("ladder") ? 1 : 0, scaleY: m.classList.contains("ladder") ? 0 : 1, duration: 0.9, ease: "power3.out", stagger: 0.06, scrollTrigger: { trigger: m, start: "top 88%" } });
    });

    /* sticky sub-nav: highlight the section in view */
    root.querySelectorAll<HTMLAnchorElement>(".subnav a").forEach((a) => {
      const sec = root.querySelector(a.hash);
      if (!sec) return;
      ScrollTrigger.create({ trigger: sec, start: "top 45%", end: "bottom 45%", onToggle: (st) => a.classList.toggle("on", st.isActive) });
    });

    /* console entrance */
    gsap.utils.toArray<HTMLElement>(".console").forEach((c) => {
      if (!below(c)) return;
      gsap.from(c, { y: 60, rotateX: 8, transformPerspective: 1200, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: c, start: "top 85%" } });
    });

    /* platform: exploded stack assembles */
    const stack = root.querySelector<HTMLElement>(".stack");
    if (stack && desk) {
      const layers = Array.from(stack.children);
      gsap.set(stack, { perspective: 1400 });
      gsap
        .timeline({ scrollTrigger: { trigger: stack, start: "top 85%", end: "center 45%", scrub: 0.8 } })
        .from(layers, {
          y: (i) => (i - layers.length / 2) * 46, rotateX: 28, z: (i) => -i * 40, opacity: 0.25,
          transformOrigin: "50% 100%", ease: "power2.out", stagger: 0.04,
        }, 0);
    }

    /* marquee: speed and direction follow scroll velocity */
    const mq = root.querySelector<HTMLElement>(".marq .tr");
    if (mq) {
      mq.style.animation = "none";
      const tw = gsap.to(mq, { xPercent: -50, duration: 60, ease: "none", repeat: -1 });
      const tick = () => {
        const v = Math.abs(motionState.velocity);
        tw.timeScale(Math.min(8, 1 + v / 6) * (motionState.direction < 0 ? -1 : 1));
      };
      gsap.ticker.add(tick);
      cleanups.push(() => gsap.ticker.remove(tick));
    }

    /* footer wordmark fill */
    const word = document.querySelector<HTMLElement>(".foot .word");
    if (word) {
      gsap.fromTo(word, { backgroundSize: "0% 100%", yPercent: 30 }, {
        backgroundSize: "100% 100%", yPercent: 0, ease: "none",
        scrollTrigger: { trigger: word, start: "top bottom", end: "bottom bottom", scrub: true },
      });
    }
  }, root);

  /* magnetic buttons + cell spotlight (plain listeners) */
  if (fine) {
    root.querySelectorAll<HTMLElement>(".btn-p").forEach((b) => {
      const xT = gsap.quickTo(b, "x", { duration: 0.5, ease: "power3.out" });
      const yT = gsap.quickTo(b, "y", { duration: 0.5, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = b.getBoundingClientRect();
        xT((e.clientX - r.left - r.width / 2) * 0.22);
        yT((e.clientY - r.top - r.height / 2) * 0.3);
      };
      const leave = () => { xT(0); yT(0); };
      b.addEventListener("pointermove", move);
      b.addEventListener("pointerleave", leave);
      cleanups.push(() => { b.removeEventListener("pointermove", move); b.removeEventListener("pointerleave", leave); gsap.set(b, { x: 0, y: 0 }); });
    });
    root.querySelectorAll<HTMLElement>(".cells > *").forEach((c) => {
      const move = (e: PointerEvent) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty("--mx", `${e.clientX - r.left}px`);
        c.style.setProperty("--my", `${e.clientY - r.top}px`);
      };
      c.addEventListener("pointermove", move);
      cleanups.push(() => c.removeEventListener("pointermove", move));
    });
  }

  const refresh = () => ScrollTrigger.refresh();
  const t = window.setTimeout(refresh, 300);
  if (document.fonts?.ready) document.fonts.ready.then(refresh);

  return () => {
    window.clearTimeout(t);
    cleanups.forEach((f) => f());
    ctx.revert();
  };
}
