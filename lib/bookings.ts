import { getDb } from './db'

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

type BookingDetails = PaketDetails | ProjektDetails | EquipmentDetails
type BookingRow = Omit<Booking, 'details'> & { details: BookingDetails | string }

function normalizeBooking(row: BookingRow): Booking {
  return {
    ...row,
    id: Number(row.id),
    details: typeof row.details === 'string' ? row.details : JSON.stringify(row.details),
  }
}

export async function createBooking(data: {
  type: BookingType
  name: string
  email: string
  phone?: string
  company?: string
  details: BookingDetails
}): Promise<Booking> {
  const { data: booking, error } = await getDb()
    .from('worte_bookings')
    .insert({
      type: data.type,
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      company: data.company ?? null,
      details: data.details,
    })
    .select('*')
    .single()

  if (error) throw error
  return normalizeBooking(booking as BookingRow)
}

export async function getBookingById(id: number): Promise<Booking | null> {
  const { data, error } = await getDb().from('worte_bookings').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data ? normalizeBooking(data as BookingRow) : null
}

export async function listBookings(filters?: {
  type?: BookingType
  status?: BookingStatus
}): Promise<Booking[]> {
  let query = getDb().from('worte_bookings').select('*').order('created_at', { ascending: false })
  if (filters?.type) query = query.eq('type', filters.type)
  if (filters?.status) query = query.eq('status', filters.status)

  const { data, error } = await query
  if (error) throw error
  return (data as BookingRow[]).map(normalizeBooking)
}

export async function updateBookingStatus(
  id: number,
  status: BookingStatus,
  adminNotes?: string,
): Promise<Booking | null> {
  const { data, error } = await getDb()
    .from('worte_bookings')
    .update({
      status,
      admin_notes: adminNotes ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .maybeSingle()

  if (error) throw error
  return data ? normalizeBooking(data as BookingRow) : null
}

export async function getBookingStats() {
  const { data, error } = await getDb().from('worte_bookings').select('status')
  if (error) throw error

  return {
    total: data.length,
    pending: data.filter((row) => row.status === 'pending').length,
    accepted: data.filter((row) => row.status === 'accepted').length,
    rejected: data.filter((row) => row.status === 'rejected').length,
  }
}
