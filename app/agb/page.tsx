export const metadata = {
  title: 'AGB',
}

export default function AGBPage() {
  return (
    <div className="px-6 pt-24 pb-16" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="mx-auto max-w-3xl">
        <h1
          className="mb-8"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--text)' }}
        >
          Allgemeine Geschäftsbedingungen
        </h1>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--text)', lineHeight: 1.7 }}>
          <p>
            Es gelten die allgemeinen Geschäftsbedingungen von Wilcke Worte und Visionen.
          </p>
          <p className="mt-4" style={{ color: 'var(--text-muted)' }}>
            Vollständige AGB werden aus WordPress überschrieben sobald verfügbar.
          </p>
        </div>
      </div>
    </div>
  )
}
