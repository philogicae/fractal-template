/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output produces a minimal production server bundle
  // (~70% smaller Docker images). See Dockerfile `runner` stage.
  // Disabled on Vercel: its build pipeline expects .next/next-server.js.nft.json,
  // which Turbopack + standalone doesn't emit (ENOENT at onBuildComplete).
  output: process.env.VERCEL ? undefined : "standalone",
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  devIndicators: false,

  // Image optimization.
  //
  // SECURITY: `dangerouslyAllowSVG` + wildcard `remotePatterns` is an XSS
  // footgun. We mitigate by forcing a strict CSP on image responses.
  // Tighten `remotePatterns` to your actual image hosts in production.
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; style-src 'unsafe-inline'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Turbopack optimizations (top-level)
  turbopack: {
    resolveExtensions: [".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
  },

  // Next 16.3.1 standalone tracing drops @swc/helpers' esm/ dir, crashing boot
  // with MODULE_NOT_FOUND for esm/_interop_require_default.js. Keeping it
  // external forces the full package into the standalone output. Harmless on
  // earlier 16.x — add before any next bump past 16.3.0.
  serverExternalPackages: ["@swc/helpers"],

  // Experimental features for performance
  experimental: {
    optimizePackageImports: ["@heroui/react", "@heroui/styles"],
  },

  compiler: {
    // Remove console.* and debugger statements in production
    removeConsole: {
      exclude: ["error"],
    },
  },

  // Headers for caching and security
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          // X-XSS-Protection intentionally omitted: deprecated/harmful
          // on modern browsers. Use a Content-Security-Policy instead.
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // Cache static assets - 1 week (Next.js cache busting via content hashing)
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800",
          },
        ],
      },
      {
        // Cache fonts - 1 week
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800",
          },
        ],
      },
      {
        // Cache Next.js static chunks (JS/CSS) - 1 week
        // Next.js uses content hashing in filenames, so new builds get new URLs
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
