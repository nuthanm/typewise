"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CATALOG_PROGRESS,
  CATALOG_UPDATED,
  CATEGORY_LABELS,
  PIPELINE_IN_PROGRESS,
  PIPELINE_UNVERIFIED,
  type CompanyCategory,
  type VerificationStatus,
} from "@/lib/companies";
import {
  filterCompanyEntries,
  pipelineToEntry,
  type CompanySearchEntry,
} from "@/lib/company-search";
import { VerificationStatusTag } from "@/components/VerificationStatusTag";
import { IconCompanies, IconSubmit } from "@/components/PortalIcons";

const PAGE_SIZE = 20;

const CATEGORY_OPTIONS: Array<{ id: CompanyCategory | "all"; label: string }> = [
  { id: "all", label: "All types" },
  { id: "product", label: "Product" },
  { id: "service", label: "Service" },
  { id: "hybrid", label: "Hybrid" },
];

const STATUS_OPTIONS: Array<{ id: VerificationStatus | "all"; label: string }> = [
  { id: "all", label: "All statuses" },
  { id: "in_progress", label: "In progress" },
  { id: "unverified", label: "Awaiting review" },
];

function formatCatalogDate(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function categoryClass(category: CompanyCategory) {
  if (category === "product") return "tag product";
  if (category === "service") return "tag service";
  if (category === "hybrid") return "tag hybrid";
  return "tag";
}

function buildPipelineEntries(): CompanySearchEntry[] {
  return [
    ...PIPELINE_IN_PROGRESS.map((item) => pipelineToEntry(item, "in_progress")),
    ...PIPELINE_UNVERIFIED.map((item) => pipelineToEntry(item, "unverified")),
  ].sort((a, b) => a.name.localeCompare(b.name));
}

type StatTileProps = {
  label: string;
  value: number;
  detail?: string;
  status?: VerificationStatus;
  active?: boolean;
  onClick?: () => void;
};

function StatTile({ label, value, detail, status, active, onClick }: StatTileProps) {
  const className = [
    "pipeline-stat",
    status === "verified" ? "verified" : "",
    status === "in_progress" ? "in-progress" : "",
    status === "unverified" ? "unverified" : "",
    status === undefined ? "total" : "",
    active ? "active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {status && <VerificationStatusTag status={status} size="sm" />}
      <strong>{value}</strong>
      <h3>{label}</h3>
      {detail && <p>{detail}</p>}
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick} aria-pressed={active}>
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
}

export function PipelineQueue() {
  const allEntries = useMemo(() => buildPipelineEntries(), []);
  const totalInQueue = CATALOG_PROGRESS.inProgress + CATALOG_PROGRESS.unverified;

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CompanyCategory | "all">("all");
  const [status, setStatus] = useState<VerificationStatus | "all">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      filterCompanyEntries(allEntries, {
        query,
        category,
        status,
      }),
    [allEntries, query, category, status],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filtered.length);

  function updateStatus(next: VerificationStatus | "all") {
    setStatus(next);
    setPage(1);
  }

  function updateCategory(next: CompanyCategory | "all") {
    setCategory(next);
    setPage(1);
  }

  function updateQuery(next: string) {
    setQuery(next);
    setPage(1);
  }

  if (totalInQueue === 0) return null;

  return (
    <section className="pipeline-dashboard" aria-labelledby="pipeline-dashboard-title">
      <div className="pipeline-dashboard-head">
        <h2 id="pipeline-dashboard-title">Review queue</h2>
        <p>
          {totalInQueue} companies we are tracking before they become verified profiles. Filter,
          browse, or click a row to see status and suggest official sources.
        </p>
      </div>

      <div className="pipeline-stat-row" aria-label="Catalog counts">
        <Link href="/companies" className="pipeline-stat verified pipeline-stat-link">
          <VerificationStatusTag status="verified" size="sm" />
          <strong>{CATALOG_PROGRESS.verified}</strong>
          <h3>Verified</h3>
          <p>As on {formatCatalogDate(CATALOG_UPDATED)}</p>
        </Link>
        <StatTile
          label="In progress"
          value={CATALOG_PROGRESS.inProgress}
          status="in_progress"
          active={status === "in_progress"}
          onClick={() => updateStatus(status === "in_progress" ? "all" : "in_progress")}
        />
        <StatTile
          label="Awaiting review"
          value={CATALOG_PROGRESS.unverified}
          status="unverified"
          active={status === "unverified"}
          onClick={() => updateStatus(status === "unverified" ? "all" : "unverified")}
        />
        <StatTile
          label="Total in queue"
          value={totalInQueue}
          detail="In progress + awaiting review"
          active={status === "all"}
          onClick={() => updateStatus("all")}
        />
      </div>

      <div className="pipeline-toolbar">
        <label className="pipeline-search">
          <span className="filter-select-label">Search</span>
          <input
            type="search"
            value={query}
            onChange={(e) => updateQuery(e.target.value)}
            placeholder="Search by company name or note…"
            aria-label="Search review queue"
          />
        </label>
        <div className="pipeline-toolbar-filters">
          <label className="filter-select-wrap">
            <span className="filter-select-label">Status</span>
            <select
              value={status}
              onChange={(e) => updateStatus(e.target.value as VerificationStatus | "all")}
              aria-label="Filter by status"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="filter-select-wrap">
            <span className="filter-select-label">Type</span>
            <select
              value={category}
              onChange={(e) => updateCategory(e.target.value as CompanyCategory | "all")}
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
      </div>

      <p className="pipeline-results-bar">
        Showing <strong>{rangeStart}–{rangeEnd}</strong> of <strong>{filtered.length}</strong> in
        queue
        {status !== "all" && <> · {STATUS_OPTIONS.find((o) => o.id === status)?.label}</>}
        {category !== "all" && <> · {CATEGORY_LABELS[category]}</>}
        {query.trim() && <> · matching “{query.trim()}”</>}
      </p>

      <div className="pipeline-grid-wrap">
        <table className="pipeline-grid">
          <thead>
            <tr>
              <th scope="col">Company</th>
              <th scope="col">Type</th>
              <th scope="col">Status</th>
              <th scope="col">Note</th>
              <th scope="col">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="pipeline-grid-empty">
                  No companies match your filters.
                </td>
              </tr>
            ) : (
              pageItems.map((entry) => (
                <tr key={entry.slug} className={`pipeline-grid-row status-${entry.verificationStatus}`}>
                  <td className="pipeline-grid-name">
                    <Link href={`/companies/${entry.slug}`}>{entry.name}</Link>
                  </td>
                  <td>
                    {entry.category !== "unknown" ? (
                      <span className={categoryClass(entry.category)}>
                        {CATEGORY_LABELS[entry.category]}
                      </span>
                    ) : (
                      <span className="pipeline-grid-muted">—</span>
                    )}
                  </td>
                  <td>
                    <VerificationStatusTag status={entry.verificationStatus} size="sm" />
                  </td>
                  <td className="pipeline-grid-note">{entry.note ?? entry.tagline ?? "—"}</td>
                  <td className="pipeline-grid-action">
                    <Link href={`/companies/${entry.slug}`} className="catalog-pipeline-action">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="pipeline-pagination" aria-label="Review queue pages">
          <button
            type="button"
            className="pipeline-page-btn"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, Math.min(p, totalPages) - 1))}
          >
            Previous
          </button>
          <span className="pipeline-page-info">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            type="button"
            className="pipeline-page-btn"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, Math.min(p, totalPages) + 1))}
          >
            Next
          </button>
        </nav>
      )}

      <div className="pipeline-actions">
        <Link href="/companies" className="landing-btn primary">
          <IconCompanies size={16} />
          Verified companies
        </Link>
        <Link href="/submit" className="landing-btn secondary">
          <IconSubmit size={16} />
          Submit
        </Link>
      </div>
    </section>
  );
}
