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
  description: 'Générez une documentation professionnelle pour vos workflows N8N en 2 minutes',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/logo.png',
  },
  openGraph: {
    title: 'ATLAS - Documentation automatique pour workflows N8N',
    description: 'Documentation automatique pour vos workflows N8N en moins de 2 minutes',
    images: ['/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
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