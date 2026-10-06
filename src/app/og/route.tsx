import { ImageResponse } from "next/og";
import en from "@/messages/en.json";
import { fill, priceVars } from "@/lib/format";

const DEFAULT = "Operational intelligence for government and enterprise";
const meta = en.meta as Record<string, { title?: string; description?: string }>;

/** Open Graph card: /og?p=pricing. Latin-only font in the image renderer, so the card is always in English. */
export async function GET(req: Request) {
  const p = new URL(req.url).searchParams.get("p") ?? "home";
  const raw = fill(meta[p]?.title ?? DEFAULT, priceVars("en"));
  const title = p === "home" ? DEFAULT : raw.replace(/s+—s+BlackGust$/, "");
  const sub = p === "home" ? "PLATFORM · FORWARD-DEPLOYED ENGINEERS · SOVEREIGN AI" : "BLACKGUST · " + (meta[p]?.description ?? "").split(/[.:]/)[0].toUpperCase().slice(0, 64);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#07080A", color: "#ECE9E2", padding: 72, fontFamily: "serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 28, letterSpacing: 8 }}>
          <div style={{ width: 44, height: 44, border: "2px solid rgba(236,233,226,.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 26, height: 3, background: "#C9A86A" }} />
          </div>
          BLACKGUST
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, lineHeight: 1.02, maxWidth: 980 }}>{title}</div>
          <div style={{ fontSize: 26, color: "#C9A86A", letterSpacing: 3 }}>{sub}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
