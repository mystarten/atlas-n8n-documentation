'use client'

import { useState } from 'react'

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: string
  cancelAtPeriodEnd: boolean
}

export default function SubscriptionModal({
  isOpen,
  onClose,
  currentPlan,
  cancelAtPeriodEnd
}: SubscriptionModalProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '9.99€',
      features: ['15 templates/mois', 'Format PDF', 'Support email', 'Claude Sonnet 4']
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '19.99€',
      features: ['40 templates/mois', 'PDF + Notes N8N', 'Sans watermark', 'Support prioritaire', 'Claude Sonnet 4']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '49.99€',
      features: ['Templates illimités', 'Branding personnalisé', 'Sans watermark', 'Support 24/7', 'Claude Sonnet 4.5']
    }
  ]

  const handleChangePlan = async (newPlan: string) => {
    if (newPlan === currentPlan) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/change-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_plan: newPlan })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        // ✅ Si upgrade → Rediriger vers Stripe Checkout
        if (data.checkout_url) {
          window.location.href = data.checkout_url
        } else {
          // ✅ Si downgrade → Afficher confirmation
          const planNames: { [key: string]: string } = {
            starter: 'Starter',
            pro: 'Pro',
            enterprise: 'Enterprise'
          }
          alert(`✅ Changement vers ${planNames[newPlan]} programmé pour le ${new Date(data.effective_date).toLocaleDateString('fr-FR')} !`)
          window.location.reload()
        }
      } else {
        alert('❌ Erreur : ' + data.error)
      }
    } catch (error) {
      console.error(error)
      alert('❌ Erreur lors du changement de plan')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/cancel-subscription', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (res.ok) {
        alert('Abonnement annulé. Vous garderez l\'accès jusqu\'à la fin de la période.')
        window.location.reload()
      } else {
        const data = await res.json()
        alert(`Erreur : ${data.error || 'Erreur lors de l\'annulation'}`)
      }
    } catch (error) {
      console.error(error)
      alert('Erreur lors de l\'annulation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="sticky top-0 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Gérer mon abonnement</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Plan actuel */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-gray-400">Votre plan actuel :</span>
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-bold">
              {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
            </span>
            {cancelAtPeriodEnd && (
              <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">
                Annulation prévue
              </span>
            )}
          </div>
        </div>

        {/* Plans disponibles */}
        {!showCancelConfirm ? (
          <>
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Changer de plan</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {plans.map(plan => (
                  <div
                    key={plan.id}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      plan.id === currentPlan
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                    }`}
                  >
                    <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                    <p className="text-3xl font-bold text-white mb-4">{plan.price}<span className="text-sm text-gray-400">/mois</span></p>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {plan.id !== currentPlan && !cancelAtPeriodEnd && (
                      <button
                        onClick={() => handleChangePlan(plan.id)}
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
                      >
                        {loading ? 'Chargement...' : 'Choisir ce plan'}
                      </button>
                    )}
                    {plan.id === currentPlan && (
                      <div className="py-3 bg-slate-700/50 text-center text-gray-400 rounded-lg">
                        Plan actuel
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bouton annulation caché en bas */}
            {currentPlan !== 'free' && !cancelAtPeriodEnd && (
              <div className="p-6 border-t border-slate-700 bg-slate-900/50">
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="text-gray-400 hover:text-red-400 text-sm transition-colors"
                >
                  Annuler mon abonnement
                </button>
              </div>
            )}
          </>
        ) : (
          /* Confirmation d'annulation */
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">😢</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Vous allez nous manquer !
              </h3>
              <p className="text-gray-400">
                Êtes-vous sûr de vouloir annuler votre abonnement {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} ?
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 mb-6">
              <h4 className="font-bold text-white mb-3">Ce que vous perdrez :</h4>
              <ul className="space-y-2">
                <li className="text-gray-300 flex items-start gap-2">
                  <span className="text-red-400">✕</span>
                  <span>Accès aux templates premium</span>
                </li>
                <li className="text-gray-300 flex items-start gap-2">
                  <span className="text-red-400">✕</span>
                  <span>Formats PDF et Notes N8N</span>
                </li>
                <li className="text-gray-300 flex items-start gap-2">
                  <span className="text-red-400">✕</span>
                  <span>Support prioritaire</span>
                </li>
                {currentPlan === 'enterprise' && (
                  <li className="text-gray-300 flex items-start gap-2">
                    <span className="text-red-400">✕</span>
                    <span>Branding personnalisé</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
              <p className="text-blue-300 text-sm">
                ℹ️ Vous garderez l'accès jusqu'à la fin de votre période de facturation
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
              >
                Non, garder mon abonnement
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Annulation...' : 'Oui, annuler'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

