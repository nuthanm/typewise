import postgres from "postgres";
import { buildAdminEmail, buildUserConfirmationEmail } from "./email-templates";
import type { SubmissionInput } from "./validators";

let sql: ReturnType<typeof postgres> | null = null;

function getSql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url || url.includes("replace") || url.includes("user:password")) return null;
  if (!sql) sql = postgres(url, { max: 1, prepare: false });
  return sql;
}

export function isDatabaseConfigured() {
  return Boolean(getSql());
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

export { buildAdminEmail, buildUserConfirmationEmail };
