'use client'

import { useState, type FormEvent } from 'react'

const subjects = ['Podcast', 'Video', 'Livestream', 'Sonstiges']

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    // Client-side validation
    const name = data.get('name') as string
    const email = data.get('email') as string
    const nachricht = data.get('nachricht') as string

    if (!name.trim() || !email.trim() || !nachricht.trim()) {
      setErrorMsg('Bitte fülle alle Pflichtfelder aus.')
      setStatus('error')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Bitte gib eine gültige E-Mail-Adresse ein.')
      setStatus('error')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          betreff: data.get('betreff'),
          nachricht: data.get('nachricht'),
          website: data.get('website'), // honeypot
        }),
      })

      if (res.ok) {
        setStatus('success')
        form.reset()
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

  if (status === 'success') {
    return (
      <div className="rounded-2xl p-8 text-center" style={{ background: 'var(--teal-soft)', border: '1px solid var(--teal)' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--text)' }}>
          Nachricht gesendet!
        </p>
        <p className="mt-2" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          Wir melden uns innerhalb von 24 Stunden.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Honeypot */}
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" name="website" id="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block uppercase"
            style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--text-muted)' }}
          >
            Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-lg px-4 py-3 outline-none transition-colors focus:ring-2"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
              background: 'var(--bg-alt)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block uppercase"
            style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--text-muted)' }}
          >
            E-Mail *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg px-4 py-3 outline-none transition-colors focus:ring-2"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
              background: 'var(--bg-alt)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="betreff"
          className="mb-1.5 block uppercase"
          style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--text-muted)' }}
        >
          Betreff
        </label>
        <select
          id="betreff"
          name="betreff"
          className="w-full rounded-lg px-4 py-3 outline-none transition-colors focus:ring-2"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            background: 'var(--bg-alt)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
          }}
        >
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="nachricht"
          className="mb-1.5 block uppercase"
          style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--text-muted)' }}
        >
          Nachricht *
        </label>
        <textarea
          id="nachricht"
          name="nachricht"
          required
          rows={5}
          className="w-full resize-y rounded-lg px-4 py-3 outline-none transition-colors focus:ring-2"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            background: 'var(--bg-alt)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
          }}
        />
      </div>

      {status === 'error' && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--coral)' }}>
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="rounded-full px-8 py-3 text-sm font-bold uppercase text-white transition-colors disabled:opacity-60"
        style={{
          fontFamily: 'var(--font-display)',
          background: 'var(--coral)',
          letterSpacing: '0.05em',
        }}
      >
        {status === 'sending' ? 'Wird gesendet...' : 'Nachricht senden'}
      </button>
    </form>
  )
}
