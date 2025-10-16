import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { targetPlan } = await request.json()
    const supabase = createClient()
    
    // Récupérer l'utilisateur
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }
    
    // Récupérer le plan actuel
    const { data: userData } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()
    
    const currentPlan = userData?.subscription_tier || 'free'
    
    // Prix des plans
    const planPrices: { [key: string]: number } = {
      free: 0,
      starter: 9,
      pro: 19,
      enterprise: 49
    }
    
    const currentPrice = planPrices[currentPlan.toLowerCase()] || 0
    const targetPrice = planPrices[targetPlan.toLowerCase()] || 0
    
    // Calculer la différence à payer
    const amountToPay = Math.max(0, targetPrice - currentPrice)
    
    console.log('💰 Calcul upgrade:')
    console.log('  Plan actuel:', currentPlan, '-', currentPrice, '€')
    console.log('  Plan cible:', targetPlan, '-', targetPrice, '€')
    console.log('  Différence à payer:', amountToPay, '€')
    
    return NextResponse.json({
      currentPlan,
      targetPlan,
      currentPrice,
      targetPrice,
      amountToPay
    })
  } catch (error: any) {
    console.error('Erreur calcul upgrade:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


