import { cookies } from 'next/headers'
import crypto from 'crypto'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'wilcke2026'
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'ww-secret-key-change-in-production'

function generateToken(): string {
  const payload = `${ADMIN_PASSWORD}:${TOKEN_SECRET}`
  return crypto.createHash('sha256').update(payload).digest('hex')
}

export function verifyPassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}

export function getAuthToken(): string {
  return generateToken()
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) return false
  return token === generateToken()
}
