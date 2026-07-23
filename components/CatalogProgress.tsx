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
  const hasPipeline =
    PIPELINE_IN_PROGRESS.length + PIPELINE_UNVERIFIED.length > 0;
  const verifiedPercent = hasPipeline
    ? Math.round((CATALOG_PROGRESS.verified / CATALOG_PROGRESS.totalTracked) * 100)
    : 100;

  return (
    <section className="catalog-progress" aria-label="Catalog overview">
      <div className="catalog-progress-top">
        <div className="catalog-progress-intro">
          <span className="landing-eyebrow">Transparency</span>
          <h2>Our catalog</h2>
          <p>
            {hasPipeline ? (
              <>
                We show our work. Only <strong>{CATALOG_PROGRESS.verified} verified</strong> companies
                have full profiles today. Search also surfaces{" "}
                <strong>{CATALOG_PROGRESS.inProgress + CATALOG_PROGRESS.unverified}</strong> names still
                in our review queue — clearly labelled, not presented as verified.
              </>
            ) : (
              <>
                Every company listed here is <strong>manually verified</strong> against official sources.
                We currently publish <strong>{CATALOG_PROGRESS.verified} full profiles</strong> — no
                placeholder or draft listings.
              </>
            )}
          </p>
        </div>
        <div className="catalog-progress-meter" aria-label={`${verifiedPercent}% verified`}>
          <div className="catalog-progress-ring">
            <div className="catalog-progress-ring-inner">
              <strong>{CATALOG_PROGRESS.verified}</strong>
              <span>{hasPipeline ? "verified" : "live profiles"}</span>
            </div>
          </div>
          {hasPipeline && (
            <div className="landing-progress-track catalog-progress-track">
              <div className="landing-progress-fill" style={{ width: `${verifiedPercent}%` }} />
            </div>
          )}
          <p>
            {hasPipeline
              ? `${CATALOG_PROGRESS.verified} of ${CATALOG_PROGRESS.totalTracked} tracked · updated ${CATALOG_UPDATED}`
              : `All verified · updated ${CATALOG_UPDATED}`}
          </p>
        </div>
      </div>

      <div className={`catalog-stat-row${hasPipeline ? "" : " catalog-stat-row-compact"}`}>
        <article className="catalog-stat verified">
          <VerificationStatusTag status="verified" size="sm" />
          <strong>{CATALOG_PROGRESS.verified}</strong>
          <h3>Verified</h3>
          <p>Live with official source links</p>
        </article>
        {hasPipeline && (
          <>
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
          </>
        )}
      </div>

      {hasPipeline && (
        <div className="catalog-pipeline-layout">
          {PIPELINE_IN_PROGRESS.length > 0 && (
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
          )}

          {PIPELINE_UNVERIFIED.length > 0 && (
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
          )}
        </div>
      )}

      <div className="catalog-progress-foot">
        <p>
          {hasPipeline
            ? "Want a company prioritised? Submit it — we review against official sources in order received."
            : "Missing a company? Submit a request — we add profiles only after verifying official sources."}
        </p>
        <Link href="/submit" className="landing-btn secondary">
          Submit request
        </Link>
      </div>
    </section>
  );
}
