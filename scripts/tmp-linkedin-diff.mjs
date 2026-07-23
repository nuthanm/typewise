import { readFileSync } from "node:fs";
const data = JSON.parse(readFileSync("data/companies.json", "utf8"));
function path(url) {
  const m = url?.match(/linkedin\.com\/company\/([^/?#]+)/i);
  return m?.[1] ?? null;
}
for (const c of data.companies) {
  const p = path(c.linkedin);
  if (p && p !== c.slug) console.log(c.slug, "->", p);
}
