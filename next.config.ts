import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const staticExport = process.env.STATIC_EXPORT === "true";

const baseSecurityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const productionCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://pagead2.googlesyndication.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://challenges.cloudflare.com https://pagead2.googlesyndication.com",
  "frame-src https://challenges.cloudflare.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export" as const } : {}),
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  ...(!staticExport
    ? {
        async headers() {
          const headers = [...baseSecurityHeaders];
          if (isProd) {
            headers.push({ key: "Content-Security-Policy", value: productionCsp });
          }
          return [{ source: "/(.*)", headers }];
        },
        async redirects() {
          return [
            { source: "/privacy", destination: "/privacy-policy", permanent: true },
            { source: "/terms", destination: "/terms-and-conditions", permanent: true },
            { source: "/prototype", destination: "/", permanent: false },
          ];
        },
      }
    : {
        trailingSlash: true,
      }),
};

export default nextConfig;
