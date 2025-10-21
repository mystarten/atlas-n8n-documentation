'use client';

import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0E27] via-[#1A1F3A] to-[#0A0E27] px-4">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">
          Vérifiez votre email
        </h1>
        
        <p className="text-gray-400 mb-6">
          Nous avons envoyé un email de confirmation à votre adresse. 
          Cliquez sur le lien dans l&apos;email pour activer votre compte.
        </p>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
          <p className="text-blue-400 text-sm">
            💡 Pensez à vérifier vos spams si vous ne voyez pas l&apos;email
          </p>
        </div>

        <Link
          href="/login"
          className="inline-block text-gray-400 hover:text-white transition"
        >
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
