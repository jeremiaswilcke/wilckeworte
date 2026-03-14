export const metadata = {
  title: 'Impressum',
}

export default function ImpressumPage() {
  return (
    <div className="px-6 pt-24 pb-16" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="mx-auto max-w-3xl">
        <h1
          className="mb-8"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--text)' }}
        >
          Impressum
        </h1>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--text)', lineHeight: 1.7 }}>
          <p><strong>Wilcke Worte und Visionen</strong></p>
          <p>Jeremias Wilcke</p>
          <p>Grenzgasse 4<br />3001 Mauerbach<br />Österreich</p>
          <p className="mt-4">
            Telefon: +43 676 792 39 29<br />
            E-Mail: studio@wilckeworte.at
          </p>
          <p className="mt-4" style={{ color: 'var(--text-muted)' }}>
            Inhalt wird aus WordPress überschrieben sobald verfügbar.
          </p>
        </div>
      </div>
    </div>
  )
}
