import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const supabaseAuth = await createSupabaseServerClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Créer client admin
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Incrémenter le compteur
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('templates_used, templates_limit, subscription_tier')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('❌ Erreur récupération profil:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const newCount = (profile.templates_used || 0) + 1;

    // Mettre à jour le compteur
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ templates_used: newCount })
      .eq('id', user.id);

    if (updateError) {
      console.error('❌ Erreur incrémentation:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    console.log(`✅ Compteur incrémenté: ${newCount}/${profile.templates_limit}`);

    return NextResponse.json({
      success: true,
      templates_used: newCount,
      templates_limit: profile.templates_limit,
    });
  } catch (error: any) {
    console.error('❌ Erreur increment-usage:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
