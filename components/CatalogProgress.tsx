import Link from "next/link";
import {
  CATALOG_PROGRESS,
  CATALOG_UPDATED,
  CATEGORY_LABELS,
  PIPELINE_IN_PROGRESS,
  PIPELINE_UNVERIFIED,
  type PipelineItem,
} from "@/lib/companies";
import { VerificationStatusTag } from "@/components/VerificationStatusTag";
import { IconEdit } from "@/components/PortalIcons";

function PipelineCard({
  item,
  status,
}: {
  item: PipelineItem;
  status: "in_progress" | "unverified";
}) {
  return (
    <li className="catalog-pipeline-card">
      <div className="catalog-pipeline-card-head">
        <Link href={`/companies/${item.slug}`}>{item.name}</Link>
        <VerificationStatusTag status={status} size="sm" />
      </div>
      {item.category && (
        <span className="mini-tag">{CATEGORY_LABELS[item.category]}</span>
      )}
      <p>{item.note}</p>
      <Link href={`/submit?slug=${item.slug}`} className="catalog-pipeline-action">
        <IconEdit size={14} />
        Suggest info
      </Link>
    </li>
  );
}

export function CatalogProgress() {
  const verifiedPercent = Math.round(
    (CATALOG_PROGRESS.verified / CATALOG_PROGRESS.totalTracked) * 100,
  );

  return (
    <section className="catalog-progress" aria-label="Catalog verification progress">
      <div className="catalog-progress-top">
        <div className="catalog-progress-intro">
          <span className="landing-eyebrow">Transparency</span>
          <h2>Catalog progress</h2>
          <p>
            We show our work. Only <strong>{CATALOG_PROGRESS.verified} verified</strong> companies
            have full profiles today. Search also surfaces{" "}
            <strong>{CATALOG_PROGRESS.inProgress + CATALOG_PROGRESS.unverified}</strong> names still
            in our review queue — clearly labelled, not presented as verified.
          </p>
        </div>
        <div className="catalog-progress-meter" aria-label={`${verifiedPercent}% verified`}>
          <div className="catalog-progress-ring">
            <div className="catalog-progress-ring-inner">
              <strong>{verifiedPercent}%</strong>
              <span>verified</span>
            </div>
          </div>
          <div className="landing-progress-track catalog-progress-track">
            <div className="landing-progress-fill" style={{ width: `${verifiedPercent}%` }} />
          </div>
          <p>
            {CATALOG_PROGRESS.verified} of {CATALOG_PROGRESS.totalTracked} tracked · updated{" "}
            {CATALOG_UPDATED}
          </p>
        </div>
      </div>

      <div className="catalog-stat-row">
        <article className="catalog-stat verified">
          <VerificationStatusTag status="verified" size="sm" />
          <strong>{CATALOG_PROGRESS.verified}</strong>
          <h3>Verified</h3>
          <p>Live with official source links</p>
        </article>
        <article className="catalog-stat in-progress">
          <VerificationStatusTag status="in_progress" size="sm" />
          <strong>{CATALOG_PROGRESS.inProgress}</strong>
          <h3>In progress</h3>
          <p>Being checked on official pages</p>
        </article>
        <article className="catalog-stat unverified">
          <VerificationStatusTag status="unverified" size="sm" />
          <strong>{CATALOG_PROGRESS.unverified}</strong>
          <h3>Awaiting review</h3>
          <p>Not published until validated</p>
        </article>
      </div>

      <div className="catalog-pipeline-layout">
        <section className="catalog-pipeline-column">
          <div className="catalog-pipeline-column-head">
            <h3>In progress</h3>
            <span>{PIPELINE_IN_PROGRESS.length}</span>
          </div>
          <ul>
            {PIPELINE_IN_PROGRESS.map((item) => (
              <PipelineCard key={item.slug} item={item} status="in_progress" />
            ))}
          </ul>
        </section>

        <section className="catalog-pipeline-column">
          <div className="catalog-pipeline-column-head">
            <h3>Awaiting review</h3>
            <span>{PIPELINE_UNVERIFIED.length}</span>
          </div>
          <ul>
            {PIPELINE_UNVERIFIED.map((item) => (
              <PipelineCard key={item.slug} item={item} status="unverified" />
            ))}
          </ul>
        </section>
      </div>

      <div className="catalog-progress-foot">
        <p>Want a company prioritised? Submit it — we review against official sources in order received.</p>
        <Link href="/submit" className="landing-btn secondary">
          Submit request
        </Link>
      </div>
    </section>
  );
}
