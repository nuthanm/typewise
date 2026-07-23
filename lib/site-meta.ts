export {
  DATA_YEAR,
  CATALOG_UPDATED,
  CATALOG_DISCLAIMER,
} from "./companies";

export const SITE_NAME = "Typewise";

export const SITE_TAGLINE = "Know your company type before you apply";

export function getSiteUrl(fallback = "http://localhost:3000") {
  return (process.env.NEXT_PUBLIC_SITE_URL || fallback).replace(/\/$/, "");
}

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_SUBMIT_API_URL?.trim().replace(/\/$/, "") || "";
}

export function getSubmitApiUrl() {
  const base = getApiBaseUrl();
  return base ? `${base}/api/submissions` : "/api/submissions";
}

export function getQueueApiUrl() {
  const base = getApiBaseUrl();
  return base ? `${base}/api/submissions/queue` : "/api/submissions/queue";
}

export function getFeedbackApiUrl() {
  const base = getApiBaseUrl();
  return base ? `${base}/api/feedback` : "/api/feedback";
}

export const DATA_ACCURACY_NOTICE = {
  title: "About this data",
  body: "We publish only verified, source-linked company profiles from public pages. Figures reflect the current catalog year and may change as companies grow, restructure, or update policies.",
  report:
    "See something wrong or outdated? Please report it through Submit request — your correction helps everyone.",
};

export const EMAIL_FOOTER = {
  disclaimer:
    "Typewise is a community directory, not official company documentation. Profiles use public sources and may change.",
  reportLine: "Report corrections via Submit request on the site — it helps others too.",
  signOff: "— Typewise team",
};
