import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/account', '/admin', '/api/', '/auth/'],
      },
    ],
    sitemap: 'https://appbuilder.app/sitemap.xml',
  }
}

