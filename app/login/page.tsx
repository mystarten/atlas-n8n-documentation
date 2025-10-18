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
  const [confirmPassword, setConfirmPassword] = useState('');
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

    // Validation des mots de passe pour Sign Up
    if (isSignUp && password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Inscription
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/generate`,
          },
        });

        if (error) {
          setError(error.message);
          setLoading(false);
        } else {
          setMessage('Compte créé ! Redirection...');
          setTimeout(() => router.push('/generate'), 1500);
        }
      } else {
        // Connexion
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error.message);
          setLoading(false);
        } else {
          router.push('/generate');
        }
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
    }
  };

  // Google OAuth
  const handleGoogleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/generate`,
      },
    });
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      
      {/* Background uniforme avec dégradé */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6] via-[#8b5cf6] to-[#ec4899] opacity-90"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
      
      {/* LEFT SIDE - Login Form (w-full lg:w-2/5) */}
      <div className="relative z-10 w-full lg:w-2/5 flex items-center justify-center p-6 sm:p-8 bg-[#0f172a]/95 backdrop-blur-xl">
        
        {/* Retour accueil */}
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
          
          {/* Logo + Titre */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <Image 
                src="/logo.png" 
                alt="ATLAS" 
                width={80} 
                height={80} 
                className="mx-auto drop-shadow-2xl"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 font-poppins">
              {isSignUp ? 'Créer un compte' : 'Connexion'}
            </h1>
            <p className="text-[#cbd5e1] font-inter">
              Accédez à votre espace ATLAS
            </p>
          </div>

          {/* Messages Success/Error */}
          {message && (
            <div className="mb-6 p-4 bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg backdrop-blur-sm">
              <p className="text-[#10b981] text-sm font-inter">{message}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg backdrop-blur-sm">
              <p className="text-[#ef4444] text-sm font-inter">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-[#cbd5e1] mb-2 font-inter">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1e293b] border border-[#334155] rounded-lg text-white placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition-all font-inter"
                placeholder="votre@email.com"
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-[#cbd5e1] font-inter">
                  Mot de passe
                </label>
                {!isSignUp && (
                  <Link href="/reset-password" className="text-xs text-[#3b82f6] hover:text-[#2563eb] transition-colors font-inter">
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
                className="w-full px-4 py-3 bg-[#1e293b] border border-[#334155] rounded-lg text-white placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition-all font-inter"
                placeholder="••••••••"
              />
            </div>

            {/* Confirm Password (Sign Up only) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-[#cbd5e1] mb-2 font-inter">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-[#1e293b] border border-[#334155] rounded-lg text-white placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition-all font-inter"
                  placeholder="••••••••"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-semibold rounded-lg hover:from-[#2563eb] hover:to-[#1d4ed8] transition-all shadow-lg shadow-[#3b82f6]/30 disabled:opacity-50 disabled:cursor-not-allowed font-inter"
            >
              {loading ? 'Chargement...' : (isSignUp ? 'Créer mon compte' : 'Se connecter')}
            </button>
          </form>

          {/* Toggle Sign In / Sign Up */}
          <p className="text-center mt-6 text-sm text-[#cbd5e1] font-inter">
            {isSignUp ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setMessage('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
              }}
              className="text-[#3b82f6] hover:text-[#2563eb] font-semibold transition-colors"
            >
              {isSignUp ? 'Se connecter' : 'S\'inscrire'}
            </button>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#334155]"></div>
            <span className="text-[#64748b] text-sm font-inter">ou continuer avec</span>
            <div className="flex-1 h-px bg-[#334155]"></div>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full px-6 py-3 bg-white text-[#0f172a] font-semibold rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-inter"
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

      {/* RIGHT SIDE - Exemple Template (Hidden on mobile, w-0 lg:w-3/5) */}
      <div className="hidden lg:flex relative z-10 w-3/5 items-center justify-center p-12">
        <div className="max-w-4xl">
          
          {/* Titre Section Droite */}
          <div className="text-center mb-8">
            <h2 className="text-5xl font-bold text-white mb-4 font-poppins drop-shadow-2xl">
              ATLAS
            </h2>
            <p className="text-2xl text-white/90 font-inter font-light">
              Documentation automatique pour workflows N8N
            </p>
          </div>

          {/* Image Exemple Workflow (comptableapres.png ou soraapres.png) */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl blur-3xl"></div>
            <div className="relative rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl backdrop-blur-sm">
              <Image
                src="/img/comptableapres.png"
                alt="Exemple de workflow documenté par ATLAS"
                width={1200}
                height={800}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Stats en dessous */}
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1 font-poppins">40s</div>
              <div className="text-white/70 text-sm font-inter">Génération rapide</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1 font-poppins">2.5K+</div>
              <div className="text-white/70 text-sm font-inter">Workflows documentés</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1 font-poppins">98%</div>
              <div className="text-white/70 text-sm font-inter">Satisfaction</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
