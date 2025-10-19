import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    // Utiliser le client normal pour vérifier l'auth
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.log('🔄 Incrémentation de l\'usage pour user:', user.id)
    
    // ✅ Utiliser le service role pour bypass RLS
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
    
    // ✅ Méthode simplifiée : mise à jour directe de la table profiles
    const { data: currentProfile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('templates_used, subscription_tier')
      .eq('id', user.id)
      .single()
    
    if (fetchError) {
      console.error('❌ Erreur récupération profil:', fetchError)
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 404 })
    }
    
    // Si plan Enterprise, ne pas incrémenter (illimité)
    if (currentProfile.subscription_tier === 'enterprise') {
      console.log('✅ Plan Enterprise - pas d\'incrémentation')
      return NextResponse.json({ 
        success: true, 
        newCount: currentProfile.templates_used || 0,
        message: 'Plan Enterprise - illimité'
      })
    }
    
    // Incrémenter le compteur
    const newCount = (currentProfile.templates_used || 0) + 1
    
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ 
        templates_used: newCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select('templates_used')
      .single()
    
    if (error) {
      console.error('❌ Erreur incrémentation:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    console.log('✅ Usage incrémenté avec succès, nouveau count:', data.templates_used)
    
    return NextResponse.json({ 
      success: true, 
      newCount: data.templates_used 
    })
  } catch (error: any) {
    console.error('❌ Erreur serveur:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
