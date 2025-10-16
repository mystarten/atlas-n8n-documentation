'use client'

import { useUser } from '@/app/contexts/UserContext'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const getTemplatesLimitDisplay = (tier: string) => {
  switch (tier) {
    case 'free': return '3'
    case 'starter': return '20'
    case 'pro': return '40'
    case 'enterprise': return '60'
    default: return '3'
  }
}


export default function AdminPage() {
  // Fonction inline pour afficher la limite de templates
  const getTemplatesLimitDisplay = (tier: string) => {
    switch (tier) {
      case 'free': return '3'
      case 'starter': return '20'
      case 'pro': return '40'
      case 'enterprise': return '60'
      default: return '3'
    }
  }

  const { 
    user, 
    subscription_tier, 
    templates_generated, 
    templates_limit,
    company_name,
    refreshUserData 
  } = useUser()

  const [newPlan, setNewPlan] = useState('enterprise')
  const [newCompanyName, setNewCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncingSubscription, setSyncingSubscription] = useState(false)

  const supabase = createClient()

  const handleChangePlan = async () => {
    if (!user) return
    setLoading(true)

    try {
      console.log('🔄 Changement de plan vers:', newPlan)
      const { error } = await supabase
        .from('profiles')
        .update({ 
          subscription_tier: newPlan,
          templates_generated: 0 // Reset
        })
        .eq('id', user.id)

      if (error) throw error

      alert('Plan changé avec succès !')
      await refreshUserData() // RAFRAÎCHIR
    } catch (error: any) {
      alert('Erreur : ' + error.message)
      console.error('❌ Erreur changement plan:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeCompanyName = async () => {
    if (!user) return
    setLoading(true)

    try {
      console.log('🏢 Changement nom entreprise:', newCompanyName)
      const { error } = await supabase
        .from('profiles')
        .update({ company_name: newCompanyName || null })
        .eq('id', user.id)

      if (error) throw error

      alert('Nom d\'entreprise changé !')
      await refreshUserData() // RAFRAÎCHIR
    } catch (error: any) {
      alert('Erreur : ' + error.message)
      console.error('❌ Erreur changement nom:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSyncStripe = async () => {
    if (!user?.id) return
    setSyncing(true)

    try {
      console.log('🔄 Synchronisation manuelle avec Stripe...')
      const response = await fetch('/api/sync-stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      })

      const data = await response.json()

      if (response.ok && data.tier) {
        alert(`✅ Synchronisation réussie !\n\nNouveau plan : ${data.tier}`)
        await refreshUserData()
      } else if (data.message) {
        alert(data.message)
      } else if (data.error) {
        alert(`❌ Erreur : ${data.error}`)
      } else {
        alert('❌ Une erreur est survenue lors de la synchronisation')
      }
    } catch (error: any) {
      alert(`❌ Erreur de connexion : ${error.message}`)
      console.error('❌ Erreur sync:', error)
    } finally {
      setSyncing(false)
    }
  }

  const handleSyncSubscription = async () => {
    setSyncingSubscription(true)
    try {
      const res = await fetch('/api/admin/sync-subscription', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const data = await res.json()
      
      if (data.success) {
        alert(`${data.message}\n\nPlan avant : ${data.before}\nPlan après : ${data.after}`)
        // ✅ Rafraîchir les données du UserContext
        await refreshUserData()
      } else if (data.message) {
        alert(data.message)
      } else if (data.error) {
        alert(`❌ Erreur : ${data.error}`)
      } else {
        alert('❌ Une erreur est survenue')
      }
    } catch (error: any) {
      alert(`❌ Erreur de connexion : ${error.message}`)
    } finally {
      setSyncingSubscription(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Connectez-vous pour accéder à cette page</p>
          <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold inline-block">
            Se connecter
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-white">Admin - Gestion compte</h1>
          <Link href="/" className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all">
            ← Retour
          </Link>
        </div>

        {/* INFOS ACTUELLES */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Informations actuelles</h2>
          <div className="space-y-3">
            <p className="text-gray-300">
              <strong className="text-white">User ID :</strong> {user.id}
            </p>
            <p className="text-gray-300">
              <strong className="text-white">Email :</strong> {user.email}
            </p>
            <p className="text-gray-300">
              <strong className="text-white">Plan :</strong>{' '}
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full uppercase text-sm font-semibold">
                {subscription_tier}
              </span>
            </p>
            <p className="text-gray-300">
              <strong className="text-white">Templates :</strong>{' '}
              <span className="text-blue-400 font-semibold">{templates_generated} / {getTemplatesLimitDisplay(templates_limit)}</span>
            </p>
            <p className="text-gray-300">
              <strong className="text-white">Nom entreprise :</strong>{' '}
              {company_name || <span className="text-gray-500">(aucun)</span>}
            </p>
          </div>
          <div className="mt-4 flex gap-3 flex-wrap">
            <button 
              onClick={refreshUserData}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold"
            >
              🔄 Rafraîchir
            </button>
            <button 
              onClick={handleSyncStripe}
              disabled={syncing}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {syncing ? 'Synchronisation...' : '🔄 Synchroniser avec Stripe'}
            </button>
            <button
              onClick={handleSyncSubscription}
              disabled={syncingSubscription}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {syncingSubscription ? '⏳ Synchronisation...' : '🔄 Synchroniser mon abonnement'}
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-3">
            Le bouton "Synchroniser avec Stripe" récupère votre plan depuis Stripe et met à jour Supabase
          </p>
        </div>

        {/* CHANGER DE PLAN */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Changer de plan</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">Nouveau plan</label>
              <select 
                value={newPlan}
                onChange={(e) => setNewPlan(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="free">Free (0€ - 3 templates)</option>
                <option value="starter">Starter (9€ - 15 templates)</option>
                <option value="pro">Pro (19€ - 40 templates)</option>
                <option value="enterprise">Enterprise (49€ - illimité)</option>
              </select>
            </div>
            <button
              onClick={handleChangePlan}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Chargement...' : 'Changer'}
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-3">
            ⚠️ Cette action réinitialise le compteur de templates à 0
          </p>
        </div>

        {/* PERSONNALISATION BRANDING */}
        <div className={`rounded-2xl p-6 border-2 ${
          subscription_tier === 'enterprise' 
            ? 'bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/30' 
            : 'bg-slate-800/30 border-slate-700/30'
        }`}>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 text-white">
                🏢 Personnalisation Branding
              </h2>
              <p className="text-gray-400 text-sm">
                Remplacez "ATLAS" par le nom de votre entreprise dans tous les documents générés (PDF et notes n8n)
              </p>
            </div>
          </div>

          {subscription_tier === 'enterprise' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Nom de votre entreprise
                </label>
                <input
                  type="text"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="Ex: Ma Société SAS"
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 text-white rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50 transition-all"
                />
                <p className="text-xs text-gray-400 mt-2">
                  💡 Laissez vide pour utiliser "ATLAS" par défaut
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleChangeCompanyName}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg"
                >
                  {loading ? '⏳ Sauvegarde...' : '✅ Sauvegarder'}
                </button>
                
                {company_name && (
                  <button
                    onClick={async () => {
                      setNewCompanyName('')
                      if (!user) return
                      setLoading(true)
                      try {
                        const { error } = await supabase
                          .from('profiles')
                          .update({ company_name: null })
                          .eq('id', user.id)
                        if (!error) {
                          alert('Nom réinitialisé à "ATLAS"')
                          await refreshUserData()
                        }
                      } catch (error: any) {
                        alert('Erreur : ' + error.message)
                      } finally {
                        setLoading(false)
                      }
                    }}
                    disabled={loading}
                    className="px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-all disabled:opacity-50"
                  >
                    🔄 Réinitialiser
                  </button>
                )}
              </div>

              {company_name && (
                <div className="bg-green-900/20 border-2 border-green-500/30 rounded-lg p-4">
                  <p className="text-sm text-green-300">
                    ✅ <strong>Nom actuel :</strong> "{company_name}"
                  </p>
                  <p className="text-xs text-green-400 mt-1">
                    Ce nom apparaîtra dans tous vos documents générés à la place de "ATLAS"
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-yellow-900/20 border-2 border-yellow-700/30 rounded-lg p-4">
              <p className="text-sm text-yellow-300">
                🔒 <strong>Fonctionnalité Enterprise</strong>
              </p>
              <p className="text-xs text-yellow-400 mt-1">
                Passez au plan Enterprise pour personnaliser le branding de vos documents
              </p>
              <Link
                href="/pricing"
                className="inline-block mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all text-sm font-semibold"
              >
                Voir les plans →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

