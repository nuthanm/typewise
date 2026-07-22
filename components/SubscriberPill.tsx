import { getSubscriberDisplay } from "@/lib/site-stats";

export function SubscriberPill() {
  const label = getSubscriberDisplay();
  if (!label) return null;

  return (
    <span className="subscriber-pill" title="Email alerts when new verified companies are added">
      {label}
    </span>
  );
}
