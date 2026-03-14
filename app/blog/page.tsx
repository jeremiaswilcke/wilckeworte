import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Einblicke, Tipps und Neuigkeiten aus unserem Studio.',
}

// TODO: Fetch from WP when available
const placeholderPosts = [
  { slug: 'willkommen', title: 'Willkommen auf unserem Blog', excerpt: 'Hier teilen wir Einblicke in unsere Arbeit, Tipps für Podcast und Video und Neuigkeiten aus dem Studio.', date: '2026-03-01' },
  { slug: 'podcast-starten', title: '5 Tipps für deinen ersten Podcast', excerpt: 'Du willst einen Podcast starten? Diese fünf Dinge solltest du vorab wissen.', date: '2026-02-15' },
  { slug: 'livestream-setup', title: 'Das perfekte Livestream-Setup', excerpt: 'Welche Technik du brauchst und worauf es bei der Bildregie ankommt.', date: '2026-02-01' },
]

export default function BlogPage() {
  return (
    <div className="px-6 pt-24 pb-16" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="mx-auto max-w-4xl">
        <p
          className="mb-4 uppercase"
          style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--teal)' }}
        >
          Blog
        </p>
        <h1
          className="mb-12"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--text)' }}
        >
          Neuigkeiten & Einblicke
        </h1>

        <div className="grid gap-8">
          {placeholderPosts.map((post) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-4 rounded-2xl p-6 transition-shadow hover:shadow-lg sm:flex-row sm:items-start"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              {/* Image Placeholder */}
              <div
                className="flex aspect-video w-full flex-shrink-0 items-center justify-center rounded-xl border-2 border-dashed sm:w-48"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--bg-alt)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-faint)',
                }}
              >
                [ Bild ]
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-faint)' }}>
                  {new Date(post.date).toLocaleDateString('de-AT', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <h2
                  className="mt-1 transition-colors group-hover:text-[var(--coral)]"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--text)' }}
                >
                  {post.title}
                </h2>
                <p className="mt-2" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  {post.excerpt}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
