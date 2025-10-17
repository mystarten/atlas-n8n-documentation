# Stripe Webhook - Supabase Edge Function

## Description

Cette fonction Edge Supabase reçoit et traite les webhooks envoyés par Stripe pour gérer :
- Paiements complétés
- Abonnements créés/modifiés/annulés
- Factures payées/échouées

## Configuration requise

### Variables d'environnement

Deux secrets doivent être configurés dans Supabase :

1. **STRIPE_SECRET_KEY** : Ta clé secrète Stripe
   - Test : `sk_test_...`
   - Production : `sk_live_...`

2. **STRIPE_WEBHOOK_SECRET** : Secret de signature du webhook
   - Commence par `whsec_...`

### Comment configurer les secrets

```bash
# STRIPE_SECRET_KEY
supabase secrets set STRIPE_SECRET_KEY=sk_test_VOTRE_CLE --project-ref gvwpopahjuvuefdyuilx

# STRIPE_WEBHOOK_SECRET
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET --project-ref gvwpopahjuvuefdyuilx
```

## Déploiement

```bash
# Depuis la racine du projet
supabase functions deploy stripe-webhook --project-ref gvwpopahjuvuefdyuilx
```

## URL du Webhook

```
https://gvwpopahjuvuefdyuilx.supabase.co/functions/v1/stripe-webhook
```

Configure cette URL dans ton Dashboard Stripe : https://dashboard.stripe.com/webhooks

## Événements traités

- `checkout.session.completed` - Paiement complété
- `customer.subscription.created` - Nouvel abonnement
- `customer.subscription.updated` - Abonnement modifié
- `customer.subscription.deleted` - Abonnement annulé
- `invoice.payment_succeeded` - Paiement réussi
- `invoice.payment_failed` - Paiement échoué

## Logs

Voir les logs en temps réel :

```bash
supabase functions logs stripe-webhook --project-ref gvwpopahjuvuefdyuilx --tail
```

Ou via le Dashboard Supabase :
https://supabase.com/dashboard/project/gvwpopahjuvuefdyuilx/functions/stripe-webhook

## Tests

### Test depuis Stripe Dashboard

1. Va sur https://dashboard.stripe.com/webhooks
2. Clique sur ton endpoint
3. Clique "Send test webhook"
4. Choisis un événement
5. Vérifie les logs

### Test avec Stripe CLI

```bash
# Installer Stripe CLI
stripe login

# Forward vers Supabase
stripe listen --forward-to https://gvwpopahjuvuefdyuilx.supabase.co/functions/v1/stripe-webhook

# Trigger un événement
stripe trigger checkout.session.completed
```

## Sécurité

- ✅ Vérification de signature Stripe
- ✅ Accepte uniquement les requêtes POST
- ✅ Logs d'erreur pour le debugging
- ✅ Retourne 200 seulement si le webhook est valide

## Dépendances

- `https://deno.land/std@0.168.0/http/server.ts` - Serveur HTTP Deno
- `https://esm.sh/stripe@14.11.0?target=deno` - SDK Stripe pour Deno

## Structure de réponse

### Succès (200)
```json
{
  "received": true
}
```

### Erreur (400/500)
```json
{
  "error": "Description de l'erreur"
}
```

## TODO

- [ ] Connecter à la base de données Supabase
- [ ] Mettre à jour les profils utilisateurs après paiement
- [ ] Envoyer des emails de confirmation
- [ ] Gérer les remboursements
- [ ] Logger les événements dans une table d'audit

## Support

Pour toute question, consulte :
- Guide complet : `STRIPE_WEBHOOK_DEPLOYMENT_GUIDE.md`
- Fix rapide : `QUICK_FIX_STRIPE_WEBHOOK.md`

