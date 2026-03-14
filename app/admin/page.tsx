'use client'

import { useState, useEffect, useCallback } from 'react'

interface Booking {
  id: number
  type: 'paket' | 'projekt' | 'equipment'
  status: 'pending' | 'accepted' | 'rejected'
  name: string
  email: string
  phone: string | null
  company: string | null
  details: string
  admin_notes: string | null
  created_at: string
  updated_at: string
}

interface Stats {
  total: number
  pending: number
  accepted: number
  rejected: number
}

const TYPE_LABELS: Record<string, string> = {
  paket: 'Paket',
  projekt: 'Projekt',
  equipment: 'Equipment',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Offen',
  accepted: 'Angenommen',
  rejected: 'Abgelehnt',
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#e6a817',
  accepted: '#22a867',
  rejected: '#e84040',
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, accepted: 0, rejected: 0 })
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const loadBookings = useCallback(async () => {
    const params = new URLSearchParams()
    if (filterType) params.set('type', filterType)
    if (filterStatus) params.set('status', filterStatus)

    const res = await fetch(`/api/admin/bookings?${params}`)
    if (res.status === 401) {
      setAuthed(false)
      return
    }
    if (res.ok) {
      const data = await res.json()
      setBookings(data.bookings)
      setStats(data.stats)
    }
  }, [filterType, filterStatus])

  useEffect(() => {
    if (authed) loadBookings()
  }, [authed, loadBookings])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      setAuthed(true)
      setLoginError('')
    } else {
      setLoginError('Falsches Passwort.')
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    setAuthed(false)
    setBookings([])
  }

  async function updateStatus(id: number, status: string, adminNotes?: string) {
    await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, admin_notes: adminNotes }),
    })
    loadBookings()
  }

  // Check if already authed
  useEffect(() => {
    fetch('/api/admin/bookings').then((res) => {
      if (res.ok) setAuthed(true)
    })
  }, [])

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6" style={{ background: '#0c0c0c' }}>
        <form onSubmit={handleLogin} className="w-full max-w-sm rounded-2xl p-8" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: '#ececec' }}>
            Admin Login
          </h1>
          <p className="mt-2 mb-6" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: '#999' }}>
            Wilcke Worte und Visionen
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort"
            className="mb-4 w-full rounded-lg px-4 py-3 outline-none"
            style={{ fontFamily: 'var(--font-body)', background: '#141414', border: '1px solid rgba(255,255,255,0.08)', color: '#ececec' }}
            autoFocus
          />
          {loginError && (
            <p className="mb-3" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: '#f97d73' }}>
              {loginError}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-full py-3 text-sm font-bold uppercase text-white"
            style={{ fontFamily: 'var(--font-display)', background: '#f97d73', letterSpacing: '0.05em' }}
          >
            Einloggen
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6" style={{ background: '#0c0c0c', color: '#ececec', paddingTop: '88px' }}>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)' }}>
              Buchungen
            </h1>
            <p className="mt-1" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: '#999' }}>
              Wilcke Worte und Visionen — Admin
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full px-4 py-2 text-sm transition-colors hover:bg-white/10"
            style={{ fontFamily: 'var(--font-body)', color: '#999', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Gesamt', value: stats.total, color: '#ececec' },
            { label: 'Offen', value: stats.pending, color: '#e6a817' },
            { label: 'Angenommen', value: stats.accepted, color: '#22a867' },
            { label: 'Abgelehnt', value: stats.rejected, color: '#e84040' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-4" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                {s.label}
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: s.color }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-lg px-3 py-2 text-sm outline-none"
            style={{ fontFamily: 'var(--font-body)', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', color: '#ececec' }}
          >
            <option value="">Alle Typen</option>
            <option value="paket">Pakete</option>
            <option value="projekt">Projekte</option>
            <option value="equipment">Equipment</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg px-3 py-2 text-sm outline-none"
            style={{ fontFamily: 'var(--font-body)', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', color: '#ececec' }}
          >
            <option value="">Alle Status</option>
            <option value="pending">Offen</option>
            <option value="accepted">Angenommen</option>
            <option value="rejected">Abgelehnt</option>
          </select>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ fontFamily: 'var(--font-body)', color: '#999' }}>
              Keine Buchungen gefunden.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => {
              const details = JSON.parse(booking.details)
              const isExpanded = expandedId === booking.id

              return (
                <div
                  key={booking.id}
                  className="rounded-xl overflow-hidden"
                  style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {/* Row */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                    className="flex w-full cursor-pointer items-center gap-4 px-6 py-4 text-left"
                  >
                    {/* Status dot */}
                    <span
                      className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                      style={{ background: STATUS_COLORS[booking.status] }}
                    />
                    {/* Type badge */}
                    <span
                      className="flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs uppercase"
                      style={{ fontFamily: 'var(--font-body)', background: 'rgba(255,255,255,0.06)', color: '#999', letterSpacing: '0.1em' }}
                    >
                      {TYPE_LABELS[booking.type]}
                    </span>
                    {/* Name & summary */}
                    <div className="min-w-0 flex-1">
                      <span style={{ fontFamily: 'var(--font-body)', color: '#ececec' }}>
                        {booking.name}
                      </span>
                      <span className="ml-2" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: '#999' }}>
                        {booking.type === 'paket' && details.paket_name}
                        {booking.type === 'equipment' && details.equipment_name}
                        {booking.type === 'projekt' && details.art}
                      </span>
                    </div>
                    {/* Date */}
                    <span className="hidden flex-shrink-0 sm:block" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: '#666' }}>
                      {new Date(booking.created_at).toLocaleDateString('de-AT')}
                    </span>
                    {/* Status label */}
                    <span
                      className="flex-shrink-0 text-xs font-bold"
                      style={{ fontFamily: 'var(--font-body)', color: STATUS_COLORS[booking.status] }}
                    >
                      {STATUS_LABELS[booking.status]}
                    </span>
                    {/* Chevron */}
                    <span style={{ color: '#666', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                      ▾
                    </span>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t px-6 py-5" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Detail label="E-Mail" value={booking.email} />
                        <Detail label="Telefon" value={booking.phone || '—'} />
                        <Detail label="Firma" value={booking.company || '—'} />
                        <Detail label="Erstellt" value={new Date(booking.created_at).toLocaleString('de-AT')} />

                        {booking.type === 'paket' && (
                          <>
                            <Detail label="Paket" value={`${details.paket_name} (${details.paket_id})`} />
                            <Detail label="Preis" value={`€${details.preis}/${details.einheit === 'monatlich' ? 'Monat' : 'einmalig'}`} />
                            <Detail label="Kategorie" value={details.kategorie} />
                            <Detail label="Startdatum" value={details.startdatum || '—'} />
                            {details.nachricht && <Detail label="Nachricht" value={details.nachricht} span />}
                          </>
                        )}

                        {booking.type === 'projekt' && (
                          <>
                            <Detail label="Art" value={details.art} />
                            <Detail label="Budget" value={details.budget || '—'} />
                            <Detail label="Beschreibung" value={details.beschreibung} span />
                          </>
                        )}

                        {booking.type === 'equipment' && (
                          <>
                            <Detail label="Equipment" value={details.equipment_name} />
                            <Detail label="Zeitraum" value={`${details.von} – ${details.bis}`} />
                            {details.nachricht && <Detail label="Nachricht" value={details.nachricht} span />}
                          </>
                        )}

                        {booking.admin_notes && <Detail label="Admin-Notizen" value={booking.admin_notes} span />}
                      </div>

                      {/* Actions */}
                      <div className="mt-5 flex flex-wrap gap-3">
                        {booking.status !== 'accepted' && (
                          <button
                            onClick={() => updateStatus(booking.id, 'accepted')}
                            className="rounded-full px-5 py-2 text-sm font-bold text-white"
                            style={{ fontFamily: 'var(--font-body)', background: '#22a867' }}
                          >
                            Annehmen
                          </button>
                        )}
                        {booking.status !== 'rejected' && (
                          <button
                            onClick={() => updateStatus(booking.id, 'rejected')}
                            className="rounded-full px-5 py-2 text-sm font-bold text-white"
                            style={{ fontFamily: 'var(--font-body)', background: '#e84040' }}
                          >
                            Ablehnen
                          </button>
                        )}
                        {booking.status !== 'pending' && (
                          <button
                            onClick={() => updateStatus(booking.id, 'pending')}
                            className="rounded-full px-5 py-2 text-sm"
                            style={{ fontFamily: 'var(--font-body)', border: '1px solid rgba(255,255,255,0.15)', color: '#999' }}
                          >
                            Zurücksetzen
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const notes = prompt('Admin-Notizen:', booking.admin_notes || '')
                            if (notes !== null) updateStatus(booking.id, booking.status, notes)
                          }}
                          className="rounded-full px-5 py-2 text-sm"
                          style={{ fontFamily: 'var(--font-body)', border: '1px solid rgba(255,255,255,0.15)', color: '#999' }}
                        >
                          Notiz
                        </button>
                        <a
                          href={`mailto:${booking.email}?subject=${encodeURIComponent(
                            booking.type === 'paket' ? `Ihre Buchung: ${details.paket_name}` :
                            booking.type === 'equipment' ? `Equipment-Anfrage: ${details.equipment_name}` :
                            'Ihre Projektanfrage'
                          )}`}
                          className="rounded-full px-5 py-2 text-sm"
                          style={{ fontFamily: 'var(--font-body)', border: '1px solid rgba(255,255,255,0.15)', color: '#999' }}
                        >
                          E-Mail senden
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function Detail({ label, value, span }: { label: string; value: string; span?: boolean }) {
  return (
    <div className={span ? 'sm:col-span-2' : ''}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
        {label}
      </p>
      <p className="mt-0.5" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: '#ececec', whiteSpace: 'pre-wrap' }}>
        {value}
      </p>
    </div>
  )
}
