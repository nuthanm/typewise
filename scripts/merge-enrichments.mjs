import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = join(ROOT, "data/companies.json");
const enrichDir = join(ROOT, "data/enrichments");

const catalog = JSON.parse(readFileSync(dataPath, "utf8"));
const bySlug = Object.fromEntries(catalog.companies.map((c) => [c.slug, c]));

function deepMerge(base, patch) {
  const out = { ...base };
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) out[k] = v;
    else if (typeof v === "object" && !Array.isArray(v)) out[k] = { ...(out[k] ?? {}), ...v };
    else out[k] = v;
  }
  return out;
}

if (!existsSync(enrichDir)) {
  console.error("No enrichments directory:", enrichDir);
  process.exit(1);
}

const files = readdirSync(enrichDir)
  .filter((f) => f.endsWith(".json"))
  .sort((a, b) => {
    const order = (f) =>
      f === "batch-final-fix.json" ? 1 : f === "batch-last-two.json" ? 2 : 0;
    return order(a) - order(b) || a.localeCompare(b);
  });
let merged = 0;
const missing = [];

for (const file of files) {
  const batch = JSON.parse(readFileSync(join(enrichDir, file), "utf8"));
  for (const [slug, patch] of Object.entries(batch)) {
    if (!bySlug[slug]) {
      missing.push({ file, slug });
      continue;
    }
    bySlug[slug] = deepMerge(bySlug[slug], patch);
    merged++;
  }
}

catalog.companies = catalog.companies.map((c) => bySlug[c.slug]);
catalog.catalogUpdated = new Date().toISOString().slice(0, 10);
writeFileSync(dataPath, JSON.stringify(catalog, null, 2) + "\n");

console.log(`Merged ${merged} company patches from ${files.length} files`);
if (missing.length) {
  console.warn("Unknown slugs:", missing);
}
