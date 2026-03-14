import { NextResponse } from 'next/server'
import { listEquipment, seedEquipmentFromDefaults } from '@/lib/equipment'

export const dynamic = 'force-dynamic'

export async function GET() {
  await seedEquipmentFromDefaults()
  const items = await listEquipment(true)
  return NextResponse.json({ equipment: items })
}
