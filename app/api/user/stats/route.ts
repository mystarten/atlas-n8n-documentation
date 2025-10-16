import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

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

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ used: 0, limit: 3 })
  }

  // ✅ Utiliser admin pour lire (bypass RLS)
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('subscription_tier, templates_used, templates_limit')
    .eq('id', user.id)
    .single()

  console.log('📊 Stats pour', user.email, ':', profile)

  if (!profile || error) {
    console.error('❌ Erreur lecture profile:', error)
    return NextResponse.json({ used: 0, limit: 3 })
  }

  return NextResponse.json({
    used: profile.templates_used || 0,
    limit: profile.templates_limit || 3,
    tier: profile.subscription_tier || 'free'
  })
}
