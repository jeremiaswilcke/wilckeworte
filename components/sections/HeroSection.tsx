'use client'

import { motion } from 'framer-motion'
import { GradientOrb } from '../animations/GradientOrb'
import { siteContent } from '@/lib/seed-data'

export function HeroSection() {
  const { hero } = siteContent

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6" style={{ paddingTop: '64px' }}>
      <GradientOrb />

      <motion.div
        className="relative z-10 max-w-3xl text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Tagline */}
        <p
          className="mb-6 uppercase"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            letterSpacing: '0.15em',
            color: 'var(--teal)',
          }}
        >
          {hero.tagline}
        </p>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-hero)',
            color: 'var(--text)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}
        >
          {hero.headline}
        </h1>

        {/* Subline */}
        <p
          className="mx-auto mt-6"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            color: 'var(--text-muted)',
            maxWidth: '54ch',
            lineHeight: 1.7,
          }}
        >
          {hero.subline}
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#kontakt"
            className="rounded-full px-8 py-3 text-sm font-bold uppercase text-white transition-colors"
            style={{
              fontFamily: 'var(--font-display)',
              background: 'var(--coral)',
              letterSpacing: '0.05em',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--coral-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--coral)')}
          >
            {hero.cta_primary}
          </a>
          <a
            href="#preise"
            className="rounded-full border px-8 py-3 text-sm uppercase transition-colors"
            style={{
              fontFamily: 'var(--font-body)',
              borderColor: 'var(--border-strong)',
              color: 'var(--text)',
              letterSpacing: '0.05em',
            }}
          >
            {hero.cta_secondary}
          </a>
        </div>
      </motion.div>
    </section>
  )
}
