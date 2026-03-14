import { getDb, initDb } from './db'

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

let initialized = false
async function ensureInit() {
  if (!initialized) { await initDb(); initialized = true }
}

export async function listEquipment(onlyActive = true): Promise<Equipment[]> {
  await ensureInit()
  const db = getDb()
  const where = onlyActive ? 'WHERE active = 1' : ''
  const result = await db.execute(`SELECT * FROM equipment ${where} ORDER BY sort_order ASC, id ASC`)
  return result.rows.map(rowToEquipment)
}

export async function getEquipmentById(id: number): Promise<Equipment | null> {
  await ensureInit()
  const db = getDb()
  const result = await db.execute({ sql: 'SELECT * FROM equipment WHERE id = ?', args: [id] })
  if (result.rows.length === 0) return null
  return rowToEquipment(result.rows[0])
}

export async function createEquipment(data: {
  name: string
  description: string
  preis_tag?: number | null
  image_url?: string | null
  sort_order?: number
}): Promise<Equipment> {
  await ensureInit()
  const db = getDb()
  const result = await db.execute({
    sql: 'INSERT INTO equipment (name, description, preis_tag, image_url, sort_order) VALUES (?, ?, ?, ?, ?)',
    args: [data.name, data.description, data.preis_tag ?? null, data.image_url ?? null, data.sort_order ?? 0],
  })
  return (await getEquipmentById(Number(result.lastInsertRowid)))!
}

export async function updateEquipment(id: number, data: {
  name?: string
  description?: string
  preis_tag?: number | null
  image_url?: string | null
  active?: boolean
  sort_order?: number
}): Promise<Equipment | null> {
  await ensureInit()
  const db = getDb()
  const sets: string[] = []
  const args: (string | number | null)[] = []

  if (data.name !== undefined) { sets.push('name = ?'); args.push(data.name) }
  if (data.description !== undefined) { sets.push('description = ?'); args.push(data.description) }
  if (data.preis_tag !== undefined) { sets.push('preis_tag = ?'); args.push(data.preis_tag) }
  if (data.image_url !== undefined) { sets.push('image_url = ?'); args.push(data.image_url) }
  if (data.active !== undefined) { sets.push('active = ?'); args.push(data.active ? 1 : 0) }
  if (data.sort_order !== undefined) { sets.push('sort_order = ?'); args.push(data.sort_order) }

  if (sets.length === 0) return getEquipmentById(id)

  args.push(id)
  await db.execute({ sql: `UPDATE equipment SET ${sets.join(', ')} WHERE id = ?`, args })
  return getEquipmentById(id)
}

export async function deleteEquipment(id: number): Promise<void> {
  await ensureInit()
  const db = getDb()
  await db.execute({ sql: 'DELETE FROM equipment WHERE id = ?', args: [id] })
}

export async function seedEquipmentFromDefaults(): Promise<void> {
  await ensureInit()
  const db = getDb()
  const result = await db.execute('SELECT COUNT(*) as count FROM equipment')
  if (Number(result.rows[0].count) > 0) return

  const { siteContent } = await import('./seed-data')
  for (let i = 0; i < siteContent.equipment_highlights.length; i++) {
    const item = siteContent.equipment_highlights[i]
    await db.execute({
      sql: 'INSERT INTO equipment (name, description, preis_tag, sort_order) VALUES (?, ?, ?, ?)',
      args: [item.name, item.description, item.preis_tag, i],
    })
  }
}

function rowToEquipment(row: Record<string, unknown>): Equipment {
  return {
    id: Number(row.id),
    name: row.name as string,
    description: row.description as string,
    preis_tag: row.preis_tag != null ? Number(row.preis_tag) : null,
    image_url: (row.image_url as string) || null,
    active: Boolean(row.active),
    sort_order: Number(row.sort_order) || 0,
    created_at: row.created_at as string,
  }
}
