# BlackGust — blackgust.com

Corporate site for BlackGust, the international brand of AISolution. Target markets: Europe, the Americas, China, Japan, Korea, Australia. Multilingual (EN default, DE, FR, ES, PT, ZH, JA, KO), premium enterprise/government positioning, scroll-driven motion.

## Stack
- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- next-intl 4 — locale routing (`/` = English, `/de`, `/fr`, `/es`, `/pt`, `/zh`, `/ja`, `/ko`)
- GSAP + ScrollTrigger, Lenis smooth scroll, Canvas 2D (live organization model)
- zod for API validation; self-hosted fonts (@fontsource)

## Run
```bash
npm install
cp .env.example .env.local     # fill Telegram and/or Resend
npm run dev                    # http://localhost:3000
npm run i18n:check             # all locales must match en.json
npm run build && npm start     # production
```

## Where things live
| What | Where |
|---|---|
| All texts (8 languages) | `src/messages/*.json` (`en.json` is the source) |
| Contacts, prices (USD/EUR), AISolution links | `src/config/site.ts` |
| Pages | `src/app/[locale]/*/page.tsx`, page-specific CSS in `src/styles/<page>.css` |
| Shared long-page blocks (sub-nav, FAQ + JSON-LD, matrix, meters, related) | `src/components/Blocks.tsx` |
| Update one message namespace safely | `node scripts/set-ns.mjs <locale> <namespace> <file.json>` |
| Header, footer, language switcher, form | `src/components/` |
| Motion: smooth scroll, reveals, parallax | `src/components/MotionRoot.tsx`, `src/lib/motion/page.ts` |
| Live model ("How it works") | `src/lib/motion/flow.ts`, `src/components/FlowViz.tsx` |
| Particle wind field (heroes) | `src/lib/motion/gust.ts` |
| Lead API (anti-spam + Telegram/email) | `src/app/api/lead/route.ts` |
| SEO: metadata, hreflang, sitemap, robots, OG | `src/lib/seo.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/og/route.tsx` |
| Cursor rules | `.cursor/rules/blackgust.mdc` |

## Pricing
Fixed list prices per currency in `src/config/site.ts` (placeholders `{diagnostic}`, `{pilot}`, `{foundation}`, `{enterprise}`, `{sovereign}`):
- USD (en, es, pt, zh, ja, ko): diagnostic $1,490 · pilot from $9,990 · packages Foundation $90,000 / Enterprise $250,000 / Sovereign $490,000 per year
- EUR (fr, de): €1,390 · from €9,290 · €84,000 / €230,000 / €450,000 per year (EUR prices are proposals — confirm)
Package scope (users, systems, team size, SLA) is described on /pricing (`pricing` namespace) — confirm before launch.

## Lead form
`POST /api/lead` — origin check, honeypot, ≥3 s completion time, 5 requests / 10 min per IP, duplicate suppression, optional Cloudflare Turnstile. Delivers to Telegram and/or email (Resend). Rate limit and dedup are in-memory: fine for one PM2 process; use Redis if you run several instances.

## Deploy (Hetzner, same as aisolution.uz)
```bash
npm ci && npm run build
pm2 start npm --name blackgust -- start -- -p 3010
```
Nginx: proxy `blackgust.com` → `127.0.0.1:3010`, Let's Encrypt for TLS, redirect `www` → apex. Set `NEXT_PUBLIC_SITE_URL=https://blackgust.com`.

## Before launch — verify
- Technical claims on Platform/Security pages (in-region data center, SAML/OIDC, Kubernetes, SIEM export, own Uzbek STT/TTS, deploy timelines).
- "OpenAI Select Partner" is stated for AISolution only (approved wording). Get written approval before showing it next to the BlackGust brand.
- Create the mailbox hello@blackgust.com and confirm WhatsApp on +998 93 949 20 00.
- Native-speaker review of DE, FR, ES, PT, ZH, JA, KO texts.
- RU/KK texts were removed from .com (CIS goes to aisolution.uz); archived in `_archive/messages/`.
- EUR prices are proposals — confirm.
