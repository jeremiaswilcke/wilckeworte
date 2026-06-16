import { getDb } from './db'

export interface EquipmentBlock {
  id: number
  equipment_id: number
  von: string
  bis: string
  grund: string | null
  created_at: string
}

function normalize(row: Record<string, unknown>): EquipmentBlock {
  return {
    id: Number(row.id),
    equipment_id: Number(row.equipment_id),
    von: String(row.von),
    bis: String(row.bis),
    grund: row.grund ? String(row.grund) : null,
    created_at: String(row.created_at),
  }
}

export async function listBlocks(equipmentId?: number): Promise<EquipmentBlock[]> {
  let query = getDb().from('worte_equipment_blocks').select('*').order('von')
  if (equipmentId != null) query = query.eq('equipment_id', equipmentId)
  const { data, error } = await query
  if (error) throw error
  return data.map(normalize)
}

export async function createBlock(data: {
  equipment_id: number
  von: string
  bis: string
  grund?: string | null
}): Promise<EquipmentBlock> {
  const { data: row, error } = await getDb()
    .from('worte_equipment_blocks')
    .insert({
      equipment_id: data.equipment_id,
      von: data.von,
      bis: data.bis,
      grund: data.grund ?? null,
    })
    .select('*')
    .single()
  if (error) throw error
  return normalize(row)
}

export async function deleteBlock(id: number): Promise<void> {
  const { error } = await getDb().from('worte_equipment_blocks').delete().eq('id', id)
  if (error) throw error
}

/**
 * Liefert die IDs aller Geräte, die im Zeitraum [von, bis] NICHT verfügbar sind.
 * Belegt = manuell gesperrt (worte_equipment_blocks) ODER in einer bereits
 * angenommenen Equipment-Buchung mit überschneidendem Zeitraum enthalten.
 * Datums-Strings im Format YYYY-MM-DD lassen sich direkt lexikografisch vergleichen.
 */
export async function getUnavailableEquipmentIds(von: string, bis: string): Promise<number[]> {
  const db = getDb()
  const ids = new Set<number>()

  const { data: blocks, error: blockError } = await db
    .from('worte_equipment_blocks')
    .select('equipment_id')
    .lte('von', bis)
    .gte('bis', von)
  if (blockError) throw blockError
  for (const b of blocks) ids.add(Number(b.equipment_id))

  const { data: bookings, error: bookingError } = await db
    .from('worte_bookings')
    .select('details')
    .eq('type', 'equipment')
    .eq('status', 'accepted')
  if (bookingError) throw bookingError
  for (const row of bookings) {
    const d = row.details as { von?: string; bis?: string; items?: { id?: number }[] }
    if (!d?.von || !d?.bis || !Array.isArray(d.items)) continue
    if (d.von <= bis && d.bis >= von) {
      for (const it of d.items) if (it?.id != null) ids.add(Number(it.id))
    }
  }

  return [...ids]
}
