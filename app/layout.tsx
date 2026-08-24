import "./globals.css"
import { siteConfig } from "@config/site"
import { getCurrentDictionary } from "@i18n/server"
import { Footer } from "@layout/Footer"
import { NavBar } from "@layout/Navbar"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata, Viewport } from "next"
import { IBM_Plex_Mono, Inter } from "next/font/google"
import { Providers } from "./providers"

const isVercel = !!process.env.VERCEL

/**
 * Root layout for the Next.js application.
 * Configures fonts, metadata, and global viewport settings.
 * Uses Linear design system: Inter for UI, IBM Plex Mono for code.
 */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  preload: true,
  display: "swap",
  adjustFontFallback: true,
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  preload: true,
  display: "swap",
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  manifest: "/manifest.json",
  title: siteConfig.name,
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/images/apple-touch-icon.png",
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
    siteName: siteConfig.name,
    url: siteConfig.url,
    images: [
      {
        url: "/images/screenshot.jpeg",
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/images/screenshot.jpeg"],
  },
}

export const viewport: Viewport = {
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: siteConfig.themeColor.light,
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: siteConfig.themeColor.dark,
    },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}): Promise<React.ReactElement> {
  const { locale, dict } = await getCurrentDictionary()
  const cfWebAnalyticsToken = process.env.CF_WEB_ANALYTICS_TOKEN
  // Computed on the server so the prerendered markup and the hydrated
  // client agree — a client-side `new Date().getFullYear()` bakes the
  // build-time year into static HTML and can mismatch across New Year.
  const year = new Date().getFullYear()
  return (
    <html
      lang={locale}
      className={`${inter.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
         * Opt out of Dark Reader / Night Eye / Midnight Lizard style
         * extensions — this site ships its own dark mode. Without this they
         * re-color every element (cyan becomes yellow, text-transparent
         * gradients break, Logo classes get rewritten causing hydration
         * mismatches).
         * See https://github.com/darkreader/darkreader#how-to-exclude-a-website
         */}
        <meta name="darkreader-lock" />
        {/* Cloudflare Web Analytics — enabled per instance via CF_WEB_ANALYTICS_TOKEN
        (omit the var to disable); posts RUM data to /cdn-cgi/rum. */}
        {cfWebAnalyticsToken && (
          <script
            type="module"
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${cfWebAnalyticsToken}"}`}
          />
        )}
      </head>
      <body className="antialiased">
        <Providers locale={locale} dict={dict}>
          <NavBar />
          <main>{children}</main>
          <Footer year={year} />
        </Providers>
        {isVercel && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  )
}
