import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia'
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    console.error('❌ Pas de signature')
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('❌ Signature invalide:', err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  console.log('✅ Webhook reçu:', event.type, event.id)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode === 'subscription') {
          const customerId = session.customer as string
          const subscriptionId = session.subscription as string

          console.log('💳 Checkout complété:', { customerId, subscriptionId })

          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const priceId = subscription.items.data[0].price.id

          const planMapping: Record<string, string> = {
            [process.env.STRIPE_PRICE_STARTER!]: 'starter',
            [process.env.STRIPE_PRICE_PRO!]: 'pro',
            [process.env.STRIPE_PRICE_ENTERPRISE!]: 'enterprise'
          }

          const plan = planMapping[priceId] || 'free'
          console.log('📊 Plan détecté:', plan)

          // Chercher profile par stripe_customer_id
          let { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('id, email')
            .eq('stripe_customer_id', customerId)
            .single()

          // Si pas trouvé, chercher par client_reference_id
          if (!profile && session.client_reference_id) {
            console.log('🔍 Recherche par user_id')
            const { data: profileById } = await supabaseAdmin
              .from('profiles')
              .select('id, email')
              .eq('id', session.client_reference_id)
              .single()
            profile = profileById
          }

          // Si toujours pas trouvé, chercher par email
          if (!profile) {
            const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
            console.log('🔍 Recherche par email:', customer.email)
            const { data: profileByEmail } = await supabaseAdmin
              .from('profiles')
              .select('id, email')
              .eq('email', customer.email)
              .single()
            profile = profileByEmail
          }

          if (!profile) {
            console.error('❌ Profile non trouvé')
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
          }

          console.log('✅ Profile trouvé:', profile.email)

          // Mettre à jour le profile
          const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({
              subscription_tier: plan,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              updated_at: new Date().toISOString()
            })
            .eq('id', profile.id)

          if (updateError) {
            console.error('❌ Erreur update:', updateError)
          } else {
            console.log('✅✅✅ PROFILE MIS À JOUR:', plan, '✅✅✅')
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        const priceId = subscription.items.data[0].price.id

        const planMapping: Record<string, string> = {
          [process.env.STRIPE_PRICE_STARTER!]: 'starter',
          [process.env.STRIPE_PRICE_PRO!]: 'pro',
          [process.env.STRIPE_PRICE_ENTERPRISE!]: 'enterprise'
        }

        const plan = planMapping[priceId] || 'free'
        console.log('🔄 Subscription updated:', plan)

        await supabaseAdmin
          .from('profiles')
          .update({ subscription_tier: plan })
          .eq('stripe_customer_id', customerId)

        console.log('✅ Profile updated')
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        console.log('❌ Subscription deleted')

        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_tier: 'free',
            stripe_subscription_id: null
          })
          .eq('stripe_customer_id', customerId)

        console.log('✅ Rétrogradé vers free')
        break
      }
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error('❌ Erreur webhook:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

