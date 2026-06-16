'use client'

import Image from 'next/image'
import { HorizontalScroll } from '../animations/HorizontalScroll'
import { siteContent } from '@/lib/seed-data'

function ServicePanel({ service, index }: { service: typeof siteContent.services[number]; index: number }) {
  return (
    <div
      className="flex h-screen w-screen flex-shrink-0 flex-col md:flex-row"
      style={{ background: index % 2 === 0 ? 'var(--bg)' : 'var(--bg-alt)' }}
    >
      {/* Text Side */}
      <div className="flex flex-1 flex-col justify-center px-8 py-12 md:px-16 lg:px-24">
        <p
          className="mb-4 uppercase"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            letterSpacing: '0.15em',
            color: 'var(--teal)',
          }}
        >
          {service.num}
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-2xl)',
            color: 'var(--text)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          {service.title}
        </h2>
        <p
          className="mt-1"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-xl)',
            color: 'var(--coral)',
            fontStyle: 'italic',
          }}
        >
          {service.subtitle}
        </p>
        <p
          className="mt-6"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            color: 'var(--text-muted)',
            maxWidth: '45ch',
            lineHeight: 1.7,
          }}
        >
          {service.description}
        </p>
        <a
          href="#kontakt"
          className="mt-8 inline-block transition-colors hover:text-[var(--coral-hover)]"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            color: 'var(--coral)',
          }}
        >
          Mehr erfahren →
        </a>
      </div>

      {/* Image Side */}
      <div className="relative flex-1 overflow-hidden">
        <Image
          src={service.image}
          alt={service.image_label}
          fill
          sizes="50vw"
          className="object-cover"
        />
      </div>
    </div>
  )
}

export function ServicesSection() {
  const { services } = siteContent

  return (
    <section id="services">
      {/* Desktop: Horizontal Scroll */}
      <div className="hidden md:block" style={{ minWidth: 0 }}>
        <HorizontalScroll panelCount={services.length}>
          {services.map((service, i) => (
            <ServicePanel key={service.num} service={service} index={i} />
          ))}
        </HorizontalScroll>
      </div>

      {/* Mobile: Vertical Stack */}
      <div className="md:hidden">
        {services.map((service, i) => (
          <div key={service.num} className="min-h-screen" style={{ background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-alt)' }}>
            {/* Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image src={service.image} alt={service.image_label} fill sizes="100vw" className="object-cover" />
            </div>
            {/* Text */}
            <div className="px-6 py-12">
              <p className="mb-3 uppercase" style={{ fontFamily: 'var(--font-body)', fontSize: '12px', letterSpacing: '0.15em', color: 'var(--teal)' }}>
                {service.num}
              </p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--text)' }}>
                {service.title}
              </h2>
              <p className="mt-1" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--coral)', fontStyle: 'italic' }}>
                {service.subtitle}
              </p>
              <p className="mt-4" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                {service.description}
              </p>
              <a href="#kontakt" className="mt-6 inline-block" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--coral)' }}>
                Mehr erfahren →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
