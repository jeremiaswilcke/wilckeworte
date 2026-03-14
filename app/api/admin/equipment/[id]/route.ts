import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { updateEquipment, deleteEquipment, getEquipmentById } from '@/lib/equipment'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  try {
    const { id } = await params
    const equipmentId = parseInt(id, 10)

    const existing = await getEquipmentById(equipmentId)
    if (!existing) {
      return NextResponse.json({ error: 'Equipment nicht gefunden.' }, { status: 404 })
    }

    const body = await req.json()
    const item = await updateEquipment(equipmentId, {
      name: body.name,
      description: body.description,
      preis_tag: body.preis_tag,
      image_url: body.image_url,
      active: body.active,
      sort_order: body.sort_order,
    })

    return NextResponse.json({ equipment: item })
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  const { id } = await params
  const equipmentId = parseInt(id, 10)

  const existing = await getEquipmentById(equipmentId)
  if (!existing) {
    return NextResponse.json({ error: 'Equipment nicht gefunden.' }, { status: 404 })
  }

  await deleteEquipment(equipmentId)
  return NextResponse.json({ success: true })
}
