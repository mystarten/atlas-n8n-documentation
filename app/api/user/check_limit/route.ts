import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('🔍 API check_limit appelée');
    
    const supabaseAuth = await createSupabaseServerClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) {
      console.log('❌ Non authentifié');
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    console.log('✅ User:', user.email);

    // Créer client avec Service Role
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Récupérer le profil
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('subscription_tier, templates_used, templates_limit')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('❌ Erreur profil:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const tier = profile?.subscription_tier || 'free';
    const used = profile?.templates_used || 0;
    const limit = profile?.templates_limit || 3;

    console.log(`✅ Données: ${used}/${limit} (${tier})`);

    return NextResponse.json({
      allowed: used < limit,
      current: used,
      limit: limit,
      tier: tier,
    });
  } catch (error: any) {
    console.error('❌ Erreur check_limit:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

