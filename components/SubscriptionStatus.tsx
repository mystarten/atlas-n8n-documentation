'use client'

import { useEffect, useState } from 'react'

interface SubscriptionData {
  subscription_tier: string
  status: string
  current_period_end: string | null
  current_period_start: string | null
  cancel_at_period_end: boolean
  scheduled_changes: {
    type: 'change_plan' | 'cancel'
    new_plan: string
    effective_date: string
  } | null
  payment_method: {
    type: string
    last4: string
  } | null
}

export default function SubscriptionStatus() {
  const [data, setData] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/subscription/status')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Erreur chargement abonnement:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="animate-pulse bg-slate-800 rounded-2xl p-6 h-64 border border-slate-700"></div>
    )
  }

  if (!data) return null

  // ✅ Badge du plan actuel
  const planColors = {
    free: 'bg-gray-500',
    starter: 'bg-blue-500',
    pro: 'bg-blue-500',
    enterprise: 'bg-gradient-to-r from-blue-500 to-cyan-500'
  }

  const planNames = {
    free: 'Free',
    starter: 'Starter',
    pro: 'Pro',
    enterprise: 'Enterprise'
  }

  const currentPlanColor = planColors[data.subscription_tier as keyof typeof planColors] || 'bg-gray-500'
  const currentPlanName = planNames[data.subscription_tier as keyof typeof planNames] || data.subscription_tier

  return (
    <>
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50 p-8 hover:border-blue-500/50 transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Informations d'abonnement</h2>
      </div>

      {/* Plan actuel */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-gray-400">Plan actuel :</span>
          <span className={`${currentPlanColor} text-white px-4 py-2 rounded-lg font-bold text-lg`}>
            {currentPlanName}
          </span>
          {data.status === 'active' && (
            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm border border-green-500/30">
              ✓ Actif
            </span>
          )}
        </div>
      </div>

      {/* Période actuelle */}
      {data.current_period_end && (
        <div className="mb-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Début de période</p>
              <p className="text-white font-medium">
                {new Date(data.current_period_start!).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">
                {data.cancel_at_period_end ? 'Fin de l\'abonnement' : 'Prochaine facturation'}
              </p>
              <p className="text-white font-medium">
                {new Date(data.current_period_end).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Changements prévus */}
      {data.scheduled_changes && (
        <div className="mb-6 p-4 rounded-lg border-2 border-yellow-500/30 bg-yellow-500/10">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <p className="text-yellow-400 font-bold mb-2">Changement prévu</p>
              
              {data.scheduled_changes.type === 'cancel' ? (
                <p className="text-white">
                  Votre abonnement <strong>{currentPlanName}</strong> sera annulé et vous passerez au plan <strong>Free</strong> le{' '}
                  <strong>
                    {new Date(data.scheduled_changes.effective_date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </strong>
                </p>
              ) : (
                <p className="text-white">
                  Vous passerez au plan <strong>{planNames[data.scheduled_changes.new_plan as keyof typeof planNames] || data.scheduled_changes.new_plan}</strong> le{' '}
                  <strong>
                    {new Date(data.scheduled_changes.effective_date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </strong>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Méthode de paiement */}
      {data.payment_method && (
        <div className="mb-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
          <p className="text-gray-400 text-sm mb-2">Méthode de paiement</p>
          <div className="flex items-center gap-2 text-white">
            <span className="text-2xl">💳</span>
            <span>Carte •••• {data.payment_method.last4}</span>
          </div>
        </div>
      )}

    </div>
    </>
  )
}

