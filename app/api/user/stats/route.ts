import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ used: 0, limit: 3, tier: 'free' })
  }

  // ✅ Lecture directe depuis profiles (plus simple et fiable)
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('subscription_tier, templates_used, templates_limit')
    .eq('id', user.id)
    .single()

  console.log('📊 Stats pour', user.email, ':', profile)

  if (!profile || error) {
    console.error('❌ Erreur lecture profile:', error)
    return NextResponse.json({ used: 0, limit: 3, tier: 'free' })
  }

  return NextResponse.json({
    used: profile.templates_used || 0,
    limit: profile.templates_limit || 3,
    tier: profile.subscription_tier || 'free'
  })
}
