import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia'
})

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

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ 
        error: 'Aucun abonnement Stripe trouvé',
        message: 'Vous n\'avez pas encore souscrit à un abonnement payant.'
      }, { status: 404 })
    }

    console.log('🔄 Création session portail Stripe pour customer:', profile.stripe_customer_id)

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/account`
    })

    console.log('✅ Session portail créée:', session.url)

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('❌ Erreur création portail:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

