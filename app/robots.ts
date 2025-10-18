import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/account', '/api/', '/auth/'],
      },
    ],
    sitemap: 'https://atlasbuilder.app/sitemap.xml',
  }
}

