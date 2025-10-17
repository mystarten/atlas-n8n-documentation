import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('❌ Erreur échange code:', error)
      return NextResponse.redirect(`${origin}/login?error=auth_failed`)
    }
  }

  // Redirection vers /account après connexion réussie
  return NextResponse.redirect(`${origin}/account`)
}