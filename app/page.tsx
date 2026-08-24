import { Container } from "@components/Container"
import { FeatureCard } from "@components/FeatureCard"
import { siteConfig } from "@config/site"
import type { Dictionary } from "@i18n/config"
import { getCurrentDictionary } from "@i18n/server"
import Link from "next/link"

/**
 * Background grid pattern with subtle Linear-style glow.
 */
function BackgroundDecor(): React.ReactElement {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(var(--color-accent-primary) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-accent-primary) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />
      <div
        className="absolute left-1/2 top-[-10%] h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-3xl opacity-[0.15]"
        style={{
          background:
            "radial-gradient(circle, var(--color-accent-primary) 0%, transparent 70%)",
        }}
      />
    </div>
  )
}

/**
 * CSS-based entrance animation wrapper with reduced motion support.
 */
function AnimatedSection({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}): React.ReactElement {
  const delayStyle = delay > 0 ? { animationDelay: `${delay}ms` } : undefined

  return (
    <div
      className={`animate-fade-in-up opacity-0 fill-mode-forwards ${className}`}
      style={delayStyle}
    >
      {children}
    </div>
  )
}
type FeatureKey = keyof Dictionary["landing"]["features"]

/** Anchor-as-button styles: keeps real link semantics without nesting a
 * `<button>` inside an `<a>` (invalid interactive nesting). */
const ctaClass =
  "inline-flex items-center justify-center w-40 sm:w-auto h-8 sm:h-9 rounded-(--radius-buttons) text-xs transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent-secondary)"
const primaryCtaClass = `${ctaClass} px-4 sm:px-6 bg-(--color-accent-primary) hover:brightness-110 text-(--color-bg-primary) font-semibold`
const ghostCtaClass = `${ctaClass} px-4 text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-(--color-bg-surface)`

/** Brand/tech names are kept as-is; only the description is localized. */
const features = [
  { name: "Next.js 16", icon: "▲", descKey: "nextjs" },
  { name: "React 19", icon: "⚛", descKey: "react" },
  { name: "Tailwind 4", icon: "🌊", descKey: "tailwind" },
  { name: "HeroUI v3", icon: "🎨", descKey: "heroui" },
  { name: "Biome", icon: "🛠️", descKey: "biome" },
  { name: "SKILL.md", icon: "📄", descKey: "skill" },
] as const satisfies readonly {
  name: string
  icon: string
  descKey: FeatureKey
}[]

/**
 * Landing page with CSS-animated hero and feature grid.
 * Server Component — reads the dictionary for the active locale.
 */
export default async function LandingPage(): Promise<React.ReactElement> {
  const { dict } = await getCurrentDictionary()
  const t = dict.landing
  const githubHref =
    siteConfig.social.find((s) => s.label === "GitHub")?.href ?? siteConfig.url

  return (
    <div className="relative w-full flex-1 flex flex-col">
      <BackgroundDecor />

      <section className="relative w-full flex-1 flex flex-col justify-center px-4 py-8 sm:py-12">
        <Container size="md">
          <AnimatedSection delay={100} className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center text-(--color-text-primary) tracking-tight">
              {t.headingPrefix}{" "}
              <span className="heading-accent-gradient">{t.headingAccent}</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={200} className="mb-6 sm:mb-8">
            <p className="text-xs sm:text-sm md:text-base text-(--color-text-secondary) text-center max-w-xl mx-auto leading-relaxed px-2 tracking-[-0.13px]">
              {t.subtitleLine1}
              <br />
              {t.subtitleLine2}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={300} className="mb-8 sm:mb-12 md:mb-16">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center items-center">
              <Link href="/playground" className={primaryCtaClass}>
                {t.ctaPlayground}
              </Link>
              <a href="/skill.md" className={ghostCtaClass}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="mr-1 sm:mr-1.5"
                >
                  <title>{t.ctaSkill}</title>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                {t.ctaSkill}
              </a>
              <a
                href={githubHref}
                target="_blank"
                rel="noopener noreferrer"
                className={ghostCtaClass}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="mr-1 sm:mr-1.5"
                >
                  <title>{t.ctaGithub}</title>
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                {t.ctaGithub}
              </a>
              <a
                href={`https://vercel.com/new/clone?repository-url=${encodeURIComponent(githubHref)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={ghostCtaClass}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mr-1 sm:mr-1.5"
                >
                  <title>{t.ctaVercel}</title>
                  <path d="M24 22.525H0l12-21.05 12 21.05z" />
                </svg>
                {t.ctaVercel}
              </a>
            </div>
          </AnimatedSection>
        </Container>

        <Container size="lg">
          <AnimatedSection delay={500}>
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-3 md:gap-4">
              {features.map((feature) => (
                <FeatureCard
                  key={feature.name}
                  icon={feature.icon}
                  name={feature.name}
                  description={t.features[feature.descKey]}
                />
              ))}
            </div>
          </AnimatedSection>
        </Container>
      </section>
    </div>
  )
}
