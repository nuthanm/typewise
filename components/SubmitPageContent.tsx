"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CompanySubmissionForm } from "@/components/CompanySubmissionForm";
import { FormPageHeader, FormPanel } from "@/components/FormLayout";
import { DATA_YEAR } from "@/lib/companies";

export function SubmitPageContent() {
  const params = useSearchParams();
  const initialSlug = params.get("slug")?.trim() || undefined;

  return (
    <div className="page-narrow">
      <FormPageHeader
        eyebrow="No sign-in required"
        title="Submit a company add or edit"
        lead={
          <>
            Help keep the <strong>{DATA_YEAR}</strong> catalog accurate. We review every request
            against <strong>official public sources</strong> before publishing. Read{" "}
            <Link href="/brief">The Brief</Link> to see what this app covers.
          </>
        }
      />
      <FormPanel>
        <CompanySubmissionForm initialSlug={initialSlug} />
      </FormPanel>
    </div>
  );
}
