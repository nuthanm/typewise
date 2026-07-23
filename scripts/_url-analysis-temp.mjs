import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const TIMEOUT_MS = 8000;

function linkedinPath(url) {
  if (!url || typeof url !== "string") return null;
  try {
    const u = new URL(url.trim());
    if (!u.hostname.includes("linkedin.com")) return null;
    const parts = u.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
    // /company/slug or /school/slug
    if (parts.length >= 2 && (parts[0] === "company" || parts[0] === "school" || parts[0] === "showcase")) {
      return parts[1].toLowerCase();
    }
    if (parts.length === 1) return parts[0].toLowerCase();
    return parts.join("/").toLowerCase();
  } catch {
    return null;
  }
}

async function checkUrl(url, method = "HEAD") {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    let res = await fetch(url, {
      method,
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "TypewiseURLCheck/1.0 (+https://github.com/typewise)",
        Accept: "text/html,*/*",
      },
    });
    if (method === "HEAD" && (res.status === 405 || res.status === 403 || res.status === 501)) {
      res = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        redirect: "follow",
        headers: {
          "User-Agent": "TypewiseURLCheck/1.0",
          Accept: "text/html,*/*",
        },
      });
    }
    return { status: res.status, ok: res.ok, finalUrl: res.url };
  } catch (e) {
    const msg = e.name === "AbortError" ? "timeout" : String(e.message || e);
    return { status: null, ok: false, error: msg };
  } finally {
    clearTimeout(t);
  }
}

function extractMergeSlugs() {
  const text = readFileSync(join(ROOT, "scripts/merge-pipeline-batch.mjs"), "utf8");
  const start = text.indexOf("const META = {");
  if (start === -1) return [];
  let depth = 0;
  let i = text.indexOf("{", start);
  const begin = i;
  for (; i < text.length; i++) {
    const ch = text[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        const block = text.slice(begin, i + 1);
        const slugs = [];
        const re = /^\s{2}("([^"]+)"|([a-zA-Z0-9-]+)):\s*\{/gm;
        let m;
        while ((m = re.exec(block))) slugs.push((m[2] || m[3]).toLowerCase());
        return slugs;
      }
    }
  }
  return [];
}

const catalog = JSON.parse(readFileSync(join(ROOT, "data/companies.json"), "utf8"));
const companies = catalog.companies || [];
const mergeSlugs = new Set(extractMergeSlugs());

const mismatches = [];
for (const co of companies) {
  const slug = (co.slug || "").toLowerCase();
  const path = linkedinPath(co.linkedin);
  if (path && path !== slug) {
    mismatches.push({ slug, linkedinPath: path, linkedin: co.linkedin, name: co.name });
  } else if (co.linkedin && !path) {
    mismatches.push({ slug, linkedinPath: "(unparsed)", linkedin: co.linkedin, name: co.name });
  }
}

console.log("=== TOTAL COMPANY COUNT ===");
console.log(companies.length);
console.log("");

console.log("=== SLUG -> LINKEDIN PATH MISMATCHES ===");
console.log(`Count: ${mismatches.length}`);
for (const m of mismatches.sort((a, b) => a.slug.localeCompare(b.slug))) {
  console.log(`${m.slug} -> ${m.linkedinPath}  |  ${m.linkedin}`);
}
console.log("");

// LinkedIn checks - all companies with linkedin, flag 404 and errors
console.log("=== LINKEDIN URL CHECKS (8s timeout) ===");
const linkedinBroken = [];
const concurrency = 8;
const withLinkedin = companies.filter((c) => c.linkedin);
for (let i = 0; i < withLinkedin.length; i += concurrency) {
  const batch = withLinkedin.slice(i, i + concurrency);
  await Promise.all(
    batch.map(async (co) => {
      const r = await checkUrl(co.linkedin, "HEAD");
      const bad = r.status === 404 || r.error;
      if (bad || r.status >= 400) {
        linkedinBroken.push({
          slug: co.slug,
          linkedin: co.linkedin,
          status: r.status,
          error: r.error,
          finalUrl: r.finalUrl,
        });
      }
      process.stderr.write(".");
    })
  );
}
console.error("");
console.log(`Checked: ${withLinkedin.length}, issues: ${linkedinBroken.length}`);
for (const b of linkedinBroken.sort((a, x) => a.slug.localeCompare(x.slug))) {
  console.log(`${b.slug}: ${b.status ?? b.error}  ${b.linkedin}`);
}
console.log("");

// Merge pipeline URL checks
console.log("=== MERGE-PIPELINE BATCH URL CHECKS ===");
console.log(`Merge slugs in script: ${mergeSlugs.size}`);
const mergeCompanies = companies.filter((c) => mergeSlugs.has(c.slug));
const urlFields = ["website", "careersUrl", "aboutUrl", "locationsUrl"];
const brokenSources = [];

for (let i = 0; i < mergeCompanies.length; i += concurrency) {
  const batch = mergeCompanies.slice(i, i + concurrency);
  await Promise.all(
    batch.map(async (co) => {
      for (const field of urlFields) {
        const url = co[field];
        if (!url) continue;
        const r = await checkUrl(url, "HEAD");
        if (r.status === 404 || r.error || (r.status && r.status >= 400 && r.status !== 403 && r.status !== 405)) {
          brokenSources.push({
            slug: co.slug,
            field,
            url,
            status: r.status,
            error: r.error,
          });
        }
      }
      // sources array
      if (Array.isArray(co.sources)) {
        for (const src of co.sources) {
          if (!src?.url) continue;
          const r = await checkUrl(src.url, "HEAD");
          if (r.status === 404 || r.error || (r.status && r.status >= 400 && r.status !== 403 && r.status !== 405)) {
            brokenSources.push({
              slug: co.slug,
              field: `sources:${src.label || "?"}`,
              url: src.url,
              status: r.status,
              error: r.error,
            });
          }
        }
      }
      process.stderr.write(",");
    })
  );
}
console.error("");
console.log(`Merge companies in catalog: ${mergeCompanies.length}`);
console.log(`Broken URL count: ${brokenSources.length}`);
for (const b of brokenSources.sort((a, x) => `${a.slug}-${a.field}`.localeCompare(`${x.slug}-${x.field}`))) {
  console.log(`${b.slug} [${b.field}]: ${b.status ?? b.error}  ${b.url}`);
}

