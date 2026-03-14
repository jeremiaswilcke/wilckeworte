import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, getAuthToken } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()

    if (!verifyPassword(password)) {
      return NextResponse.json({ error: 'Falsches Passwort.' }, { status: 401 })
    }

    const token = getAuthToken()
    const res = NextResponse.json({ success: true })
    res.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.delete('admin_token')
  return res
}
