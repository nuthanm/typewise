import postgres from "postgres";
import type { FeedbackInput } from "./validators";

let sql: ReturnType<typeof postgres> | null = null;

function getSql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url || url.includes("replace") || url.includes("user:password")) return null;
  if (!sql) sql = postgres(url, { max: 1, prepare: false });
  return sql;
}

export async function saveFeedback(input: FeedbackInput & { id: string }) {
  const db = getSql();
  if (!db) return { stored: false as const };
  await db`
    INSERT INTO site_feedback (id, name, email, helped, message)
    VALUES (
      ${input.id},
      ${input.name},
      ${input.email},
      ${input.helped},
      ${input.message || null}
    )
  `;
  return { stored: true as const };
}

export function helpedLabel(helped: FeedbackInput["helped"]) {
  if (helped === "yes") return "Yes — helped pick the right company";
  if (helped === "somewhat") return "Somewhat helpful";
  return "Not really helpful yet";
}
