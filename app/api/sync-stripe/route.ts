import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

const SUPABASE_URL = 'https://ibikrttopnusseutvzvb.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliaWtydHRvcG51c3NldXR2enZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ2OTgxMCwiZXhwIjoyMDc2MDQ1ODEwfQ.TVGXCgUUfXhXF5Utsqlyq2JBATeaquqWpyZ7TNMTT9I'

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID requis' }, { status: 400 })
    }

    console.log('🔄 Synchronisation manuelle pour user:', userId)

    // Récupérer les infos Supabase
    const { data: userInfo, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError || !userInfo) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    if (!userInfo.stripe_subscription_id) {
      return NextResponse.json({ 
        success: true,
        message: 'Pas d\'abonnement Stripe actif',
        tier: 'free'
      })
    }

    // Récupérer l'abonnement depuis Stripe
    console.log('📡 Récupération abonnement Stripe:', userInfo.stripe_subscription_id)
    const subscription = await stripe.subscriptions.retrieve(
      userInfo.stripe_subscription_id
    )

    const priceId = subscription.items.data[0]?.price.id

    console.log('💳 Price ID Stripe:', priceId)
    console.log('📊 Statut Stripe:', subscription.status)

    // Mapper vers tier
    const priceTierMap: Record<string, string> = {
      [process.env.STRIPE_PRICE_STARTER!]: 'starter',
      [process.env.STRIPE_PRICE_PRO!]: 'pro',
      [process.env.STRIPE_PRICE_ENTERPRISE!]: 'enterprise'
    }

    const tier = priceTierMap[priceId] || 'free'

    console.log('📊 Tier déterminé:', tier)

    // Mettre à jour Supabase
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_tier: tier,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (updateError) {
      console.error('❌ Erreur mise à jour Supabase:', updateError)
      throw new Error('Erreur mise à jour Supabase')
    }

    console.log('✅ Supabase synchronisé avec Stripe')

    return NextResponse.json({
      success: true,
      tier,
      stripeStatus: subscription.status,
      priceId
    })
  } catch (error: any) {
    console.error('❌ Erreur sync:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


