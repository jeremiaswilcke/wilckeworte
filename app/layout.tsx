import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'Wilcke Worte und Visionen – Kreatives Studio für Wort, Bild und Klang',
    template: '%s | Wilcke Worte und Visionen',
  },
  description: 'Podcast, Video und Livestream: Wir begleiten Pfarren, Initiativen und Kreative von der ersten Idee bis zur Veröffentlichung.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wilckeworte.at'),
  openGraph: {
    locale: 'de_AT',
    type: 'website',
    siteName: 'Wilcke Worte und Visionen',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only">Zum Inhalt springen</a>
        <Navigation />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
