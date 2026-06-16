import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { listBlocks, createBlock } from '@/lib/equipment-blocks'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  const equipmentId = req.nextUrl.searchParams.get('equipment_id')
  const blocks = await listBlocks(equipmentId ? Number(equipmentId) : undefined)
  return NextResponse.json({ blocks })
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const equipment_id = Number(body.equipment_id)
    const von = String(body.von ?? '')
    const bis = String(body.bis ?? '')

    if (!equipment_id || !von || !bis) {
      return NextResponse.json({ error: 'Gerät, Von- und Bis-Datum sind Pflichtfelder.' }, { status: 400 })
    }
    if (von > bis) {
      return NextResponse.json({ error: 'Das Von-Datum darf nicht nach dem Bis-Datum liegen.' }, { status: 400 })
    }

    const block = await createBlock({
      equipment_id,
      von,
      bis,
      grund: body.grund ? String(body.grund) : null,
    })
    return NextResponse.json({ block })
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }
}
