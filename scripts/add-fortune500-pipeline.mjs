#!/usr/bin/env node
/**
 * Add Fortune 500 (2025) company stubs to data/pipeline.json.
 * Skips companies already in the verified catalog (including *-india variants).
 *
 * Usage: node scripts/add-fortune500-pipeline.mjs [path-to-fortune500-table.txt]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const SOURCE_CANDIDATES = [
  join(ROOT, "data", "fortune500-2025-source.txt"),
  join(ROOT, ".cursor", "projects", "d-My-work-typewise", "agent-tools", "ca3c969d-529e-42ce-881c-9b942e6530a6.txt"),
];

/** Manual aliases: Fortune 500 name -> existing catalog slug */
const ALIAS_TO_EXISTING_SLUG = {
  alphabet: "google-india",
  sap: "sap-labs-india",
};

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\b(inc|corp|corporation|company|co|ltd|llc|plc|group|holdings|international|technologies|technology|systems|services|solutions|enterprises|enterprise|platforms|global|usa|us)\b\.?/gi, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function parseFortune500Table(text) {
  const bySlug = new Map();
  for (const line of text.split("\n")) {
    const match = line.match(/^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/);
    if (!match) continue;
    const rank = Number(match[1]);
    const name = match[2].trim();
    const industry = match[3].trim();
    if (rank < 1 || rank > 500 || !name || name === "Company") continue;

    const slug = slugify(name);
    const existing = bySlug.get(slug);
    if (!existing || rank < existing.rank) {
      bySlug.set(slug, { rank, name, industry });
    }
  }
  return [...bySlug.values()].sort((a, b) => a.rank - b.rank);
}

function inferCategory(industry) {
  const value = industry.toLowerCase();
  if (
    /it services|consulting|professional services|bpo|engineering \/ construction|real estate services|advertising|business services/.test(
      value,
    )
  ) {
    return "service";
  }
  if (/technology|software|fintech|financial technology|cybersecurity|saas/.test(value)) {
    return "product";
  }
  if (/retail|healthcare|insurance|financial services|media|telecommunications|energy|utilities/.test(value)) {
    return "hybrid";
  }
  return "unknown";
}

function buildExistingIndex(companies) {
  const slugs = new Set(companies.map((c) => c.slug));
  const normalizedNames = new Map();
  for (const company of companies) {
    normalizedNames.set(normalizeName(company.name), company.slug);
    const base = company.slug.replace(/-india$/, "");
    if (base !== company.slug) {
      normalizedNames.set(normalizeName(base.replace(/-/g, " ")), company.slug);
    }
  }
  return { slugs, normalizedNames };
}

function isAlreadyDone(entry, index) {
  const slug = slugify(entry.name);
  const normalized = normalizeName(entry.name);

  if (index.slugs.has(slug)) return true;
  if (index.slugs.has(`${slug}-india`)) return true;

  for (const existingSlug of index.slugs) {
    if (existingSlug.replace(/-india$/, "") === slug) return true;
    if (slug.startsWith(`${existingSlug}-`) || existingSlug.startsWith(`${slug}-`)) {
      if (existingSlug.endsWith("-india") || slug.endsWith("-india")) return true;
    }
  }

  const aliasSlug = ALIAS_TO_EXISTING_SLUG[normalized] ?? ALIAS_TO_EXISTING_SLUG[slug];
  if (aliasSlug && index.slugs.has(aliasSlug)) return true;

  if (index.normalizedNames.has(normalized)) return true;

  // First token match for well-known brands (e.g. Cognizant Technology Solutions -> cognizant)
  const firstToken = normalized.split(" ")[0];
  if (firstToken.length >= 4) {
    for (const existingSlug of index.slugs) {
      if (existingSlug === firstToken || existingSlug.startsWith(`${firstToken}-`)) return true;
      if (existingSlug.replace(/-india$/, "") === firstToken) return true;
    }
  }

  return false;
}

function main() {
  const sourcePath = process.argv[2] ?? SOURCE_CANDIDATES.find((path) => {
    try {
      readFileSync(path);
      return true;
    } catch {
      return false;
    }
  });

  if (!sourcePath) {
    console.error("Fortune 500 source file not found. Pass a path or add data/fortune500-2025-source.txt");
    process.exit(1);
  }

  const tableText = readFileSync(sourcePath, "utf8");
  const fortune500 = parseFortune500Table(tableText);

  if (fortune500.length < 400) {
    console.error(`Expected ~500 companies, parsed ${fortune500.length} from ${sourcePath}`);
    process.exit(1);
  }

  const catalog = JSON.parse(readFileSync(join(ROOT, "data", "companies.json"), "utf8"));
  const pipelinePath = join(ROOT, "data", "pipeline.json");
  const pipeline = JSON.parse(readFileSync(pipelinePath, "utf8"));
  const index = buildExistingIndex(catalog.companies);

  const existingPipelineSlugs = new Set([
    ...pipeline.inProgress.map((item) => item.slug),
    ...pipeline.unverified.map((item) => item.slug),
  ]);

  const skipped = [];
  const added = [];

  for (const entry of fortune500) {
    if (isAlreadyDone(entry, index)) {
      skipped.push(entry.name);
      continue;
    }

    const slug = slugify(entry.name);
    if (existingPipelineSlugs.has(slug)) continue;

    const item = {
      name: entry.name,
      slug,
      category: inferCategory(entry.industry),
      note: `Fortune 500 #${entry.rank} (2025) — research profile from official sources`,
    };

    pipeline.inProgress.push(item);
    existingPipelineSlugs.add(slug);
    added.push(item);
  }

  writeFileSync(pipelinePath, JSON.stringify(pipeline, null, 2) + "\n");

  console.log(`Fortune 500 parsed: ${fortune500.length}`);
  console.log(`Skipped (already in catalog): ${skipped.length}`);
  console.log(`Added to pipeline.inProgress: ${added.length}`);
  console.log(`Pipeline totals: inProgress=${pipeline.inProgress.length}, unverified=${pipeline.unverified.length}`);
  if (skipped.length) {
    console.log(`Skipped examples: ${skipped.slice(0, 15).join(", ")}${skipped.length > 15 ? "…" : ""}`);
  }
}

main();
