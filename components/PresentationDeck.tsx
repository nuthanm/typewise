"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AreaLineChart } from "@/components/charts/AreaLineChart";
import { BarChartSimple } from "@/components/charts/BarChartSimple";
import { generateDirectoryGrowthCurve } from "@/lib/chartData";
import {
  CATEGORY_COUNTS,
  COMPETITIVE_MATRIX,
  COVERAGE_COMPARISON,
  DIFFERENTIATION_MECHANISMS,
  SAMPLE_COMPANIES,
} from "@/lib/mockData";

const SLIDE_COUNT = 15;

function Stars({ count }: { count: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? "pres-star-filled pres-star" : "pres-star"}>★</span>
      ))}
    </span>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function PresentationDeck() {
  const [slide, setSlide] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [exiting, setExiting] = useState(false);
  const progress = ((slide + 1) / SLIDE_COUNT) * 100;

  const go = useCallback(
    (next: number) => {
      if (next < 0 || next >= SLIDE_COUNT || next === slide) return;
      setExiting(true);
      window.setTimeout(() => {
        setSlide(next);
        setAnimKey((k) => k + 1);
        setExiting(false);
      }, 220);
    },
    [slide],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.altKey) return;
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        go(slide + 1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(slide - 1);
      }
      if (e.key === "Home") go(0);
      if (e.key === "End") go(SLIDE_COUNT - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, slide]);

  return (
    <div className="pres-root">
      <div className="pres-progress" aria-hidden>
        <div className="pres-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="pres-shell">
        <header className="pres-header">
          <Link href="/" className="pres-logo" aria-label="Typewise home — back to landing page">
            Type<span>wise</span>
          </Link>
          <div className="flex items-center gap-3 text-xs font-semibold text-[var(--ink-faint)]">
            <span className="hidden sm:inline">Stakeholder Brief · July 2026</span>
            <span>{slide + 1} / {SLIDE_COUNT}</span>
          </div>
        </header>

        <main className="pres-stage">
          <div key={animKey} className={cn("pres-slide", exiting && "pres-slide-out")}>
            {slide === 0 && <SlideTitle />}
            {slide === 1 && <SlideProblem />}
            {slide === 2 && <SlideVision />}
            {slide === 3 && <SlideMarket />}
            {slide === 4 && <SlideCompetitors />}
            {slide === 5 && <SlideCompare />}
            {slide === 6 && <SlideDifferentiation />}
            {slide === 7 && <SlideFeatures />}
            {slide === 8 && <SlideJobSeekerValue />}
            {slide === 9 && <SlideVerification />}
            {slide === 10 && <SlideDataCosts />}
            {slide === 11 && <SlideRoadmap />}
            {slide === 12 && <SlideProductVision />}
            {slide === 13 && <SlideFeasibility />}
            {slide === 14 && <SlideAsk />}
          </div>
        </main>
      </div>

      <footer className="pres-footer">
        <button type="button" className="pres-nav-btn" disabled={slide === 0} onClick={() => go(slide - 1)} aria-label="Previous slide">←</button>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => go(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === slide ? "w-6 bg-[var(--profit)]" : "w-1.5 bg-[var(--cream-2)] hover:bg-[var(--profit-soft)]",
              )}
            />
          ))}
        </div>
        {slide < SLIDE_COUNT - 1 ? (
          <button type="button" className="pres-nav-btn" onClick={() => go(slide + 1)} aria-label="Next slide">→</button>
        ) : (
          <div className="flex items-center gap-2">
          <Link href="/companies" className="pres-cta pres-cta-glow">Browse companies →</Link>
            <a href="mailto:inbox.nuthan@gmail.com?subject=Typewise%20-%20Approved%20to%20Proceed" className="pres-cta pres-cta-secondary">Approve →</a>
          </div>
        )}
      </footer>
    </div>
  );
}

function SlideTitle() {
  const barData = CATEGORY_COUNTS.slice(0, 4).map((c) => ({
    label: c.label.split("-")[0].trim().slice(0, 8),
    value: c.count,
    color: c.color,
  }));

  return (
    <div className="pres-stagger text-center">
      <p className="pres-kicker mx-auto">The Brief · Stakeholder Approval</p>
      <h1 className="pres-title mt-5">
        Typewise
        <span className="mt-2 block text-[var(--profit)]">Know your company type. Apply with clarity.</span>
      </h1>
      <p className="pres-subtitle mx-auto">
        A searchable company directory where anyone can instantly see whether a firm is product-based,
        service-based, or hybrid — with verified profiles, careers links, and interview intel.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <span className="pres-pill pres-pill-profit pres-pill-glow">Product vs service filter</span>
        <span className="pres-pill pres-pill-gold">847 product · 1,204 service</span>
        <span className="pres-pill pres-pill-profit">India headcount split</span>
      </div>
      <div className="pres-highlight-card mx-auto mt-10 max-w-lg text-left">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase text-[var(--ink-faint)]">Directory by category</span>
          <span className="pres-live-dot">● Live counts</span>
        </div>
        <div className="pres-mock-pnl mt-1" style={{ color: "var(--gold)" }}>3,431 companies</div>
        <div className="mt-3 h-24">
          <BarChartSimple data={barData} height={96} />
        </div>
      </div>
    </div>
  );
}

function SlideProblem() {
  const pains = [
    ["Product or service — nobody tells you", "Job titles hide the business model. TCS and Razorpay both hire “SDE” but the work is completely different"],
    ["Static blog lists only", "GeeksforGeeks and UpGrad publish “Top 10 product companies” — not searchable, outdated within months"],
    ["Job boards ≠ company intel", "Naukri and Indeed list openings but never answer: does this company build its own product?"],
    ["Scattered research", "LinkedIn for people, Glassdoor for reviews, company site for careers — no single profile page"],
  ];

  return (
    <div className="pres-stagger">
      <p className="pres-kicker">The problem</p>
      <h2 className="pres-title mt-4">Job seekers guess. Researchers hunt. Nobody filters by company type.</h2>
      <p className="pres-subtitle">
        Millions of Indians choose between product-based depth and service-based breadth every year —
        with no dedicated directory to tell them which is which.
      </p>
      <div className="pres-grid-2 mt-8">
        {pains.map(([title, desc]) => (
          <div key={title} className="pres-card border-l-[3px] border-l-[var(--loss)]">
            <div className="text-sm font-extrabold">{title}</div>
            <p className="mt-1 text-[13px] leading-relaxed text-[var(--ink-soft)]">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideVision() {
  const steps = [
    ["01", "Curate", "Hand-pick 150–200 companies with verified type classification"],
    ["02", "Profile", "One page per company: vision, products, leadership, locations"],
    ["03", "Filter", "Search + product/service/hybrid pills on landing and browse"],
    ["04", "Community", "Suggest edits, interview patterns — editorial review before publish"],
  ];

  return (
    <div className="pres-stagger">
      <p className="pres-kicker">Our vision</p>
      <h2 className="pres-title mt-4">The company directory job sites forgot to build</h2>
      <p className="pres-subtitle">
        Not a job board. An information-first site for job seekers, students, parents, journalists,
        and vendors — anyone who needs to understand what a company actually does.
      </p>
      <div className="pres-proof-chain mt-6">
        {["Search company", "See type tag", "Read full profile", "Jump to careers"].map((step, i) => (
          <div key={step} className="pres-proof-chain-step">
            <span className="pres-proof-chain-num">{i + 1}</span>
            <span>{step}</span>
            {i < 3 && <span className="pres-proof-chain-arrow">→</span>}
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {steps.map(([num, title, desc]) => (
          <div key={num} className="pres-card pres-card-highlight flex gap-4 border-l-[3px] border-l-[var(--profit)]">
            <span className="font-serif text-2xl font-bold text-[var(--profit)]">{num}</span>
            <div>
              <div className="text-sm font-extrabold">{title}</div>
              <p className="mt-0.5 text-[13px] text-[var(--ink-soft)]">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideMarket() {
  const growth = generateDirectoryGrowthCurve();

  return (
    <div className="pres-stagger">
      <p className="pres-kicker">Market opportunity</p>
      <h2 className="pres-title mt-4">Every job seeker needs this — repeatedly</h2>
      <div className="pres-grid-3 mt-8">
        <div className="pres-card pres-stat-glow text-center">
          <div className="pres-stat text-[var(--profit)]">12M+</div>
          <p className="pres-stat-label">Annual campus & lateral hires (India tech)</p>
        </div>
        <div className="pres-card pres-stat-glow text-center">
          <div className="pres-stat text-[var(--gold)]">70%</div>
          <p className="pres-stat-label">Freshers confused on product vs service (est.)</p>
        </div>
        <div className="pres-card pres-stat-glow text-center">
          <div className="pres-stat text-[var(--navy-mid)]">0</div>
          <p className="pres-stat-label">Dedicated searchable directories today</p>
        </div>
      </div>
      <div className="pres-card pres-card-highlight mt-6">
        <div className="text-sm font-extrabold">Target directory size (companies indexed)</div>
        <div className="mt-4">
          <AreaLineChart data={growth} height={120} showGrid showYAxis showXAxis formatY={(v) => v.toLocaleString("en-IN")} />
        </div>
      </div>
      <div className="pres-grid-2 mt-6">
        <div className="pres-card">
          <div className="text-sm font-extrabold">Primary users</div>
          <p className="mt-1 text-[13px] text-[var(--ink-soft)]">Job seekers, campus students, career switchers choosing product vs service path</p>
        </div>
        <div className="pres-card">
          <div className="text-sm font-extrabold">Secondary users</div>
          <p className="mt-1 text-[13px] text-[var(--ink-soft)]">Parents, mentors, journalists, vendors, investors doing quick company research</p>
        </div>
      </div>
    </div>
  );
}

function SlideCompetitors() {
  const rows = [
    ["Typewise (planned)", "Product/service filter", "Full profiles", "Interview intel", "India-first", "Free MVP"],
    ["LinkedIn", "No type filter", "Basic company page", "Limited", "Global", "Freemium"],
    ["Glassdoor", "No", "Reviews focus", "Interview reviews", "Global", "Free browse"],
    ["AmbitionBox", "Blog lists only", "Ratings + salary", "Interview exp.", "India", "Free"],
    ["Naukri / Indeed", "Job board", "Job listings", "No", "India", "Employer-paid"],
    ["GeeksforGeeks", "Static articles", "Prep content", "No", "India", "Free editorial"],
    ["Crunchbase", "Startup/funding lens", "Funding data", "No", "Global paid", "₹2K+/mo"],
  ];

  return (
    <div className="pres-stagger">
      <p className="pres-kicker">Competitive landscape</p>
      <h2 className="pres-title mt-4">What exists today — and what they miss</h2>
      <div className="pres-table-wrap mt-6">
        <table className="pres-table">
          <thead>
            <tr>
              <th>Platform</th>
              <th>Type filter</th>
              <th>Profiles</th>
              <th>Interview</th>
              <th>Focus</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, ...rest]) => (
              <tr key={name} className={name.startsWith("Typewise") ? "highlight" : undefined}>
                <td className="font-bold">{name}</td>
                {rest.map((cell, i) => <td key={i}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SlideCompare() {
  return (
    <div className="pres-stagger">
      <p className="pres-kicker">Head-to-head</p>
      <h2 className="pres-title mt-4">Where Typewise wins</h2>
      <div className="mt-6 space-y-3">
        {COVERAGE_COMPARISON.map((row) => (
          <div key={row.label} className="pres-card">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-sm font-extrabold">{row.label}</span>
              <span className="pres-pill pres-pill-profit text-[10px]">Typewise</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-[11px] font-semibold text-[var(--profit)]">Typewise</span>
                <div className="pres-metric-bar flex-1">
                  <div className="pres-metric-fill bg-[var(--profit)]" style={{ width: `${row.typewise}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-[11px] font-semibold text-[var(--ink-faint)]">Best alternative</span>
                <div className="pres-metric-bar flex-1">
                  <div className="pres-metric-fill bg-[var(--cream-2)]" style={{ width: `${row.market}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideDifferentiation() {
  return (
    <div className="pres-stagger">
      <p className="pres-kicker">Why we win · Mechanisms</p>
      <h2 className="pres-title mt-4">How Typewise is different — and why it&apos;s strong</h2>
      <div className="mt-6 space-y-3">
        {DIFFERENTIATION_MECHANISMS.map((m, i) => (
          <div key={m.title} className="pres-card pres-card-highlight pres-mechanism-card">
            <div className="flex flex-wrap items-start gap-3">
              <span className="pres-mechanism-num">{i + 1}</span>
              <div className="flex-1 min-w-[12rem]">
                <div className="text-sm font-extrabold text-[var(--profit)]">{m.title}</div>
                <p className="mt-1 text-[12px] text-[var(--ink-soft)]">
                  <span className="font-bold text-[var(--loss)]">Others: </span>{m.others}
                </p>
                <p className="mt-1 text-[12px]">
                  <span className="font-bold text-[var(--gold)]">Typewise: </span>{m.ours}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideFeatures() {
  const fields = [
    ["Official name & website", "Verified link to company homepage"],
    ["Company type tag", "Product · Service · Hybrid · BPO · Consulting · Startup"],
    ["Vision summary", "Brief about-line sourced from About page or annual report"],
    ["Employee count", "Global vs India split where publicly available"],
    ["Products & links", "What they build + official product URLs"],
    ["Leadership", "Founder, CEO, CTO, key executives"],
    ["Locations", "Office cities + remote/hybrid/on-site policy"],
    ["Careers page", "Direct outbound link — not scraped job listings"],
    ["Interview pattern", "Community-submitted, moderated round structure"],
    ["Social links", "LinkedIn, Glassdoor, Twitter/X official pages"],
  ];

  return (
    <div className="pres-stagger">
      <p className="pres-kicker">Company profile schema</p>
      <h2 className="pres-title mt-4">Everything on one page — mock: Razorpay</h2>
      <div className="pres-table-wrap mt-6">
        <table className="pres-table">
          <thead><tr><th>Field</th><th>Example (Razorpay)</th></tr></thead>
          <tbody>
            {fields.map(([field, example]) => (
              <tr key={field}><td className="font-bold">{field}</td><td>{example}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SlideJobSeekerValue() {
  const today = [
    ["Product or service company?", "Company type tag — the core filter no job board offers"],
    ["Will I build products or serve clients?", "Products, services, and domain tags on one page"],
    ["Is it big enough / stable enough?", "Founded year, India & global headcount with caveats"],
    ["Can I work from my city?", "HQ, hiring cities, and official locations link"],
    ["Remote, hybrid, or office-first?", "Work model policy — sourced from official pages"],
    ["What does this company actually do?", "About, vision, and one-line tagline"],
    ["Who runs it?", "Leadership — founder, CEO, key executives"],
    ["Can I trust this?", "Verified stamp, source links, and last-updated date"],
  ];

  const later = [
    "Interview rounds & difficulty",
    "Salary bands & compensation",
    "Culture & work-life balance",
    "Benefits & perks",
  ];

  return (
    <div className="pres-stagger">
      <p className="pres-kicker">What you get</p>
      <h2 className="pres-title mt-4">Every answer job seekers need — before they apply</h2>
      <p className="pres-subtitle">
        Typewise is not Glassdoor or a job board. It is the step before those — a verified snapshot
        that answers: <strong className="text-[var(--ink)]">&ldquo;Is this the kind of company I actually want to work at?&rdquo;</strong>
      </p>
      <div className="pres-proof-chain mt-6">
        {["Search company", "See type & work model", "Read verified profile", "Jump to careers"].map((step, i) => (
          <div key={step} className="pres-proof-chain-step">
            <span className="pres-proof-chain-num">{i + 1}</span>
            <span>{step}</span>
            {i < 3 && <span className="pres-proof-chain-arrow">→</span>}
          </div>
        ))}
      </div>
      <div className="pres-table-wrap mt-6">
        <table className="pres-table">
          <thead>
            <tr>
              <th>Job seeker asks…</th>
              <th>Typewise answers with…</th>
            </tr>
          </thead>
          <tbody>
            {today.map(([question, answer]) => (
              <tr key={question}>
                <td className="font-bold">{question}</td>
                <td>{answer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pres-grid-2 mt-6">
        <div className="pres-card border-l-[3px] border-l-[var(--profit)]">
          <div className="text-sm font-extrabold text-[var(--profit)]">Live today — first filter</div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--ink-soft)]">
            Product vs service, where they hire, how they work, what they build — enough to narrow
            50 companies down to 5 worth applying to.
          </p>
        </div>
        <div className="pres-card border-l-[3px] border-l-[var(--gold)]">
          <div className="text-sm font-extrabold text-[var(--gold)]">Phase 2 — second-stage decisions</div>
          <ul className="mt-2 space-y-1 text-[13px] text-[var(--ink-soft)]">
            {later.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
          <p className="mt-2 text-[12px] text-[var(--ink-faint)]">Community-moderated · after MVP launch</p>
        </div>
      </div>
    </div>
  );
}

function SlideVerification() {
  const steps = [
    ["1 · Official source", "We open the company About page, careers URL, and product pages — not scraped forums."],
    ["2 · Content match", "Every field (type, HQ, vision, links) must match what the company publishes publicly."],
    ["3 · Source links", "We store the exact URLs used so you can double-check anytime."],
    ["4 · Verified stamp", "Only then the profile goes live with the Typewise Verified badge — browse with confidence."],
  ];

  return (
    <div className="pres-stagger">
      <p className="pres-kicker">Trust model</p>
      <h2 className="pres-title mt-4">
        Manually validated on official pages — then <span className="text-[var(--gold)]">Verified</span>
      </h2>
      <p className="pres-subtitle mt-3 max-w-2xl">
        We never publish guesswork. A human reviewer reads the official website content, confirms each
        field, and only then awards the certified Verified stamp so you can confidently check out a company.
      </p>
      <div className="pres-grid-2 mt-8 items-start">
        <div className="space-y-3">
          {steps.map(([title, desc]) => (
            <div key={title} className="pres-card text-left">
              <div className="text-sm font-extrabold text-[var(--profit)]">{title}</div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--ink-soft)]">{desc}</p>
            </div>
          ))}
        </div>
        <div className="pres-card pres-stat-glow flex flex-col items-center justify-center py-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--gold)] bg-[var(--gold-soft)] px-5 py-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--gold)] text-lg font-black text-white">✓</span>
            <span className="font-extrabold tracking-wide text-[var(--gold)]">VERIFIED</span>
          </div>
          <p className="mt-4 max-w-xs text-[13px] text-[var(--ink-soft)]">
            Appears on every live profile · Data as of {new Date().getFullYear()} · Updated when official sources change
          </p>
          <p className="mt-3 text-[12px] font-bold text-[var(--profit)]">
            In progress & awaiting review — visible on site, not in search until stamped
          </p>
        </div>
      </div>
    </div>
  );
}

function SlideDataCosts() {
  const sources = [
    ["Company website / careers", "Free", "High", "MVP manual curation"],
    ["Wikipedia / Wikidata", "Free", "Medium", "API + manual"],
    ["LinkedIn company pages", "Free browse", "Medium–High", "Manual (API paid at scale)"],
    ["Clearbit / Crunchbase", "$50–500+/mo", "High", "Optional enrichment only"],
    ["Glassdoor scraping", "ToS risk", "Reviews", "Manual entry or partnership"],
  ];

  return (
    <div className="pres-stagger">
      <p className="pres-kicker">Data & costs</p>
      <h2 className="pres-title mt-4">Mostly free to start — paid APIs only at scale</h2>
      <div className="pres-grid-3 mt-8">
        <div className="pres-card pres-stat-glow text-center">
          <div className="pres-stat text-[var(--profit)]">$15–40</div>
          <p className="pres-stat-label">Monthly hosting + domain</p>
        </div>
        <div className="pres-card pres-stat-glow text-center">
          <div className="pres-stat text-[var(--gold)]">$0</div>
          <p className="pres-stat-label">Data cost for MVP (manual)</p>
        </div>
        <div className="pres-card pres-stat-glow text-center">
          <div className="pres-stat text-[var(--navy-mid)]">8–12 wks</div>
          <p className="pres-stat-label">Solo dev MVP timeline</p>
        </div>
      </div>
      <div className="pres-table-wrap mt-6">
        <table className="pres-table">
          <thead><tr><th>Source</th><th>Cost</th><th>Quality</th><th>Phase</th></tr></thead>
          <tbody>
            {sources.map(([s, c, q, p]) => (
              <tr key={s}><td className="font-bold">{s}</td><td>{c}</td><td>{q}</td><td>{p}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SlideRoadmap() {
  return (
    <div className="pres-stagger">
      <p className="pres-kicker">Build plan</p>
      <h2 className="pres-title mt-4">Phased rollout — ship the MVP first</h2>
      <div className="pres-grid-2 mt-8">
        <div className="pres-card border-[var(--gold-soft)] bg-[var(--gold-soft)]/30">
          <div className="text-[11px] font-bold uppercase tracking-wide text-[var(--gold)]">Phase 1 · MVP (8–12 weeks)</div>
          <ul className="mt-3 space-y-1.5 text-[13px] text-[var(--ink-soft)]">
            <li>· Landing + hero search + category counts</li>
            <li>· Browse with product/service/hybrid filters</li>
            <li>· 150 curated company profiles</li>
            <li>· Company detail pages with careers outbound links</li>
            <li>· Supabase database + Vercel hosting</li>
          </ul>
        </div>
        <div className="pres-card border-[var(--profit-soft)] bg-[var(--profit-soft)]/40">
          <div className="text-[11px] font-bold uppercase tracking-wide text-[var(--profit)]">Phase 2 · Growth (months 4–6)</div>
          <ul className="mt-3 space-y-1.5 text-[13px] text-[var(--ink-soft)]">
            <li>· User suggest-an-edit workflow</li>
            <li>· Interview pattern wiki (moderated)</li>
            <li>· Office location map</li>
            <li>· Advanced filters: domain, headcount, work model</li>
            <li>· SEO for “is X product based company”</li>
          </ul>
        </div>
      </div>
      <div className="pres-roadmap mt-6">
        {[
          ["Month 1–2", "Foundation", "Schema, 50 seed companies", "profit"],
          ["Month 3–4", "Launch", "150 profiles, public site", "gold"],
          ["Month 5–6", "Community", "Edits + interview wiki", "profit"],
          ["Month 7+", "Scale", "API enrich, featured listings", "navy"],
        ].map(([when, title, desc, tone]) => (
          <div key={when} className={cn("pres-roadmap-phase", tone === "gold" && "gold", tone === "navy" && "navy")}>
            <div className="text-[10px] font-bold uppercase text-[var(--profit)]">{when}</div>
            <div className="mt-1 text-sm font-extrabold">{title}</div>
            <p className="text-[12px] text-[var(--ink-soft)]">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideProductVision() {
  return (
    <div className="pres-stagger">
      <p className="pres-kicker">Product vision</p>
      <h2 className="pres-title mt-4">What Typewise looks like at launch</h2>
      <div className="pres-mock-app pres-mock-glow mt-6">
        <div className="pres-mock-bar">
          <span>Typewise · Company Directory</span>
          <span className="text-[var(--profit-bright)]">● 3,431 indexed</span>
        </div>
        <div className="pres-mock-body">
          <div className="space-y-3">
            <div className="pres-card !p-3 pres-card-highlight">
              <div className="text-[10px] font-bold uppercase text-[var(--ink-faint)]">Landing · search + categories</div>
              <div className="mt-2 rounded-lg border border-[var(--cream-2)] bg-[var(--cream)] px-3 py-2 text-[12px]">
                Search Razorpay, TCS, Zoho…
              </div>
              <div className="pres-grid-3 mt-3 !gap-2">
                <div className="text-center"><div className="text-lg font-extrabold text-[var(--gold)]">847</div><div className="text-[10px] text-[var(--ink-faint)]">Product</div></div>
                <div className="text-center"><div className="text-lg font-extrabold text-[var(--profit)]">1,204</div><div className="text-[10px] text-[var(--ink-faint)]">Service</div></div>
                <div className="text-center"><div className="text-lg font-extrabold text-[var(--service)]">312</div><div className="text-[10px] text-[var(--ink-faint)]">Hybrid</div></div>
              </div>
            </div>
            <div className="pres-card !p-3">
              <div className="text-[10px] font-bold uppercase text-[var(--ink-faint)]">Filter pills</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {["All", "Product", "Service", "Hybrid", "Fintech", "SaaS"].map((p) => (
                  <span key={p} className="pres-pill pres-pill-profit text-[10px]">{p}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {SAMPLE_COMPANIES.slice(0, 3).map((c) => (
              <div key={c.name} className="pres-card !p-3 border-l-[3px] border-l-[var(--profit)]">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold">{c.name}</div>
                  <span className={cn("pres-pill text-[10px]", c.type.includes("Product") ? "pres-pill-gold" : "pres-pill-profit")}>{c.type}</span>
                </div>
                <p className="text-[12px] text-[var(--ink-soft)]">{c.domain} · {c.india} India · {c.hq}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SlideFeasibility() {
  return (
    <div className="pres-stagger">
      <p className="pres-kicker">Feasibility</p>
      <h2 className="pres-title mt-4">Honest assessment — highly buildable</h2>
      <div className="pres-grid-2 mt-8">
        <div className="pres-card border-l-[3px] border-l-[var(--loss)]">
          <div className="text-sm font-extrabold text-[var(--loss)]">Hard parts</div>
          <ul className="mt-2 space-y-1.5 text-[13px] text-[var(--ink-soft)]">
            <li>· Keeping 500+ profiles fresh without a research team</li>
            <li>· India vs global headcount — often estimated, not exact</li>
            <li>· Interview patterns need moderation to avoid spam</li>
            <li>· Client lists rarely public for service companies</li>
          </ul>
        </div>
        <div className="pres-card border-l-[3px] border-l-[var(--gold)]">
          <div className="text-sm font-extrabold text-[var(--gold)]">Easy wins for MVP</div>
          <ul className="mt-2 space-y-1.5 text-[13px] text-[var(--ink-soft)]">
            <li>· Type classification for top 150 companies — manual, one-time</li>
            <li>· Careers links, websites, vision — all public</li>
            <li>· Category counts on landing — immediate value</li>
            <li>· Search + filter — standard web app patterns</li>
          </ul>
        </div>
      </div>
      <div className="pres-card mt-4 bg-[var(--navy)] text-white">
        <p className="text-[13px] leading-relaxed">
          <strong className="text-[var(--profit-bright)]">Your instinct is correct:</strong>{" "}
          hosting, domain, database, and AI dev tools are the main costs. Rich company data can start
          free via manual curation. Paid APIs only matter beyond a few hundred companies.
        </p>
      </div>
    </div>
  );
}

function SlideAsk() {
  return (
    <div className="pres-stagger text-center">
      <p className="pres-kicker mx-auto">The ask</p>
      <h2 className="pres-title mt-4">Approve MVP — start building</h2>
      <p className="pres-subtitle mx-auto">
        8–12 weeks solo build · $15–40/mo infra · 150 curated companies · product vs service
        filter on day one. A directory job seekers actually need.
      </p>
      <div className="pres-scorecard mt-8 text-left">
        <div className="pres-scorecard-head">
          <span>Criteria</span>
          <span>LinkedIn</span>
          <span>Glassdoor</span>
          <span>AmbitionBox</span>
          <span>Naukri</span>
          <span className="text-[var(--profit)]">Typewise</span>
        </div>
        {COMPETITIVE_MATRIX.map((row) => (
          <div key={row.criteria} className="pres-scorecard-row">
            <div className="pres-scorecard-criteria">{row.criteria}</div>
            <div className="text-center"><Stars count={row.linkedin} /></div>
            <div className="text-center"><Stars count={row.glassdoor} /></div>
            <div className="text-center"><Stars count={row.ambition} /></div>
            <div className="text-center"><Stars count={row.naukri} /></div>
            <div className="text-center"><Stars count={row.tw} /></div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <span className="pres-pill pres-pill-profit pres-pill-glow">Product vs service — first-class</span>
        <span className="pres-pill pres-pill-gold">India-aware profiles</span>
        <span className="pres-pill pres-pill-profit">Free MVP — no data API required</span>
      </div>
      <div className="mt-8 flex flex-col items-center gap-4">
        <Link href="/companies" className="pres-cta pres-cta-experience inline-flex">
          Experience how your site will look after approval →
        </Link>
        <a href="mailto:inbox.nuthan@gmail.com?subject=Typewise%20MVP%20-%20Approved" className="pres-cta pres-cta-secondary inline-flex">
          Green-light MVP →
        </a>
      </div>
    </div>
  );
}
