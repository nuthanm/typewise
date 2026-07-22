import catalog from "@/data/companies.json";
import pipeline from "@/data/pipeline.json";
import {
  companyProfileToEntry,
  filterCompanies,
  filterCompanyEntries,
  pipelineToEntry,
  type CompanySearchEntry,
} from "./company-search";

export type CompanyCategory = "product" | "service" | "hybrid" | "unknown";
export type VerificationStatus = "verified" | "in_progress" | "unverified";

export type DataSource = {
  label: string;
  url: string;
};

export type CompanyProfile = {
  slug: string;
  name: string;
  category: CompanyCategory;
  tagline: string;
  description: string;
  website: string;
  founded?: string;
  hq: string;
  headcountIndia?: string;
  headcountGlobal?: string;
  headcountNote?: string;
  domains: string[];
  tags: string[];
  products?: string[];
  services?: string[];
  clients?: string[];
  onsitePolicy?: string;
  careersUrl?: string;
  linkedin?: string;
  twitter?: string;
  interviewPatterns?: string[];
  interviewPatternsNote?: string;
  leadership?: { name: string; role: string }[];
  vision?: string;
  lastVerified: string;
  verificationStatus: VerificationStatus;
  sources: DataSource[];
};

export type PipelineItem = {
  name: string;
  slug: string;
  category?: CompanyCategory;
  note: string;
};

export const CATEGORY_LABELS: Record<CompanyCategory, string> = {
  product: "Product-based",
  service: "Service-based",
  hybrid: "Hybrid",
  unknown: "Uncategorized",
};

export const VERIFICATION_LABELS: Record<VerificationStatus, string> = {
  verified: "Verified",
  in_progress: "In progress",
  unverified: "Awaiting review",
};

export const DATA_YEAR = catalog.dataYear;
export const CATALOG_UPDATED = catalog.catalogUpdated;
export const CATALOG_DISCLAIMER = catalog.disclaimer;

export const COMPANIES: CompanyProfile[] = catalog.companies as CompanyProfile[];

export const PIPELINE_IN_PROGRESS = pipeline.inProgress as PipelineItem[];
export const PIPELINE_UNVERIFIED = pipeline.unverified as PipelineItem[];

function countByCategory(list: CompanyProfile[]) {
  const counts = { product: 0, service: 0, hybrid: 0, unknown: 0, total: 0 };
  for (const c of list) {
    counts[c.category] += 1;
    counts.total += 1;
  }
  return counts;
}

export const VERIFIED_COMPANIES = COMPANIES.filter((c) => c.verificationStatus === "verified");

export const ALL_SEARCH_ENTRIES: CompanySearchEntry[] = [
  ...COMPANIES.map(companyProfileToEntry),
  ...PIPELINE_IN_PROGRESS.map((item) => pipelineToEntry(item, "in_progress")),
  ...PIPELINE_UNVERIFIED.map((item) => pipelineToEntry(item, "unverified")),
];

export const ALL_COMPANY_SLUGS = ALL_SEARCH_ENTRIES.map((e) => e.slug);

export const CATEGORY_COUNTS = countByCategory(VERIFIED_COMPANIES);

export const CATALOG_PROGRESS = {
  verified: VERIFIED_COMPANIES.length,
  inProgress: PIPELINE_IN_PROGRESS.length,
  unverified: PIPELINE_UNVERIFIED.length,
  totalTracked:
    VERIFIED_COMPANIES.length + PIPELINE_IN_PROGRESS.length + PIPELINE_UNVERIFIED.length,
};

export function getCompanyBySlug(slug: string) {
  const company = COMPANIES.find((c) => c.slug === slug);
  if (!company || company.verificationStatus !== "verified") return undefined;
  return company;
}

export function getCompanyEntryBySlug(slug: string): CompanySearchEntry | undefined {
  return ALL_SEARCH_ENTRIES.find((e) => e.slug === slug);
}

export function searchCompanies(
  query: string,
  category?: CompanyCategory | "all",
  location?: string,
) {
  return filterCompanies(VERIFIED_COMPANIES, { query, category, location });
}

export function searchAllCompanies(
  query: string,
  category?: CompanyCategory | "all",
  location?: string,
) {
  return filterCompanyEntries(ALL_SEARCH_ENTRIES, { query, category, location });
}

export function slugifyCompanyName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** @deprecated use COMPANIES */
export const SAMPLE_COMPANIES = VERIFIED_COMPANIES;
