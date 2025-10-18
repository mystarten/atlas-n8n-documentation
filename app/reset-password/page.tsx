'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const supabase = createClient();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      
      if (error) throw error;
      
      setMessage('Un email de réinitialisation a été envoyé ! Vérifiez votre boîte de réception.');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      
      {/* Background dégradé uniforme */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6] via-[#8b5cf6] to-[#ec4899] opacity-90"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
      
      {/* LEFT SIDE - Reset Form */}
      <div className="relative z-10 w-full lg:w-2/5 flex items-center justify-center p-6 sm:p-8 bg-[#0f172a]/95 backdrop-blur-xl">
        <div className="w-full max-w-md">
          
          {/* Logo + Titre */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <Image 
                src="/logo.png" 
                alt="ATLAS" 
                width={80} 
                height={80} 
                className="mx-auto drop-shadow-2xl hover:scale-105 transition-transform"
              />
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 font-poppins">
              Mot de passe oublié ?
            </h1>
            <p className="text-[#cbd5e1] font-inter">
              Pas de souci, nous allons vous aider
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="mb-6 p-4 bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-[#10b981] text-sm font-inter">{message}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#ef4444] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-[#ef4444] text-sm font-inter">{error}</p>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mb-6 p-4 bg-[#3b82f6]/10 border border-[#3b82f6]/30 rounded-lg">
            <p className="text-[#cbd5e1] text-sm font-inter">
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleResetPassword} className="space-y-6">
            
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-[#cbd5e1] mb-2 font-inter">
                Adresse email
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-semibold rounded-lg hover:from-[#2563eb] hover:to-[#1d4ed8] transition-all shadow-lg shadow-[#3b82f6]/30 disabled:opacity-50 disabled:cursor-not-allowed font-inter"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-[#3b82f6] hover:text-[#2563eb] transition-colors font-inter text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à la connexion
            </Link>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE - Visual (même que login) */}
      <div className="hidden lg:flex relative z-10 w-3/5 items-center justify-center p-12">
        <div className="max-w-4xl text-center">
          <h2 className="text-5xl font-bold text-white mb-4 font-poppins drop-shadow-2xl">
            ATLAS
          </h2>
          <p className="text-2xl text-white/90 font-inter font-light mb-8">
            Sécurité et simplicité pour vos workflows
          </p>
          <div className="relative mx-auto max-w-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl blur-3xl"></div>
            <div className="relative rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl backdrop-blur-sm">
              <Image
                src="/img/comptableapres.png"
                alt="Exemple ATLAS"
                width={1200}
                height={800}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

