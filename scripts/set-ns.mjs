// Replaces one top-level namespace in a locale file, safely when several writers run at once.
// Usage: node scripts/set-ns.mjs <locale> <namespace> <path/to/namespace.json>
// The namespace file holds just the namespace value (an object). Keeps key order of the locale file.
import fs from "node:fs";
import path from "node:path";

const [locale, ns, src] = process.argv.slice(2);
if (!locale || !ns || !src) { console.error("usage: node scripts/set-ns.mjs <locale> <namespace> <file>"); process.exit(1); }
const value = JSON.parse(fs.readFileSync(src, "utf8"));
const file = path.join(process.cwd(), "src/messages", `${locale}.json`);
const lock = file + ".lock";

const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
for (let i = 0; ; i++) {
  try { fs.mkdirSync(lock); break; } catch {
    if (i > 600) { console.error("lock timeout: remove " + lock + " if no writer is running"); process.exit(1); }
    sleep(50);
  }
}
try {
  const j = JSON.parse(fs.readFileSync(file, "utf8"));
  const out = {};
  for (const k of Object.keys(j)) out[k] = k === ns ? value : j[k];
  if (!(ns in j)) out[ns] = value;
  fs.writeFileSync(file, JSON.stringify(out, null, 2) + "\n");
  console.log(`${locale}.json: ${ns} updated`);
} finally {
  fs.rmdirSync(lock);
}
