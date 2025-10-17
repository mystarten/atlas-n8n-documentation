import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { UserProvider } from './contexts/UserContext'
import { AuthProvider } from '@/components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ATLAS - Documentation automatique pour workflows N8N',
  description: 'Documentez vos workflows N8N automatiquement en 30 secondes avec IA. Générez des templates professionnels enrichis pour vos automations N8N.',
  keywords: [
    'N8N',
    'documentation automatique',
    'workflows',
    'automation',
    'IA',
    'intelligence artificielle',
    'templates N8N',
    'Claude Sonnet',
    'GPT-5',
    'documentation workflow',
    'n8n france',
    'automatisation',
    'low-code',
    'no-code'
  ],
  authors: [{ name: 'ATLAS' }],
  creator: 'ATLAS',
  publisher: 'ATLAS',
  metadataBase: new URL('https://atlasbuilder.app'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=2', sizes: 'any' },
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=2',
    apple: '/logo.png',
    other: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        url: '/favicon.ico?v=2',
      },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://atlasbuilder.app',
    title: 'ATLAS - Documentation automatique pour workflows N8N',
    description: 'Documentez vos workflows N8N automatiquement en 30 secondes avec IA',
    siteName: 'ATLAS',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ATLAS - Documentation automatique pour workflows N8N',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATLAS - Documentation automatique pour workflows N8N',
    description: 'Documentez vos workflows N8N automatiquement en 30 secondes avec IA',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ATLAS',
    description: 'Documentation automatique pour workflows N8N avec intelligence artificielle',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: 'https://atlasbuilder.app',
    offers: {
      '@type': 'Offer',
      price: '9',
      priceCurrency: 'EUR',
      priceValidUntil: '2025-12-31',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'ATLAS',
      },
    },
    author: {
      '@type': 'Organization',
      name: 'ATLAS',
      url: 'https://atlasbuilder.app',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
    },
    softwareVersion: '1.0',
    applicationSubCategory: 'Workflow Automation',
    featureList: [
      'Documentation automatique N8N',
      'Génération avec IA (Claude Sonnet 4.5, GPT-5)',
      'Templates professionnels enrichis',
      'Export PDF et notes N8N',
      'Support multi-formats',
    ],
  }

  return (
    <html lang="fr">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <UserProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  )
}