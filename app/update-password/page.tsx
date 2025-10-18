'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      alert('Mot de passe mis à jour ! Redirection...');
      router.push('/generate');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      <div className="w-full max-w-md">
        
        {/* Logo + Titre */}
        <div className="text-center mb-8">
          <Image 
            src="/logo.png" 
            alt="ATLAS" 
            width={80} 
            height={80} 
            className="mx-auto mb-4 drop-shadow-2xl" 
          />
          <h1 className="text-3xl font-bold text-white mb-2 font-poppins">
            Nouveau mot de passe
          </h1>
          <p className="text-[#cbd5e1] font-inter">
            Choisissez un nouveau mot de passe sécurisé
          </p>
        </div>

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

        {/* Form */}
        <form onSubmit={handleUpdatePassword} className="space-y-4 bg-[#1e293b]/50 p-6 sm:p-8 rounded-2xl border border-[#334155]/30 backdrop-blur-sm">
          
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-[#cbd5e1] mb-2 font-inter">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition-all font-inter"
              placeholder="••••••••"
            />
            <p className="text-xs text-[#64748b] mt-2 font-inter">Minimum 6 caractères</p>
          </div>

          {/* Confirm Password */}
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
              className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition-all font-inter"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-semibold rounded-lg hover:from-[#2563eb] hover:to-[#1d4ed8] transition-all shadow-lg shadow-[#3b82f6]/30 disabled:opacity-50 disabled:cursor-not-allowed font-inter"
          >
            {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
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
  );
}

