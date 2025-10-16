import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover'
})

// ✅ Client admin pour bypass RLS
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // ✅ Récupérer le profil avec admin (bypass RLS)
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile non trouvé' }, { status: 404 })
    }

  // Chercher customer Stripe
  let customerId = profile.stripe_customer_id

  if (!customerId) {
    const customers = await stripe.customers.list({ email: user.email!, limit: 1 })
    if (customers.data.length === 0) {
      return NextResponse.json({ 
        error: 'Aucun abonnement Stripe trouvé',
        message: 'Vous n\'avez pas encore souscrit à un abonnement payant.'
      })
    }
    customerId = customers.data[0].id
  }

  // Chercher subscription active
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1
  })

  if (subscriptions.data.length === 0) {
    return NextResponse.json({ 
      message: 'Aucun abonnement actif',
      current_plan: profile.subscription_tier
    })
  }

  const subscription = subscriptions.data[0]
  const priceId = subscription.items.data[0].price.id

  const planMapping: Record<string, string> = {
    [process.env.STRIPE_PRICE_STARTER!]: 'starter',
    [process.env.STRIPE_PRICE_PRO!]: 'pro',
    [process.env.STRIPE_PRICE_ENTERPRISE!]: 'enterprise'
  }

  const correctPlan = planMapping[priceId] || 'free'

  // ✅ Mettre à jour avec admin (bypass RLS)
  const { error } = await supabaseAdmin
    .from('profiles')
    .update({
      subscription_tier: correctPlan,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)

    if (error) {
      console.error('❌ Erreur update:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: '✅ Abonnement synchronisé avec succès !',
      before: profile.subscription_tier,
      after: correctPlan
    })

  } catch (error: any) {
    console.error('❌ Erreur sync:', error)
    return NextResponse.json({ 
      error: error.message || 'Erreur lors de la synchronisation' 
    }, { status: 500 })
  }
}

