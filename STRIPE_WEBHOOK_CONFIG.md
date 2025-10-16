# 🔧 CONFIGURATION DU WEBHOOK STRIPE - GUIDE COMPLET

## ✅ PROBLÈME RÉSOLU

L'abonnement ne se mettait pas à jour après le paiement car **l'événement `checkout.session.completed` n'était pas géré** dans le webhook.

### Corrections apportées :

1. ✅ **Ajout du handler `checkout.session.completed`** dans `app/api/webhooks/stripe/route.ts`
2. ✅ **Ajout des métadonnées** dans `app/api/create-checkout-session/route.ts`
3. ✅ **Création de l'endpoint de debug** `app/api/debug/sync-stripe`

---

## 📋 ÉTAPE 1 : VÉRIFIER LES VARIABLES D'ENVIRONNEMENT

Dans votre fichier `.env.local`, assurez-vous d'avoir :

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_...  # ou sk_live_... en production
STRIPE_WEBHOOK_SECRET=whsec_...  # ⚠️ CRUCIAL - voir étape 2

# Stripe Price IDs (récupérés depuis Stripe Dashboard → Products)
STRIPE_PRICE_STARTER=price_xxxxxxxxxxxxx
STRIPE_PRICE_PRO=price_xxxxxxxxxxxxx
STRIPE_PRICE_ENTERPRISE=price_xxxxxxxxxxxxx

# Site URL
NEXT_PUBLIC_URL=http://localhost:3000  # ou votre domaine en prod
```

---

## 📋 ÉTAPE 2 : CONFIGURER LE WEBHOOK SUR STRIPE DASHBOARD

### A. Créer le webhook sur Stripe

1. Aller sur **[Stripe Dashboard](https://dashboard.stripe.com/)**
2. Cliquer sur **Developers** → **Webhooks**
3. Cliquer sur **Add endpoint**

### B. Configuration de l'endpoint

**Pour le développement local :**
```
URL: http://localhost:3000/api/webhooks/stripe
```

**Pour la production :**
```
URL: https://votre-domaine.com/api/webhooks/stripe
```

### C. Sélectionner les événements à écouter

Cochez **EXACTEMENT** ces événements :

- ✅ `checkout.session.completed` **(CRUCIAL pour le premier paiement)**
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`

### D. Copier le Webhook Secret

Après la création, Stripe affiche un **Signing Secret** qui commence par `whsec_...`

📝 **Copiez-le et ajoutez-le dans `.env.local` :**

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **IMPORTANT :** Sans ce secret, les webhooks ne fonctionneront PAS !

---

## 📋 ÉTAPE 3 : TESTER EN LOCAL AVEC STRIPE CLI

### A. Installer Stripe CLI

**Windows :**
```bash
scoop install stripe
```

**macOS :**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux :**
```bash
curl -s https://packages.stripe.com/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.com/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
sudo apt update
sudo apt install stripe
```

### B. Se connecter à Stripe

```bash
stripe login
```

### C. Forwarder les webhooks vers localhost

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Vous verrez :
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxxx (^C to quit)
```

📝 **Copiez ce secret dans `.env.local` :**

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxx
```

### D. Redémarrer votre serveur Next.js

```bash
# Arrêter le serveur (Ctrl+C)
# Relancer
npm run dev
```

---

## 📋 ÉTAPE 4 : TESTER UN PAIEMENT

### A. Créer un paiement de test

1. Aller sur votre page `/pricing`
2. Cliquer sur **Souscrire** pour un plan (Starter, Pro, ou Enterprise)
3. Utiliser une carte de test Stripe :

```
Numéro de carte : 4242 4242 4242 4242
Date d'expiration : 12/34 (n'importe quelle date future)
CVC : 123
Code postal : 12345
```

### B. Vérifier les logs

**Dans votre terminal avec Stripe CLI :**
```
✅ Webhook Stripe reçu: checkout.session.completed
🎉 Checkout complété: cs_test_xxxxx
💳 Checkout complété: { customerId: 'cus_xxx', subscriptionId: 'sub_xxx', priceId: 'price_xxx' }
📊 Tier déterminé: pro
👤 User ID trouvé: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
✅ Supabase mis à jour après checkout: { userId: 'xxx', tier: 'pro' }
```

**Dans votre serveur Next.js :**
```
✅ Webhook Stripe reçu: checkout.session.completed
...
✅ Supabase mis à jour après checkout
```

### C. Vérifier dans Supabase

1. Aller sur **Supabase Dashboard** → **Table Editor** → **user_usage**
2. Chercher votre utilisateur
3. Vérifier que :
   - `subscription_tier` = `pro` (ou le plan choisi)
   - `stripe_subscription_id` = `sub_xxxxx`
   - `stripe_customer_id` = `cus_xxxxx`
   - `templates_generated` = `0` (réinitialisé)

---

## 📋 ÉTAPE 5 : SYNCHRONISATION MANUELLE (SI NÉCESSAIRE)

Si l'abonnement ne s'est pas mis à jour automatiquement, utilisez l'endpoint de debug :

### A. Récupérer votre User ID

Dans Supabase Dashboard → Table Editor → user_usage → Copier l'ID de votre utilisateur

### B. Appeler l'endpoint de debug

```bash
http://localhost:3000/api/debug/sync-stripe?user_id=VOTRE_USER_ID
```

Ou via navigateur :
```
http://localhost:3000/api/debug/sync-stripe?user_id=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### C. Réponse attendue

```json
{
  "success": true,
  "message": "✅ Profile synchronisé avec Stripe",
  "changes": {
    "before": {
      "subscription_tier": "free",
      "stripe_subscription_id": null
    },
    "after": {
      "subscription_tier": "pro",
      "stripe_subscription_id": "sub_xxxxxxxxxxxxx"
    }
  },
  "stripe_data": {
    "customer_id": "cus_xxxxxxxxxxxxx",
    "subscription_id": "sub_xxxxxxxxxxxxx",
    "subscription_status": "active",
    "price_id": "price_xxxxxxxxxxxxx",
    "current_period_end": "2025-02-14T12:00:00.000Z"
  }
}
```

---

## 📋 ÉTAPE 6 : DÉPLOIEMENT EN PRODUCTION

### A. Vérifier les variables d'environnement en prod

Sur Vercel/Netlify/votre hébergeur :

```bash
STRIPE_SECRET_KEY=sk_live_...  # ⚠️ Clé LIVE (pas test)
STRIPE_WEBHOOK_SECRET=whsec_...  # ⚠️ Secret LIVE du webhook prod
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_ENTERPRISE=price_...
NEXT_PUBLIC_URL=https://votre-domaine.com
```

### B. Créer un nouveau webhook pour la production

1. Stripe Dashboard → Webhooks → Add endpoint
2. URL : `https://votre-domaine.com/api/webhooks/stripe`
3. Même événements que pour le test
4. Copier le nouveau signing secret (différent du test !)
5. L'ajouter dans les variables d'environnement de production

### C. Tester en production

1. Faire un vrai paiement (carte réelle ou mode test désactivé)
2. Vérifier les logs sur Vercel/Netlify
3. Vérifier dans Supabase que `subscription_tier` est mis à jour

---

## 🔍 DIAGNOSTIC DES PROBLÈMES

### Problème : Le webhook ne se déclenche pas

**Solution :**
- Vérifier que `STRIPE_WEBHOOK_SECRET` est bien défini
- Vérifier que le serveur Next.js est redémarré après ajout de la variable
- Vérifier les logs Stripe Dashboard → Webhooks → Voir les tentatives

### Problème : Erreur "Invalid signature"

**Solution :**
- Le `STRIPE_WEBHOOK_SECRET` est incorrect ou manquant
- Recréer le webhook sur Stripe Dashboard
- Copier le nouveau secret

### Problème : L'utilisateur n'est pas trouvé dans Supabase

**Solution :**
- Vérifier que `stripe_customer_id` est bien enregistré dans `user_usage`
- Utiliser l'endpoint de debug pour voir les détails
- Vérifier que le paiement a bien créé un customer Stripe

### Problème : Le tier ne se met pas à jour

**Solution :**
- Vérifier que les `STRIPE_PRICE_XXX` correspondent aux vrais price IDs sur Stripe
- Regarder les logs du webhook pour voir quel `priceId` est reçu
- Comparer avec les price IDs dans Stripe Dashboard → Products

---

## 🎯 RÉSULTAT FINAL

Après paiement :
```
Free → Starter = subscription_tier passe à "starter" ✅
Free → Pro = subscription_tier passe à "pro" ✅
Free → Enterprise = subscription_tier passe à "enterprise" ✅
```

Le changement est **INSTANTANÉ** après le paiement réussi !

---

## ⚠️ IMPORTANT - SÉCURITÉ

1. **NE JAMAIS commit** le fichier `.env.local` dans Git
2. **Supprimer** l'endpoint `/api/debug/sync-stripe` en production (ou le protéger)
3. **Utiliser** les clés LIVE uniquement en production
4. **Vérifier** que le webhook secret est différent entre test et production

---

## 📞 SUPPORT

Si problème persistant :
1. Vérifier les logs Stripe Dashboard → Webhooks
2. Vérifier les logs Vercel/serveur
3. Utiliser l'endpoint de debug pour diagnostiquer
4. Vérifier que tous les événements sont bien cochés sur Stripe

---

**✅ Configuration terminée !**

