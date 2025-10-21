import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Récupérer le customer Stripe à partir de l'email
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({ error: 'Aucun client Stripe trouvé' }, { status: 404 });
    }

    const customer = customers.data[0];

    // Créer la session du portail client Stripe pour ce customer
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/account`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('❌ Erreur portail:', error);
    return NextResponse.json({ error: error.message || 'Erreur serveur inconnue' }, { status: 500 });
  }
}
