'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/app/contexts/UserContext'

interface UpgradeModalProps {
  currentPlan: string
  targetPlan: string
  userId: string
  onClose: () => void
}

export default function UpgradeModal({ currentPlan, targetPlan, userId, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [upgradeInfo, setUpgradeInfo] = useState<any>(null)
  const { refreshUserData } = useUser()

  useEffect(() => {
    loadUpgradeInfo()
  }, [])

  const loadUpgradeInfo = async () => {
    try {
      const response = await fetch('/api/calculate-upgrade-cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetPlan })
      })
      const data = await response.json()
      setUpgradeInfo(data)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleUpgrade = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/upgrade-subscription-immediate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetPlan, userId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'upgrade')
      }

      // Succès : rafraîchir les données et fermer le modal
      alert(`Upgrade réussi ! Vous êtes maintenant sur le plan ${targetPlan}.`)
      await refreshUserData() // Rafraîchir le context
      onClose() // Fermer le modal
      window.location.reload() // Recharger pour être sûr
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!upgradeInfo) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
          <p className="text-white">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-white mb-6">
          Upgrade vers <span className="text-blue-400">{targetPlan}</span>
        </h2>
        
        <div className="mb-6 space-y-3">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Plan actuel</p>
            <p className="text-lg font-semibold text-white capitalize">
              {upgradeInfo.currentPlan} - {upgradeInfo.currentPrice}€/mois
            </p>
          </div>
          
          <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30">
            <p className="text-sm text-gray-400 mb-1">Nouveau plan</p>
            <p className="text-lg font-semibold text-white capitalize">
              {upgradeInfo.targetPlan} - {upgradeInfo.targetPrice}€/mois
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl p-6 mb-6">
          <p className="text-sm opacity-90 mb-2">À payer maintenant</p>
          <p className="text-5xl font-black">{upgradeInfo.amountToPay}€</p>
          <p className="text-sm opacity-90 mt-2">
            Différence de prix pour ce mois
          </p>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-200">
            ℹ️ Vous avez déjà payé {upgradeInfo.currentPrice}€ ce mois-ci.<br/>
            Vous payez {upgradeInfo.amountToPay}€ maintenant pour accéder immédiatement à {upgradeInfo.targetPlan}.<br/>
            <strong className="text-white">Le mois prochain : {upgradeInfo.targetPrice}€/mois</strong>
          </p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-slate-600 text-gray-300 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 font-semibold"
          >
            {loading ? 'Traitement...' : `Payer ${upgradeInfo.amountToPay}€ maintenant`}
          </button>
        </div>
      </div>
    </div>
  )
}

