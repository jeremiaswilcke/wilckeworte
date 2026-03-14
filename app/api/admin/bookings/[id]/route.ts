import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { updateBookingStatus, getBookingById, type BookingStatus } from '@/lib/bookings'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  try {
    const { id } = await params
    const bookingId = parseInt(id, 10)
    if (isNaN(bookingId)) {
      return NextResponse.json({ error: 'Ungültige ID.' }, { status: 400 })
    }

    const existing = await getBookingById(bookingId)
    if (!existing) {
      return NextResponse.json({ error: 'Buchung nicht gefunden.' }, { status: 404 })
    }

    const body = await req.json()
    const status = body.status as BookingStatus
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Ungültiger Status.' }, { status: 400 })
    }

    const booking = await updateBookingStatus(bookingId, status, body.admin_notes)
    return NextResponse.json({ booking })
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }
}
