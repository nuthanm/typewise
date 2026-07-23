import {
  companyMatchesLocation,
  type CompanyCategory,
  type CompanyProfile,
  type PipelineItem,
  type VerificationStatus,
} from "./companies";

export type CompanySearchFilters = {
  query?: string;
  location?: string;
  category?: CompanyCategory | "all";
  status?: VerificationStatus | "all" | "pipeline";
};

/** Unified row for directory search — verified profiles and pipeline queue items */
export type CompanySearchEntry = {
  slug: string;
  name: string;
  verificationStatus: VerificationStatus;
  category: CompanyCategory;
  tagline?: string;
  hq?: string;
  domains?: string[];
  tags?: string[];
  note?: string;
  /** Full profile when verified */
  profile?: CompanyProfile;
};

export function companyProfileToEntry(company: CompanyProfile): CompanySearchEntry {
  return {
    slug: company.slug,
    name: company.name,
    verificationStatus: company.verificationStatus,
    category: company.category,
    tagline: company.tagline,
    hq: company.hq,
    domains: company.domains,
    tags: company.tags,
    profile: company,
  };
}

export function pipelineToEntry(
  item: PipelineItem,
  verificationStatus: "in_progress" | "unverified",
): CompanySearchEntry {
  return {
    slug: item.slug,
    name: item.name,
    verificationStatus,
    category: item.category ?? "unknown",
    tagline: item.note,
    note: item.note,
  };
}

export function getCompanyLocations(companies: CompanyProfile[]) {
  const set = new Set<string>();
  for (const c of companies) {
    const hq = c.hq.trim();
    if (hq) set.add(hq);
    const city = hq.split(",")[0]?.trim();
    if (city) set.add(city);
    for (const officeCity of c.officeCities ?? []) {
      const trimmed = officeCity.trim();
      if (trimmed) set.add(trimmed);
    }
    for (const country of c.officeCountries ?? []) {
      const trimmed = country.trim();
      if (trimmed) set.add(trimmed);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function filterCompanies(companies: CompanyProfile[], filters: CompanySearchFilters) {
  const q = filters.query?.trim().toLowerCase() ?? "";
  const loc = filters.location?.trim().toLowerCase() ?? "";
  const category = filters.category ?? "all";

  return companies.filter((c) => {
    if (category !== "all" && c.category !== category) return false;

    if (loc && loc !== "all" && !companyMatchesLocation(c, loc)) return false;

    if (!q) return true;

    const haystack = [
      c.name,
      c.tagline,
      c.description,
      c.hq,
      ...c.domains,
      ...c.tags,
      ...(c.products ?? []),
      ...(c.services ?? []),
      ...(c.officeCities ?? []),
      ...(c.officeCountries ?? []),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}

function entryHaystack(entry: CompanySearchEntry) {
  return [
    entry.name,
    entry.slug,
    entry.tagline,
    entry.note,
    entry.hq,
    ...(entry.domains ?? []),
    ...(entry.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function filterCompanyEntries(entries: CompanySearchEntry[], filters: CompanySearchFilters) {
  const q = filters.query?.trim().toLowerCase() ?? "";
  const loc = filters.location?.trim().toLowerCase() ?? "";
  const category = filters.category ?? "all";
  const status = filters.status ?? "all";

  return entries.filter((entry) => {
    if (status === "pipeline" && entry.verificationStatus === "verified") return false;
    if (
      status !== "all" &&
      status !== "pipeline" &&
      entry.verificationStatus !== status
    ) {
      return false;
    }

    if (category !== "all" && entry.category !== category) return false;

    if (loc && loc !== "all") {
      const matchesHq = (entry.hq ?? "").toLowerCase().includes(loc);
      const matchesOffices = (entry.profile?.officeCities ?? []).some((city) =>
        city.toLowerCase().includes(loc),
      );
      const matchesCountries = (entry.profile?.officeCountries ?? []).some((country) =>
        country.toLowerCase().includes(loc),
      );
      if (!matchesHq && !matchesOffices && !matchesCountries) return false;
    }

    if (!q) return true;

    return entryHaystack(entry).includes(q);
  });
}
