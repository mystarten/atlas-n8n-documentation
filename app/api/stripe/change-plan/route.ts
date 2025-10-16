import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia'
})

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { new_plan } = await request.json()

  const { data: userUsage } = await supabase
    .from('profiles')
    .select('stripe_customer_id, stripe_subscription_id, subscription_tier')
    .eq('id', user.id)
    .single()

  if (!userUsage?.stripe_subscription_id) {
    // ✅ Pas d'abonnement actif → Rediriger vers Checkout
    return createCheckoutSession(userUsage?.stripe_customer_id, new_plan)
  }

  // ✅ Déterminer si c'est un upgrade ou downgrade
  const planHierarchy: { [key: string]: number } = { free: 0, starter: 1, pro: 2, enterprise: 3 }
  const currentLevel = planHierarchy[userUsage.subscription_tier || 'free']
  const newLevel = planHierarchy[new_plan]

  const isUpgrade = newLevel > currentLevel

  if (isUpgrade) {
    // ✅ UPGRADE : Stripe Checkout avec prorata
    console.log('🚀 Upgrade détecté :', userUsage.subscription_tier, '→', new_plan)
    return createCheckoutSession(userUsage.stripe_customer_id, new_plan, true)
  } else {
    // ✅ DOWNGRADE : Schedule pour la prochaine période
    console.log('📉 Downgrade détecté :', userUsage.subscription_tier, '→', new_plan)
    return scheduleDowngrade(userUsage.stripe_subscription_id, new_plan)
  }
}

// ✅ Créer une session Checkout pour upgrade ou nouvel abonnement
async function createCheckoutSession(customerId: string | null, plan: string, isUpgrade = false) {
  const priceIds: { [key: string]: string } = {
    starter: process.env.STRIPE_PRICE_STARTER!,
    pro: process.env.STRIPE_PRICE_PRO!,
    enterprise: process.env.STRIPE_PRICE_ENTERPRISE!
  }

  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId || undefined,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceIds[plan],
          quantity: 1
        }
      ],
      subscription_data: {
        // ✅ Si upgrade, appliquer prorata immédiat
        proration_behavior: isUpgrade ? 'always_invoice' : 'create_prorations'
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account`
    })

    return NextResponse.json({ checkout_url: session.url })
  } catch (error: any) {
    console.error('Erreur Checkout:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ✅ Programmer un downgrade pour la fin de période
async function scheduleDowngrade(subscriptionId: string, newPlan: string) {
  const priceIds: { [key: string]: string } = {
    starter: process.env.STRIPE_PRICE_STARTER!,
    pro: process.env.STRIPE_PRICE_PRO!,
    enterprise: process.env.STRIPE_PRICE_ENTERPRISE!
  }

  try {
    // Récupérer l'abonnement actuel
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    // ✅ Créer un Subscription Schedule pour le changement
    const schedule = await stripe.subscriptionSchedules.create({
      from_subscription: subscriptionId
    })

    // ✅ Ajouter une phase pour le nouveau plan à partir de la prochaine période
    await stripe.subscriptionSchedules.update(schedule.id, {
      phases: [
        // Phase actuelle (jusqu'à la fin de période)
        {
          items: subscription.items.data.map(item => ({
            price: item.price.id,
            quantity: item.quantity
          })),
          start_date: subscription.current_period_start,
          end_date: subscription.current_period_end
        },
        // Nouvelle phase (nouveau plan)
        {
          items: [
            {
              price: priceIds[newPlan],
              quantity: 1
            }
          ],
          start_date: subscription.current_period_end
        }
      ]
    })

    console.log('✅ Downgrade programmé pour:', new Date(subscription.current_period_end * 1000))

    return NextResponse.json({
      success: true,
      message: 'Changement programmé pour la prochaine période',
      effective_date: new Date(subscription.current_period_end * 1000).toISOString()
    })

  } catch (error: any) {
    console.error('Erreur Schedule:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

