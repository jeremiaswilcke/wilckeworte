'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { siteContent, type Paket } from '@/lib/seed-data'
import { BookingModal } from '../BookingModal'

type Kategorie = 'selbstproduktion' | 'voller_service'

function PaketCard({ paket, kategorie, onBook }: { paket: Paket; kategorie: Kategorie; onBook: () => void }) {
  const isEmpfohlen = paket.empfohlen

  return (
    <div
      className="relative flex flex-col rounded-2xl p-8"
      style={{
        background: 'var(--card)',
        border: isEmpfohlen ? '2px solid var(--coral)' : '1px solid var(--border)',
        boxShadow: isEmpfohlen ? '0 0 40px var(--coral-soft)' : 'none',
      }}
    >
      {isEmpfohlen && (
        <span
          className="absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-bold uppercase text-white"
          style={{ background: 'var(--coral)', fontFamily: 'var(--font-body)', letterSpacing: '0.1em' }}
        >
          Empfohlen
        </span>
      )}
      <p
        className="mb-1"
        style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}
      >
        {paket.sub}
      </p>
      <h3
        style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--text)' }}
      >
        {paket.name}
      </h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--text)' }}>
          €{paket.preis}
        </span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          /{paket.einheit === 'monatlich' ? 'Monat' : 'einmalig'}
        </span>
      </div>
      <p className="mt-2" style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--teal)' }}>
        Bezahlung auf Rechnung
      </p>
      <ul className="mt-6 flex flex-1 flex-col gap-3">
        {paket.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2"
            style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}
          >
            <span style={{ color: 'var(--teal)', flexShrink: 0 }}>✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <button
        onClick={onBook}
        className="mt-8 block w-full cursor-pointer rounded-full py-3 text-center text-sm font-bold uppercase transition-colors"
        style={{
          fontFamily: 'var(--font-display)',
          background: isEmpfohlen ? 'var(--coral)' : 'transparent',
          color: isEmpfohlen ? '#fff' : 'var(--coral)',
          border: isEmpfohlen ? 'none' : '1px solid var(--coral)',
          letterSpacing: '0.05em',
        }}
      >
        Jetzt buchen
      </button>
    </div>
  )
}

export function PricingSection() {
  const [step, setStep] = useState<1 | 2>(1)
  const [kategorie, setKategorie] = useState<Kategorie | null>(null)
  const [selectedPaket, setSelectedPaket] = useState<{ paket: Paket; kategorie: Kategorie } | null>(null)

  const pakete = kategorie ? siteContent.pakete[kategorie] : []

  return (
    <section id="preise" className="px-6 py-24 md:py-32" style={{ background: 'var(--bg)' }}>
      <div className="mx-auto max-w-5xl">
        <p
          className="mb-4 text-center uppercase"
          style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--teal)' }}
        >
          Preise
        </p>
        <h2
          className="mb-4 text-center"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--text)' }}
        >
          Das richtige Paket für dich
        </h2>
        <p
          className="mx-auto mb-12 max-w-lg text-center"
          style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--text-muted)' }}
        >
          Wähle zuerst, wie viel Unterstützung du brauchst.
        </p>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              className="grid gap-6 md:grid-cols-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => { setKategorie('selbstproduktion'); setStep(2) }}
                className="cursor-pointer rounded-2xl p-8 text-left transition-shadow hover:shadow-lg"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--text)' }}>
                  Selbstproduktion
                </h3>
                <p className="mt-3" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  Du produzierst selbst — wir stellen Studio und Equipment. Ideal für regelmäßige Formate.
                </p>
              </button>
              <button
                onClick={() => { setKategorie('voller_service'); setStep(2) }}
                className="cursor-pointer rounded-2xl p-8 text-left transition-shadow hover:shadow-lg"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--text)' }}>
                  Voller Service
                </h3>
                <p className="mt-3" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  Wir übernehmen alles — von der Aufnahme bis zur fertigen Folge auf allen Plattformen.
                </p>
              </button>
            </motion.div>
          )}

          {step === 2 && kategorie && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setStep(1)}
                className="mb-8 transition-colors hover:text-[var(--coral)]"
                style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}
              >
                ← Zurück zur Auswahl
              </button>
              <div className="grid gap-6 md:grid-cols-3">
                {pakete.map((paket) => (
                  <PaketCard
                    key={paket.id}
                    paket={paket as unknown as Paket}
                    kategorie={kategorie}
                    onBook={() => setSelectedPaket({ paket: paket as unknown as Paket, kategorie })}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Booking Modal */}
      {selectedPaket && (
        <BookingModal
          open={!!selectedPaket}
          onClose={() => setSelectedPaket(null)}
          type="paket"
          paket={{
            paket_id: selectedPaket.paket.id,
            paket_name: selectedPaket.paket.name,
            kategorie: selectedPaket.kategorie,
            preis: selectedPaket.paket.preis,
            einheit: selectedPaket.paket.einheit,
          }}
        />
      )}
    </section>
  )
}
