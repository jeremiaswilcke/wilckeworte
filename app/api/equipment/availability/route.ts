import { NextRequest, NextResponse } from 'next/server'
import { getUnavailableEquipmentIds } from '@/lib/equipment-blocks'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const von = req.nextUrl.searchParams.get('von')
  const bis = req.nextUrl.searchParams.get('bis')

  if (!von || !bis || von > bis) {
    return NextResponse.json({ error: 'Gültiger Zeitraum (von, bis) erforderlich.' }, { status: 400 })
  }

  try {
    const unavailable = await getUnavailableEquipmentIds(von, bis)
    return NextResponse.json({ unavailable })
  } catch {
    // Fail open: im Zweifel nichts sperren, der Admin bestätigt ohnehin.
    return NextResponse.json({ unavailable: [] })
  }
}
