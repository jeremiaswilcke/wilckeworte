import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { listBookings, getBookingStats, type BookingType, type BookingStatus } from '@/lib/bookings'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') as BookingType | null
  const status = searchParams.get('status') as BookingStatus | null

  const bookings = await listBookings({
    type: type || undefined,
    status: status || undefined,
  })

  const stats = await getBookingStats()

  return NextResponse.json({ bookings, stats })
}
