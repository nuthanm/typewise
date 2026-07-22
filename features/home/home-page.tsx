"use client";

import Link from "next/link";
import {
  CATALOG_PROGRESS,
  CATALOG_UPDATED,
  CATEGORY_COUNTS,
  CATEGORY_LABELS,
  DATA_YEAR,
  VERIFIED_COMPANIES,
} from "@/lib/companies";
import { CatalogProgress } from "@/components/CatalogProgress";
import { DataNotice } from "@/components/DataNotice";
import { VerificationStatusTag } from "@/components/VerificationStatusTag";
import {
  IconBrief,
  IconCompanies,
  IconGlobe,
  IconSubmit,
  IconUsers,
} from "@/components/PortalIcons";

const TRUST_PILLARS = [
  {
    title: "Manual verification",
    body: "Every verified profile is checked by a human against official company pages — not scraped blindly.",
    icon: IconUsers,
  },
  {
    title: "Source-linked data",
    body: "Headcount, work model, and company type link back to public sources you can open and verify yourself.",
    icon: IconGlobe,
  },
  {
    title: "Community corrections",
    body: "Spot something outdated? Submit an edit without sign-in — we review against official sources before updating.",
    icon: IconSubmit,
  },
] as const;

function categoryClass(category: (typeof VERIFIED_COMPANIES)[number]["category"]) {
  if (category === "product") return "tag product";
  if (category === "service") return "tag service";
  if (category === "hybrid") return "tag hybrid";
  return "tag";
}

export function HomePage() {
  const featured = VERIFIED_COMPANIES.slice(0, 3);
  const verifiedPercent = Math.round(
    (CATALOG_PROGRESS.verified / CATALOG_PROGRESS.totalTracked) * 100,
  );

  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <span className="landing-eyebrow">India company directory · {DATA_YEAR}</span>
          <h1>
            Know if a company is product or service
            <span>before you apply</span>
          </h1>
          <p className="landing-lead">
            Typewise helps job seekers understand what kind of company they are joining — with
            manually verified profiles, official source links, and clear product vs service labels.
          </p>
          <div className="landing-hero-actions">
            <Link href="/companies" className="landing-btn primary">
              Browse {CATEGORY_COUNTS.total} verified companies
            </Link>
            <Link href="/brief" className="landing-btn secondary">
              Read the brief
            </Link>
          </div>
          <ul className="landing-trust-chips" aria-label="Trust signals">
            <li>No sign-in required</li>
            <li>Official sources only</li>
            <li>Updated {CATALOG_UPDATED}</li>
          </ul>
        </div>

        <aside className="landing-hero-panel" aria-label="Catalog snapshot">
          <div className="landing-panel-head">
            <span className="landing-panel-label">Live catalog</span>
            <VerificationStatusTag status="verified" size="sm" />
          </div>
          <div className="landing-panel-score">
            <strong>{CATALOG_PROGRESS.verified}</strong>
            <span>verified companies live today</span>
          </div>
          <div className="landing-progress-track" aria-hidden="true">
            <div className="landing-progress-fill" style={{ width: `${verifiedPercent}%` }} />
          </div>
          <p className="landing-panel-meta">
            {verifiedPercent}% of {CATALOG_PROGRESS.totalTracked} tracked names are fully published ·{" "}
            {CATALOG_PROGRESS.inProgress} in progress · {CATALOG_PROGRESS.unverified} awaiting review
          </p>
          <div className="landing-panel-stats">
            <div>
              <strong>{CATEGORY_COUNTS.product}</strong>
              <span>Product</span>
            </div>
            <div>
              <strong>{CATEGORY_COUNTS.service}</strong>
              <span>Service</span>
            </div>
            <div>
              <strong>{CATEGORY_COUNTS.hybrid}</strong>
              <span>Hybrid</span>
            </div>
          </div>
          <Link href="/companies" className="landing-panel-link">
            <IconCompanies size={16} />
            Explore directory
          </Link>
        </aside>
      </section>

      <section className="landing-trust-row" aria-label="How Typewise works">
        {TRUST_PILLARS.map(({ title, body, icon: Icon }) => (
          <article key={title} className="landing-trust-card">
            <span className="landing-trust-icon" aria-hidden="true">
              <Icon size={20} />
            </span>
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </section>

      <section className="landing-featured" aria-labelledby="featured-heading">
        <div className="landing-section-head">
          <div>
            <h2 id="featured-heading">Featured verified profiles</h2>
            <p>Real companies with source-linked data — not dummy listings.</p>
          </div>
          <Link href="/companies" className="landing-text-link">
            View all →
          </Link>
        </div>
        <ul className="landing-featured-grid">
          {featured.map((company) => (
            <li key={company.slug}>
              <Link href={`/companies/${company.slug}`} className="landing-company-card">
                <div className="landing-company-card-top">
                  <h3>{company.name}</h3>
                  <VerificationStatusTag status="verified" size="sm" />
                </div>
                <p>{company.tagline}</p>
                <div className="landing-company-card-meta">
                  <span className={categoryClass(company.category)}>
                    {CATEGORY_LABELS[company.category]}
                  </span>
                  <span>{company.hq.split(",")[0]?.trim()}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <DataNotice />
      <CatalogProgress />

      <section className="landing-cta">
        <div className="landing-cta-copy">
          <h2>Help us keep this catalog honest</h2>
          <p>
            Missing a company or see outdated info? Submit a request — we validate every change
            against official pages before publishing.
          </p>
        </div>
        <div className="landing-cta-actions">
          <Link href="/submit" className="landing-btn primary">
            <IconSubmit size={16} />
            Submit add / edit
          </Link>
          <Link href="/brief" className="landing-btn secondary">
            <IconBrief size={16} />
            The Brief
          </Link>
        </div>
      </section>
    </div>
  );
}
