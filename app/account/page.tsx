'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
// import SubscriptionStatus from '@/components/SubscriptionStatus'  // Supprimé - Infos disponibles sur Stripe
// import SubscriptionModal from '@/components/SubscriptionModal'  // Désactivé - Tout se fait sur Stripe

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [tier, setTier] = useState('free')
  const [templatesGenerated, setTemplatesGenerated] = useState(0)
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState('active')
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingPortal, setIsLoadingPortal] = useState(false)
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    loadUserData()
  }, [])

  // Vérifier si l'abonnement est expiré
  useEffect(() => {
    if (subscriptionEndDate && new Date() > subscriptionEndDate) {
      const resetToFree = async () => {
        const { error } = await supabase
          .from('profiles')
          .update({ subscription_tier: 'free', subscription_status: 'expired' })
          .eq('id', user.id)

        if (!error) {
          setTier('free')
          setSubscriptionStatus('expired')
        }
      }
      resetToFree()
    }
  }, [subscriptionEndDate, user?.id])

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      window.location.href = '/'
      return
    }

    setUser(user)

    // ✅ Utiliser l'API stats au lieu de lire user_usage
    try {
      const res = await fetch('/api/user/stats')
      const statsData = await res.json()
      
      console.log('📊 Account - Stats récupérées:', statsData)
      
      setTier(statsData.tier || 'free')
      setTemplatesGenerated(statsData.used || 0)
      
      // Récupérer stripe_customer_id depuis profiles
      const { data: profileData } = await supabase
        .from('profiles')
        .select('stripe_customer_id, subscription_status, subscription_end_date')
        .eq('id', user.id)
        .single()
      
      if (profileData) {
        setStripeCustomerId(profileData.stripe_customer_id)
        setSubscriptionStatus(profileData.subscription_status || 'active')
        if (profileData.subscription_end_date) {
          setSubscriptionEndDate(new Date(profileData.subscription_end_date))
        }
      }
    } catch (error) {
      console.error('❌ Erreur chargement données:', error)
    }

    // Charger les infos Stripe pour cancelAtPeriodEnd
    try {
      const subStatusRes = await fetch('/api/subscription/status')
      const subStatus = await subStatusRes.json()
      if (subStatus.cancel_at_period_end) {
        setCancelAtPeriodEnd(true)
      }
    } catch (error) {
      console.error('Erreur chargement status Stripe:', error)
    }

    setIsLoading(false)
  }

  const getLimitByTier = (tier: string) => {
    switch (tier) {
      case 'starter': return 20
      case 'pro': return 40
      case 'enterprise': return 60
      default: return 3
    }
  }

  const getTierName = (tier: string) => {
    switch (tier) {
      case 'starter': return 'Starter'
      case 'pro': return 'Pro'
      case 'enterprise': return 'Enterprise'
      default: return 'Gratuit'
    }
  }

  const limit = getLimitByTier(tier)
  const isUnlimited = limit === null
  const percentage = isUnlimited ? 0 : Math.min(Math.round((templatesGenerated / limit) * 100), 100)

  const handleManageSubscription = async () => {
    setIsLoadingPortal(true)
    try {
      console.log('🔄 Redirection vers portail Stripe...')
      
      const response = await fetch('/api/customer-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      })

      const data = await response.json()

      if (data.url) {
        console.log('✅ Redirection vers:', data.url)
        window.location.href = data.url
      } else if (data.error) {
        alert(`❌ Erreur : ${data.error}`)
      } else if (data.message) {
        alert(data.message)
      } else {
        alert('❌ Impossible de créer la session Stripe')
      }
    } catch (error: any) {
      console.error('❌ Erreur:', error)
      alert(`❌ Erreur de connexion au portail Stripe : ${error.message}`)
    } finally {
      setIsLoadingPortal(false)
    }
  }


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* NAVBAR supprimée - Utilise le Header global du layout.tsx */}

      {/* BANNER ABONNEMENT ANNULÉ */}
      {subscriptionStatus === 'canceled' && subscriptionEndDate && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-orange-500/20 border-b border-orange-500/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-orange-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-orange-100 font-medium">
                  Votre abonnement a été annulé
                </p>
                <p className="text-orange-200 text-sm">
                  Accès jusqu'au {subscriptionEndDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <button
                onClick={handleManageSubscription}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                Réactiver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="pt-24 pb-12 relative">
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-black mb-4 text-white">
              Mon Compte
            </h1>
            <p className="text-gray-400 text-lg">
              Gérez votre abonnement et suivez votre utilisation
            </p>
          </div>
        </div>
      </section>

      {/* DASHBOARD */}
      <section className="pb-20 relative">
        <div className="max-w-6xl mx-auto px-6 space-y-6">
          
          {/* CARD ABONNEMENT PRINCIPALE */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-slate-600 transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-3">Votre Abonnement</h2>
                <div className="inline-flex items-center px-5 py-2.5 rounded-full text-lg font-bold bg-blue-600 text-white">
                  {getTierName(tier)}
                </div>
              </div>
              
              {tier !== 'free' && (
                <button
                  onClick={handleManageSubscription}
                  disabled={isLoadingPortal}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingPortal ? '⏳ Chargement...' : 'Gérer mon abonnement'}
                </button>
              )}
            </div>

            {/* PROGRESSION */}
            <div className="space-y-5 mb-8">
              <div className="flex justify-between items-baseline">
                <span className="text-gray-300 text-lg">Documents générés ce mois</span>
                <span className="text-4xl font-bold text-blue-400">
                  {templatesGenerated} <span className="text-2xl text-blue-400 font-semibold">/ {limit}</span>
                </span>
              </div>

              {!isUnlimited && (
                <>
                  <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-700 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400">
                    {percentage}% utilisé · <span className="text-white font-semibold">{limit - templatesGenerated} documents restants</span>
                  </p>
                </>
              )}

              {isUnlimited && (
                <div className="bg-blue-900/30 rounded-xl p-5 border border-blue-700/30">
                  <p className="text-blue-200 font-semibold flex items-center gap-2 text-lg">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Générations illimitées
                  </p>
                </div>
              )}
            </div>

            {/* STATISTIQUES DE VALEUR */}
            {tier !== 'free' && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/50">
                  <p className="text-sm text-gray-400 mb-1">Gain de temps</p>
                  <p className="text-3xl font-bold text-white">{templatesGenerated * 2}h</p>
                  <p className="text-xs text-gray-500 mt-1">estimé ce mois</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/50">
                  <p className="text-sm text-gray-400 mb-1">Documents créés</p>
                  <p className="text-3xl font-bold text-white">{templatesGenerated}</p>
                  <p className="text-xs text-gray-500 mt-1">ce mois-ci</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/50">
                  <p className="text-sm text-gray-400 mb-1">Économies</p>
                  <p className="text-3xl font-bold text-white">{templatesGenerated * 50}€</p>
                  <p className="text-xs text-gray-500 mt-1">vs freelance</p>
                </div>
              </div>
            )}

            {/* CTA SELON LE PLAN */}
            {tier === 'free' ? (
              <div className="bg-blue-900/50 rounded-xl p-6 border border-blue-700/50">
                <h3 className="font-bold text-xl mb-2 text-white">Passez à un plan premium</h3>
                <p className="text-gray-300 mb-4">Débloquez plus de documentations et gagnez du temps</p>
                <Link
                  href="/pricing"
                  className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold"
                >
                  Voir les offres
                </Link>
              </div>
            ) : (
              <Link
                href="/pricing"
                className="block w-full text-center px-6 py-3 border-2 border-slate-600 text-gray-300 rounded-xl hover:bg-slate-700/50 hover:border-slate-500 transition-all font-semibold"
              >
                Changer de plan
              </Link>
            )}
          </div>

          {/* GRILLE INFOS SECONDAIRES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* PROFIL */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all">
              <h3 className="text-xl font-bold text-white mb-5">
                Informations du compte
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-gray-200 font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Membre depuis</p>
                  <p className="text-gray-200 font-medium">
                    {new Date(user?.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* SUPPORT */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all">
              <h3 className="text-xl font-bold text-white mb-5">
                Besoin d'aide ?
              </h3>
              <p className="text-gray-400 text-sm mb-5">
                Notre équipe est là pour vous accompagner dans votre utilisation d'Atlas.
              </p>
              <a 
                href="mailto:contact@atlasbuilder.app"
                className="block w-full px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-center"
              >
                Contacter le support
              </a>
              <p className="text-center text-gray-500 text-sm mt-3">
                <a href="mailto:contact@atlasbuilder.app" className="text-blue-400 hover:text-blue-300 transition-colors">
                  contact@atlasbuilder.app
                </a>
              </p>
            </div>
          </div>

          {/* INFO : Redirection vers Stripe */}
          {tier !== 'free' && (
            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <p className="text-blue-300 text-sm">
                ℹ️ Pour modifier votre abonnement, changer de plan ou annuler, utilisez le bouton "Gérer mon abonnement" ci-dessus. Vous serez redirigé vers le portail sécurisé de Stripe.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Modal de gestion d'abonnement - Désactivée car tout se fait sur Stripe maintenant */}
      {/* <SubscriptionModal
        isOpen={false}
        onClose={() => {}}
        currentPlan={tier}
        cancelAtPeriodEnd={cancelAtPeriodEnd}
      /> */}
    </div>
  )
}
