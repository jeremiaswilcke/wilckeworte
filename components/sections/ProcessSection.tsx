'use client'

import { motion } from 'framer-motion'
import { siteContent } from '@/lib/seed-data'

export function ProcessSection() {
  const { process } = siteContent

  return (
    <section className="px-6 py-24 md:py-32" style={{ background: 'var(--bg-alt)' }}>
      <div className="mx-auto max-w-5xl">
        <p
          className="mb-4 text-center uppercase"
          style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--teal)' }}
        >
          So arbeiten wir
        </p>
        <h2
          className="mb-16 text-center"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--text)' }}
        >
          Drei Schritte zum Ergebnis
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {process.map((step, i) => (
            <motion.div
              key={step.num}
              className="relative rounded-2xl p-8"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true, margin: '-50px' }}
            >
              {/* Number */}
              <span
                className="mb-4 block"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-2xl)',
                  color: 'var(--teal)',
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {step.num}
              </span>
              {/* Title */}
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-xl)',
                  color: 'var(--text)',
                  letterSpacing: '-0.02em',
                }}
              >
                {step.title}
              </h3>
              {/* Description */}
              <p
                className="mt-3"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--text-muted)',
                  lineHeight: 1.7,
                }}
              >
                {step.description}
              </p>

              {/* Connector arrow (between cards on desktop) */}
              {i < process.length - 1 && (
                <div
                  className="absolute -right-5 top-1/2 hidden -translate-y-1/2 md:block"
                  style={{ color: 'var(--teal)', fontSize: '20px' }}
                >
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
