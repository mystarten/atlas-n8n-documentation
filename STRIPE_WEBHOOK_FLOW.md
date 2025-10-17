# 🔄 FLOW DU WEBHOOK STRIPE

## Architecture Complète

```
┌─────────────────┐
│   Dashboard     │
│    Stripe       │
│                 │
│  - Paiements    │
│  - Abonnements  │
│  - Factures     │
└────────┬────────┘
         │
         │ Événement (checkout.session.completed, etc.)
         │
         ▼
┌─────────────────────────────────────────────────────┐
│              WEBHOOK STRIPE                         │
│  https://gvwpopahjuvuefdyuilx.supabase.co/         │
│  functions/v1/stripe-webhook                        │
│                                                     │
│  Headers:                                           │
│  - stripe-signature: whsec_xxx                      │
│                                                     │
│  Body: JSON event                                   │
└────────┬────────────────────────────────────────────┘
         │
         │ POST Request
         │
         ▼
┌─────────────────────────────────────────────────────┐
│         SUPABASE EDGE FUNCTION                      │
│      (stripe-webhook/index.ts)                      │
│                                                     │
│  1. Vérifie méthode (POST only)                    │
│  2. Vérifie signature Stripe                       │
│  3. Parse l'événement                              │
│  4. Traite selon le type                           │
│  5. Retourne 200 (succès)                          │
└────────┬────────────────────────────────────────────┘
         │
         │ Switch sur event.type
         │
         ▼
┌─────────────────────────────────────────────────────┐
│           TRAITEMENT DES ÉVÉNEMENTS                 │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ checkout.session.completed                  │   │
│  │ → Paiement complété                         │   │
│  │ → Activer le plan utilisateur               │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ customer.subscription.created               │   │
│  │ → Nouvel abonnement                         │   │
│  │ → Créer l'entrée dans la BDD                │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ customer.subscription.updated               │   │
│  │ → Abonnement modifié                        │   │
│  │ → Mettre à jour le statut                   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ customer.subscription.deleted               │   │
│  │ → Abonnement annulé                         │   │
│  │ → Désactiver le plan                        │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ invoice.payment_succeeded                   │   │
│  │ → Facture payée                             │   │
│  │ → Enregistrer le paiement                   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ invoice.payment_failed                      │   │
│  │ → Échec de paiement                         │   │
│  │ → Envoyer notification                      │   │
│  └─────────────────────────────────────────────┘   │
└────────┬────────────────────────────────────────────┘
         │
         │ Mise à jour
         │
         ▼
┌─────────────────────────────────────────────────────┐
│         BASE DE DONNÉES SUPABASE                    │
│                                                     │
│  Tables :                                           │
│  - profiles (user_id, plan, status)                 │
│  - subscriptions (stripe_subscription_id, ...)      │
│  - payments (stripe_payment_id, amount, ...)        │
│  - usage (generations_used, generations_limit)      │
└─────────────────────────────────────────────────────┘
```

---

## 🔐 Sécurité : Vérification de Signature

```
┌─────────────────────────────────────────────────────┐
│              VÉRIFICATION STRIPE                    │
│                                                     │
│  1. Stripe envoie :                                 │
│     - Body (raw JSON)                               │
│     - Header stripe-signature                       │
│                                                     │
│  2. Edge Function :                                 │
│     - Lit le body en text (important!)              │
│     - Récupère le header stripe-signature           │
│     - Récupère STRIPE_WEBHOOK_SECRET (env)          │
│                                                     │
│  3. Stripe SDK :                                    │
│     stripe.webhooks.constructEvent(                 │
│       body,                                         │
│       signature,                                    │
│       webhookSecret                                 │
│     )                                               │
│                                                     │
│  4. Si signature valide :                           │
│     ✅ Continue le traitement                       │
│                                                     │
│  5. Si signature invalide :                         │
│     ❌ Retourne 400 (Bad Request)                   │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Flow de Configuration

```
1. DÉVELOPPEUR
   ↓
   Crée la fonction Edge
   (supabase/functions/stripe-webhook/index.ts)
   ↓
2. DÉPLOIEMENT
   ↓
   supabase functions deploy stripe-webhook
   ↓
3. CONFIGURATION SECRETS
   ↓
   supabase secrets set STRIPE_SECRET_KEY=sk_xxx
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx
   ↓
4. STRIPE DASHBOARD
   ↓
   Configure l'URL webhook
   Active les événements
   ↓
5. TEST
   ↓
   Envoie un test webhook depuis Stripe
   ↓
6. VÉRIFICATION
   ↓
   Vérifie Status 200
   Vérifie les logs Supabase
   ↓
7. PRODUCTION
   ↓
   ✅ Webhooks fonctionnels
```

---

## 🎯 Exemple de Payload Webhook

### checkout.session.completed

```json
{
  "id": "evt_1Q...",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_abc123...",
      "amount_total": 900,
      "currency": "eur",
      "customer": "cus_abc123...",
      "metadata": {
        "userId": "user_123",
        "plan": "starter"
      },
      "payment_status": "paid"
    }
  }
}
```

### customer.subscription.created

```json
{
  "id": "evt_1Q...",
  "type": "customer.subscription.created",
  "data": {
    "object": {
      "id": "sub_abc123...",
      "customer": "cus_abc123...",
      "status": "active",
      "items": {
        "data": [{
          "price": {
            "id": "price_abc123...",
            "product": "prod_abc123..."
          }
        }]
      }
    }
  }
}
```

---

## 🔄 Cycle de Vie d'un Abonnement

```
1. UTILISATEUR CLIQUE "S'ABONNER"
   ↓
2. CRÉATION CHECKOUT SESSION
   (Frontend → API Stripe)
   ↓
3. PAIEMENT
   (Utilisateur → Stripe)
   ↓
4. WEBHOOK: checkout.session.completed
   (Stripe → Supabase Edge Function)
   ↓
5. MISE À JOUR BDD
   (Edge Function → Supabase DB)
   ↓
6. WEBHOOK: customer.subscription.created
   (Stripe → Supabase Edge Function)
   ↓
7. CONFIRMATION ABONNEMENT
   (Edge Function → Supabase DB)
   ↓
8. UTILISATEUR ACTIF
   (Plan activé, limites mises à jour)
   ↓
9. RENOUVELLEMENT MENSUEL
   ↓
10. WEBHOOK: invoice.payment_succeeded
    (Stripe → Supabase Edge Function)
    ↓
11. ABONNEMENT PROLONGÉ
    (Edge Function → Supabase DB)
```

---

## 🚨 Gestion des Erreurs

```
WEBHOOK REÇU
  ↓
Signature valide ?
  ├─ NON → Retourne 400 ❌
  │        Log: "Invalid signature"
  │        Stripe réessaie
  │
  └─ OUI → Continue
        ↓
    Parse event ?
      ├─ ERREUR → Retourne 500 ❌
      │           Log: "Parse error"
      │           Stripe réessaie
      │
      └─ OK → Traite l'événement
            ↓
        Mise à jour BDD ?
          ├─ ERREUR → Retourne 500 ❌
          │           Log: "DB error"
          │           Stripe réessaie
          │
          └─ OK → Retourne 200 ✅
                  Log: "Success"
                  Stripe arrête
```

---

## 📈 Monitoring

### Logs à surveiller

```
✅ SUCCESS :
"✅ Webhook signature verified: checkout.session.completed"
"💰 Checkout completed: cs_test_..."

❌ ERRORS :
"❌ No Stripe signature found"
"❌ Webhook signature verification failed"
"❌ STRIPE_WEBHOOK_SECRET not configured"
"❌ Webhook error: ..."

⚠️  WARNINGS :
"⚠️  Unhandled event type: ..."
```

### Métriques importantes

- **Taux de succès** : % de webhooks avec Status 200
- **Temps de réponse** : < 5 secondes (idéal)
- **Erreurs de signature** : Doit être 0
- **Événements non traités** : À surveiller

---

## 🎓 Bonnes Pratiques

1. ✅ **Toujours vérifier la signature**
   - Sécurité critique
   - Évite les faux webhooks

2. ✅ **Retourner 200 rapidement**
   - Stripe attend une réponse rapide
   - Traite en async si nécessaire

3. ✅ **Logger les événements**
   - Facilite le debugging
   - Audit trail

4. ✅ **Gérer l'idempotence**
   - Stripe peut renvoyer le même événement
   - Utilise l'ID de l'événement comme clé unique

5. ✅ **Surveiller les logs**
   - Détecte les erreurs rapidement
   - Vérifie que tout fonctionne

---

## 📞 Ressources

- **Stripe Webhooks** : https://stripe.com/docs/webhooks
- **Supabase Edge Functions** : https://supabase.com/docs/guides/functions
- **Testing Webhooks** : https://stripe.com/docs/webhooks/test

---

**Ce flow est maintenant implémenté et prêt à être déployé ! 🚀**

