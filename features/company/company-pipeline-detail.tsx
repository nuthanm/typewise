import Link from "next/link";
import {
  CATEGORY_LABELS,
  VERIFICATION_LABELS,
} from "@/lib/companies";
import type { CompanySearchEntry } from "@/lib/company-search";
import { VerificationStatusTag } from "@/components/VerificationStatusTag";
import { IconArrowLeft, IconCompanies, IconEdit } from "@/components/PortalIcons";

function categoryClass(category: CompanySearchEntry["category"]) {
  if (category === "product") return "tag product";
  if (category === "service") return "tag service";
  if (category === "hybrid") return "tag hybrid";
  return "tag";
}

export function CompanyPipelineDetail({ entry }: { entry: CompanySearchEntry }) {
  const statusCopy =
    entry.verificationStatus === "in_progress"
      ? "We are actively checking this company against official pages before publishing a full profile."
      : "This company is in our queue. It will not show as verified until we manually validate official sources.";

  return (
    <article className="company-profile company-pipeline">
      <div className="profile-hero">
        <div className="profile-hero-main">
          <div className="profile-hero-badges">
            <VerificationStatusTag status={entry.verificationStatus} size="md" />
            {entry.category !== "unknown" && (
              <span className={categoryClass(entry.category)}>
                {CATEGORY_LABELS[entry.category]}
              </span>
            )}
          </div>
          <h1>{entry.name}</h1>
          <p className="profile-tagline">
            {VERIFICATION_LABELS[entry.verificationStatus]} — not yet a full verified profile
          </p>
        </div>
      </div>

      <div className="profile-layout profile-layout-three">
        <aside className="profile-left-nav">
          <div className="profile-left-panel">
            <h2 className="profile-left-title">Quick links</h2>
            <div className="profile-icon-links">
              <Link href={`/submit?slug=${entry.slug}`} className="profile-icon-link primary">
                <span className="profile-icon-link-icon">
                  <IconEdit size={17} />
                </span>
                <span>Suggest info</span>
              </Link>
              <Link href="/companies" className="profile-icon-link">
                <span className="profile-icon-link-icon">
                  <IconCompanies size={17} />
                </span>
                <span>All companies</span>
              </Link>
            </div>
          </div>
        </aside>

        <div className="profile-main">
          <div className="profile-pipeline-notice">
            <h2>What this means</h2>
            <p>{statusCopy}</p>
            {entry.note && (
              <div className="profile-pipeline-note">
                <h3>Current status</h3>
                <p>{entry.note}</p>
              </div>
            )}
            <p className="profile-pipeline-help">
              Know something useful? Submit details with links to official pages — it speeds up manual review.
            </p>
            <Link href={`/submit?slug=${entry.slug}`} className="form-submit-btn">
              <IconEdit size={16} />
              Submit add / edit request
            </Link>
          </div>
        </div>
      </div>

      <p className="profile-back">
        <Link href="/companies">
          <IconArrowLeft size={16} />
          Back to all companies
        </Link>
      </p>
    </article>
  );
}
