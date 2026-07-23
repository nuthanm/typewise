import { getSiteUrl } from "@/lib/site-meta";

const LOCAL_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"];

function allowedOrigins() {
  const site = getSiteUrl("");
  const origins = new Set(LOCAL_ORIGINS);
  if (site) origins.add(site);
  const extra = process.env.API_CORS_ORIGINS?.split(",").map((o) => o.trim()).filter(Boolean) ?? [];
  for (const origin of extra) origins.add(origin);
  return origins;
}

export function isAllowedOrigin(origin: string | null) {
  if (!origin) return false;
  return allowedOrigins().has(origin);
}

export function corsHeaders(origin: string | null): Record<string, string> {
  if (!origin || !isAllowedOrigin(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

export function corsPreflightResponse(request: Request) {
  const origin = request.headers.get("origin");
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

export function jsonResponse(
  body: unknown,
  request: Request,
  init?: { status?: number; headers?: Record<string, string> },
) {
  const origin = request.headers.get("origin");
  return Response.json(body, {
    status: init?.status ?? 200,
    headers: {
      ...corsHeaders(origin),
      ...(init?.headers ?? {}),
    },
  });
}
