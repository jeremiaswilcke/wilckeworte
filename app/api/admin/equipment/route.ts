import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { listEquipment, createEquipment, seedEquipmentFromDefaults } from '@/lib/equipment'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  await seedEquipmentFromDefaults()
  const items = await listEquipment(false)
  return NextResponse.json({ equipment: items })
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  try {
    const body = await req.json()
    if (!body.name || !body.description) {
      return NextResponse.json({ error: 'Name und Beschreibung sind Pflichtfelder.' }, { status: 400 })
    }

    const item = await createEquipment({
      name: body.name,
      description: body.description,
      preis_tag: body.preis_tag != null ? Number(body.preis_tag) : null,
      image_url: body.image_url || null,
      sort_order: Number(body.sort_order) || 0,
    })

    return NextResponse.json({ equipment: item })
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }
}
