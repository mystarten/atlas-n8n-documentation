import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.log('🔄 Incrémentation de l\'usage pour user:', user.id)
    
    // Incrémenter l'usage
    const { data, error } = await supabase.rpc('increment_user_templates_usage', {
      user_id_param: user.id
    })
    
    if (error) {
      console.error('❌ Erreur incrémentation:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    console.log('✅ Usage incrémenté avec succès, nouveau count:', data)
    
    return NextResponse.json({ 
      success: true, 
      newCount: data 
    })
  } catch (error: any) {
    console.error('❌ Erreur serveur:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
