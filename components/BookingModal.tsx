'use client'

import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type BookingType = 'paket' | 'projekt' | 'equipment'

interface PaketPrefill {
  paket_id: string
  paket_name: string
  kategorie: string
  preis: number
  einheit: string
}

interface EquipmentPrefill {
  equipment_name: string
}

interface Props {
  open: boolean
  onClose: () => void
  type: BookingType
  paket?: PaketPrefill
  equipment?: EquipmentPrefill
}

const artOptions = ['Podcast', 'Video', 'Livestream', 'Sonstiges']

export function BookingModal({ open, onClose, type, paket, equipment }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)

    const base = {
      type,
      name: fd.get('name'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      company: fd.get('company'),
      website: fd.get('website'), // honeypot
    }

    let payload: Record<string, unknown> = base

    if (type === 'paket' && paket) {
      payload = {
        ...base,
        paket_id: paket.paket_id,
        paket_name: paket.paket_name,
        kategorie: paket.kategorie,
        preis: paket.preis,
        einheit: paket.einheit,
        startdatum: fd.get('startdatum'),
        nachricht: fd.get('nachricht'),
      }
    } else if (type === 'projekt') {
      payload = {
        ...base,
        art: fd.get('art'),
        beschreibung: fd.get('beschreibung'),
        budget: fd.get('budget'),
      }
    } else if (type === 'equipment') {
      payload = {
        ...base,
        equipment_name: equipment?.equipment_name ?? fd.get('equipment_name'),
        von: fd.get('von'),
        bis: fd.get('bis'),
        nachricht: fd.get('nachricht'),
      }
    }

    setStatus('sending')
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        const json = await res.json()
        setErrorMsg(json.error || 'Ein Fehler ist aufgetreten.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Verbindungsfehler. Bitte versuche es erneut.')
      setStatus('error')
    }
  }

  function handleClose() {
    setStatus('idle')
    setErrorMsg('')
    onClose()
  }

  const title =
    type === 'paket'
      ? `${paket?.paket_name} buchen`
      : type === 'equipment'
      ? `${equipment?.equipment_name} anfragen`
      : 'Projekt anfragen'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-8"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
          >
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-2xl leading-none transition-colors hover:text-[var(--coral)]"
              style={{ color: 'var(--text-faint)' }}
              aria-label="Schließen"
            >
              ×
            </button>

            <h2
              className="mb-2"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--text)' }}
            >
              {title}
            </h2>

            {/* Paket info */}
            {type === 'paket' && paket && (
              <div
                className="mb-6 rounded-lg p-4"
                style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-baseline justify-between">
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                    {paket.kategorie === 'selbstproduktion' ? 'Selbstproduktion' : 'Voller Service'}
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--text)' }}>
                    €{paket.preis}<span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                      /{paket.einheit === 'monatlich' ? 'Monat' : 'einmalig'}
                    </span>
                  </span>
                </div>
              </div>
            )}

            {/* Equipment info */}
            {type === 'equipment' && equipment && (
              <p className="mb-6" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                Verleih-Anfrage für: <strong style={{ color: 'var(--text)' }}>{equipment.equipment_name}</strong>
              </p>
            )}

            {/* Invoice notice */}
            <div
              className="mb-6 flex items-center gap-2 rounded-lg px-4 py-3"
              style={{ background: 'var(--teal-soft)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--teal)' }}
            >
              <span>✓</span> Bezahlung auf Rechnung — keine Vorzahlung nötig.
            </div>

            {status === 'success' ? (
              <div className="text-center py-8">
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--text)' }}>
                  Anfrage gesendet!
                </p>
                <p className="mt-2" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                  Wir melden uns innerhalb von 24 Stunden bei dir.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-6 rounded-full px-6 py-2 text-sm transition-colors"
                  style={{ fontFamily: 'var(--font-body)', border: '1px solid var(--border)', color: 'var(--text)' }}
                >
                  Schließen
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Honeypot */}
                <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField label="Name *" name="name" type="text" required />
                  <InputField label="E-Mail *" name="email" type="email" required />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField label="Telefon" name="phone" type="tel" />
                  <InputField label="Firma / Organisation" name="company" type="text" />
                </div>

                {/* Type-specific fields */}
                {type === 'paket' && (
                  <>
                    <InputField label="Gewünschter Start" name="startdatum" type="date" />
                    <TextareaField label="Nachricht / Anmerkungen" name="nachricht" rows={3} />
                  </>
                )}

                {type === 'projekt' && (
                  <>
                    <SelectField label="Art des Projekts *" name="art" options={artOptions} />
                    <TextareaField label="Projektbeschreibung *" name="beschreibung" rows={4} required />
                    <InputField label="Budget-Rahmen (optional)" name="budget" type="text" placeholder="z.B. ca. €500" />
                  </>
                )}

                {type === 'equipment' && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <InputField label="Von *" name="von" type="date" required />
                      <InputField label="Bis *" name="bis" type="date" required />
                    </div>
                    <TextareaField label="Nachricht / Einsatzzweck" name="nachricht" rows={3} />
                  </>
                )}

                {status === 'error' && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--coral)' }}>
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="mt-2 rounded-full px-8 py-3 text-sm font-bold uppercase text-white transition-colors disabled:opacity-60"
                  style={{ fontFamily: 'var(--font-display)', background: 'var(--coral)', letterSpacing: '0.05em' }}
                >
                  {status === 'sending' ? 'Wird gesendet...' : 'Verbindlich anfragen'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function InputField({
  label, name, type, required, placeholder,
}: {
  label: string; name: string; type: string; required?: boolean; placeholder?: string
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block uppercase"
        style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--text-muted)' }}
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg px-4 py-2.5 outline-none transition-colors"
        style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)',
          background: 'var(--bg-alt)', border: '1px solid var(--border)', color: 'var(--text)',
        }}
      />
    </div>
  )
}

function TextareaField({
  label, name, rows, required,
}: {
  label: string; name: string; rows: number; required?: boolean
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block uppercase"
        style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--text-muted)' }}
      >
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        className="w-full resize-y rounded-lg px-4 py-2.5 outline-none transition-colors"
        style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)',
          background: 'var(--bg-alt)', border: '1px solid var(--border)', color: 'var(--text)',
        }}
      />
    </div>
  )
}

function SelectField({
  label, name, options,
}: {
  label: string; name: string; options: string[]
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block uppercase"
        style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--text-muted)' }}
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        className="w-full rounded-lg px-4 py-2.5 outline-none transition-colors"
        style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)',
          background: 'var(--bg-alt)', border: '1px solid var(--border)', color: 'var(--text)',
        }}
      >
        {options.map((o) => <option key={o} value={o.toLowerCase()}>{o}</option>)}
      </select>
    </div>
  )
}
