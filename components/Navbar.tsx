'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-[#0f172a]/90 backdrop-blur-lg border-b border-[#1e293b] z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        
        {/* Logo - Toujours visible */}
        <Link href="/" className="flex-shrink-0">
          <Image 
            src="/logo.png" 
            alt="ATLAS" 
            width={40} 
            height={40}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          />
        </Link>
        
        {/* Nav links - Desktop seulement */}
        <div className="hidden md:flex items-center gap-8">
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
        
        {/* Bouton Se connecter - Desktop seulement */}
        <Link 
          href="/login" 
          className="hidden md:flex px-6 py-2.5 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white text-sm font-semibold rounded-lg hover:from-[#2563eb] hover:to-[#1d4ed8] transition-all shadow-lg shadow-[#3b82f6]/30 font-inter"
        >
          Se connecter
        </Link>
        
        {/* Bouton Menu Hamburger - Mobile seulement */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-2 text-[#e2e8f0] hover:text-white transition-colors"
          aria-label="Menu"
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
      
      {/* Menu Mobile - Slide down */}
      {isOpen && (
        <div className="md:hidden bg-[#1e293b] border-t border-[#334155]">
          <div className="px-4 py-4 space-y-3">
            <Link 
              href="/" 
              onClick={() => setIsOpen(false)} 
              className={`block px-4 py-3 rounded-lg transition-colors font-inter ${
                pathname === '/' 
                  ? 'bg-[#3b82f6]/20 text-white font-medium' 
                  : 'text-[#e2e8f0] hover:bg-[#334155]'
              }`}
            >
              Accueil
            </Link>
            <Link 
              href="/documentation" 
              onClick={() => setIsOpen(false)} 
              className={`block px-4 py-3 rounded-lg transition-colors font-inter ${
                pathname === '/documentation' 
                  ? 'bg-[#3b82f6]/20 text-white font-medium' 
                  : 'text-[#e2e8f0] hover:bg-[#334155]'
              }`}
            >
              Documentation
            </Link>
            <Link 
              href="/blog" 
              onClick={() => setIsOpen(false)} 
              className={`block px-4 py-3 rounded-lg transition-colors font-inter ${
                pathname.startsWith('/blog') 
                  ? 'bg-[#3b82f6]/20 text-white font-medium' 
                  : 'text-[#e2e8f0] hover:bg-[#334155]'
              }`}
            >
              Blog
            </Link>
            <Link 
              href="/pricing" 
              onClick={() => setIsOpen(false)} 
              className={`block px-4 py-3 rounded-lg transition-colors font-inter ${
                pathname === '/pricing' 
                  ? 'bg-[#3b82f6]/20 text-white font-medium' 
                  : 'text-[#e2e8f0] hover:bg-[#334155]'
              }`}
            >
              Tarifs
            </Link>
            <Link 
              href="/login" 
              onClick={() => setIsOpen(false)} 
              className="block px-6 py-3 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white text-center font-semibold rounded-lg transition-all shadow-lg font-inter mt-4"
            >
              Se connecter
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
