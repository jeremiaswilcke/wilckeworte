import { getDb, initDb } from './db'

export type BookingType = 'paket' | 'projekt' | 'equipment'
export type BookingStatus = 'pending' | 'accepted' | 'rejected'

export interface Booking {
  id: number
  type: BookingType
  status: BookingStatus
  name: string
  email: string
  phone: string | null
  company: string | null
  details: string
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export interface PaketDetails {
  paket_id: string
  paket_name: string
  kategorie: string
  preis: number
  einheit: string
  startdatum?: string
  nachricht?: string
}

export interface ProjektDetails {
  art: string
  beschreibung: string
  budget?: string
}

export interface EquipmentDetails {
  equipment_name: string
  von: string
  bis: string
  nachricht?: string
}

let initialized = false

async function ensureInit() {
  if (!initialized) {
    await initDb()
    initialized = true
  }
}

export async function createBooking(data: {
  type: BookingType
  name: string
  email: string
  phone?: string
  company?: string
  details: PaketDetails | ProjektDetails | EquipmentDetails
}): Promise<Booking> {
  await ensureInit()
  const db = getDb()

  const result = await db.execute({
    sql: `INSERT INTO bookings (type, name, email, phone, company, details) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      data.type,
      data.name,
      data.email,
      data.phone ?? null,
      data.company ?? null,
      JSON.stringify(data.details),
    ],
  })

  const booking = await getBookingById(Number(result.lastInsertRowid))
  return booking!
}

export async function getBookingById(id: number): Promise<Booking | null> {
  await ensureInit()
  const db = getDb()
  const result = await db.execute({ sql: 'SELECT * FROM bookings WHERE id = ?', args: [id] })
  if (result.rows.length === 0) return null
  return rowToBooking(result.rows[0])
}

export async function listBookings(filters?: {
  type?: BookingType
  status?: BookingStatus
}): Promise<Booking[]> {
  await ensureInit()
  const db = getDb()

  const conditions: string[] = []
  const args: (string | number)[] = []

  if (filters?.type) {
    conditions.push('type = ?')
    args.push(filters.type)
  }
  if (filters?.status) {
    conditions.push('status = ?')
    args.push(filters.status)
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const result = await db.execute({ sql: `SELECT * FROM bookings ${where} ORDER BY created_at DESC`, args })

  return result.rows.map(rowToBooking)
}

export async function updateBookingStatus(id: number, status: BookingStatus, adminNotes?: string): Promise<Booking | null> {
  await ensureInit()
  const db = getDb()

  await db.execute({
    sql: `UPDATE bookings SET status = ?, admin_notes = ?, updated_at = datetime('now') WHERE id = ?`,
    args: [status, adminNotes ?? null, id],
  })

  return getBookingById(id)
}

export async function getBookingStats() {
  await ensureInit()
  const db = getDb()

  const result = await db.execute(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted,
      SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
    FROM bookings
  `)

  const row = result.rows[0]
  return {
    total: Number(row.total) || 0,
    pending: Number(row.pending) || 0,
    accepted: Number(row.accepted) || 0,
    rejected: Number(row.rejected) || 0,
  }
}

function rowToBooking(row: Record<string, unknown>): Booking {
  return {
    id: Number(row.id),
    type: row.type as BookingType,
    status: row.status as BookingStatus,
    name: row.name as string,
    email: row.email as string,
    phone: (row.phone as string) || null,
    company: (row.company as string) || null,
    details: row.details as string,
    admin_notes: (row.admin_notes as string) || null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  }
}
