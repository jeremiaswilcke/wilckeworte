'use client'

import { useState, useEffect } from 'react'
import { siteContent } from '@/lib/seed-data'
import { BookingModal } from '@/components/BookingModal'

interface EquipmentItem {
  id: number
  name: string
  description: string
  preis_tag: number | null
  image_url: string | null
}

export default function EquipmentPage() {
  const [items, setItems] = useState<EquipmentItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/equipment')
      .then((res) => res.json())
      .then((data) => {
        if (data.equipment?.length > 0) {
          setItems(data.equipment)
        } else {
          // Fallback to seed data
          setItems(siteContent.equipment_highlights.map((e, i) => ({
            id: i,
            name: e.name,
            description: e.description,
            preis_tag: e.preis_tag,
            image_url: null,
          })))
        }
        setLoaded(true)
      })
      .catch(() => {
        setItems(siteContent.equipment_highlights.map((e, i) => ({
          id: i, name: e.name, description: e.description, preis_tag: e.preis_tag, image_url: null,
        })))
        setLoaded(true)
      })
  }, [])

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

        {!loaded ? (
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>Lädt...</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col rounded-2xl overflow-hidden"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <div
                    className="flex aspect-[4/3] items-center justify-center border-b border-dashed"
                    style={{
                      borderColor: 'var(--border)', background: 'var(--bg-alt)',
                      fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-faint)',
                    }}
                  >
                    [ {item.name} ]
                  </div>
                )}
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
                  {item.preis_tag != null && (
                    <p className="mt-3" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--teal)' }}>
                      ab €{item.preis_tag}/Tag
                    </p>
                  )}
                  <button
                    onClick={() => setSelectedEquipment(item.name)}
                    className="mt-4 w-full cursor-pointer rounded-full border px-6 py-2 text-center text-sm transition-colors hover:bg-[var(--coral-soft)]"
                    style={{ fontFamily: 'var(--font-body)', borderColor: 'var(--coral)', color: 'var(--coral)' }}
                  >
                    Jetzt anfragen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
