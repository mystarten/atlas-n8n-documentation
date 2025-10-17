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
    
    // ✅ IMPORTANT : Rediriger SANS le paramètre code dans l'URL
    // Pour éviter que le client Supabase tente de ré-échanger le code
    // (le code OAuth ne peut être utilisé qu'une seule fois)
    return NextResponse.redirect(`${origin}/account`)
  }

  // Si pas de code, rediriger vers login
  return NextResponse.redirect(`${origin}/login`)
}