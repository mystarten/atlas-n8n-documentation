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
    
    // ✅ Rediriger vers /generate ou la page spécifiée
    return NextResponse.redirect(`${origin}${next}`)
  }

  // Si pas de code, rediriger vers login
  return NextResponse.redirect(`${origin}/login`)
}