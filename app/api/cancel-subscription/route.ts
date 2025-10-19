import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

const SUPABASE_URL = 'https://ibikrttopnusseutvzvb.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliaWtydHRvcG51c3NldXR2enZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ2OTgxMCwiZXhwIjoyMDc2MDQ1ODEwfQ.TVGXCgUUfXhXF5Utsqlyq2JBATeaquqWpyZ7TNMTT9I'

export async function POST(request: Request) {
  try {
    const { customerId } = await request.json()

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 })
    }

    console.log('🔄 Cancelling subscription for customer:', customerId)

    // Récupérer l'abonnement actif du client
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1
    })

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
    }

    const subscription = subscriptions.data[0]
    console.log('🔍 Found subscription:', subscription.id)

    // Annuler l'abonnement Stripe
    const cancelledSubscription = await stripe.subscriptions.cancel(subscription.id)
    console.log('✅ Stripe subscription cancelled:', cancelledSubscription.id)

    // Mettre à jour Supabase
    const updateResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/user_usage?stripe_customer_id=eq.${customerId}`,
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
      console.error('❌ Supabase update error:', errorText)
      return NextResponse.json({ error: 'Failed to update database' }, { status: 500 })
    }

    console.log('✅ Supabase updated successfully')

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription cancelled successfully' 
    })

  } catch (error: any) {
    console.error('❌ Cancel subscription error:', error.message)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
