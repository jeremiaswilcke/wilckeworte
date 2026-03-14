'use client'

import { useState } from 'react'
import { siteContent } from '@/lib/seed-data'
import { BookingModal } from '@/components/BookingModal'

export default function EquipmentPage() {
  const items = siteContent.equipment_highlights
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null)

  return (
    <div className="px-6 pt-24 pb-16" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="mx-auto max-w-6xl">
        <p
          className="mb-4 uppercase"
          style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--teal)' }}
        >
          Equipment
        </p>
        <h1
          className="mb-4"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--text)' }}
        >
          Unser Equipment
        </h1>
        <p
          className="mb-12"
          style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--teal)' }}
        >
          Alle Preise auf Rechnung — keine Vorzahlung nötig.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.name}
              className="flex flex-col rounded-2xl overflow-hidden"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div
                className="flex aspect-[4/3] items-center justify-center border-b border-dashed"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--bg-alt)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-faint)',
                }}
              >
                [ {item.image_label} ]
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--text)' }}>
                  {item.name}
                </h2>
                <p
                  className="mt-2 flex-1"
                  style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.7 }}
                >
                  {item.description}
                </p>
                {item.preis_tag && (
                  <p className="mt-3" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--teal)' }}>
                    ab €{item.preis_tag}/Tag
                  </p>
                )}
                <button
                  onClick={() => setSelectedEquipment(item.name)}
                  className="mt-4 w-full cursor-pointer rounded-full border px-6 py-2 text-center text-sm transition-colors hover:bg-[var(--coral-soft)]"
                  style={{
                    fontFamily: 'var(--font-body)',
                    borderColor: 'var(--coral)',
                    color: 'var(--coral)',
                  }}
                >
                  Jetzt anfragen
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BookingModal
        open={!!selectedEquipment}
        onClose={() => setSelectedEquipment(null)}
        type="equipment"
        equipment={selectedEquipment ? { equipment_name: selectedEquipment } : undefined}
      />
    </div>
  )
}
