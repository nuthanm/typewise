import postgres from "postgres";
import {
  ALL_COMPANY_SLUGS,
  PIPELINE_IN_PROGRESS,
  PIPELINE_UNVERIFIED,
  slugifyCompanyName,
  VERIFIED_COMPANIES,
} from "./companies";
import { buildAdminEmail, buildUserConfirmationEmail } from "./email-templates";
import type { SubmissionInput } from "./validators";

let sql: ReturnType<typeof postgres> | null = null;

const STATIC_PIPELINE_SLUGS = new Set([
  ...PIPELINE_IN_PROGRESS.map((item) => item.slug),
  ...PIPELINE_UNVERIFIED.map((item) => item.slug),
]);

const VERIFIED_SLUGS = new Set(VERIFIED_COMPANIES.map((company) => company.slug));

export type QueueSubmissionItem = {
  id: string;
  slug: string;
  name: string;
  requestType: "add" | "edit";
  note: string;
  submittedAt: string;
  website?: string;
};

function getSql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url || url.includes("replace") || url.includes("user:password")) return null;
  if (!sql) sql = postgres(url, { max: 1, prepare: false });
  return sql;
}

export function resolveSubmissionSlug(input: Pick<SubmissionInput, "companySlug" | "companyName">) {
  const slug = input.companySlug?.trim() || slugifyCompanyName(input.companyName);
  return slug || "unknown";
}

export function isDatabaseConfigured() {
  return Boolean(getSql());
}

function summarizeMessage(message: string, max = 120) {
  const trimmed = message.trim().replace(/\s+/g, " ");
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

function buildQueueNote(input: Pick<SubmissionInput, "requestType" | "message">) {
  const summary = summarizeMessage(input.message);
  if (input.requestType === "edit") {
    return `Community edit request — ${summary}`;
  }
  return `Community request — ${summary}`;
}

export async function saveSubmission(input: SubmissionInput & { id: string }) {
  const db = getSql();
  if (!db) return { stored: false as const };
  await db`
    INSERT INTO company_submissions (
      id, request_type, company_name, company_slug, website,
      submitter_name, submitter_email, message
    ) VALUES (
      ${input.id},
      ${input.requestType},
      ${input.companyName},
      ${input.companySlug || null},
      ${input.website || null},
      ${input.submitterName},
      ${input.submitterEmail},
      ${input.message}
    )
  `;
  return { stored: true as const };
}

export async function listQueueSubmissions() {
  const db = getSql();
  if (!db) return [] as QueueSubmissionItem[];

  const rows = await db<
    Array<{
      id: string;
      request_type: "add" | "edit";
      company_name: string;
      company_slug: string | null;
      website: string | null;
      message: string;
      created_at: Date;
    }>
  >`
    SELECT id, request_type, company_name, company_slug, website, message, created_at
    FROM company_submissions
    WHERE status = 'pending'
    ORDER BY created_at DESC
    LIMIT 200
  `;

  const seen = new Set<string>();

  return rows
    .map((row) => {
      const slug = row.company_slug?.trim() || slugifyCompanyName(row.company_name);
      const input = {
        requestType: row.request_type,
        companyName: row.company_name,
        companySlug: slug,
        message: row.message,
      } as SubmissionInput;

      return {
        id: row.id,
        slug,
        name: row.company_name.trim(),
        requestType: row.request_type,
        note: buildQueueNote(input),
        submittedAt: row.created_at.toISOString(),
        website: row.website?.trim() || undefined,
      } satisfies QueueSubmissionItem;
    })
    .filter((item) => {
      if (!item.slug || item.slug === "unknown") return false;
      if (VERIFIED_SLUGS.has(item.slug)) return false;
      if (item.requestType === "edit" && !STATIC_PIPELINE_SLUGS.has(item.slug) && !ALL_COMPANY_SLUGS.includes(item.slug)) {
        return false;
      }
      if (STATIC_PIPELINE_SLUGS.has(item.slug)) return false;
      if (seen.has(item.slug)) return false;
      seen.add(item.slug);
      return true;
    });
}

export { buildAdminEmail, buildUserConfirmationEmail };
