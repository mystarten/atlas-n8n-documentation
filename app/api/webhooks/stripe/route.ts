import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

function getPlanFromPriceId(priceId: string): { plan: string; limit: number } {
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER) {
    return { plan: 'starter', limit: 20 };
  } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO) {
    return { plan: 'pro', limit: 40 };
  } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE) {
    return { plan: 'enterprise', limit: 65 };
  }
  return { plan: 'free', limit: 3 };
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  console.log('✅ Stripe Event:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Webhook client_reference_id:', session.client_reference_id);

        const userId = session.client_reference_id || session.metadata?.user_id;
        if (!userId) {
          console.error('❌ User ID manquant');
          break;
        }

        const subscriptionId = session.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0].price.id;
        const customerId = subscription.customer as string;
        const { plan, limit } = getPlanFromPriceId(priceId);

        console.log(`Mise à jour du profil Supabase pour userId=${userId}, plan=${plan}, limit=${limit}`);

        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({
            subscription_tier: plan,
            templates_limit: limit,
            templates_used: 0,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

        if (updateError) {
          console.error('❌ Erreur mise à jour profil:', updateError.message);
          break;
        }

        const { error: subscriptionError } = await supabaseAdmin
          .from('subscriptions')
          .upsert({
            id: subscriptionId,
            user_id: userId,
            stripe_customer_id: customerId,
            status: subscription.status,
            price_id: priceId,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            created_at: new Date().toISOString(),
          });

        if (subscriptionError) {
          console.error('❌ Erreur mise à jour subscription:', subscriptionError.message);
          break;
        }

        console.log('✅ Abonnement activé et données mises à jour dans Supabase');
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0].price.id;
        const { plan, limit } = getPlanFromPriceId(priceId);

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: subscription.status,
            price_id: priceId,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('id', subscription.id);

        const { data: subData } = await supabaseAdmin
          .from('subscriptions')
          .select('user_id')
          .eq('id', subscription.id)
          .single();

        if (subData) {
          await supabaseAdmin
            .from('profiles')
            .update({
              subscription_tier: plan,
              templates_limit: limit,
            })
            .eq('id', subData.user_id);
        }

        console.log('✅ Abonnement mis à jour');
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('id', subscription.id);

        const { data: subData } = await supabaseAdmin
          .from('subscriptions')
          .select('user_id')
          .eq('id', subscription.id)
          .single();

        if (subData) {
          await supabaseAdmin
            .from('profiles')
            .update({
              subscription_tier: 'free',
              templates_limit: 3,
            })
            .eq('id', subData.user_id);
          console.log('✅ Profil remis en free');
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        if (subscriptionId) {
          await supabaseAdmin
            .from('subscriptions')
            .update({
              status: 'active',
              current_period_end: new Date((invoice.period_end || 0) * 1000).toISOString(),
            })
            .eq('id', subscriptionId);
          console.log(`✅ Paiement récurrent réussi: ${subscriptionId}`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        if (subscriptionId) {
          await supabaseAdmin
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('id', subscriptionId);
          console.log(`⚠️ Paiement échoué: ${subscriptionId}`);
        }
        break;
      }

      case 'customer.subscription.paused': {
        const subscription = event.data.object as Stripe.Subscription;
        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'paused' })
          .eq('id', subscription.id);
        console.log(`⏸️ Abonnement suspendu: ${subscription.id}`);
        break;
      }

      case 'customer.subscription.resumed': {
        const subscription = event.data.object as Stripe.Subscription;
        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'active' })
          .eq('id', subscription.id);
        console.log(`▶️ Abonnement repris: ${subscription.id}`);
        break;
      }

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('❌ Erreur webhook:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
