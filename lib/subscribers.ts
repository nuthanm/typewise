import postgres from "postgres";

let sql: ReturnType<typeof postgres> | null = null;

function getSql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url || url.includes("replace") || url.includes("user:password")) return null;
  if (!sql) sql = postgres(url, { max: 1, prepare: false });
  return sql;
}

export async function saveSubscriber(input: { id: string; email: string; name?: string; source?: string }) {
  const db = getSql();
  if (!db) return { stored: false as const };
  await db`
    INSERT INTO catalog_subscribers (id, email, name, source)
    VALUES (${input.id}, ${input.email}, ${input.name ?? null}, ${input.source ?? "submit_form"})
    ON CONFLICT (email) DO NOTHING
  `;
  return { stored: true as const };
}
