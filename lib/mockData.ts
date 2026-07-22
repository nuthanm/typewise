export const DIFFERENTIATION_MECHANISMS = [
  {
    title: "Product vs service taxonomy",
    others: "Blog posts list “Top 10 product companies” — static, outdated, not searchable",
    ours: "First-class filter: product · service · hybrid · BPO · consulting · startup",
    strength: "Solves the exact confusion job seekers face every day",
    mechanism: "Editorial taxonomy + community corrections with moderation",
  },
  {
    title: "Single company profile page",
    others: "LinkedIn shows jobs; Glassdoor shows reviews — data scattered across sites",
    ours: "Vision, products, leadership, locations, careers link, interview pattern in one place",
    strength: "One URL to share with friends, mentors, or parents researching a company",
    mechanism: "Curated schema with verified outbound links to official sources",
  },
  {
    title: "India-aware headcount",
    others: "Global platforms show worldwide numbers only — useless for local job decisions",
    ours: "Global vs India employee split, office cities, hybrid/on-site policy",
    strength: "Built for Indian job seekers and campus placement research",
    mechanism: "Manual curation from annual reports, LinkedIn, and company pages",
  },
  {
    title: "Not a job board",
    others: "Naukri/Indeed list openings but hide whether the company builds products",
    ours: "Information-first directory — careers page is an outbound verified link",
    strength: "Trust through transparency; no pay-to-hide-company-type",
    mechanism: "No job scraping in MVP — link out to official careers pages",
  },
];

export const COVERAGE_COMPARISON = [
  { label: "Product vs service filter", typewise: 95, market: 15 },
  { label: "Rich company profiles", typewise: 90, market: 45 },
  { label: "Interview pattern intel", typewise: 75, market: 40 },
  { label: "India headcount split", typewise: 85, market: 20 },
  { label: "Searchable directory", typewise: 92, market: 55 },
];

export const COMPETITIVE_MATRIX = [
  { criteria: "Product vs service filter", linkedin: 1, glassdoor: 0, ambition: 1, naukri: 0, tw: 5 },
  { criteria: "Company profile depth", linkedin: 3, glassdoor: 3, ambition: 2, naukri: 1, tw: 5 },
  { criteria: "Careers outbound link", linkedin: 4, glassdoor: 3, ambition: 3, naukri: 5, tw: 5 },
  { criteria: "Interview patterns", linkedin: 1, glassdoor: 4, ambition: 4, naukri: 0, tw: 4 },
  { criteria: "India office locations", linkedin: 3, glassdoor: 2, ambition: 3, naukri: 2, tw: 5 },
  { criteria: "Free access (MVP)", linkedin: 3, glassdoor: 3, ambition: 4, naukri: 4, tw: 5 },
  { criteria: "Not a job board", linkedin: 2, glassdoor: 5, ambition: 4, naukri: 1, tw: 5 },
];

export const SAMPLE_COMPANIES = [
  { name: "Razorpay", type: "Product-based", domain: "Fintech", india: "3,200+", hq: "Bengaluru" },
  { name: "TCS", type: "Service-based", domain: "IT Services", india: "500,000+", hq: "Mumbai" },
  { name: "Zoho", type: "Product-based", domain: "SaaS", india: "12,000+", hq: "Chennai" },
  { name: "Freshworks", type: "Product-based", domain: "SaaS", india: "3,000+", hq: "Chennai" },
  { name: "Infosys", type: "Service-based", domain: "IT Services", india: "250,000+", hq: "Bengaluru" },
  { name: "Flipkart", type: "Product-based", domain: "E-commerce", india: "28,000+", hq: "Bengaluru" },
];

export const CATEGORY_COUNTS = [
  { label: "Product-based", count: 847, color: "var(--gold)" },
  { label: "Service-based", count: 1204, color: "var(--profit)" },
  { label: "Hybrid", count: 312, color: "var(--service)" },
  { label: "Startups", count: 623, color: "var(--gold-bright)" },
  { label: "Consulting", count: 289, color: "var(--navy-mid)" },
  { label: "BPO", count: 156, color: "var(--ink-faint)" },
];
