import { getSubscriberDisplay } from "@/lib/site-stats";
import stats from "@/data/site-stats.json";

/** Shown in nav/footer only when a live subscriber count is enabled. */
export function SubscriberPill() {
  if (!(stats.showSubscriberCount && stats.subscriberCount > 0)) return null;

  const label = getSubscriberDisplay();
  if (!label) return null;

  return (
    <span className="subscriber-pill" title="Email alerts when new verified companies are added">
      {label}
    </span>
  );
}
