"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CATEGORY_COUNTS,
  CATEGORY_LABELS,
  CATALOG_PROGRESS,
  VERIFIED_COMPANIES,
  type CompanyCategory,
} from "@/lib/companies";
import { filterCompanies } from "@/lib/company-search";
import { CompanyListRowFromEntry, CompanyTileFromEntry } from "@/components/CompanyCard";
import { AlphabetIndex, groupCompaniesByLetter } from "@/components/AlphabetIndex";
import { AdSlot } from "@/components/AdSense";

type ViewMode = "tiles" | "list";

const CATEGORY_OPTIONS: Array<{ id: CompanyCategory | "all"; label: string }> = [
  { id: "all", label: "All types" },
  { id: "product", label: "Product" },
  { id: "service", label: "Service" },
  { id: "hybrid", label: "Hybrid" },
];

const hasPipeline =
  CATALOG_PROGRESS.inProgress + CATALOG_PROGRESS.unverified > 0;

export function CompanyDirectory() {
  const [location, setLocation] = useState("all");
  const [category, setCategory] = useState<CompanyCategory | "all">("all");
  const [view, setView] = useState<ViewMode>("list");

  const locations = useMemo(() => {
    const set = new Set<string>();
    for (const c of VERIFIED_COMPANIES) {
      const hq = c.hq.trim();
      if (hq) set.add(hq);
      const city = hq.split(",")[0]?.trim();
      if (city) set.add(city);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  const results = useMemo(() => {
    const filters = {
      location: location === "all" ? undefined : location,
      category,
    };

    return filterCompanies(VERIFIED_COMPANIES, filters).map((company) => ({
      slug: company.slug,
      name: company.name,
      verificationStatus: company.verificationStatus,
      category: company.category,
      tagline: company.tagline,
      hq: company.hq,
      domains: company.domains,
      tags: company.tags,
      profile: company,
    }));
  }, [location, category]);

  const grouped = useMemo(() => groupCompaniesByLetter(results), [results]);

  const availableLetters = useMemo(
    () => new Set(grouped.map((g) => g.letter)),
    [grouped],
  );

  return (
    <div className="companies-page">
      <div className="companies-toolbar-sticky">
        <div className="companies-toolbar companies-toolbar-filters-only">
          {!hasPipeline && (
            <p className="companies-toolbar-hint">
              Browse <strong>{CATEGORY_COUNTS.total} verified</strong> companies — sorted A–Z.
              Use the letter rail on the right to jump to any section.
            </p>
          )}
          {hasPipeline && (
            <p className="companies-toolbar-hint">
              Filters below apply to the <strong>{CATEGORY_COUNTS.total} verified</strong> companies in this
              directory. Header search can also find{" "}
              <strong>{CATALOG_PROGRESS.inProgress + CATALOG_PROGRESS.unverified}</strong> names still in our
              verification queue.
            </p>
          )}
          <div className="companies-toolbar-filters">
            <label className="filter-select-wrap">
              <span className="filter-select-label">Location</span>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-label="Filter by location"
              >
                <option value="all">All locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc.toLowerCase()}>
                    {loc}
                  </option>
                ))}
              </select>
            </label>
            <label className="filter-select-wrap">
              <span className="filter-select-label">Type</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CompanyCategory | "all")}
                aria-label="Filter by company type"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="view-toggle" role="group" aria-label="View mode">
            <button
              type="button"
              className={view === "tiles" ? "active" : ""}
              onClick={() => setView("tiles")}
              aria-pressed={view === "tiles"}
            >
              Tiles
            </button>
            <button
              type="button"
              className={view === "list" ? "active" : ""}
              onClick={() => setView("list")}
              aria-pressed={view === "list"}
            >
              List
            </button>
          </div>
        </div>
        <p className="companies-results-bar">
          Showing <strong>{results.length}</strong> of {CATEGORY_COUNTS.total} verified companies
          {category !== "all" && <> · {CATEGORY_LABELS[category]}</>}
          {location !== "all" && <> · {location}</>}
        </p>
      </div>

      <AdSlot />

      {results.length === 0 ? (
        <div className="empty-state">
          <p>No companies match your filters.</p>
          <Link href="/submit" className="app-btn primary">
            Request this company
          </Link>
        </div>
      ) : (
        <div className="companies-directory-layout">
          <div className="companies-directory-main">
            {grouped.map(({ letter, items }) => (
              <section
                key={letter}
                id={`companies-${letter}`}
                className="companies-alpha-section"
                aria-labelledby={`companies-heading-${letter}`}
              >
                <h2 id={`companies-heading-${letter}`} className="companies-alpha-letter">
                  {letter}
                </h2>
                {view === "tiles" ? (
                  <ul className="company-tile-grid">
                    {items.map((entry) => (
                      <li key={entry.slug}>
                        <CompanyTileFromEntry entry={entry} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="company-list">
                    {items.map((entry) => (
                      <li key={entry.slug}>
                        <CompanyListRowFromEntry entry={entry} />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
          <AlphabetIndex availableLetters={availableLetters} />
        </div>
      )}
    </div>
  );
}
