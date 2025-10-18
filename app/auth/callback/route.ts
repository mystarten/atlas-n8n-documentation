import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/generate'
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('❌ Erreur échange code:', error)
      return NextResponse.redirect(`${origin}/login?error=auth_failed`)
    }
    
    // Vérifier si c'est un nouvel utilisateur (pas encore d'onboarding)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Vérifier si l'utilisateur a déjà fait l'onboarding
      const { data: onboardingData } = await supabase
        .from('onboarding_data')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()
      
      // Si pas d'onboarding, rediriger vers /onboarding
      if (!onboardingData) {
        console.log('🆕 Nouvel utilisateur détecté → /onboarding')
        return NextResponse.redirect(`${origin}/onboarding`)
      }
    }
    
    // ✅ Rediriger vers la page demandée ou /generate
    return NextResponse.redirect(`${origin}${next}`)
  }

  // Si pas de code, rediriger vers login
  return NextResponse.redirect(`${origin}/login`)
}
