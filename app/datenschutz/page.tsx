export const metadata = {
  title: 'Datenschutz',
}

export default function DatenschutzPage() {
  return (
    <div className="px-6 pt-24 pb-16" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="mx-auto max-w-3xl">
        <h1
          className="mb-8"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--text)' }}
        >
          Datenschutzerklärung
        </h1>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--text)', lineHeight: 1.7 }}>
          <p>
            Der Schutz deiner persönlichen Daten ist uns ein besonderes Anliegen.
            Wir verarbeiten deine Daten daher ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2003).
          </p>
          <p className="mt-4" style={{ color: 'var(--text-muted)' }}>
            Vollständige Datenschutzerklärung wird aus WordPress überschrieben sobald verfügbar.
          </p>
        </div>
      </div>
    </div>
  )
}
