import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia'
})

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  // Récupérer les données utilisateur avec stripe_subscription_id
  const { data: userUsage } = await supabase
    .from('profiles')
    .select('subscription_tier, stripe_subscription_id, stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (!userUsage?.stripe_subscription_id) {
    return NextResponse.json({
      subscription_tier: userUsage?.subscription_tier || 'free',
      status: 'active',
      current_period_end: null,
      current_period_start: null,
      cancel_at_period_end: false,
      scheduled_changes: null,
      payment_method: null
    })
  }

  try {
    // ✅ Récupérer l'abonnement Stripe avec les détails
    const subscription = await stripe.subscriptions.retrieve(
      userUsage.stripe_subscription_id,
      {
        expand: ['schedule', 'default_payment_method']
      }
    )

    // ✅ Récupérer le plan actuel
    const currentPlan = subscription.items.data[0]?.price?.lookup_key || userUsage?.subscription_tier || 'unknown'
    
    // ✅ Vérifier s'il y a un changement prévu via Subscription Schedule
    let scheduledChanges = null
    if (subscription.schedule) {
      try {
        const schedule = await stripe.subscriptionSchedules.retrieve(
          subscription.schedule as string
        )
        
        // Phases futures (après la phase actuelle)
        const futurePhases = schedule.phases.filter(
          phase => phase.start_date > Math.floor(Date.now() / 1000)
        )
        
        if (futurePhases.length > 0) {
          const nextPhase = futurePhases[0]
          const nextPlan = nextPhase.items[0]?.price || null
          
          if (nextPlan) {
            const nextPrice = await stripe.prices.retrieve(nextPlan as string)
            scheduledChanges = {
              type: 'change_plan',
              new_plan: nextPrice.lookup_key || 'unknown',
              effective_date: new Date(nextPhase.start_date * 1000).toISOString()
            }
          }
        }
      } catch (error) {
        console.error('Erreur récupération schedule:', error)
      }
    }

    // ✅ Vérifier si annulation prévue
    if (subscription.cancel_at_period_end) {
      scheduledChanges = {
        type: 'cancel',
        new_plan: 'free',
        effective_date: new Date(subscription.current_period_end * 1000).toISOString()
      }
    }

    // ✅ Récupérer les infos de la méthode de paiement
    let paymentMethodInfo = null
    if (subscription.default_payment_method) {
      const pm = subscription.default_payment_method as any
      paymentMethodInfo = {
        type: pm.type || 'card',
        last4: pm.card?.last4 || '****'
      }
    }

    return NextResponse.json({
      subscription_tier: currentPlan,
      status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      scheduled_changes: scheduledChanges,
      payment_method: paymentMethodInfo
    })

  } catch (error: any) {
    console.error('Erreur Stripe:', error)
    return NextResponse.json({ 
      error: error.message,
      subscription_tier: userUsage?.subscription_tier || 'free',
      status: 'unknown',
      current_period_end: null,
      current_period_start: null,
      cancel_at_period_end: false,
      scheduled_changes: null,
      payment_method: null
    }, { status: 500 })
  }
}

