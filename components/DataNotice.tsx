import Link from "next/link";
import { CATALOG_UPDATED, DATA_YEAR } from "@/lib/companies";
import { IconInfo, IconSubmit } from "@/components/PortalIcons";

export function DataNotice() {
  return (
    <aside className="data-notice" role="note" aria-label="Data accuracy notice">
      <div className="data-notice-mark" aria-hidden="true">
        <IconInfo size={18} />
      </div>
      <div className="data-notice-content">
        <h2>Built for accuracy, not hype</h2>
        <p>
          We publish only <strong>verified, source-linked</strong> profiles from official public pages.
          Figures reflect {DATA_YEAR} data and may change as companies update policies or headcount.
        </p>
        <div className="data-notice-meta">
          <span>Last updated {CATALOG_UPDATED}</span>
          <span>Manual review before publish</span>
          <span>No sign-in to submit corrections</span>
        </div>
      </div>
      <Link href="/submit" className="data-notice-cta">
        <IconSubmit size={15} />
        Submit correction
      </Link>
    </aside>
  );
}
