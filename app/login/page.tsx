'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const router = useRouter();
  const supabase = createClient();

  // Fonction auth principale
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isSignUp) {
        // Inscription
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          setError(error.message);
        } else {
          setMessage('✅ Email de confirmation envoyé ! Vérifiez votre boîte mail.');
        }
      } else {
        // Connexion
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error.message);
        } else {
          router.push('/generate');
        }
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth
  const handleGoogleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen flex">
      
      {/* LEFT SIDE - FORMULAIRE (1/3) */}
      <div className="w-full lg:w-1/3 bg-[#0f172a] flex items-center justify-center p-6 sm:p-8 lg:p-12 relative">
        
        {/* Retour accueil - Mobile */}
        <Link 
          href="/"
          className="absolute top-6 left-6 text-[#64748b] hover:text-white transition-colors text-sm font-inter flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </Link>

        <div className="w-full max-w-md">
          
          {/* Logo + Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Image
                src="/logo.png"
                alt="ATLAS"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 font-poppins">
              {isSignUp ? 'Créer un compte' : 'Connexion'}
            </h1>
            <p className="text-[#94a3b8] font-inter">
              {isSignUp ? 'Rejoignez ATLAS et documentez vos workflows' : 'Accédez à votre espace ATLAS'}
            </p>
          </div>

          {/* Messages d'erreur/succès */}
          {error && (
            <div className={`mb-6 p-4 rounded-xl border font-inter text-sm ${
              error.startsWith('✅') 
                ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]'
                : 'bg-[#ef4444]/10 border-[#ef4444]/30 text-[#ef4444]'
            }`}>
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 rounded-xl border bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981] font-inter text-sm">
              {message}
            </div>
          )}

          {/* Formulaire Email/Password */}
          <form onSubmit={handleAuth} className="space-y-4 mb-6">
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#cbd5e1] mb-2 font-inter">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white placeholder-[#64748b] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 outline-none transition-all font-inter"
                placeholder="votre@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-[#cbd5e1] font-inter">
                  Mot de passe
                </label>
                {!isSignUp && (
                  <Link 
                    href="/reset-password" 
                    className="text-xs text-[#3b82f6] hover:text-[#2563eb] transition-colors font-inter"
                  >
                    Oublié ?
                  </Link>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white placeholder-[#64748b] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 outline-none transition-all font-inter"
                placeholder="••••••••"
              />
              {isSignUp && (
                <p className="text-xs text-[#64748b] mt-2 font-inter">Minimum 6 caractères</p>
              )}
            </div>

            {/* Bouton Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#3b82f6]/30 font-inter"
            >
              {loading ? 'Chargement...' : isSignUp ? 'Créer mon compte' : 'Se connecter'}
            </button>
          </form>

          {/* Toggle Sign Up / Login */}
          <div className="text-center mb-6">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setMessage('');
                setEmail('');
                setPassword('');
              }}
              className="text-sm text-[#94a3b8] hover:text-white transition-colors font-inter"
            >
              {isSignUp ? 'Déjà un compte ? ' : 'Pas encore de compte ? '}
              <span className="text-[#3b82f6] font-semibold">
                {isSignUp ? 'Se connecter' : "S'inscrire"}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#334155]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0f172a] text-[#64748b] font-inter">Ou continuer avec</span>
            </div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 font-inter"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>

        </div>
      </div>

      {/* RIGHT SIDE - LOGO GÉANT (2/3) - CACHÉ SUR MOBILE */}
      <div className="hidden lg:flex w-2/3 bg-gradient-to-br from-[#3b82f6] via-[#8b5cf6] to-[#ec4899] items-center justify-center relative overflow-hidden">
        
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Contenu */}
        <div className="relative z-10 text-center">
          
          {/* Logo ATLAS géant */}
          <div className="mb-12 animate-pulse">
            <Image
              src="/logo.png"
              alt="ATLAS"
              width={500}
              height={500}
              className="object-contain drop-shadow-2xl"
            />
          </div>

          {/* Tagline */}
          <h2 className="text-5xl font-bold text-white mb-4 font-poppins drop-shadow-lg">
            ATLAS
          </h2>
          <p className="text-2xl text-white/90 font-light font-inter max-w-2xl mx-auto leading-relaxed">
            Documentation automatique pour workflows N8N
          </p>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <p className="text-4xl font-bold text-white mb-2 font-poppins">40s</p>
              <p className="text-white/80 text-sm font-inter">Génération</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-white mb-2 font-poppins">2.5K+</p>
              <p className="text-white/80 text-sm font-inter">Templates</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-white mb-2 font-poppins">98%</p>
              <p className="text-white/80 text-sm font-inter">Satisfaction</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
