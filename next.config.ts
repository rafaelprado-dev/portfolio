import type { NextConfig } from "next";

const isVercelPreview =
  process.env.VERCEL === "1" && process.env.VERCEL_ENV === "preview";
const vercelToolbarSource = isVercelPreview ? " https://vercel.live" : "";

const contentSecurityPolicyReportOnly = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://*.googletagmanager.com https://va.vercel-scripts.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/${vercelToolbarSource}`,
  `style-src 'self' 'unsafe-inline'${vercelToolbarSource}`,
  `img-src 'self' blob: data: https://github.com https://*.google-analytics.com https://*.googletagmanager.com${vercelToolbarSource}${isVercelPreview ? " https://vercel.com" : ""}`,
  `font-src 'self' data:${vercelToolbarSource}${isVercelPreview ? " https://assets.vercel.com" : ""}`,
  `connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://www.google.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://content-firebaseappcheck.googleapis.com${vercelToolbarSource}${isVercelPreview ? " wss://ws-us3.pusher.com" : ""}`,
  `frame-src https://archive.org https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/${vercelToolbarSource}`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const isVercelProduction =
  process.env.VERCEL === "1" &&
  process.env.VERCEL_ENV === "production" &&
  Boolean(process.env.VERCEL_URL);
const deploymentEnvironment =
  process.env.NODE_ENV === "development"
    ? "development"
    : isVercelProduction
      ? "production"
      : "disabled";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_DEPLOYMENT_ENV: deploymentEnvironment,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.rafaelprado.dev",
          },
        ],
        destination: "https://rafaelprado.dev/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none'",
          },
          ...(process.env.NODE_ENV === "production"
            ? [
                {
                  key: "Content-Security-Policy-Report-Only",
                  value: contentSecurityPolicyReportOnly,
                },
              ]
            : []),
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
