'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-[#0A0E27] flex items-center justify-center relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0E27] via-[#1A1F3A] to-[#0A0E27] opacity-90"></div>
      
      {/* Particules décoratives */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#7C3AED] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#06B6D4] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <div className="glass-dark rounded-3xl p-8 border-gradient glow-violet text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/img/logo.png"
              alt="Atlas"
              width={80}
              height={80}
              className="rounded-xl"
              style={{ objectFit: 'contain', background: 'transparent' }}
            />
          </div>

          {/* Message d'erreur */}
          <h1 className="text-4xl font-black text-white mb-4">
            Erreur d'<span className="text-gradient-violet">authentification</span>
          </h1>
          <p className="text-gray-300 mb-8">
            Une erreur s'est produite lors de la connexion. Veuillez réessayer.
          </p>

          {/* Boutons d'action */}
          <div className="space-y-4">
            <Link 
              href="/login" 
              className="block w-full px-8 py-4 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white rounded-2xl hover:scale-110 transition-all font-black uppercase tracking-wider glow-violet"
            >
              Réessayer la connexion
            </Link>
            <Link 
              href="/" 
              className="block w-full px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-2xl hover:scale-110 transition-all font-bold uppercase tracking-wider"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}



