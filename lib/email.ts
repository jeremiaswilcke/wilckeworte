import { Resend } from 'resend'

const FROM = process.env.RESEND_FROM ?? 'Wilcke Worte <onboarding@resend.dev>'
const TO = process.env.NOTIFY_EMAIL_TO ?? process.env.CONTACT_EMAIL_TO ?? ''

let client: Resend | null = null

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  if (!client) client = new Resend(key)
  return client
}

/**
 * Schickt eine Benachrichtigung an die Studio-Adresse.
 * Wirft nie: schlaegt der Versand fehl, wird nur geloggt, damit der
 * Buchungs-/Kontakt-Flow trotzdem erfolgreich bleibt.
 */
export async function sendNotification(subject: string, lines: string[]): Promise<void> {
  const resend = getClient()
  if (!resend || !TO) {
    console.warn('E-Mail-Versand uebersprungen: RESEND_API_KEY oder NOTIFY_EMAIL_TO fehlt.')
    return
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      subject,
      text: lines.join('\n'),
    })
    if (error) console.error('Resend-Fehler:', error)
  } catch (err) {
    console.error('E-Mail-Versand fehlgeschlagen:', err)
  }
}
