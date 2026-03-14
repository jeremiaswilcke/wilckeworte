import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wilckeworte.at'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    '',
    '/equipment',
    '/blog',
    '/impressum',
    '/datenschutz',
    '/agb',
  ]

  return staticPages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1.0 : 0.7,
  }))
}
