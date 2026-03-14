import { ContactForm } from '../ContactForm'
import { siteContent } from '@/lib/seed-data'

export function FinalCTASection() {
  const { cta, contact } = siteContent

  return (
    <section id="kontakt" className="px-6 py-24 md:py-32" style={{ background: 'var(--bg)' }}>
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Left: CTA Text + Contact Info */}
          <div className="flex flex-col justify-center">
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-2xl)',
                color: 'var(--text)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              {cta.headline}
            </h2>
            <p
              className="mt-4"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--text-muted)',
                maxWidth: '45ch',
                lineHeight: 1.7,
              }}
            >
              {cta.subline}
            </p>

            <div className="mt-10 flex flex-col gap-3">
              <a
                href={`tel:${contact.telefon.replace(/\s/g, '')}`}
                className="transition-colors hover:text-[var(--coral)]"
                style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--text)' }}
              >
                📞 {contact.telefon}
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="transition-colors hover:text-[var(--coral)]"
                style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--text)' }}
              >
                ✉️ {contact.email}
              </a>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--text)' }}>
                📍 {contact.adresse}
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="relative">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
