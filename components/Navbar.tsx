'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const supabase = createClient();

  // Effet de scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsUserMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#0f172a]/95 backdrop-blur-xl border-b border-[#1e293b] shadow-lg shadow-black/20' 
        : 'bg-[#0f172a]/80 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo (gauche) */}
          <Link href="/" className="flex-shrink-0 group">
            <Image 
              src="/logo.png" 
              alt="ATLAS" 
              width={40} 
              height={40}
              className="cursor-pointer transition-transform duration-300 group-hover:scale-110 drop-shadow-lg"
            />
          </Link>
          
          {/* Navigation Desktop (centré) */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center gap-1 bg-[#1e293b]/50 backdrop-blur-sm rounded-full px-2 py-1.5 border border-[#334155]/50">
              <Link 
                href="/" 
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 font-inter ${
                  pathname === '/' 
                    ? 'bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/30' 
                    : 'text-[#cbd5e1] hover:text-white hover:bg-[#334155]'
                }`}
              >
                Accueil
              </Link>
              <Link 
                href="/documentation" 
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 font-inter ${
                  pathname === '/documentation' 
                    ? 'bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/30' 
                    : 'text-[#cbd5e1] hover:text-white hover:bg-[#334155]'
                }`}
              >
                Documentation
              </Link>
              <Link 
                href="/blog" 
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 font-inter ${
                  pathname.startsWith('/blog') 
                    ? 'bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/30' 
                    : 'text-[#cbd5e1] hover:text-white hover:bg-[#334155]'
                }`}
              >
                Blog
              </Link>
              <Link 
                href="/pricing" 
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 font-inter ${
                  pathname === '/pricing' 
                    ? 'bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/30' 
                    : 'text-[#cbd5e1] hover:text-white hover:bg-[#334155]'
                }`}
              >
                Tarifs
              </Link>
              {user && (
                <Link 
                  href="/generate" 
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 font-inter ${
                    pathname === '/generate' 
                      ? 'bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/30' 
                      : 'text-[#cbd5e1] hover:text-white hover:bg-[#334155]'
                  }`}
                >
                  Générer
                </Link>
              )}
            </div>
          </div>

          {/* User Menu OU Login (droite) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2 bg-[#1e293b]/80 backdrop-blur-sm border border-[#334155] rounded-full hover:bg-[#334155] transition-all duration-300 shadow-lg"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <span className="text-white text-sm font-inter max-w-[120px] truncate">{user.email}</span>
                  <svg className={`w-4 h-4 text-[#cbd5e1] transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-[#1e293b] border border-[#334155] rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-[#334155] bg-[#0f172a]">
                      <p className="text-xs text-[#64748b] font-inter">Connecté en tant que</p>
                      <p className="text-sm text-white font-inter truncate mt-1">{user.email}</p>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-3 text-[#e2e8f0] hover:bg-[#334155] transition-colors font-inter text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Mon compte
                      </div>
                    </Link>
                    <div className="border-t border-[#334155]"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-[#ef4444] hover:bg-[#334155] transition-colors font-inter text-sm flex items-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/login" 
                className="px-6 py-2.5 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white text-sm font-semibold rounded-full hover:from-[#2563eb] hover:to-[#1d4ed8] transition-all duration-300 shadow-lg shadow-[#3b82f6]/40 hover:shadow-[#3b82f6]/60 hover:scale-105 font-inter"
              >
                Se connecter
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#e2e8f0] hover:text-white transition-colors rounded-lg hover:bg-[#1e293b]"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#1e293b]/95 backdrop-blur-xl border-t border-[#334155] shadow-2xl">
          <div className="px-4 py-4 space-y-2">
            <Link href="/" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl transition-all font-inter ${pathname === '/' ? 'bg-[#3b82f6] text-white shadow-lg' : 'text-[#e2e8f0] hover:bg-[#334155]'}`}>
              Accueil
            </Link>
            <Link href="/documentation" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl transition-all font-inter ${pathname === '/documentation' ? 'bg-[#3b82f6] text-white shadow-lg' : 'text-[#e2e8f0] hover:bg-[#334155]'}`}>
              Documentation
            </Link>
            <Link href="/blog" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl transition-all font-inter ${pathname.startsWith('/blog') ? 'bg-[#3b82f6] text-white shadow-lg' : 'text-[#e2e8f0] hover:bg-[#334155]'}`}>
              Blog
            </Link>
            <Link href="/pricing" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl transition-all font-inter ${pathname === '/pricing' ? 'bg-[#3b82f6] text-white shadow-lg' : 'text-[#e2e8f0] hover:bg-[#334155]'}`}>
              Tarifs
            </Link>

            {user ? (
              <>
                <Link href="/generate" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl transition-all font-inter ${pathname === '/generate' ? 'bg-[#3b82f6] text-white shadow-lg' : 'text-[#e2e8f0] hover:bg-[#334155]'}`}>
                  Générer
                </Link>
                <Link href="/account" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl transition-all font-inter ${pathname === '/account' ? 'bg-[#3b82f6] text-white shadow-lg' : 'text-[#e2e8f0] hover:bg-[#334155]'}`}>
                  Mon compte
                </Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl text-[#ef4444] hover:bg-[#334155] transition-all font-inter">
                  Déconnexion
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsOpen(false)} className="block px-6 py-3 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white text-center font-semibold rounded-xl font-inter mt-4 shadow-lg">
                Se connecter
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
