'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-[#0f172a]/90 backdrop-blur-lg border-b border-[#1e293b] z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo - Gauche */}
        <Link href="/" className="flex-shrink-0">
          <Image 
            src="/logo.png" 
            alt="ATLAS" 
            width={40} 
            height={40}
            className="cursor-pointer hover:scale-105 transition-transform"
          />
        </Link>
        
        {/* Nav links - Centre */}
        <div className="flex items-center gap-8">
          <Link 
            href="/" 
            className={`text-sm transition-colors font-inter ${
              pathname === '/' 
                ? 'text-white font-medium' 
                : 'text-[#e2e8f0] hover:text-white'
            }`}
          >
            Accueil
          </Link>
          <Link 
            href="/documentation" 
            className={`text-sm transition-colors font-inter ${
              pathname === '/documentation' 
                ? 'text-white font-medium' 
                : 'text-[#e2e8f0] hover:text-white'
            }`}
          >
            Documentation
          </Link>
          <Link 
            href="/blog" 
            className={`text-sm transition-colors font-inter ${
              pathname.startsWith('/blog') 
                ? 'text-white font-medium' 
                : 'text-[#e2e8f0] hover:text-white'
            }`}
          >
            Blog
          </Link>
          <Link 
            href="/pricing" 
            className={`text-sm transition-colors font-inter ${
              pathname === '/pricing' 
                ? 'text-white font-medium' 
                : 'text-[#e2e8f0] hover:text-white'
            }`}
          >
            Tarifs
          </Link>
        </div>
        
        {/* Bouton Se connecter - Droite - GRADIENT BLEU PARTOUT */}
        <Link 
          href="/login" 
          className="flex-shrink-0 px-6 py-2.5 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white text-sm font-semibold rounded-lg hover:from-[#2563eb] hover:to-[#1d4ed8] transition-all shadow-lg shadow-[#3b82f6]/30 font-inter"
        >
          Se connecter
        </Link>
        
      </div>
    </nav>
  );
}

