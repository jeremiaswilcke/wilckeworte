import { createClient, type Client } from '@libsql/client'

let client: Client | null = null

export function getDb(): Client {
  if (client) return client

  client = createClient({
    url: process.env.TURSO_URL || 'file:data/bookings.db',
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  return client
}

export async function initDb() {
  const db = getDb()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK(type IN ('paket', 'projekt', 'equipment')),
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'rejected')),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      details TEXT NOT NULL,
      admin_notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)
}
