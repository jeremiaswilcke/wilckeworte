import { NextRequest, NextResponse } from 'next/server'
import { createBooking } from '@/lib/bookings'
import { sendNotification } from '@/lib/email'

const rateLimit = new Map<string, { count: number; reset: number }>()
const RATE_LIMIT = 3
const RATE_WINDOW = 60_000 // 1 minute

function stripTags(str: string): string {
  return str.replace(/<[^>]*>/g, '')
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
  const now = Date.now()
  const entry = rateLimit.get(ip)

  if (entry) {
    if (now < entry.reset) {
      if (entry.count >= RATE_LIMIT) {
        return NextResponse.json({ error: 'Zu viele Anfragen. Bitte warte einen Moment.' }, { status: 429 })
      }
      entry.count++
    } else {
      rateLimit.set(ip, { count: 1, reset: now + RATE_WINDOW })
    }
  } else {
    rateLimit.set(ip, { count: 1, reset: now + RATE_WINDOW })
  }

  try {
    const body = await req.json()
    const { name, email, betreff, nachricht, website } = body

    // Honeypot check
    if (website) {
      return NextResponse.json({ success: true })
    }

    // Validation
    if (!name?.trim() || !email?.trim() || !nachricht?.trim()) {
      return NextResponse.json({ error: 'Bitte fülle alle Pflichtfelder aus.' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 })
    }

    // Sanitize
    const sanitized = {
      name: stripTags(name.trim()),
      email: stripTags(email.trim()),
      betreff: stripTags((betreff ?? 'Sonstiges').trim()),
      nachricht: stripTags(nachricht.trim()),
    }

    const booking = await createBooking({
      type: 'kontakt',
      name: sanitized.name,
      email: sanitized.email,
      details: { betreff: sanitized.betreff, nachricht: sanitized.nachricht } as never,
    })

    await sendNotification(`Neue Kontaktanfrage: ${sanitized.betreff}`, [
      `Name: ${sanitized.name}`,
      `E-Mail: ${sanitized.email}`,
      `Betreff: ${sanitized.betreff}`,
      '',
      sanitized.nachricht,
      '',
      `Im Dashboard ansehen: ${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/admin`,
    ])

    return NextResponse.json({ success: true, id: booking.id })
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }
}
