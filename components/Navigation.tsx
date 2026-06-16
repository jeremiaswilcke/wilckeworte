'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ThemeToggle } from './ThemeToggle'

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Preise', href: '#preise' },
  { label: 'Equipment', href: '#equipment' },
  { label: 'Team', href: '#team' },
  { label: 'Blog', href: '/blog' },
  { label: 'Kontakt', href: '#kontakt' },
]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-shadow duration-300"
      style={{
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: scrolled ? 'var(--shadow)' : 'none',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <a href="/" className="flex-shrink-0">
          <Image
            src="/images/Logo_wilcke.png"
            alt="Wilcke Worte und Visionen"
            width={120}
            height={40}
            style={{ height: '40px', width: 'auto' }}
            priority
          />
        </a>

        {/* Desktop Links */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] uppercase tracking-[0.15em] transition-colors hover:text-[var(--coral)]"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}
            >
              {link.label}
            </a>
          ))}
          <ThemeToggle />
          <a
            href="#kontakt"
            className="rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition-colors"
            style={{
              fontFamily: 'var(--font-display)',
              background: 'var(--coral)',
              letterSpacing: '0.05em',
              fontSize: '12px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--coral-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--coral)')}
          >
            Projekt starten
          </a>
        </div>

        {/* Mobile: ThemeToggle + Burger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--coral-soft)]"
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-16 z-40 flex flex-col items-center gap-6 pt-12 md:hidden"
          style={{ background: 'var(--bg)' }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-lg uppercase tracking-[0.15em] transition-colors hover:text-[var(--coral)]"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--text)' }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#kontakt"
            onClick={() => setMobileOpen(false)}
            className="mt-4 rounded-full px-8 py-3 text-sm font-bold uppercase text-white transition-colors"
            style={{
              fontFamily: 'var(--font-display)',
              background: 'var(--coral)',
            }}
          >
            Projekt starten
          </a>
        </div>
      )}
    </nav>
  )
}
