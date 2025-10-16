import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// ✅ Client admin pour bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function GET() {
  try {
    // Récupérer le user connecté
    const { createClient: createServerClient } = await import('@/lib/supabase/server')
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
    }

    console.log('🔍 User:', user.id, user.email)

    // ✅ Lire avec ADMIN (bypass RLS)
    const { data: profile, error: readError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', user.email)
      .single()

    console.log('📊 Profile:', profile)
    console.log('❌ Erreur:', readError)

    if (readError || !profile) {
      return NextResponse.json({
        error: 'Profile non trouvé',
        user_email: user.email,
        read_error: readError
      }, { status: 404 })
    }

    // ✅ Mettre à jour avec ADMIN
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_tier: 'pro',
        templates_limit: 40,
        stripe_customer_id: 'cus_TFLX6Sa9eJqliw',
        stripe_subscription_id: 'sub_1SIqqWRy2u5FNwIAHlbslB3r',
        updated_at: new Date().toISOString()
      })
      .eq('id', profile.id)
      .select()
      .single()

    console.log('✅ Mis à jour:', updated)

    return NextResponse.json({
      success: true,
      user_id: user.id,
      user_email: user.email,
      before: {
        subscription_tier: profile.subscription_tier,
        templates_limit: profile.templates_limit
      },
      after: {
        subscription_tier: updated?.subscription_tier,
        templates_limit: updated?.templates_limit
      }
    })

  } catch (error: any) {
    console.error('❌ Erreur:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

