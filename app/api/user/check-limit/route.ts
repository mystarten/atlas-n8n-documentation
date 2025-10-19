import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.log('🔍 Vérification limite pour user:', user.id)
    
    // Utiliser la fonction RPC pour vérifier les limites
    const { data, error } = await supabase.rpc('check_usage_limit', {
      user_uuid: user.id
    })
    
    if (error) {
      console.error('❌ Erreur vérification limite:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    console.log('✅ Limite vérifiée:', data)
    
    return NextResponse.json({ 
      allowed: data.allowed,
      current: data.current,
      limit: data.limit,
      tier: data.tier
    })
  } catch (error: any) {
    console.error('❌ Erreur serveur:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
