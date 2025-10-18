import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Récupérer le stripe_customer_id depuis profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()
    
    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: 'Aucun client Stripe trouvé' }, { status: 404 })
    }
    
    console.log('🔗 Création session Stripe Portal pour:', profile.stripe_customer_id)
    
    // Créer la session Stripe Portal
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account`,
    })
    
    console.log('✅ Session Portal créée:', session.id)
    
    return NextResponse.json({ 
      url: session.url 
    })
  } catch (error: any) {
    console.error('❌ Erreur création session Portal:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
