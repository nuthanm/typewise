import stats from "@/data/site-stats.json";

export const SITE_STATS = stats;

export function getSubscriberDisplay() {
  if (stats.showSubscriberCount && stats.subscriberCount > 0) {
    return `${stats.subscriberCount.toLocaleString()} subscribers`;
  }
  if (stats.updatesNotifyComingSoon) {
    return "Update alerts · coming soon";
  }
  return null;
}
