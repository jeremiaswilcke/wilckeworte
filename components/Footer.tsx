import Image from 'next/image'
import { siteContent } from '@/lib/seed-data'

const footerNav = [
  { label: 'Services', href: '#services' },
  { label: 'Preise', href: '#preise' },
  { label: 'Equipment', href: '#equipment' },
  { label: 'Team', href: '#team' },
  { label: 'Blog', href: '/blog' },
  { label: 'Kontakt', href: '#kontakt' },
]

const legalNav = [
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutz', href: '/datenschutz' },
  { label: 'AGB', href: '/agb' },
]

export function Footer() {
  const { contact } = siteContent

  return (
    <footer
      className="border-t"
      style={{ background: 'var(--bg-alt)', borderColor: 'var(--border)' }}
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-3">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Image
            src="/images/Logo_wilcke.png"
            alt="Wilcke Worte und Visionen"
            width={84}
            height={28}
            style={{ height: '28px', width: 'auto' }}
          />
          <p
            className="max-w-xs"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-muted)',
              lineHeight: '1.7',
            }}
          >
            Kreatives Studio für Wort, Bild und Klang — Medien für Menschen mit Mission.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3
            className="mb-4 text-xs uppercase tracking-[0.15em]"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--text-faint)' }}
          >
            Navigation
          </h3>
          <ul className="flex flex-col gap-2">
            {footerNav.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="transition-colors hover:text-[var(--coral)]"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal + Contact */}
        <div>
          <h3
            className="mb-4 text-xs uppercase tracking-[0.15em]"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--text-faint)' }}
          >
            Kontakt & Rechtliches
          </h3>
          <ul className="flex flex-col gap-2">
            <li>
              <a
                href={`tel:${contact.telefon.replace(/\s/g, '')}`}
                className="transition-colors hover:text-[var(--coral)]"
                style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}
              >
                {contact.telefon}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${contact.email}`}
                className="transition-colors hover:text-[var(--coral)]"
                style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}
              >
                {contact.email}
              </a>
            </li>
            <li
              style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}
            >
              {contact.adresse}
            </li>
          </ul>
          <ul className="mt-6 flex gap-4">
            {legalNav.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="transition-colors hover:text-[var(--coral)]"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-faint)',
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className="border-t px-6 py-4 text-center"
        style={{
          borderColor: 'var(--border)',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-faint)',
        }}
      >
        © {new Date().getFullYear()} Wilcke Worte und Visionen. Alle Rechte vorbehalten.
      </div>
    </footer>
  )
}
