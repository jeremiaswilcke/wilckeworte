import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"

export const metadata: Metadata = {
  title: {
    default: "Wilcke Worte und Visionen — Kreatives Studio für Wort, Bild und Klang",
    template: "%s | Wilcke Worte und Visionen",
  },
  description: "Podcast, Video, Livestream — wir begleiten Pfarren, Initiativen und Kreative von der ersten Idee bis zur Veröffentlichung.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://wilckeworte.at"),
  openGraph: {
    locale: "de_AT",
    type: "website",
    siteName: "Wilcke Worte und Visionen",
  },
}

const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
  } catch(e) {}
})();
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body style={{ fontFamily: "var(--font-body)" }}>
        <ThemeProvider>
          <a
            href="#main"
            className="fixed left-2 top-2 z-[100] -translate-y-full rounded-full px-4 py-2 text-sm transition-transform focus:translate-y-0"
            style={{
              background: 'var(--coral)',
              color: '#fff',
              fontFamily: 'var(--font-body)',
            }}
          >
            Zum Inhalt springen
          </a>
          <Navigation />
          <main id="main">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
