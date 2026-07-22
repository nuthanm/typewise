"use client";

import Link from "next/link";
import { CATEGORY_COUNTS, SAMPLE_COMPANIES } from "@/lib/mockData";

export default function PrototypeLandingPage() {
  return (
    <div className="proto-landing">
      <header className="proto-landing-nav">
        <Link href="/prototype" className="proto-brand">
          Type<span>wise</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/" className="proto-text-link hidden sm:inline">← Stakeholder brief</Link>
          <button type="button" className="proto-btn-outline">Sign in</button>
          <button type="button" className="proto-btn-primary">Browse companies →</button>
        </div>
      </header>

      <section className="proto-hero">
        <div className="proto-hero-copy">
          <span className="proto-hero-badge">Product vs service · searchable directory</span>
          <h1>
            Know your company type.
            <span> Apply with clarity.</span>
          </h1>
          <p>
            Search any company and instantly see whether it builds products or delivers client
            services — with leadership, locations, interview patterns, and a direct careers link.
          </p>
          <div className="proto-hero-actions">
            <button type="button" className="proto-btn-primary lg">Search companies →</button>
            <button type="button" className="proto-btn-outline lg">Browse by category</button>
          </div>
          <div className="proto-hero-stats">
            <div>
              <strong>847</strong>
              <span>Product-based</span>
            </div>
            <div>
              <strong>1,204</strong>
              <span>Service-based</span>
            </div>
            <div>
              <strong>3,431</strong>
              <span>Total indexed</span>
            </div>
          </div>
        </div>
        <div className="proto-hero-visual">
          <div className="proto-search-card">
            <label className="proto-search-label">Search company</label>
            <input className="proto-search-input" placeholder="Razorpay, TCS, Zoho…" readOnly defaultValue="Razorpay" />
            <div className="proto-category-grid">
              {CATEGORY_COUNTS.slice(0, 6).map((c) => (
                <div key={c.label} className="proto-category-chip">
                  <strong>{c.count.toLocaleString("en-IN")}</strong>
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="proto-section">
        <h2>Featured companies</h2>
        <p className="proto-section-desc">Sample profiles from the curated directory — click through to full detail in the real app.</p>
        <div className="proto-company-grid">
          {SAMPLE_COMPANIES.map((c) => (
            <article key={c.name} className="proto-company-card">
              <div className="flex items-center justify-between gap-2">
                <h3>{c.name}</h3>
                <span className={`proto-type-badge ${c.type.includes("Product") ? "product" : "service"}`}>{c.type}</span>
              </div>
              <p>{c.domain} · {c.hq}</p>
              <div className="proto-card-meta">
                <span>{c.india} in India</span>
                <span>View profile →</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="proto-cta-band">
        <h2>This is a prototype — not the live product</h2>
        <p>Return to the stakeholder brief to review feasibility, costs, and the full 13-slide deck.</p>
        <Link href="/" className="proto-btn-primary lg">← Back to stakeholder brief</Link>
      </section>

      <footer className="proto-landing-foot">
        <span>Typewise prototype · July 2026</span>
        <Link href="/">Return to stakeholder brief</Link>
      </footer>
    </div>
  );
}
