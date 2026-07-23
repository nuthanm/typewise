import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { FormPageHeader, FormPanel } from "@/components/FormLayout";
import { CATALOG_PROGRESS } from "@/lib/companies";
import { IconCompanies, IconSubmit } from "@/components/PortalIcons";

export const metadata = {
  title: "Coming soon — Typewise",
  description: "Update alerts and the full review queue are on the way.",
};

const PLANNED = [
  {
    title: "Update alerts",
    body: "Get an email when new companies are verified or existing profiles change — so you do not have to check back manually.",
  },
  {
    title: "Full review queue",
    body: `Browse all ${CATALOG_PROGRESS.inProgress + CATALOG_PROGRESS.unverified} names we are actively researching — with status, notes, and a way to suggest corrections before they go live.`,
  },
  {
    title: "Pipeline filters",
    body: "Filter by product, service, or hybrid while a profile is still in progress — useful if you are tracking a specific company type.",
  },
] as const;

export default function ComingSoonPage() {
  return (
    <AppShell active="home">
      <div className="page-narrow coming-soon-page">
        <FormPageHeader
          eyebrow="On the roadmap"
          title="Coming soon"
          lead={
            <>
              We are building a few features that are not ready yet. Verified company profiles are
              live today — the items below will ship when they are properly wired up.
            </>
          }
        />

        <FormPanel>
          <ul className="coming-soon-list">
            {PLANNED.map(({ title, body }) => (
              <li key={title} className="coming-soon-item">
                <span className="coming-soon-badge">Coming soon</span>
                <h2>{title}</h2>
                <p>{body}</p>
              </li>
            ))}
          </ul>

          <div className="coming-soon-snapshot" aria-label="Current catalog snapshot">
            <div>
              <strong>{CATALOG_PROGRESS.verified}</strong>
              <span>Verified today</span>
            </div>
            <div>
              <strong>{CATALOG_PROGRESS.inProgress}</strong>
              <span>In progress</span>
            </div>
            <div>
              <strong>{CATALOG_PROGRESS.unverified}</strong>
              <span>Awaiting review</span>
            </div>
          </div>

          <div className="coming-soon-actions">
            <Link href="/companies" className="landing-btn primary">
              <IconCompanies size={16} />
              Browse verified companies
            </Link>
            <Link href="/submit" className="landing-btn secondary">
              <IconSubmit size={16} />
              Submit add / edit
            </Link>
          </div>
        </FormPanel>
      </div>
    </AppShell>
  );
}
