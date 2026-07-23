import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/companies";

const CATEGORIES = [
  {
    id: "product" as const,
    title: CATEGORY_LABELS.product,
    summary: "Builds and sells its own software or platform — revenue comes from the product itself.",
    example: "Razorpay builds payment products; Zoho builds business apps.",
    examples: [
      { name: "Razorpay", slug: "razorpay" },
      { name: "Zoho", slug: "zoho" },
    ],
  },
  {
    id: "service" as const,
    title: CATEGORY_LABELS.service,
    summary: "Delivers work for clients — consulting, outsourcing, or project-based IT delivery.",
    example: "TCS and Infosys build solutions for enterprise customers.",
    examples: [
      { name: "TCS", slug: "tcs" },
      { name: "Infosys", slug: "infosys" },
    ],
  },
  {
    id: "hybrid" as const,
    title: CATEGORY_LABELS.hybrid,
    summary: "Runs a meaningful product or platform and large client-delivery or operations arms.",
    example: "Flipkart runs e-commerce tech plus warehousing and logistics at scale.",
    examples: [{ name: "Flipkart", slug: "flipkart" }],
  },
] as const;

const CLASSIFICATION_STEPS = [
  {
    title: "Official pages first",
    body: "We read the company’s About page and whether it publishes Products vs Services.",
  },
  {
    title: "Build vs deliver",
    body: "Product = owns what it ships. Service = primarily delivers for clients. Hybrid = both at scale.",
  },
  {
    title: "Human review",
    body: "A reviewer assigns the label — not scraped from job posts, Glassdoor, or Wikipedia alone.",
  },
  {
    title: "Source-linked",
    body: "Every verified profile lists the URLs we used, so you can open and check them yourself.",
  },
] as const;

export function CategoryGuide() {
  return (
    <section className="landing-category-guide" aria-labelledby="category-guide-heading">
      <div className="landing-category-guide-head">
        <span className="landing-eyebrow">Company types</span>
        <h2 id="category-guide-heading">Product, service, or hybrid?</h2>
        <p>
          Typewise labels every verified company so you know what kind of work you are likely to do
          before you apply — not just the brand name.
        </p>
      </div>

      <ul className="landing-category-cards">
        {CATEGORIES.map((cat) => (
          <li key={cat.id}>
            <article className={`landing-category-card landing-category-card-${cat.id}`}>
              <span className={`tag ${cat.id}`}>{cat.title}</span>
              <p>{cat.summary}</p>
              <p className="landing-category-example">{cat.example}</p>
              <p className="landing-category-links">
                See{" "}
                {cat.examples.map((ex, i) => (
                  <span key={ex.slug}>
                    {i > 0 && " · "}
                    <Link href={`/companies/${ex.slug}`}>{ex.name}</Link>
                  </span>
                ))}
              </p>
            </article>
          </li>
        ))}
      </ul>

      <div className="landing-classification-panel">
        <h3>How we decide the label</h3>
        <ol className="landing-classification-steps">
          {CLASSIFICATION_STEPS.map((step) => (
            <li key={step.title}>
              <strong>{step.title}</strong>
              <span>{step.body}</span>
            </li>
          ))}
        </ol>
        <p className="landing-classification-foot">
          Labels reflect what the company primarily builds today — they can change when a company
          shifts strategy. Spot something off?{" "}
          <Link href="/submit">Submit a correction</Link> with a link to an official page.
        </p>
      </div>
    </section>
  );
}
