import { DATA_YEAR } from "./companies";
import { helpedLabel } from "./feedback-store";
import { escapeHtml } from "./security/sanitize";
import { EMAIL_FOOTER, getSiteUrl, SITE_NAME } from "./site-meta";
import type { FeedbackInput, SubmissionInput } from "./validators";

function emailShell(title: string, bodyHtml: string) {
  const site = escapeHtml(getSiteUrl());
  return `
    <div style="font-family:system-ui,sans-serif;color:#141414;max-width:560px;line-height:1.55">
      <p style="font-size:12px;color:#737373;margin:0 0 16px">${escapeHtml(SITE_NAME)} · Verified catalog · ${DATA_YEAR}</p>
      <h2 style="font-size:18px;margin:0 0 12px">${escapeHtml(title)}</h2>
      ${bodyHtml}
      <hr style="border:none;border-top:1px solid #e8e4dc;margin:20px 0" />
      <p style="font-size:12px;color:#737373">${escapeHtml(EMAIL_FOOTER.disclaimer)}</p>
      <p style="font-size:12px;color:#737373">${escapeHtml(EMAIL_FOOTER.reportLine)}</p>
      <p style="font-size:12px"><a href="${site}/submit" style="color:#0a66c2">Submit a correction</a> · <a href="${site}/feedback" style="color:#0a66c2">Share feedback</a></p>
      <p style="font-size:12px;color:#737373;margin-top:12px">${escapeHtml(EMAIL_FOOTER.signOff)}</p>
    </div>
  `;
}

function textFooter() {
  return [
    "",
    EMAIL_FOOTER.disclaimer,
    EMAIL_FOOTER.reportLine,
    `${getSiteUrl()}/submit`,
    "",
    EMAIL_FOOTER.signOff,
  ].join("\n");
}

export function buildAdminEmail(input: SubmissionInput & { id: string }) {
  const site = getSiteUrl();
  const subject = `[Typewise] ${input.requestType === "add" ? "Add" : "Edit"} request: ${input.companyName}`;
  const lines = [
    `New ${input.requestType} request for the ${DATA_YEAR} catalog.`,
    "",
    `Request ID: ${input.id}`,
    `Type: ${input.requestType}`,
    `Company: ${input.companyName}`,
    input.companySlug ? `Existing slug: ${input.companySlug}` : "",
    input.website ? `Website: ${input.website}` : "",
    `From: ${input.submitterName} <${input.submitterEmail}>`,
    input.subscribeToUpdates ? "Also opted in to catalog update notifications." : "",
    "",
    "Message:",
    input.message,
    "",
    `Review: ${site}/submit`,
    textFooter(),
  ].filter(Boolean);

  const html = emailShell(
    `New company ${input.requestType} request`,
    `
      <p>A visitor submitted a correction for the <strong>${DATA_YEAR}</strong> catalog. Verify on the <strong>official company website</strong> before publishing.</p>
      <p><strong>ID:</strong> ${escapeHtml(input.id)}</p>
      <p><strong>Company:</strong> ${escapeHtml(input.companyName)}</p>
      ${input.companySlug ? `<p><strong>Slug:</strong> ${escapeHtml(input.companySlug)}</p>` : ""}
      ${input.website ? `<p><strong>Website:</strong> ${escapeHtml(input.website)}</p>` : ""}
      <p><strong>Submitter:</strong> ${escapeHtml(input.submitterName)} (${escapeHtml(input.submitterEmail)})</p>
      ${input.subscribeToUpdates ? "<p><strong>Update alerts:</strong> Yes — add to subscriber list after review.</p>" : ""}
      <pre style="white-space:pre-wrap;font-family:inherit;background:#f7f5f0;padding:12px;border-radius:8px">${escapeHtml(input.message)}</pre>
    `,
  );

  return { subject, text: lines.join("\n"), html };
}

export function buildUserConfirmationEmail(input: SubmissionInput & { id: string }) {
  const subject = `We received your ${SITE_NAME} request (${DATA_YEAR} catalog)`;
  const updateLine = input.subscribeToUpdates
    ? "You opted in to email alerts when we add or verify companies — notifications are rolling out soon."
    : "";
  const text = [
    `Hi ${input.submitterName},`,
    "",
    `Thank you for helping keep ${SITE_NAME} accurate.`,
    "",
    `We received your request to ${input.requestType === "add" ? "add" : "update"} ${input.companyName}.`,
    `Reference: ${input.id}`,
    "",
    "Our team manually checks every field against official pages before a profile gets the Verified stamp.",
    updateLine,
    textFooter(),
  ].filter(Boolean).join("\n");

  const html = emailShell(
    "Request received — thank you",
    `
      <p>Hi ${escapeHtml(input.submitterName)},</p>
      <p>Thank you for helping keep <strong>${escapeHtml(SITE_NAME)}</strong> accurate for everyone.</p>
      <p>We received your request to <strong>${input.requestType === "add" ? "add" : "update"} ${escapeHtml(input.companyName)}</strong> on the ${DATA_YEAR} catalog.</p>
      <p>Reference: <code>${escapeHtml(input.id)}</code></p>
      <p>We manually validate content on official company pages before awarding the <strong>Verified</strong> stamp.</p>
      ${input.subscribeToUpdates ? "<p>You opted in to catalog update emails — we will notify you when new verified companies are published.</p>" : ""}
    `,
  );

  return { subject, text, html };
}

export function buildSubscribeWelcomeEmail(input: { name: string; email: string }) {
  const subject = `${SITE_NAME} update alerts — you're on the list`;
  const text = [
    `Hi ${input.name},`,
    "",
    `Thanks for subscribing to ${SITE_NAME} catalog updates for ${DATA_YEAR}.`,
    "We will email you when we add or verify new companies — with details of what changed.",
    "",
    "Every listed company is manually checked on official pages before it receives our Verified stamp.",
    textFooter(),
  ].join("\n");

  const html = emailShell(
    "You're subscribed to catalog updates",
    `
      <p>Hi ${escapeHtml(input.name)},</p>
      <p>Thanks for subscribing to <strong>${escapeHtml(SITE_NAME)}</strong> update alerts.</p>
      <p>We will email you when we add or verify companies on the ${DATA_YEAR} catalog — including what was added or updated.</p>
      <p>Only profiles that pass manual review on official sources receive our <strong>Verified</strong> stamp.</p>
    `,
  );

  return { subject, text, html };
}

export function buildFeedbackAdminEmail(input: FeedbackInput & { id: string }) {
  const subject = `[Typewise] Site feedback — ${helpedLabel(input.helped)}`;
  const text = [
    `Feedback ID: ${input.id}`,
    `From: ${input.name} <${input.email}>`,
    `Helped career decision: ${helpedLabel(input.helped)}`,
    input.message ? `Message: ${input.message}` : "",
    textFooter(),
  ].filter(Boolean).join("\n");

  const html = emailShell(
    "New site feedback",
    `
      <p><strong>ID:</strong> ${escapeHtml(input.id)}</p>
      <p><strong>From:</strong> ${escapeHtml(input.name)} (${escapeHtml(input.email)})</p>
      <p><strong>Helped pick the right company:</strong> ${escapeHtml(helpedLabel(input.helped))}</p>
      ${input.message ? `<pre style="white-space:pre-wrap;font-family:inherit;background:#f7f5f0;padding:12px;border-radius:8px">${escapeHtml(input.message)}</pre>` : ""}
    `,
  );

  return { subject, text, html };
}

export function buildFeedbackUserEmail(input: FeedbackInput & { id: string }) {
  const subject = `Thanks for your ${SITE_NAME} feedback`;
  const text = [
    `Hi ${input.name},`,
    "",
    "Thank you for sharing whether Typewise helped your career research.",
    "Your opinion helps us improve the catalog for other job seekers.",
    textFooter(),
  ].join("\n");

  const html = emailShell(
    "Thank you for your feedback",
    `
      <p>Hi ${escapeHtml(input.name)},</p>
      <p>Thank you for telling us whether <strong>${escapeHtml(SITE_NAME)}</strong> helped you pick the right company.</p>
      <p>We read every response. Report data issues anytime via Submit request.</p>
    `,
  );

  return { subject, text, html };
}
