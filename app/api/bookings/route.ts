import { NextRequest, NextResponse } from 'next/server'
import { createBooking, type BookingType } from '@/lib/bookings'
import { listEquipment } from '@/lib/equipment'
import { getUnavailableEquipmentIds } from '@/lib/equipment-blocks'
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
      const von = sanitize(body.von)
      const bis = sanitize(body.bis)
      const rawItems: unknown[] = Array.isArray(body.items) ? body.items : []
      const itemIds: number[] = [...new Set(rawItems.map((x) => Number(x)).filter((n) => Number.isFinite(n)))]

      if (!von || !bis || itemIds.length === 0) {
        return NextResponse.json({ error: 'Bitte Zeitraum und mindestens ein Gerät wählen.' }, { status: 400 })
      }
      if (von > bis) {
        return NextResponse.json({ error: 'Das Von-Datum darf nicht nach dem Bis-Datum liegen.' }, { status: 400 })
      }

      const allEquipment = await listEquipment(false)
      const chosen = allEquipment.filter((e) => itemIds.includes(e.id))
      if (chosen.length === 0) {
        return NextResponse.json({ error: 'Kein gültiges Equipment ausgewählt.' }, { status: 400 })
      }

      const unavailable = await getUnavailableEquipmentIds(von, bis)
      const conflict = chosen.find((e) => unavailable.includes(e.id))
      if (conflict) {
        return NextResponse.json({ error: `"${conflict.name}" ist im gewählten Zeitraum nicht mehr verfügbar.` }, { status: 409 })
      }

      const tage = Math.max(1, Math.round((new Date(bis).getTime() - new Date(von).getTime()) / 86_400_000) + 1)
      const summe = tage * chosen.reduce((sum, e) => sum + (e.preis_tag ?? 0), 0)

      details = {
        von,
        bis,
        tage,
        summe,
        items: chosen.map((e) => ({ id: e.id, name: e.name, preis_tag: e.preis_tag })),
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
      detailLines.push(`Zeitraum: ${String(details.von)} bis ${String(details.bis)} (${String(details.tage)} Tage)`)
      const items = (details.items as { name: string; preis_tag: number | null }[]) ?? []
      for (const it of items) {
        detailLines.push(`- ${it.name}${it.preis_tag != null ? ` (€${it.preis_tag}/Tag)` : ''}`)
      }
      detailLines.push(`Gesamtsumme: €${String(details.summe)} (auf Rechnung)`)
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
