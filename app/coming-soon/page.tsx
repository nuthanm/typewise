import { AppShell } from "@/components/AppShell";
import { FormPageHeader, FormPanel } from "@/components/FormLayout";
import { PipelineQueue } from "@/components/PipelineQueue";
import { CATALOG_PROGRESS } from "@/lib/companies";

export const metadata = {
  title: "Review queue — Typewise",
  description: "Browse companies in progress and awaiting review before they become verified profiles.",
};

export default function ComingSoonPage() {
  const totalInQueue = CATALOG_PROGRESS.inProgress + CATALOG_PROGRESS.unverified;

  return (
    <AppShell active="home">
      <div className="page-narrow coming-soon-page">
        <FormPageHeader
          eyebrow="Transparency"
          title="Review queue"
          lead={
            <>
              {totalInQueue} companies are being researched before they get a verified profile.
              Browse the grid below — filter by status or type, and suggest official sources if you
              have them.
            </>
          }
        />

        <FormPanel>
          <PipelineQueue />
        </FormPanel>
      </div>
    </AppShell>
  );
}
