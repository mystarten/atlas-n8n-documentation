import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

const SUPABASE_URL = 'https://ibikrttopnusseutvzvb.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliaWtydHRvcG51c3NldXR2enZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ2OTgxMCwiZXhwIjoyMDc2MDQ1ODEwfQ.TVGXCgUUfXhXF5Utsqlyq2JBATeaquqWpyZ7TNMTT9I'

export async function POST(request: Request) {
  try {
    const { targetPlan, userId } = await request.json()
    
    if (!userId || !targetPlan) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    console.log('🔄 Upgrade immédiat demandé:')
    console.log('  User ID:', userId)
    console.log('  Plan cible:', targetPlan)
    
    // Récupérer les infos utilisateur via REST API
    const userResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/user_usage?user_id=eq.${userId}`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        }
      }
    )
    
    const userData = await userResponse.json()
    if (!userData || userData.length === 0) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }
    
    const userInfo = userData[0]
    const currentPlan = userInfo.subscription_tier || 'free'
    
    // Prix des plans
    const planPrices: { [key: string]: number } = {
      free: 0,
      starter: 9,
      pro: 19,
      enterprise: 49
    }
    
    const currentPrice = planPrices[currentPlan.toLowerCase()] || 0
    const targetPrice = planPrices[targetPlan.toLowerCase()] || 0
    const amountToPay = Math.max(0, targetPrice - currentPrice)
    
    console.log('💰 Calcul:')
    console.log('  Plan actuel:', currentPlan, '-', currentPrice, '€')
    console.log('  Plan cible:', targetPlan, '-', targetPrice, '€')
    console.log('  Différence:', amountToPay, '€')
    
    if (amountToPay === 0) {
      return NextResponse.json({ error: 'Aucun upgrade nécessaire' }, { status: 400 })
    }
    
    // Price IDs Stripe
    const stripePriceIds: { [key: string]: string } = {
      starter: process.env.STRIPE_PRICE_STARTER!,
      pro: process.env.STRIPE_PRICE_PRO!,
      enterprise: process.env.STRIPE_PRICE_ENTERPRISE!
    }
    
    const newPriceId = stripePriceIds[targetPlan.toLowerCase()]
    
    if (!newPriceId) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 })
    }
    
    // 1. Créer une invoice pour la différence
    console.log('📝 Création invoice pour', userInfo.stripe_customer_id)
    const invoiceItem = await stripe.invoiceItems.create({
      customer: userInfo.stripe_customer_id,
      amount: Math.round(amountToPay * 100), // En centimes
      currency: 'eur',
      description: `Upgrade immédiat vers ${targetPlan} (différence de prix)`,
    })
    
    console.log('✅ Invoice item créé:', invoiceItem.id)
    
    // 2. Créer et facturer l'invoice
    console.log('💳 Création et facturation de l\'invoice')
    const invoice = await stripe.invoices.create({
      customer: userInfo.stripe_customer_id,
      auto_advance: true, // Finaliser automatiquement
    })
    
    const paidInvoice = await stripe.invoices.pay(invoice.id)
    
    console.log('💰 Statut paiement:', paidInvoice.status)
    
    if (paidInvoice.status !== 'paid') {
      throw new Error('Échec du paiement')
    }
    
    // 3. Mettre à jour l'abonnement Stripe
    if (userInfo.stripe_subscription_id) {
      console.log('🔄 Mise à jour abonnement Stripe:', userInfo.stripe_subscription_id)
      
      const subscription = await stripe.subscriptions.retrieve(
        userInfo.stripe_subscription_id
      )
      
      await stripe.subscriptions.update(
        subscription.id,
        {
          items: [{
            id: subscription.items.data[0].id,
            price: newPriceId,
          }],
          proration_behavior: 'none', // Pas de prorata
          billing_cycle_anchor: 'unchanged', // Garde le cycle actuel
        }
      )
      
      console.log('✅ Abonnement Stripe mis à jour')
    }
    
    // 4. Mettre à jour Supabase immédiatement
    console.log('💾 Mise à jour Supabase')
    const updateResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/user_usage?user_id=eq.${userId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify({
          subscription_tier: targetPlan.toLowerCase(),
          templates_generated: 0, // Reset du compteur
        })
      }
    )
    
    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      console.error('❌ Erreur mise à jour Supabase:', errorText)
      throw new Error('Erreur lors de la mise à jour de la base de données')
    }
    
    console.log('✅ Supabase mis à jour')
    
    return NextResponse.json({
      success: true,
      amountPaid: amountToPay,
      newPlan: targetPlan,
      invoiceId: paidInvoice.id
    })
  } catch (error: any) {
    console.error('❌ Erreur upgrade:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}



