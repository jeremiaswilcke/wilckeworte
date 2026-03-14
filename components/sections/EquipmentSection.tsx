'use client'

import { HorizontalScroll } from '../animations/HorizontalScroll'
import { siteContent } from '@/lib/seed-data'

function EquipmentPanel({ item, index }: { item: typeof siteContent.equipment_highlights[number]; index: number }) {
  return (
    <div
      className="flex h-screen w-screen flex-shrink-0 flex-col-reverse md:flex-row"
      style={{ background: index % 2 === 0 ? 'var(--bg)' : 'var(--bg-alt)' }}
    >
      {/* Image Side (left on desktop) */}
      <div className="flex items-center justify-center p-8 md:flex-[1.2] md:p-0">
        <div
          className="flex aspect-[4/3] w-full max-w-lg items-center justify-center rounded-2xl border-2 border-dashed md:aspect-auto md:h-full md:max-w-none md:rounded-none"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--card)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-faint)',
          }}
        >
          [ {item.image_label} ]
        </div>
      </div>

      {/* Text Side (right on desktop) */}
      <div className="flex flex-1 flex-col justify-center px-8 py-12 md:px-16 lg:px-24">
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-2xl)',
            color: 'var(--text)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          {item.name}
        </h2>
        <p
          className="mt-4"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            color: 'var(--text-muted)',
            maxWidth: '45ch',
            lineHeight: 1.7,
          }}
        >
          {item.description}
        </p>
        {item.preis_tag && (
          <p
            className="mt-4"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              color: 'var(--teal)',
            }}
          >
            ab €{item.preis_tag}/Tag
          </p>
        )}
        <a
          href="/equipment"
          className="mt-8 inline-block transition-colors hover:text-[var(--coral-hover)]"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            color: 'var(--coral)',
          }}
        >
          Zum Equipment →
        </a>
      </div>
    </div>
  )
}

export function EquipmentSection() {
  const { equipment_highlights } = siteContent

  return (
    <section id="equipment">
      {/* Desktop: Horizontal Scroll */}
      <div className="hidden md:block" style={{ minWidth: 0 }}>
        <HorizontalScroll panelCount={equipment_highlights.length}>
          {equipment_highlights.map((item, i) => (
            <EquipmentPanel key={item.name} item={item} index={i} />
          ))}
        </HorizontalScroll>
      </div>

      {/* Mobile: Vertical Stack */}
      <div className="md:hidden">
        {equipment_highlights.map((item, i) => (
          <div key={item.name} className="min-h-screen" style={{ background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-alt)' }}>
            <div
              className="flex aspect-[16/9] w-full items-center justify-center border-b-2 border-dashed"
              style={{ borderColor: 'var(--border)', background: 'var(--card)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-faint)' }}
            >
              [ {item.image_label} ]
            </div>
            <div className="px-6 py-12">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--text)' }}>
                {item.name}
              </h2>
              <p className="mt-4" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                {item.description}
              </p>
              {item.preis_tag && (
                <p className="mt-3" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--teal)' }}>
                  ab €{item.preis_tag}/Tag
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
