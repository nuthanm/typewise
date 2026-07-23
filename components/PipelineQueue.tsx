import Link from "next/link";
import {
  CATEGORY_LABELS,
  PIPELINE_IN_PROGRESS,
  PIPELINE_UNVERIFIED,
  type PipelineItem,
  type VerificationStatus,
} from "@/lib/companies";
import { VerificationStatusTag } from "@/components/VerificationStatusTag";

function categoryClass(category: PipelineItem["category"]) {
  if (category === "product") return "tag product";
  if (category === "service") return "tag service";
  if (category === "hybrid") return "tag hybrid";
  return "tag";
}

function PipelineColumn({
  title,
  status,
  items,
}: {
  title: string;
  status: VerificationStatus;
  items: PipelineItem[];
}) {
  const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="catalog-pipeline-column">
      <div className="catalog-pipeline-column-head">
        <h3>{title}</h3>
        <div className="catalog-pipeline-column-meta">
          <VerificationStatusTag status={status} size="sm" />
          <span aria-label={`${sorted.length} companies`}>{sorted.length}</span>
        </div>
      </div>
      <ul className="catalog-pipeline-name-grid">
        {sorted.map((item) => (
          <li key={item.slug}>
            <Link href={`/companies/${item.slug}`} className="catalog-pipeline-name-chip">
              <span className="catalog-pipeline-name-chip-label">{item.name}</span>
              {item.category && item.category !== "unknown" && (
                <span className={categoryClass(item.category)}>
                  {CATEGORY_LABELS[item.category]}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PipelineQueue() {
  const total = PIPELINE_IN_PROGRESS.length + PIPELINE_UNVERIFIED.length;
  if (total === 0) return null;

  return (
    <section className="coming-soon-queue" aria-labelledby="coming-soon-queue-title">
      <div className="coming-soon-queue-head">
        <h2 id="coming-soon-queue-title">Names in the review queue</h2>
        <p>
          {total} companies we are tracking before they become verified profiles. Click a name to
          see its current status or suggest official sources.
        </p>
      </div>
      <div className="catalog-pipeline-layout">
        <PipelineColumn
          title="In progress"
          status="in_progress"
          items={PIPELINE_IN_PROGRESS}
        />
        <PipelineColumn
          title="Awaiting review"
          status="unverified"
          items={PIPELINE_UNVERIFIED}
        />
      </div>
    </section>
  );
}
