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
    return NextResponse.json({ used: 0, limit: 3, tier: 'free' })
  }

  // ✅ Utiliser la fonction RPC pour récupérer les stats
  const { data: statsData, error } = await supabase.rpc('check_usage_limit', {
    user_uuid: user.id
  })

  console.log('📊 Stats pour', user.email, ':', statsData)

  if (!statsData || error) {
    console.error('❌ Erreur lecture stats:', error)
    return NextResponse.json({ used: 0, limit: 3, tier: 'free' })
  }

  return NextResponse.json({
    used: statsData.current || 0,
    limit: statsData.limit || 3,
    tier: statsData.tier || 'free'
  })
}
