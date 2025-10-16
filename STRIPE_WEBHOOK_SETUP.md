# Configuration du Webhook Stripe

## Objectif
Synchroniser automatiquement les changements d'abonnement Stripe avec Supabase.

## Étapes de configuration

### 1. Créer le webhook sur Stripe Dashboard

1. **Aller sur Stripe Dashboard**
   - Mode Test : https://dashboard.stripe.com/test/webhooks
   - Mode Live : https://dashboard.stripe.com/webhooks

2. **Cliquer sur "Add endpoint"**

3. **URL de l'endpoint**
   - Production : `https://votre-domaine.com/api/webhooks/stripe`
   - Développement : Utiliser Stripe CLI (voir section 2)

4. **Événements à écouter**
   Sélectionner les événements suivants :
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`

5. **Copier le Signing Secret**
   - Format : `whsec_...`
   - Le copier dans `.env.local`

### 2. Configuration en développement local

#### Option A : Stripe CLI (Recommandée)

1. **Installer Stripe CLI**
   ```bash
   # Windows (via Scoop)
   scoop install stripe
   
   # macOS (via Homebrew)
   brew install stripe/stripe-cli/stripe
   
   # Ou télécharger : https://stripe.com/docs/stripe-cli
   ```

2. **Se connecter à Stripe**
   ```bash
   stripe login
   ```

3. **Forwarder les webhooks vers localhost**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Copier le webhook secret**
   Le CLI affichera un secret comme : `whsec_...`
   Copier ce secret dans `.env.local` :
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

5. **Laisser le CLI tourner**
   Garde le terminal ouvert pendant le développement.

#### Option B : ngrok ou localhost.run

1. **Installer ngrok**
   ```bash
   # Télécharger depuis https://ngrok.com/download
   ngrok http 3000
   ```

2. **Copier l'URL publique**
   Exemple : `https://abc123.ngrok.io`

3. **Configurer le webhook sur Stripe**
   URL : `https://abc123.ngrok.io/api/webhooks/stripe`

### 3. Variables d'environnement

Ajouter dans `.env.local` :

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs
STRIPE_PRICE_STARTER=price_1SIPjARy2u5FNwIA8BWqWi9g
STRIPE_PRICE_PRO=price_1SIPjqRy2u5FNwIAKvxx3C79
STRIPE_PRICE_ENTERPRISE=price_1SIPkQRy2u5FNwIAwPpCKgWU

# Supabase (déjà configuré normalement)
NEXT_PUBLIC_SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=eyJh...
```

### 4. Tester le webhook

#### Test avec Stripe CLI

1. **Déclencher un événement test**
   ```bash
   stripe trigger customer.subscription.created
   ```

2. **Vérifier les logs**
   - Dans le terminal où tourne Stripe CLI
   - Dans les logs de votre app Next.js
   - Dans Stripe Dashboard → Webhooks → Logs

#### Test avec un vrai paiement

1. **Faire un paiement test**
   - Carte test : `4242 4242 4242 4242`
   - Date : N'importe quelle date future
   - CVC : N'importe quel 3 chiffres

2. **Vérifier Supabase**
   - Ouvrir Supabase Dashboard → Table Editor → `user_usage`
   - Vérifier que `subscription_tier` a été mis à jour
   - Vérifier que `stripe_subscription_id` est présent

### 5. Événements gérés

| Événement | Action |
|-----------|--------|
| `customer.subscription.created` | Création d'un nouvel abonnement → Mise à jour tier |
| `customer.subscription.updated` | Modification d'abonnement → Mise à jour tier + reset compteur |
| `customer.subscription.deleted` | Annulation → Remise en plan `free` |
| `invoice.payment_succeeded` | Paiement réussi → Log |
| `invoice.payment_failed` | Paiement échoué → Log |

### 6. Synchronisation manuelle

Si le webhook ne fonctionne pas ou pour forcer une sync :

1. **Aller sur `/admin`**
2. **Cliquer sur "🔄 Synchroniser avec Stripe"**
3. **Vérifier que le plan est mis à jour**

### 7. Dépannage

#### Le webhook ne reçoit rien

- ✅ Vérifier que Stripe CLI tourne (`stripe listen`)
- ✅ Vérifier que le serveur Next.js tourne (`npm run dev`)
- ✅ Vérifier l'URL du webhook sur Stripe Dashboard
- ✅ Vérifier les logs Stripe Dashboard → Webhooks

#### Erreur "Invalid signature"

- ✅ Vérifier que `STRIPE_WEBHOOK_SECRET` est correct
- ✅ Vérifier que le secret correspond au mode (test vs live)
- ✅ Redémarrer le serveur Next.js après avoir changé `.env.local`

#### L'abonnement n'est pas mis à jour

- ✅ Vérifier les logs dans le terminal Next.js
- ✅ Vérifier que les `STRIPE_PRICE_*` sont corrects
- ✅ Utiliser le bouton "Synchroniser avec Stripe" sur `/admin`

### 8. Passage en production

1. **Créer un webhook en mode Live**
   - URL : `https://votre-domaine.com/api/webhooks/stripe`
   - Copier le nouveau signing secret (différent du test)

2. **Variables d'environnement production**
   ```bash
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_... (mode live)
   ```

3. **Tester avec une vraie carte**

## Endpoints créés

- `POST /api/webhooks/stripe` - Webhook Stripe automatique
- `POST /api/sync-stripe` - Synchronisation manuelle

## Flux de synchronisation

```
Stripe (changement d'abonnement)
  ↓
Webhook envoyé à /api/webhooks/stripe
  ↓
Vérification signature
  ↓
Récupération customer_id et price_id
  ↓
Mapping price_id → tier
  ↓
Mise à jour Supabase
  ↓
Reset compteur templates
  ↓
✅ Synchronisé !
```

## Logs attendus

```
✅ Webhook Stripe reçu: customer.subscription.updated
🔄 Mise à jour subscription: { customerId: 'cus_...', priceId: 'price_...', status: 'active' }
📊 Price ID: price_1SIPkQRy2u5FNwIAwPpCKgWU
📊 Tier déterminé: enterprise
👤 User ID trouvé: 22d90ff5-ea14-4721-9e7f-fec1d01ccd86
✅ Supabase mis à jour: { userId: '...', tier: 'enterprise' }
```


