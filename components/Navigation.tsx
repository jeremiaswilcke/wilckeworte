'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const links = [
  ['Studio', '/#studio'],
  ['Podcast', '/#podcast1'],
  ['Preise', '/#preise'],
  ['Team', '/#team'],
  ['Equipment', '/#equipment'],
  ['Kontakt', '/#kontakt'],
] as const

export function Navigation() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <Link href="/" className="brand-link" aria-label="Wilcke Worte und Visionen – Startseite">
        <Image src="/media/logo-wide.png" alt="Wilcke Worte und Visionen" width={1280} height={473} priority />
      </Link>
      <nav className={open ? 'main-nav open' : 'main-nav'} aria-label="Hauptnavigation">
        {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menü öffnen">
        <span /><span /><span />
      </button>
    </header>
  )
}
