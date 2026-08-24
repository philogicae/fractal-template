"use client"

import { LanguageSwitcher } from "@components/LanguageSwitcher"
import { ThemeToggle } from "@components/ThemeToggle"
import { siteConfig } from "@config/site"
import type { Dictionary } from "@i18n/config"
import { useDict } from "@i18n/LocaleProvider"
import { useClickOutside } from "@utils/click-outside"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const navLinks = siteConfig.nav

/** Map a nav entry's `labelKey` to its translated label. */
function navLabel(
  dict: Dictionary,
  key: (typeof navLinks)[number]["labelKey"]
): string {
  return dict.nav[key]
}

interface NavLinkProps {
  href: string
  label: string
  isActive: boolean
  external: boolean
  onClick?: () => void
  mobile?: boolean
}

function NavLink({
  href,
  label,
  isActive,
  external,
  onClick,
  mobile = false,
}: NavLinkProps): React.ReactElement {
  const className = [
    mobile
      ? "px-2 py-1.5 rounded-(--radius-tags)"
      : "px-3 py-1.5 rounded-(--radius-tags)",
    "text-xs font-medium transition-colors tracking-[-0.13px]",
    isActive
      ? "bg-(--color-bg-surface) text-(--color-text-primary)"
      : "text-(--color-text-muted) hover:text-(--color-ghost-white) hover:bg-(--color-pitch-black) dark:hover:bg-(--color-ghost-white) dark:hover:text-(--color-pitch-black)",
  ].join(" ")

  if (external) {
    return (
      <a href={href} onClick={onClick} className={className}>
        {label}
      </a>
    )
  }
  return (
    <Link href={href} onClick={onClick} className={className}>
      {label}
    </Link>
  )
}

function NavList({
  pathname,
  dict,
  mobile = false,
  onItemClick,
}: {
  pathname: string
  dict: Dictionary
  mobile?: boolean
  onItemClick?: () => void
}): React.ReactElement {
  return (
    <>
      {navLinks.map((link) => (
        <NavLink
          key={link.href}
          href={link.href}
          label={navLabel(dict, link.labelKey)}
          isActive={pathname === link.href}
          external={"external" in link && link.external === true}
          onClick={onItemClick}
          mobile={mobile}
        />
      ))}
    </>
  )
}

function MobileMenuButton({
  open,
  onToggle,
  label,
  openLabel,
  closeLabel,
}: {
  open: boolean
  onToggle: () => void
  label: string
  openLabel: string
  closeLabel: string
}): React.ReactElement {
  return (
    <button
      type="button"
      id="mobile-menu-trigger"
      aria-label={label}
      aria-expanded={open}
      onClick={onToggle}
      className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-(--radius-tags) text-(--color-accent-primary) hover:text-(--color-ghost-white) hover:bg-(--color-pitch-black) dark:hover:bg-(--color-ghost-white) dark:hover:text-(--color-pitch-black) transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>{open ? closeLabel : openLabel}</title>
        {open ? (
          <>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </>
        ) : (
          <>
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </>
        )}
      </svg>
    </button>
  )
}

function Logo(): React.ReactElement {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 sm:gap-2.5 md:gap-3 hover:opacity-80 transition-opacity min-w-0"
    >
      <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 shrink-0 relative logo-halo">
        <Image
          src="/images/logo.gif"
          alt=""
          fill
          className="object-contain"
          priority
          sizes="(max-width: 640px) 20px, (max-width: 768px) 24px, 28px"
          unoptimized
        />
      </div>
      <span className="text-sm sm:text-base md:text-lg font-semibold text-(--color-text-primary) tracking-tighter truncate -mt-0.5">
        {siteConfig.shortName}
      </span>
    </Link>
  )
}

/**
 * Fixed header with logo, navigation, theme toggle, and mobile menu.
 */
export function NavBar(): React.ReactElement {
  const pathname = usePathname()
  const dict = useDict()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close menu on route change.
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Close menu when clicking anywhere on the page, except inside the dropdown itself.
  useClickOutside(
    mobileOpen,
    ["mobile-menu-dropdown", "mobile-menu-trigger"],
    () => setMobileOpen(false)
  )

  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <header className="sticky top-3 z-50 mx-3 sm:mx-4 md:mx-6 rounded-lg border border-(--color-border-default) bg-(--color-bg-primary) shadow-(--shadow-xl)">
      <div className="flex items-center justify-between h-(--navbar-height-mobile) sm:h-(--navbar-height) px-3 sm:px-4 md:px-6 w-full">
        <Logo />

        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
          <nav className="hidden md:flex items-center gap-1">
            <NavList pathname={pathname} dict={dict} />
          </nav>

          <LanguageSwitcher />
          <ThemeToggle />

          <MobileMenuButton
            open={mobileOpen}
            onToggle={toggleMobile}
            label={dict.nav.toggleMenu}
            openLabel={dict.nav.openMenu}
            closeLabel={dict.nav.closeMenu}
          />
        </div>
      </div>
      {/* Mobile menu dropdown - positioned absolutely to overlay content */}
      {mobileOpen && (
        <nav
          id="mobile-menu-dropdown"
          className="md:hidden absolute top-[calc(100%+8px)] right-0 min-w-[200px] bg-(--color-bg-secondary) border border-(--color-border-default) rounded-(--radius-cards) shadow-lg z-50"
        >
          <div className="flex flex-col p-2 gap-1">
            <NavList
              pathname={pathname}
              dict={dict}
              mobile
              onItemClick={closeMobile}
            />
          </div>
        </nav>
      )}
    </header>
  )
}
