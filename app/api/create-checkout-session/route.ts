import { NextResponse } from 'next/server'
import { stripe, PRICE_IDS } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

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

export async function POST(request: Request) {
  try {
    const { priceId, userId } = await request.json()
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }
    
    console.log('🛒 Création checkout:', {
      user_id: user.id,
      email: user.email,
      priceId: priceId
    })
    
    if (!priceId || !userId) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    // Déterminer le plan basé sur le priceId
    const planMapping: Record<string, string> = {
      [process.env.STRIPE_PRICE_STARTER!]: 'starter',
      [process.env.STRIPE_PRICE_PRO!]: 'pro',
      [process.env.STRIPE_PRICE_ENTERPRISE!]: 'enterprise'
    }
    
    const plan = planMapping[priceId] || 'unknown'

    // ✅ ÉTAPE 1 : Récupérer le profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id, stripe_subscription_id')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    // ✅ ÉTAPE 2 : Si pas de customer ID, chercher sur Stripe par email
    if (!customerId) {
      const existingCustomers = await stripe.customers.list({
        email: user.email!,
        limit: 1
      })

      if (existingCustomers.data.length > 0) {
        customerId = existingCustomers.data[0].id
        console.log('✅ Customer existant trouvé:', customerId)
      }
    }

    // ✅ ÉTAPE 3 : Si toujours pas de customer, en créer un
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: {
          supabase_user_id: user.id
        }
      })
      customerId = customer.id
      console.log('✅ Nouveau customer créé:', customerId)
    }

    // ✅ ÉTAPE 4 : Mettre à jour le profile avec le customer_id MAINTENANT
    await supabaseAdmin
      .from('profiles')
      .update({ 
        stripe_customer_id: customerId,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    console.log('✅ Profile mis à jour avec customer_id:', customerId)

    // ✅ ÉTAPE 5 : VÉRIFIER SI UN ABONNEMENT EXISTE DÉJÀ
    if (profile?.stripe_subscription_id) {
      console.log('⚠️ Abonnement existant détecté:', profile.stripe_subscription_id)
      
      try {
        const subscription = await stripe.subscriptions.retrieve(profile.stripe_subscription_id)
        
        if (subscription.status === 'active' || subscription.status === 'trialing') {
          console.log('🔄 Modification de l\'abonnement existant au lieu d\'en créer un nouveau')
          
          // Modifier l'abonnement existant
          const updated = await stripe.subscriptions.update(subscription.id, {
            items: [{
              id: subscription.items.data[0].id,
              price: priceId
            }],
            proration_behavior: 'create_prorations',
            billing_cycle_anchor: 'unchanged'
          })

          console.log('✅ Abonnement modifié avec succès:', updated.id)
          
          // Mettre à jour le tier dans Supabase immédiatement
          const planMapping: Record<string, string> = {
            [process.env.STRIPE_PRICE_STARTER!]: 'starter',
            [process.env.STRIPE_PRICE_PRO!]: 'pro',
            [process.env.STRIPE_PRICE_ENTERPRISE!]: 'enterprise'
          }
          
          const newPlan = planMapping[priceId] || 'free'
          
          await supabaseAdmin
            .from('profiles')
            .update({ 
              subscription_tier: newPlan,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id)
          
          console.log('✅ Profile mis à jour avec nouveau plan:', newPlan)
          
          return NextResponse.json({
            url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/account?upgraded=true`
          })
        }
      } catch (error) {
        console.log('⚠️ Abonnement introuvable ou inactif, création d\'un nouveau')
      }
    }

    // ✅ ÉTAPE 6 : Créer un nouveau checkout seulement si pas d'abonnement actif
    const session = await stripe.checkout.sessions.create({
      customer: customerId,  // ✅ IMPORTANT : Utiliser le customer existant
      client_reference_id: user.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/pricing`,
      // ✅ Métadonnées pour la session
      metadata: {
        user_id: user.id,
        user_email: user.email!,
        plan,
      },
      // ✅ Métadonnées pour l'abonnement (important!)
      subscription_data: {
        metadata: {
          user_id: user.id,
          user_email: user.email!,
          plan,
        },
      },
    })

    console.log('✅ Session Stripe créée:', session.id)
    console.log('🔗 URL de checkout:', session.url)

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Erreur création session Stripe:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

