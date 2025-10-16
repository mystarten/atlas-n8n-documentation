import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

// ✅ Client admin pour bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ibikrttopnusseutvzvb.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliaWtydHRvcG51c3NldXR2enZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ2OTgxMCwiZXhwIjoyMDc2MDQ1ODEwfQ.TVGXCgUUfXhXF5Utsqlyq2JBATeaquqWpyZ7TNMTT9I',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()
    console.log('🔄 Creating portal for user:', userId)

    // ✅ Récupérer customer ID depuis profiles (pas user_usage)
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single()

    if (error || !data?.stripe_customer_id) {
      console.error('❌ No customer found for user:', userId)
      return NextResponse.json({ 
        error: 'Aucun abonnement Stripe trouvé',
        message: 'Vous n\'avez pas encore souscrit à un abonnement payant.'
      }, { status: 404 })
    }

    console.log('✅ Customer found:', data.stripe_customer_id)

    // Créer session portal
    const session = await stripe.billingPortal.sessions.create({
      customer: data.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/account`,
    })

    console.log('✅ Portal URL:', session.url)
    return NextResponse.json({ url: session.url })

  } catch (error: any) {
    console.error('❌ Portal error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}