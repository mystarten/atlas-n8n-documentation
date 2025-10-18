'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (isSignUp && password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              email_confirm: true // Force la confirmation automatique
            }
          },
        });
        if (error) throw error;
        setMessage('Compte créé ! Redirection...');
        setTimeout(() => router.push('/onboarding'), 1500);
      } else {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        // ✅ REDIRECTION IMMÉDIATE ET FORCÉE
        console.log('✅ Login réussi, redirection...');
        
        // Vérifier si l'onboarding est fait
        if (data.user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('onboarding_completed')
            .eq('user_id', data.user.id)
            .maybeSingle();

          if (profile?.onboarding_completed) {
            window.location.href = '/generate';
          } else {
            window.location.href = '/onboarding';
          }
        }
        // Ne pas mettre setLoading(false) ici car on redirige
        return;
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/generate`,
      },
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[#0a0f1e]">
      
      {/* Pattern background subtil */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.05)_0%,_transparent_50%)]"></div>
      
      {/* LEFT SIDE - Formulaire (w-full lg:w-2/5) */}
      <div className="relative z-10 w-full lg:w-2/5 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          
          {/* Logo petit en haut (lien retour) */}
          <Link href="/" className="inline-flex items-center gap-2 mb-12 text-[#cbd5e1] hover:text-white transition-colors group">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-inter">Retour à l'accueil</span>
          </Link>

          {/* Titre */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-white mb-3 font-poppins">
              {isSignUp ? 'Créer un compte' : 'Connexion'}
            </h1>
            <p className="text-[#94a3b8] font-inter text-base">
              {isSignUp ? 'Commencez à documenter vos workflows' : 'Bon retour sur ATLAS'}
            </p>
          </div>

          {/* Messages */}
          {message && (
            <div className="mb-6 p-4 bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl backdrop-blur-sm">
              <p className="text-[#10b981] text-sm font-inter">{message}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl backdrop-blur-sm">
              <p className="text-[#ef4444] text-sm font-inter">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-5">
            
            <div>
              <label className="block text-sm font-semibold text-[#cbd5e1] mb-2 font-inter">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-[#1e293b]/60 border border-[#334155] rounded-xl text-white placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/30 transition-all font-inter"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-[#cbd5e1] font-inter">
                  Mot de passe
                </label>
                {!isSignUp && (
                  <Link href="/reset-password" className="text-xs text-[#3b82f6] hover:text-[#60a5fa] transition-colors font-inter font-medium">
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
                className="w-full px-4 py-3.5 bg-[#1e293b]/60 border border-[#334155] rounded-xl text-white placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/30 transition-all font-inter"
                placeholder="••••••••"
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-semibold text-[#cbd5e1] mb-2 font-inter">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3.5 bg-[#1e293b]/60 border border-[#334155] rounded-xl text-white placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/30 transition-all font-inter"
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-semibold rounded-xl hover:from-[#2563eb] hover:to-[#1d4ed8] hover:shadow-xl hover:shadow-[#3b82f6]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-inter shadow-lg shadow-[#3b82f6]/30"
            >
              {loading ? 'Chargement...' : (isSignUp ? 'Créer mon compte' : 'Se connecter')}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-[#94a3b8] font-inter">
            {isSignUp ? 'Vous avez déjà un compte ?' : 'Pas encore de compte ?'}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setMessage('');
              }}
              className="text-[#3b82f6] hover:text-[#60a5fa] font-semibold transition-colors"
            >
              {isSignUp ? 'Se connecter' : 'Créer un compte'}
            </button>
          </p>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-[#334155]"></div>
            <span className="text-[#64748b] text-sm font-inter">ou continuer avec</span>
            <div className="flex-1 h-px bg-[#334155]"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-[#334155] text-white font-semibold rounded-xl hover:bg-white/20 hover:border-[#3b82f6]/50 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed font-inter"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </button>

        </div>
      </div>

      {/* RIGHT SIDE - Logo ATLAS géant (hidden on mobile, w-0 lg:w-3/5) */}
      <div className="hidden lg:flex relative z-10 w-3/5 items-center justify-center p-12">
        <div className="text-center max-w-2xl">
          
          {/* Logo ATLAS géant */}
          <div className="mb-8">
            <Image
              src="/logo.png"
              alt="ATLAS"
              width={200}
              height={200}
              className="mx-auto drop-shadow-2xl animate-float"
            />
          </div>

          {/* Titre */}
          <h2 className="text-6xl font-bold text-white mb-6 font-poppins leading-tight">
            ATLAS
          </h2>

          {/* Slogan */}
          <p className="text-3xl text-[#cbd5e1] font-light mb-8 font-inter leading-relaxed">
            Documentez vos workflows<br />en un clic
          </p>

          {/* Sous-titre */}
          <p className="text-lg text-[#94a3b8] font-inter max-w-md mx-auto">
            Générez automatiquement une documentation complète et professionnelle pour tous vos workflows N8N
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2 font-poppins">40s</div>
              <div className="text-[#94a3b8] font-inter">Génération rapide</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2 font-poppins">2.5K+</div>
              <div className="text-[#94a3b8] font-inter">Workflows documentés</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2 font-poppins">98%</div>
              <div className="text-[#94a3b8] font-inter">Satisfaction</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
