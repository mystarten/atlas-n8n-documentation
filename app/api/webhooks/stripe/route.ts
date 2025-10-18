import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

// ✅ Utiliser service_role pour bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ibikrttopnusseutvzvb.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliaWtydHRvcG51c3NldXR2enZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ2OTgxMCwiZXhwIjoyMDc2MDQ1ODEwfQ.TVGXCgUUfXhXF5Utsqlyq2JBATeaquqWpyZ7TNMTT9I'
)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const headersList = headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('❌ Pas de signature Stripe')
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    // Vérifier la signature Stripe
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('❌ Signature invalide:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log('✅ Webhook reçu:', event.type, event.id)

    // Gérer les événements
    switch (event.type) {
      // ✅ ÉVÉNEMENT CRUCIAL : Premier paiement complété
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        console.log('💰 Paiement réussi')
        break

      case 'invoice.payment_failed':
        console.log('❌ Paiement échoué')
        break

      default:
        console.log(`Événement non géré: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('❌ Erreur webhook:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ✅ NOUVEAU : Gérer le checkout complété (premier paiement)
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('🎉 Checkout complété:', session.id)

    if (session.mode !== 'subscription') {
      console.log('⚠️ Pas un abonnement, ignoré')
      return
    }

    const customerId = session.customer as string
    const subscriptionId = session.subscription as string

    if (!subscriptionId) {
      console.error('❌ Pas de subscription ID dans le checkout')
      return
    }

    // Récupérer l'abonnement pour avoir le price_id
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const priceId = subscription.items.data[0]?.price.id

    console.log('💳 Checkout complété:', {
      customerId,
      subscriptionId,
      priceId
    })

    // Mapper les price_id vers les tiers
    const priceTierMap: Record<string, string> = {
      [process.env.STRIPE_PRICE_STARTER!]: 'starter',
      [process.env.STRIPE_PRICE_PRO!]: 'pro',
      [process.env.STRIPE_PRICE_ENTERPRISE!]: 'enterprise'
    }

    const plan = priceTierMap[priceId] || 'free'

    console.log('📊 Plan détecté:', plan, 'pour price:', priceId)
    console.log('🔍 Session info:', {
      customerId,
      subscriptionId,
      client_reference_id: session.client_reference_id
    })

    // ✅ CHERCHER LE PROFILE PAR stripe_customer_id
    let { data: profile } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('stripe_customer_id', customerId)
      .single()

    // ✅ SI PAS TROUVÉ, chercher par client_reference_id (user_id)
    if (!profile && session.client_reference_id) {
      console.log('🔍 Recherche par client_reference_id:', session.client_reference_id)
      
      const { data: profileById } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('id', session.client_reference_id)
        .single()

      profile = profileById
    }

    // ✅ SI TOUJOURS PAS TROUVÉ, chercher par email
    if (!profile) {
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
      console.log('🔍 Recherche par email:', customer.email)

      const { data: profileByEmail } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', customer.email)
        .single()

      profile = profileByEmail
    }

    if (!profile) {
      console.error('❌ Profile non trouvé pour customer:', customerId)
      return
    }

    console.log('✅ Profile trouvé:', profile.id, profile.email)

    // ✅ METTRE À JOUR LE PROFILE ET RESET LE COMPTEUR
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_tier: plan,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        templates_limit: plan === 'free' ? 3 : plan === 'starter' ? 20 : plan === 'pro' ? 40 : 999999,
        templates_used: 0, // Reset du compteur après upgrade
        updated_at: new Date().toISOString()
      })
      .eq('id', profile.id)

    if (error) {
      console.error('❌ Erreur update:', error)
    } else {
      console.log('✅ Profile mis à jour:', plan)
    }
  } catch (error) {
    console.error('❌ Erreur handleCheckoutCompleted:', error)
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string
    const priceId = subscription.items.data[0]?.price.id

    const planMapping: Record<string, string> = {
      [process.env.STRIPE_PRICE_STARTER!]: 'starter',
      [process.env.STRIPE_PRICE_PRO!]: 'pro',
      [process.env.STRIPE_PRICE_ENTERPRISE!]: 'enterprise'
    }

    const plan = planMapping[priceId] || 'free'

    console.log('🔄 Subscription updated:', { customerId, plan })

    const { error } = await supabase
      .from('profiles')
      .update({ 
        subscription_tier: plan,
        templates_limit: plan === 'free' ? 3 : plan === 'starter' ? 20 : plan === 'pro' ? 40 : 999999
      })
      .eq('stripe_customer_id', customerId)

    if (error) {
      console.error('❌ Erreur:', error)
    } else {
      console.log('✅ Profile updated')
    }
  } catch (error) {
    console.error('❌ Erreur handleSubscriptionUpdate:', error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string

    console.log('❌ Subscription deleted:', customerId)

    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_tier: 'free',
        stripe_subscription_id: null,
        templates_limit: 3,
        templates_used: 0 // Reset du compteur
      })
      .eq('stripe_customer_id', customerId)

    if (error) {
      console.error('❌ Erreur:', error)
    } else {
      console.log('✅ Rétrogradé vers free')
    }
  } catch (error) {
    console.error('❌ Erreur handleSubscriptionDeleted:', error)
  }
}


