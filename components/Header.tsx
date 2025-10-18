'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

export default function Header() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    
    // Récupérer JUSTE la session (pas l'usage)
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      console.log('✅ Session chargée:', session ? 'connecté' : 'non connecté')
    }
    
    initAuth()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    
    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/30 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between h-auto">
        <Link href="/" className="flex items-center group">
          <img src="/logo.png" alt="ATLAS Logo" className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className={`text-gray-300 hover:text-white transition-colors font-medium ${pathname === '/' ? 'text-white' : ''}`}>
            Accueil
          </Link>
          <Link href="/documentation" className={`text-gray-300 hover:text-white transition-colors font-medium ${pathname === '/documentation' ? 'text-white' : ''}`}>
            Documentation
          </Link>
          <Link href="/blog" className={`text-gray-300 hover:text-white transition-colors font-medium ${pathname.startsWith('/blog') ? 'text-white' : ''}`}>
            Blog
          </Link>
          <Link href="/pricing" className={`text-gray-300 hover:text-white transition-colors font-medium ${pathname === '/pricing' ? 'text-white' : ''}`}>
            Tarifs
          </Link>
          {user && (
            <Link href="/generate" className={`text-gray-300 hover:text-white transition-colors font-medium ${pathname === '/generate' ? 'text-white' : ''}`}>
              Générer
            </Link>
          )}
        </nav>
        
        {/* Menu mobile */}
        <div className="md:hidden">
          <button className="text-gray-300 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* AFFICHAGE INSTANTANÉ - pas d'attente */}
        <div className="flex items-center gap-4">
          {!mounted ? (
            <div className="px-4 py-2 bg-white/10 rounded-lg animate-pulse h-8 w-24"></div>
          ) : user ? (
            <>
              <Link href="/account" className={`text-gray-300 hover:text-white transition-colors font-medium ${pathname === '/account' ? 'text-white' : ''}`}>
                Mon compte
              </Link>
              <button onClick={handleSignOut} className="px-5 py-2.5 border border-white/20 rounded-lg text-white/70 hover:text-white hover:border-white/40 transition-all text-sm font-medium">
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-semibold transition-all text-sm"
            >
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}