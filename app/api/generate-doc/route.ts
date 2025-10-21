import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { workflowJson, notes, format, customBrandName } = await req.json(); // ✅ Ajouté customBrandName

    // Vérifier l'authentification
    const supabaseAuth = await createSupabaseServerClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    console.log('✅ User authentifié:', user.email);

    // Client admin pour bypass RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Récupérer le profil avec company_name
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('subscription_tier, templates_used, templates_limit, company_name')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('❌ Erreur profil:', profileError);
      return NextResponse.json({ error: 'Erreur lors de la récupération du profil' }, { status: 500 });
    }

    const userPlan = profile?.subscription_tier || 'free';
    const templatesUsed = profile?.templates_used || 0;
    const templatesLimit = profile?.templates_limit || 3;

    console.log(`📊 Plan: ${userPlan}, Usage: ${templatesUsed}/${templatesLimit}`);

    // Vérifier la limite
    if (templatesUsed >= templatesLimit) {
      return NextResponse.json(
        { error: 'Limite de templates atteinte. Upgradez votre plan pour continuer.' },
        { status: 403 }
      );
    }

    // Convertir le JSON en string pour N8N
    const workflowJsonString = typeof workflowJson === 'string' 
      ? workflowJson 
      : JSON.stringify(workflowJson);

    // Préparer les données pour N8N avec branding personnalisé
    const webhookData = {
      // Workflow
      workflowJson: workflowJsonString,

      // Notes utilisateur
      notes: notes || '',

      // Informations utilisateur
      user_id: user.id,
      user_email: user.email,
      user_plan: userPlan,

      // Format de sortie
      output_format: format || 'notes',

      // ✅ BRANDING PERSONNALISÉ (priorité au formulaire)
      custom_brand_name: customBrandName || profile?.company_name || null,
      has_custom_branding: userPlan === 'enterprise' && !!(customBrandName || profile?.company_name),

      // Métadonnées
      generated_at: new Date().toISOString(),
      webhookUrl: process.env.N8N_WEBHOOK_URL,
      executionMode: 'production',

      // ✅ PERMISSIONS SELON LE PLAN
      permissions: {
        // PDF disponible à partir de Starter
        can_export_pdf: ['starter', 'pro', 'enterprise'].includes(userPlan),
        
        // Pas de watermark à partir de Pro
        has_watermark: ['free', 'starter'].includes(userPlan),
        no_watermark: ['pro', 'enterprise'].includes(userPlan),
        
        // Branding perso uniquement Enterprise
        can_use_custom_branding: userPlan === 'enterprise',
        
        // Résumé des features
        pdf_export: ['starter', 'pro', 'enterprise'].includes(userPlan),
        remove_watermark: ['pro', 'enterprise'].includes(userPlan),
        custom_branding: userPlan === 'enterprise',
      },

      // Limites de templates
      templates_used: templatesUsed,
      templates_limit: templatesLimit,
      subscription_tier: userPlan,
    };

    console.log('📤 Envoi au webhook N8N...');
    console.log('🎨 Branding:', webhookData.custom_brand_name || 'ATLAS (default)');

    // Envoyer au webhook N8N
    const webhookResponse = await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookData),
    });

    if (!webhookResponse.ok) {
      throw new Error(`Webhook N8N error: ${webhookResponse.status}`);
    }

    const webhookResult = await webhookResponse.json();
    console.log('✅ Webhook N8N réussi');

    return NextResponse.json({
      success: true,
      message: 'Documentation générée avec succès',
      data: webhookResult,
    });

  } catch (error: any) {
    console.error('❌ Erreur generate-doc:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la génération' },
      { status: 500 }
    );
  }
}
