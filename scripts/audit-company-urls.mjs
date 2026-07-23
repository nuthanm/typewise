#!/usr/bin/env node
/**
 * Audit company URLs in companies.json — LinkedIn, website, careers, sources.
 */
import { readFileSync } from "node:fs";

const data = JSON.parse(readFileSync("data/companies.json", "utf8"));

async function head(url, timeout = 12000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "User-Agent": "TypewiseAudit/1.0" },
    });
    return { url, status: res.status, ok: res.ok || res.status === 405 || res.status === 403 };
  } catch (e) {
    return { url, status: 0, ok: false, error: e.message };
  } finally {
    clearTimeout(t);
  }
}

const fields = [
  "website",
  "careersUrl",
  "linkedin",
  "twitter",
  "locationsUrl",
  "contactUrl",
];

const issues = [];

for (const c of data.companies) {
  const row = { slug: c.slug, name: c.name, problems: [] };
  for (const f of fields) {
    if (!c[f]) continue;
    const r = await head(c[f]);
    if (!r.ok) row.problems.push({ field: f, url: c[f], status: r.status, error: r.error });
  }
  for (const s of c.sources ?? []) {
    const r = await head(s.url);
    if (!r.ok) row.problems.push({ field: `source:${s.label}`, url: s.url, status: r.status, error: r.error });
  }
  if (row.problems.length) issues.push(row);
  process.stderr.write(".");
}

console.log(JSON.stringify({ total: data.companies.length, withIssues: issues.length, issues }, null, 2));
