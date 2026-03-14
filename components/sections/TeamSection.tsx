'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { siteContent } from '@/lib/seed-data'

function TeamCard({ member }: { member: typeof siteContent.team[number] }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="cursor-pointer rounded-2xl p-6 transition-shadow hover:shadow-lg"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Portrait Placeholder */}
      <div
        className="mb-4 flex aspect-square w-full items-center justify-center rounded-xl border-2 border-dashed"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--bg-alt)',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-faint)',
        }}
      >
        [ Portrait ]
      </div>

      <h3
        style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--text)' }}
      >
        {member.name}
      </h3>
      <p
        className="mt-1"
        style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--teal)', textTransform: 'uppercase' }}
      >
        {member.rolle}
      </p>

      <AnimatePresence>
        {expanded && (
          <motion.p
            className="mt-3"
            style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.7 }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {member.kurz_bio}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export function TeamSection() {
  return (
    <section id="team" className="px-6 py-24 md:py-32" style={{ background: 'var(--bg-alt)' }}>
      <div className="mx-auto max-w-5xl">
        <p
          className="mb-4 text-center uppercase"
          style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--teal)' }}
        >
          Team
        </p>
        <h2
          className="mb-16 text-center"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--text)' }}
        >
          Die Menschen dahinter
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {siteContent.team.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  )
}
