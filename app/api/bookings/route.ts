import { NextRequest, NextResponse } from 'next/server'
import { createBooking, type BookingType } from '@/lib/bookings'
import { sendNotification } from '@/lib/email'

const TYPE_LABELS: Record<BookingType, string> = {
  paket: 'Paket-Buchung',
  projekt: 'Projektanfrage',
  equipment: 'Equipment-Anfrage',
  kontakt: 'Kontaktanfrage',
}

function stripTags(str: string): string {
  return str.replace(/<[^>]*>/g, '')
}

function sanitize(val: unknown): string {
  return typeof val === 'string' ? stripTags(val.trim()) : ''
}

const VALID_TYPES: BookingType[] = ['paket', 'projekt', 'equipment']

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Honeypot
    if (body.website) {
      return NextResponse.json({ success: true })
    }

    const type = body.type as BookingType
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: 'Ungültiger Buchungstyp.' }, { status: 400 })
    }

    const name = sanitize(body.name)
    const email = sanitize(body.email)
    const phone = sanitize(body.phone) || undefined
    const company = sanitize(body.company) || undefined

    if (!name || !email) {
      return NextResponse.json({ error: 'Name und E-Mail sind Pflichtfelder.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 })
    }

    let details: Record<string, unknown>

    if (type === 'paket') {
      if (!body.paket_id || !body.paket_name) {
        return NextResponse.json({ error: 'Paket-Informationen fehlen.' }, { status: 400 })
      }
      details = {
        paket_id: sanitize(body.paket_id),
        paket_name: sanitize(body.paket_name),
        kategorie: sanitize(body.kategorie),
        preis: Number(body.preis) || 0,
        einheit: sanitize(body.einheit),
        startdatum: sanitize(body.startdatum),
        nachricht: sanitize(body.nachricht),
      }
    } else if (type === 'projekt') {
      if (!body.beschreibung) {
        return NextResponse.json({ error: 'Bitte beschreibe dein Projekt.' }, { status: 400 })
      }
      details = {
        art: sanitize(body.art) || 'sonstiges',
        beschreibung: sanitize(body.beschreibung),
        budget: sanitize(body.budget),
      }
    } else {
      if (!body.equipment_name || !body.von || !body.bis) {
        return NextResponse.json({ error: 'Equipment, Von- und Bis-Datum sind Pflichtfelder.' }, { status: 400 })
      }
      details = {
        equipment_name: sanitize(body.equipment_name),
        von: sanitize(body.von),
        bis: sanitize(body.bis),
        nachricht: sanitize(body.nachricht),
      }
    }

    const booking = await createBooking({
      type,
      name,
      email,
      phone,
      company,
      details: details as never,
    })

    const detailLines: string[] = []
    if (type === 'paket') {
      detailLines.push(`Paket: ${String(details.paket_name)} (${String(details.paket_id)})`)
      detailLines.push(`Preis: €${String(details.preis)}/${String(details.einheit)}`)
      if (details.startdatum) detailLines.push(`Startdatum: ${String(details.startdatum)}`)
      if (details.nachricht) detailLines.push(`Nachricht: ${String(details.nachricht)}`)
    } else if (type === 'projekt') {
      detailLines.push(`Art: ${String(details.art)}`)
      if (details.budget) detailLines.push(`Budget: ${String(details.budget)}`)
      detailLines.push(`Beschreibung: ${String(details.beschreibung)}`)
    } else {
      detailLines.push(`Equipment: ${String(details.equipment_name)}`)
      detailLines.push(`Zeitraum: ${String(details.von)} bis ${String(details.bis)}`)
      if (details.nachricht) detailLines.push(`Nachricht: ${String(details.nachricht)}`)
    }

    const lines = [`Name: ${name}`, `E-Mail: ${email}`]
    if (phone) lines.push(`Telefon: ${phone}`)
    if (company) lines.push(`Firma: ${company}`)
    lines.push('', ...detailLines, '', `Im Dashboard ansehen: ${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/admin`)

    await sendNotification(`Neue ${TYPE_LABELS[type]}: ${name}`, lines)

    return NextResponse.json({ success: true, id: booking.id })
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }
}
