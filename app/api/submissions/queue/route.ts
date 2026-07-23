import { jsonResponse, corsPreflightResponse } from "@/lib/api/cors";
import { isDatabaseConfigured, listQueueSubmissions } from "@/lib/submissions";

export async function OPTIONS(request: Request) {
  return corsPreflightResponse(request);
}

export async function GET(request: Request) {
  if (!isDatabaseConfigured()) {
    return jsonResponse({ ok: true, items: [] }, request);
  }

  try {
    const items = await listQueueSubmissions();
    return jsonResponse({ ok: true, items }, request);
  } catch {
    return jsonResponse({ ok: false, error: "Unable to load review queue." }, request, { status: 500 });
  }
}
