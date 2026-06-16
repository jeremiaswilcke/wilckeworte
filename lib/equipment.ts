import { getDb } from './db'

export interface Equipment {
  id: number
  name: string
  description: string
  preis_tag: number | null
  image_url: string | null
  active: boolean
  sort_order: number
  created_at: string
}

const defaults = [
  { name: 'Panasonic Lumix S 20–60 mm f/3.5–5.6', description: 'Flexibles Weitwinkel- und Standardzoom für Reportagen, Events, Räume und Vlogs.', preis_tag: 15, sort_order: 0 },
  { name: 'Sigma 105 mm f/2.8 DG DN Macro Art', description: 'Sehr scharfes Tele-Makro für Details, Produktshots und Close-ups.', preis_tag: 20, sort_order: 1 },
  { name: 'Panasonic Lumix S5', description: '24,2 MP Vollformatkamera mit 4K-Aufzeichnung und Bildstabilisierung.', preis_tag: 30, sort_order: 2 },
  { name: 'Panasonic Lumix S5D', description: 'Kompakte Vollformatkamera für flexible Studio- und Außendrehs.', preis_tag: 30, sort_order: 3 },
  { name: 'Panasonic Lumix S5II', description: 'Vollformatkamera mit schnellem Phasen-Hybrid-Autofokus.', preis_tag: 40, sort_order: 4 },
  { name: 'Panasonic Lumix S1H', description: 'Cinema-Kamera mit 6K-Aufzeichnung, Dual Native ISO und V-Log.', preis_tag: 50, sort_order: 5 },
]

function normalizeEquipment(row: Record<string, unknown>): Equipment {
  return {
    id: Number(row.id),
    name: String(row.name),
    description: String(row.description),
    preis_tag: row.preis_tag == null ? null : Number(row.preis_tag),
    image_url: row.image_url ? String(row.image_url) : null,
    active: Boolean(row.active),
    sort_order: Number(row.sort_order) || 0,
    created_at: String(row.created_at),
  }
}

export async function listEquipment(onlyActive = true): Promise<Equipment[]> {
  let query = getDb().from('worte_equipment').select('*').order('sort_order').order('id')
  if (onlyActive) query = query.eq('active', true)
  const { data, error } = await query
  if (error) throw error
  return data.map(normalizeEquipment)
}

export async function getEquipmentById(id: number): Promise<Equipment | null> {
  const { data, error } = await getDb().from('worte_equipment').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data ? normalizeEquipment(data) : null
}

export async function createEquipment(data: {
  name: string
  description: string
  preis_tag?: number | null
  image_url?: string | null
  sort_order?: number
}): Promise<Equipment> {
  const { data: item, error } = await getDb()
    .from('worte_equipment')
    .insert({
      name: data.name,
      description: data.description,
      preis_tag: data.preis_tag ?? null,
      image_url: data.image_url ?? null,
      sort_order: data.sort_order ?? 0,
    })
    .select('*')
    .single()
  if (error) throw error
  return normalizeEquipment(item)
}

export async function updateEquipment(id: number, data: Partial<Omit<Equipment, 'id' | 'created_at'>>): Promise<Equipment | null> {
  const { data: item, error } = await getDb()
    .from('worte_equipment')
    .update(data)
    .eq('id', id)
    .select('*')
    .maybeSingle()
  if (error) throw error
  return item ? normalizeEquipment(item) : null
}

export async function deleteEquipment(id: number): Promise<void> {
  const { error } = await getDb().from('worte_equipment').delete().eq('id', id)
  if (error) throw error
}

export async function seedEquipmentFromDefaults(): Promise<void> {
  const { count, error } = await getDb().from('worte_equipment').select('*', { count: 'exact', head: true })
  if (error) throw error
  if ((count ?? 0) > 0) return

  const { error: insertError } = await getDb().from('worte_equipment').insert(defaults)
  if (insertError) throw insertError
}
