'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { siteContent } from '@/lib/seed-data'

interface EquipmentItem {
  id: number
  name: string
  description: string
  preis_tag: number | null
  image_url: string | null
  category: string
}

const CATEGORY_ORDER = ['Kameras', 'Objektive', 'Mikrofone', 'Licht', 'Bewegung', 'Regie & Tontechnik']

function groupByCategory(items: EquipmentItem[]): [string, EquipmentItem[]][] {
  const groups = new Map<string, EquipmentItem[]>()
  for (const item of items) {
    const key = item.category || 'Sonstiges'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(item)
  }
  const ordered = CATEGORY_ORDER.filter((c) => groups.has(c))
  const rest = [...groups.keys()].filter((c) => !CATEGORY_ORDER.includes(c)).sort()
  return [...ordered, ...rest].map((c) => [c, groups.get(c)!])
}

function tageZwischen(von: string, bis: string): number {
  if (!von || !bis) return 0
  const diff = Math.round((new Date(bis).getTime() - new Date(von).getTime()) / 86_400_000) + 1
  return diff > 0 ? diff : 0
}

const heute = () => new Date().toISOString().slice(0, 10)

export default function EquipmentPage() {
  const [items, setItems] = useState<EquipmentItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const [von, setVon] = useState('')
  const [bis, setBis] = useState('')
  const [unavailable, setUnavailable] = useState<number[] | null>(null)
  const [cart, setCart] = useState<number[]>([])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [nachricht, setNachricht] = useState('')
  const [website, setWebsite] = useState('') // Honeypot
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null)

  useEffect(() => {
    fetch('/api/equipment')
      .then((res) => res.json())
      .then((data) => {
        if (data.equipment?.length > 0) {
          setItems(data.equipment)
        } else {
          setItems(siteContent.equipment_highlights.map((e, i) => ({
            id: i, name: e.name, description: e.description, preis_tag: e.preis_tag, image_url: null, category: 'Equipment',
          })))
        }
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  const datesValid = !!von && !!bis && von <= bis
  const tage = tageZwischen(von, bis)

  const loadAvailability = useCallback(async () => {
    if (!datesValid) { setUnavailable(null); return }
    try {
      const res = await fetch(`/api/equipment/availability?von=${von}&bis=${bis}`)
      const data = await res.json()
      setUnavailable(Array.isArray(data.unavailable) ? data.unavailable : [])
    } catch {
      setUnavailable([])
    }
  }, [von, bis, datesValid])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAvailability()
  }, [loadAvailability])

  function isBlocked(id: number): boolean {
    return !!unavailable && unavailable.includes(id)
  }

  function toggleCart(id: number) {
    setCart((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))
  }

  const cartItems = items.filter((i) => cart.includes(i.id))
  const summe = tage * cartItems.reduce((s, i) => s + (i.preis_tag ?? 0), 0)

  async function submit() {
    setSubmitting(true)
    setResult(null)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'equipment', name, email, phone, von, bis, items: cart, nachricht, website }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setResult({ ok: true, msg: 'Anfrage gesendet — wir melden uns mit einem Angebot.' })
        setCart([])
        setName(''); setEmail(''); setPhone(''); setNachricht('')
      } else {
        setResult({ ok: false, msg: data.error ?? 'Es ist ein Fehler aufgetreten.' })
      }
    } catch {
      setResult({ ok: false, msg: 'Verbindungsfehler. Bitte später erneut versuchen.' })
    } finally {
      setSubmitting(false)
    }
  }

  const label = { fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--teal)' } as const
  const inputStyle = {
    fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)',
    background: 'var(--bg-alt)', border: '1px solid var(--border)', color: 'var(--text)',
  } as const

  return (
    <div className="px-6 pt-24 pb-40" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 uppercase" style={label}>Equipment</p>
        <h1 className="mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--text)' }}>
          Equipment mieten
        </h1>
        <p className="mb-10" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--teal)' }}>
          Zeitraum wählen, verfügbares Equipment in den Warenkorb legen, Anfrage senden. Alles auf Rechnung — keine Vorauszahlung.
        </p>

        {/* Zeitraum */}
        <div
          className="mb-12 flex flex-wrap items-end gap-4 rounded-2xl p-6"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div>
            <label className="mb-1 block uppercase" style={label}>Von</label>
            <input type="date" min={heute()} value={von} onChange={(e) => setVon(e.target.value)} className="rounded-lg px-4 py-2.5 outline-none" style={inputStyle} />
          </div>
          <div>
            <label className="mb-1 block uppercase" style={label}>Bis</label>
            <input type="date" min={von || heute()} value={bis} onChange={(e) => setBis(e.target.value)} className="rounded-lg px-4 py-2.5 outline-none" style={inputStyle} />
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
            {!datesValid ? 'Bitte Zeitraum wählen, um die Verfügbarkeit zu sehen.' : `${tage} ${tage === 1 ? 'Tag' : 'Tage'}`}
          </p>
        </div>

        {!loaded ? (
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>Lädt...</p>
        ) : (
          <div className="space-y-16">
            {groupByCategory(items).map(([category, group]) => (
              <div key={category}>
                <h2 className="mb-6" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--text)' }}>
                  {category}
                </h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {group.map((item) => {
                    const blocked = isBlocked(item.id)
                    const inCart = cart.includes(item.id)
                    return (
                      <div
                        key={item.id}
                        className="flex flex-col rounded-2xl overflow-hidden"
                        style={{ background: 'var(--card)', border: inCart ? '1px solid var(--coral)' : '1px solid var(--border)', opacity: blocked ? 0.55 : 1 }}
                      >
                        {item.image_url ? (
                          <Image src={item.image_url} alt={item.name} width={800} height={600} unoptimized className="aspect-[4/3] w-full object-cover" />
                        ) : (
                          <div
                            className="flex aspect-[4/3] items-center justify-center border-b border-dashed"
                            style={{ borderColor: 'var(--border)', background: 'var(--bg-alt)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-faint)' }}
                          >
                            [ {item.name} ]
                          </div>
                        )}
                        <div className="flex flex-1 flex-col p-6">
                          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--text)' }}>
                            {item.name}
                          </h3>
                          <p className="mt-2 flex-1" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                            {item.description}
                          </p>
                          {item.preis_tag != null && (
                            <p className="mt-3" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--teal)' }}>
                              ab €{item.preis_tag}/Tag
                            </p>
                          )}

                          {datesValid && blocked ? (
                            <p className="mt-4 text-center text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-faint)' }}>
                              Im Zeitraum belegt
                            </p>
                          ) : (
                            <button
                              onClick={() => toggleCart(item.id)}
                              disabled={!datesValid}
                              className="mt-4 w-full cursor-pointer rounded-full border px-6 py-2 text-center text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                              style={{
                                fontFamily: 'var(--font-body)',
                                borderColor: 'var(--coral)',
                                color: inCart ? '#fff' : 'var(--coral)',
                                background: inCart ? 'var(--coral)' : 'transparent',
                              }}
                            >
                              {!datesValid ? 'Zeitraum wählen' : inCart ? 'Im Warenkorb ✓' : 'In den Warenkorb'}
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Warenkorb + Sammelanfrage */}
        {cart.length > 0 && (
          <div id="warenkorb" className="mt-20 rounded-2xl p-6 sm:p-8" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h2 className="mb-6" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--text)' }}>
              Warenkorb
            </h2>

            <ul className="mb-6 space-y-2">
              {cartItems.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-4" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text)' }}>
                  <span>{item.name}{item.preis_tag != null && <span style={{ color: 'var(--teal)' }}> · €{item.preis_tag}/Tag</span>}</span>
                  <button onClick={() => toggleCart(item.id)} className="text-xs" style={{ color: 'var(--coral)' }}>Entfernen</button>
                </li>
              ))}
            </ul>

            <div className="mb-6 flex items-center justify-between border-t pt-4" style={{ borderColor: 'var(--border)' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                {von} – {bis} · {tage} {tage === 1 ? 'Tag' : 'Tage'}
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--text)' }}>
                Gesamt: €{summe}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name *" className="rounded-lg px-4 py-2.5 outline-none" style={inputStyle} />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="E-Mail *" className="rounded-lg px-4 py-2.5 outline-none" style={inputStyle} />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telefon (optional)" className="rounded-lg px-4 py-2.5 outline-none" style={inputStyle} />
              <input value={nachricht} onChange={(e) => setNachricht(e.target.value)} placeholder="Nachricht (optional)" className="rounded-lg px-4 py-2.5 outline-none" style={inputStyle} />
            </div>

            {/* Honeypot */}
            <input value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} aria-hidden="true" autoComplete="off" style={{ position: 'absolute', left: '-9999px' }} />

            {result && (
              <p className="mt-4" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: result.ok ? 'var(--teal)' : 'var(--coral)' }}>
                {result.msg}
              </p>
            )}

            <button
              onClick={submit}
              disabled={submitting || !name || !email}
              className="mt-6 cursor-pointer rounded-full px-8 py-3 text-sm font-bold uppercase text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              style={{ fontFamily: 'var(--font-display)', background: 'var(--coral)', letterSpacing: '0.05em' }}
            >
              {submitting ? 'Sendet…' : `Anfrage senden (${cartItems.length})`}
            </button>
          </div>
        )}
      </div>

      {/* Sticky Mini-Leiste */}
      {cart.length > 0 && (
        <a
          href="#warenkorb"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg"
          style={{ fontFamily: 'var(--font-body)', background: 'var(--coral)' }}
        >
          Warenkorb · {cart.length} · €{summe}
        </a>
      )}
    </div>
  )
}
