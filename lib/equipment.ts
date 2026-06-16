import { getDb } from './db'

export interface Equipment {
  id: number
  name: string
  description: string
  preis_tag: number | null
  image_url: string | null
  category: string
  active: boolean
  sort_order: number
  created_at: string
}

const defaults = [
  { name: 'Podcast-Set', description: '2x Shure SM7B, Behringer XR18 und NEEWER LED Panels. Sofort sendebereit für Podcast und Voiceover.', preis_tag: 70, category: 'Pakete', sort_order: 0 },
  { name: 'Videodreh-Set', description: 'Lumix S5II, Objektiv 24-105 mm, Manfrotto Gimbal und LED Panels. Vielseitig für Reportagen und Formate.', preis_tag: 90, category: 'Pakete', sort_order: 1 },
  { name: 'Interview-Set', description: 'Lumix S1H, 50 mm f/1.4, Rode NTG4+ und Rollei Candela Keylight. Hochwertige Interviews und Portraits.', preis_tag: 100, category: 'Pakete', sort_order: 2 },
  { name: 'Story-Set', description: 'Lumix S5, Sigma 24 mm und Sigma 85 mm Art. Erzählerische Szenen von Weitwinkel bis Portrait.', preis_tag: 70, category: 'Pakete', sort_order: 3 },
  { name: 'Livestream-Set', description: 'Blackmagic ATEM 4K, Behringer XR18, 2x Shure SM7B und LED Panels. Komplettes Mehrkamera-Setup.', preis_tag: 110, category: 'Pakete', sort_order: 4 },

  { name: 'Panasonic Lumix S1H', description: 'Professionelle Filmkamera mit 6K-Aufnahme, Dual Native ISO und aktiver Kühlung.', preis_tag: 60, category: 'Kameras', sort_order: 10 },
  { name: 'Panasonic Lumix S5II', description: 'Vielseitige Hybridkamera mit Phasen-Autofokus, 6K Open Gate und interner LUT-Unterstützung.', preis_tag: 40, category: 'Kameras', sort_order: 11 },
  { name: 'Panasonic Lumix S5 / S5D', description: 'Kompakte Vollformatkamera mit 4K-Video und stabilisiertem Sensor.', preis_tag: 30, category: 'Kameras', sort_order: 12 },

  { name: 'Panasonic Lumix S 24-105 mm f/4 Macro O.I.S.', description: 'Allround-Zoom für Interviews, Reportagen und Events.', preis_tag: 25, category: 'Objektive', sort_order: 20 },
  { name: 'Panasonic Lumix S PRO 50 mm f/1.4', description: 'Lichtstarkes Standard-Objektiv für Portraits und filmische Looks.', preis_tag: 30, category: 'Objektive', sort_order: 21 },
  { name: 'Panasonic Lumix S PRO 35 mm f/1.8', description: 'Weitwinkel-Objektiv für erzählerische Szenen und Storytelling.', preis_tag: 30, category: 'Objektive', sort_order: 22 },
  { name: 'Sigma 85 mm f/1.4 DG DN Art', description: 'Portrait-Optik mit großem Bokeh und schöner Freistellung.', preis_tag: 30, category: 'Objektive', sort_order: 23 },
  { name: 'Sigma 24 mm f/1.4 DG DN Art', description: 'Weitwinkel-Optik für Räume, Szenen und dynamische Bilder.', preis_tag: 25, category: 'Objektive', sort_order: 24 },

  { name: 'Shure SM7B (3x)', description: 'Broadcast-Mikrofon für klare Sprache. Dreifach im Studio vorhanden.', preis_tag: 15, category: 'Mikrofone', sort_order: 30 },
  { name: 'AKG C414 XLS', description: 'Studio-Kondensator mit detailreichem Klang.', preis_tag: 25, category: 'Mikrofone', sort_order: 31 },
  { name: 'Rode PodMic (2x)', description: 'Podcast-Dynamikmikrofon. Zweifach vorhanden.', preis_tag: 10, category: 'Mikrofone', sort_order: 32 },
  { name: 'Rode NTG4+', description: 'Richtmikrofon für Video-Ton.', preis_tag: 15, category: 'Mikrofone', sort_order: 33 },

  { name: 'NEEWER LED Panels mit Softbox (Set)', description: 'Weiches, gleichmäßiges Licht für Sets.', preis_tag: 25, category: 'Licht', sort_order: 40 },
  { name: 'Rollei Candela 100 Bi-Color', description: 'Leistungsstarkes Keylight.', preis_tag: 20, category: 'Licht', sort_order: 41 },
  { name: 'RGB Backlight Set', description: 'Farbige Akzentbeleuchtung.', preis_tag: 15, category: 'Licht', sort_order: 42 },

  { name: 'Manfrotto Gimbal', description: 'Stabilisierte Kamerafahrten.', preis_tag: 20, category: 'Bewegung', sort_order: 50 },

  { name: 'Blackmagic ATEM Production Studio 4K', description: 'Multicam-Videomischer.', preis_tag: 40, category: 'Regie & Tontechnik', sort_order: 60 },
  { name: 'Behringer XR18 Digitalmixer', description: '18-Kanal-Digitalmixer.', preis_tag: 35, category: 'Regie & Tontechnik', sort_order: 61 },
  { name: 'Behringer X-Touch Controller', description: 'Fader-Controller für Mischpulte und DAW.', preis_tag: 15, category: 'Regie & Tontechnik', sort_order: 62 },
]

function normalizeEquipment(row: Record<string, unknown>): Equipment {
  return {
    id: Number(row.id),
    name: String(row.name),
    description: String(row.description),
    preis_tag: row.preis_tag == null ? null : Number(row.preis_tag),
    image_url: row.image_url ? String(row.image_url) : null,
    category: row.category ? String(row.category) : 'Sonstiges',
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
  category?: string
  sort_order?: number
}): Promise<Equipment> {
  const { data: item, error } = await getDb()
    .from('worte_equipment')
    .insert({
      name: data.name,
      description: data.description,
      preis_tag: data.preis_tag ?? null,
      image_url: data.image_url ?? null,
      category: data.category ?? 'Sonstiges',
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
