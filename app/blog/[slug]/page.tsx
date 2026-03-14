import type { Metadata } from 'next'

// TODO: Replace with WP data fetching
const placeholderPosts: Record<string, { title: string; content: string; date: string; excerpt: string }> = {
  willkommen: {
    title: 'Willkommen auf unserem Blog',
    content: '<p>Hier teilen wir Einblicke in unsere Arbeit, Tipps für Podcast und Video und Neuigkeiten aus dem Studio Mauerbach.</p><p>Schau regelmäßig vorbei — es gibt viel zu erzählen.</p>',
    date: '2026-03-01',
    excerpt: 'Hier teilen wir Einblicke in unsere Arbeit.',
  },
  'podcast-starten': {
    title: '5 Tipps für deinen ersten Podcast',
    content: '<p>Du willst einen Podcast starten? Hier sind fünf Dinge, die du vorab wissen solltest.</p><p>1. Finde dein Thema. 2. Investiere in ein gutes Mikrofon. 3. Plane deine ersten zehn Folgen. 4. Kümmere dich um Hosting. 5. Sei konsequent.</p>',
    date: '2026-02-15',
    excerpt: 'Du willst einen Podcast starten? Diese fünf Dinge solltest du vorab wissen.',
  },
  'livestream-setup': {
    title: 'Das perfekte Livestream-Setup',
    content: '<p>Welche Technik du brauchst und worauf es bei der Bildregie ankommt — ein Überblick.</p>',
    date: '2026-02-01',
    excerpt: 'Welche Technik du brauchst und worauf es bei der Bildregie ankommt.',
  },
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = placeholderPosts[slug]
  if (!post) return { title: 'Nicht gefunden' }
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export function generateStaticParams() {
  return Object.keys(placeholderPosts).map((slug) => ({ slug }))
}

export const revalidate = 300

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = placeholderPosts[slug]

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--text)' }}>
            404
          </h1>
          <p className="mt-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>
            Beitrag nicht gefunden.
          </p>
          <a href="/blog" className="mt-4 inline-block" style={{ color: 'var(--coral)', fontFamily: 'var(--font-body)' }}>
            ← Zurück zum Blog
          </a>
        </div>
      </div>
    )
  }

  return (
    <article className="px-6 pt-24 pb-16" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="mx-auto max-w-3xl">
        <a
          href="/blog"
          className="mb-8 inline-block transition-colors hover:text-[var(--coral)]"
          style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}
        >
          ← Zurück zum Blog
        </a>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-faint)' }}>
          {new Date(post.date).toLocaleDateString('de-AT', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <h1
          className="mt-2 mb-8"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--text)' }}
        >
          {post.title}
        </h1>

        <div
          className="prose"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            color: 'var(--text)',
            lineHeight: 1.7,
            maxWidth: '54ch',
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  )
}
