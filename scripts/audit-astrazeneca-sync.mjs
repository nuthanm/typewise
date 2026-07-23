import { readFileSync, writeFileSync } from "fs";

const data = JSON.parse(readFileSync("data/companies.json", "utf8"));

const REQUIRED = [
  "tagline",
  "description",
  "website",
  "founded",
  "hq",
  "officeCities",
  "officeCountries",
  "totalOfficeLocations",
  "locationsUrl",
  "contactUrl",
  "headcountIndia",
  "headcountGlobal",
  "headcountNote",
  "domains",
  "tags",
  "onsitePolicy",
  "careersUrl",
  "linkedin",
  "twitter",
  "leadership",
  "vision",
  "lastVerified",
  "verificationStatus",
  "sources",
];

const MIN_SOURCES = 4;
const MIN_DOMAINS = 2;
const MIN_TAGS = 1;

function isEmpty(v) {
  if (v === undefined || v === null) return true;
  if (Array.isArray(v) && v.length === 0) return true;
  if (typeof v === "string" && v.trim() === "") return true;
  return false;
}

function audit(c) {
  const missing = REQUIRED.filter((f) => isEmpty(c[f]));
  const issues = [];

  if (missing.length) issues.push({ type: "missing_fields", fields: missing });
  if (!c.domains || c.domains.length < MIN_DOMAINS)
    issues.push({ type: "domains_lt_2", count: c.domains?.length ?? 0 });
  if (!c.tags || c.tags.length < MIN_TAGS)
    issues.push({ type: "no_tags" });
  if (!c.sources || c.sources.length < MIN_SOURCES)
    issues.push({
      type: "sources_lt_min",
      count: c.sources?.length ?? 0,
      min: MIN_SOURCES,
    });
  if (c.category === "product" && isEmpty(c.products))
    issues.push({ type: "product_company_no_products" });
  if (
    c.category === "service" &&
    isEmpty(c.services) &&
    isEmpty(c.products)
  )
    issues.push({ type: "service_company_no_services" });
  if (isEmpty(c.leadership)) issues.push({ type: "no_leadership" });

  return issues;
}

const results = [];
for (const c of data.companies) {
  if (c.slug === "astrazeneca") continue;
  const issues = audit(c);
  if (issues.length === 0) continue;

  const missingFields = issues.find((i) => i.type === "missing_fields")?.fields ?? [];
  results.push({
    slug: c.slug,
    name: c.name,
    category: c.category,
    status: c.verificationStatus,
    issueCount: issues.length + missingFields.length,
    missingFields,
    otherIssues: issues.filter((i) => i.type !== "missing_fields").map((i) => i.type),
  });
}

results.sort((a, b) => b.issueCount - a.issueCount);

const summary = {
  totalCompanies: data.companies.length,
  reference: "astrazeneca",
  inSync: data.companies.length - 1 - results.length,
  outOfSync: results.length,
  auditedAt: new Date().toISOString().slice(0, 10),
  results,
};

writeFileSync("audit-results.json", JSON.stringify(summary, null, 2));

console.log(`Total: ${summary.totalCompanies}`);
console.log(`In sync: ${summary.inSync}`);
console.log(`Out of sync: ${summary.outOfSync}`);
console.log("---");
for (const r of results) {
  const parts = [];
  if (r.missingFields.length) parts.push(`missing: ${r.missingFields.join(", ")}`);
  if (r.otherIssues.length) parts.push(`issues: ${r.otherIssues.join(", ")}`);
  console.log(`${r.slug} (${r.status}) — ${parts.join(" | ")}`);
}
