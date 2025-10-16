import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

const SUPABASE_URL = 'https://ibikrttopnusseutvzvb.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliaWtydHRvcG51c3NldXR2enZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ2OTgxMCwiZXhwIjoyMDc2MDQ1ODEwfQ.TVGXCgUUfXhXF5Utsqlyq2JBATeaquqWpyZ7TNMTT9I'

console.log('🔍 Using Supabase URL:', SUPABASE_URL)
console.log('🔍 Using Service Key (first 50):', SUPABASE_SERVICE_KEY.substring(0, 50))

export async function POST(request: Request) {
  try {
    // Vérifier les variables d'environnement au début
    console.log('🔍 Variables d\'environnement Stripe:')
    console.log('STRIPE_PRICE_STARTER:', process.env.STRIPE_PRICE_STARTER)
    console.log('STRIPE_PRICE_PRO:', process.env.STRIPE_PRICE_PRO)
    console.log('STRIPE_PRICE_ENTERPRISE:', process.env.STRIPE_PRICE_ENTERPRISE)
    console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'DÉFINI' : 'NON DÉFINI')
    console.log('STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? 'DÉFINI' : 'NON DÉFINI')

    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err: any) {
      console.error('❌ Webhook signature failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log('✅ Event:', event.type)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId

      console.log('🔍 Metadata:', session.metadata)
      console.log('🔍 User ID:', userId)

      if (!userId) {
        return NextResponse.json({ error: 'No userId' }, { status: 400 })
      }

      if (!session.subscription) {
        return NextResponse.json({ error: 'No subscription' }, { status: 400 })
      }

      try {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )

        const priceId = subscription.items.data[0].price.id
        console.log('💳 Price ID reçu:', priceId)
        console.log('🔍 STRIPE_PRICE_STARTER:', process.env.STRIPE_PRICE_STARTER)
        console.log('🔍 STRIPE_PRICE_PRO:', process.env.STRIPE_PRICE_PRO)
        console.log('🔍 STRIPE_PRICE_ENTERPRISE:', process.env.STRIPE_PRICE_ENTERPRISE)

        let tier = 'free'
        if (priceId === process.env.STRIPE_PRICE_STARTER) {
          tier = 'starter'
          console.log('✅ Match Starter')
        }
        if (priceId === process.env.STRIPE_PRICE_PRO) {
          tier = 'pro'
          console.log('✅ Match Pro')
        }
        if (priceId === process.env.STRIPE_PRICE_ENTERPRISE) {
          tier = 'enterprise'
          console.log('✅ Match Enterprise')
        }

        console.log('📊 Tier final:', tier)
        console.log('🔄 Updating user via REST API:', userId)

        // UTILISER L'API REST SUPABASE DIRECTEMENT
        const updateResponse = await fetch(
          `${SUPABASE_URL}/rest/v1/user_usage?user_id=eq.${userId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              subscription_tier: tier,
              stripe_customer_id: session.customer,
              stripe_subscription_id: subscription.id,
            })
          }
        )

        if (!updateResponse.ok) {
          const errorText = await updateResponse.text()
          console.error('❌ Supabase REST API error:', errorText)
          return NextResponse.json({ error: errorText }, { status: 500 })
        }

        const data = await updateResponse.json()
        console.log('✅ SUCCESS! Data:', data)
        return NextResponse.json({ success: true, tier, data })

      } catch (err: any) {
        console.error('❌ Error:', err.message)
        return NextResponse.json({ error: err.message }, { status: 500 })
      }
    }

    // Gérer les annulations (l'abonnement reste actif jusqu'à la fin)
    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription

      console.log('Subscription updated:', subscription.id)
      console.log('Cancel at period end:', subscription.cancel_at_period_end)

      try {
        // Si l'abonnement est annulé mais encore actif
        if (subscription.cancel_at_period_end) {
          const endDate = new Date((subscription as any).current_period_end * 1000)

          const updateResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/user_usage?stripe_subscription_id=eq.${subscription.id}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
              },
              body: JSON.stringify({
                subscription_status: 'canceled',
                subscription_end_date: endDate.toISOString(),
              })
            }
          )

          if (!updateResponse.ok) {
            console.error('Error updating subscription status')
          } else {
            console.log('Subscription marked as canceled, active until:', endDate)
          }
        } else {
          // L'abonnement est réactivé
          const updateResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/user_usage?stripe_subscription_id=eq.${subscription.id}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
              },
              body: JSON.stringify({
                subscription_status: 'active',
                subscription_end_date: null,
              })
            }
          )

          if (updateResponse.ok) {
            console.log('Subscription reactivated')
          }
        }

        return NextResponse.json({ success: true })

      } catch (err: any) {
        console.error('Error:', err.message)
        return NextResponse.json({ error: err.message }, { status: 500 })
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription
      
      try {
        const updateResponse = await fetch(
          `${SUPABASE_URL}/rest/v1/user_usage?stripe_subscription_id=eq.${subscription.id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            },
            body: JSON.stringify({
              subscription_tier: 'free',
              stripe_subscription_id: null,
            })
          }
        )

        if (!updateResponse.ok) {
          const errorText = await updateResponse.text()
          console.error('❌ Error:', errorText)
          return NextResponse.json({ error: errorText }, { status: 500 })
        }

        console.log('✅ Subscription deleted')
        return NextResponse.json({ success: true })

      } catch (err: any) {
        console.error('❌ Error:', err.message)
        return NextResponse.json({ error: err.message }, { status: 500 })
      }
    }

    return NextResponse.json({ received: true })

  } catch (err: any) {
    console.error('❌ Webhook error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}