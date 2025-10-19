import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Créer un client Supabase pour le middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Récupérer la session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // ✅ Middleware plus permissif - laisser le côté client gérer l'auth
  // On redirige seulement si on est sûr qu'il n'y a pas de session
  if (!session && req.nextUrl.pathname.startsWith('/generate')) {
    // Vérifier si on a au moins un cookie de session
    const sessionCookie = req.cookies.get('sb-access-token') || req.cookies.get('sb-refresh-token')
    if (!sessionCookie) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/login';
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (!session && req.nextUrl.pathname.startsWith('/account')) {
    const sessionCookie = req.cookies.get('sb-access-token') || req.cookies.get('sb-refresh-token')
    if (!sessionCookie) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/login';
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ['/generate/:path*', '/account/:path*'],
};
