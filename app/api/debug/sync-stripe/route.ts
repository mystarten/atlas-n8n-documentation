import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

const SUPABASE_URL = 'https://ibikrttopnusseutvzvb.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliaWtydHRvcG51c3NldXR2enZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ2OTgxMCwiZXhwIjoyMDc2MDQ1ODEwfQ.TVGXCgUUfXhXF5Utsqlyq2JBATeaquqWpyZ7TNMTT9I'

// ⚠️ ENDPOINT DE DEBUG - À SUPPRIMER EN PRODUCTION
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'user_id required' }, { status: 400 })
    }

    console.log('🔍 Synchronisation manuelle pour user:', userId)

    // Récupérer le profil utilisateur
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 404 })
    }

    console.log('👤 Profile trouvé:', userProfile)

    // Si pas de customer Stripe, retourner les infos
    if (!userProfile.stripe_customer_id) {
      return NextResponse.json({
        message: '⚠️ Pas de customer Stripe lié',
        profile: userProfile,
        suggestion: 'L\'utilisateur n\'a jamais fait de paiement Stripe'
      })
    }

    // Récupérer les subscriptions Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: userProfile.stripe_customer_id,
      limit: 10,
      status: 'all'
    })

    console.log('📊 Subscriptions trouvées:', subscriptions.data.length)

    if (subscriptions.data.length === 0) {
      return NextResponse.json({
        message: '⚠️ Aucun abonnement trouvé sur Stripe',
        profile: userProfile,
        stripe_customer_id: userProfile.stripe_customer_id,
        suggestion: 'L\'abonnement a peut-être été supprimé ou annulé'
      })
    }

    // Prendre l'abonnement actif ou le plus récent
    const activeSub = subscriptions.data.find(sub => sub.status === 'active') || subscriptions.data[0]
    const priceId = activeSub.items.data[0]?.price.id

    console.log('💳 Abonnement trouvé:', {
      id: activeSub.id,
      status: activeSub.status,
      priceId
    })

    // Mapper le price_id vers le tier
    const planMapping: Record<string, string> = {
      [process.env.STRIPE_PRICE_STARTER!]: 'starter',
      [process.env.STRIPE_PRICE_PRO!]: 'pro',
      [process.env.STRIPE_PRICE_ENTERPRISE!]: 'enterprise'
    }

    const correctPlan = planMapping[priceId] || 'free'

    console.log('📊 Plan déterminé:', correctPlan)

    // ✅ FORCER LA MISE À JOUR
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_tier: correctPlan,
        stripe_subscription_id: activeSub.id,
        stripe_customer_id: userProfile.stripe_customer_id,
        updated_at: new Date().toISOString()
        // NE PAS réinitialiser le compteur lors d'une sync manuelle
      })
      .eq('id', userId)

    if (updateError) {
      console.error('❌ Erreur mise à jour:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    console.log('✅ Synchronisation réussie!')

    return NextResponse.json({
      success: true,
      message: '✅ Profile synchronisé avec Stripe',
      changes: {
        before: {
          subscription_tier: profile.subscription_tier,
          stripe_subscription_id: profile.stripe_subscription_id
        },
        after: {
          subscription_tier: correctPlan,
          stripe_subscription_id: activeSub.id
        }
      },
      stripe_data: {
        customer_id: profile.stripe_customer_id,
        subscription_id: activeSub.id,
        subscription_status: activeSub.status,
        price_id: priceId,
        current_period_end: new Date(activeSub.current_period_end * 1000).toISOString()
      }
    })

  } catch (error: any) {
    console.error('❌ Erreur sync:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

