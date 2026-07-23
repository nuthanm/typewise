import Link from "next/link";
import { getSubscriberDisplay } from "@/lib/site-stats";
import stats from "@/data/site-stats.json";

export function SubscriberPill() {
  const label = getSubscriberDisplay();
  if (!label) return null;

  if (stats.updatesNotifyComingSoon) {
    return (
      <Link
        href="/coming-soon"
        className="subscriber-pill subscriber-pill-link"
        title="Update alerts — learn what's coming"
      >
        {label}
      </Link>
    );
  }

  return (
    <span className="subscriber-pill" title="Email alerts when new verified companies are added">
      {label}
    </span>
  );
}
