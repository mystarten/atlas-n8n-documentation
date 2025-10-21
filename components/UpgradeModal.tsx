'use client';

import { X, Crown, Zap, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  usedTemplates: number;
  limitTemplates: number;
}

export default function UpgradeModal({ isOpen, onClose, currentPlan, usedTemplates, limitTemplates }: UpgradeModalProps) {
  if (!isOpen) return null;

  const plans = [
    {
      name: 'Starter',
      price: '9€',
      templates: 20,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Pro',
      price: '19€',
      templates: 40,
      color: 'from-purple-500 to-pink-500',
      badge: 'POPULAIRE',
    },
    {
      name: 'Enterprise',
      price: '49€',
      templates: 65,
      color: 'from-yellow-500 to-orange-500',
      badge: 'PREMIUM',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-gradient-to-br from-[#0f172a] to-[#1e293b] border-2 border-red-500/50 rounded-3xl p-8 max-w-4xl w-full shadow-2xl shadow-red-500/30 animate-slideUp">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-full px-6 py-3 mb-4">
            <Zap className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-semibold">Limite atteinte</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Vous avez utilisé {usedTemplates}/{limitTemplates} templates
          </h2>
          <p className="text-gray-400 text-lg">
            Passez à un plan supérieur pour continuer à générer des documentations
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-[#0A0E27] border-2 ${
                plan.badge ? 'border-blue-500' : 'border-white/10'
              } rounded-2xl p-6 hover:scale-105 transition`}
            >
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r ${plan.color} text-white text-xs font-bold px-4 py-1.5 rounded-full`}>
                  {plan.badge}
                </div>
              )}

              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-3">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400">/mois</span>
                </div>
                <p className="text-gray-400">{plan.templates} templates/mois</p>
              </div>

              <Link
                href="/pricing"
                className={`w-full bg-gradient-to-r ${plan.color} text-white font-bold py-3 px-6 rounded-xl hover:shadow-xl transition flex items-center justify-center gap-2`}
              >
                <Crown className="w-4 h-4" />
                Choisir {plan.name}
              </Link>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            ✨ Garantie satisfait ou remboursé de 14 jours sur tous les plans
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
