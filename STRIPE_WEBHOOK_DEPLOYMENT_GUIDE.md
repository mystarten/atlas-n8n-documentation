# 🔧 GUIDE COMPLET : DÉPLOYER LE WEBHOOK STRIPE SUPABASE

## ⚠️ PROBLÈME ACTUEL
- **Erreur Stripe** : 9 requêtes n'ont pas pu se connecter au serveur
- **URL Webhook** : `https://gvwpopahjuvuefdyuilx.supabase.co/functions/v1/stripe-webhook`
- **Deadline** : 23 octobre 2025 (Stripe arrêtera d'envoyer les webhooks)

---

## 📋 PRÉREQUIS

1. **Supabase CLI installé**
   ```bash
   npm install -g supabase
   ```

2. **Connexion à Supabase**
   ```bash
   supabase login
   ```

3. **Variables d'environnement nécessaires** :
   - `STRIPE_SECRET_KEY` : Clé secrète Stripe (sk_live_... ou sk_test_...)
   - `STRIPE_WEBHOOK_SECRET` : Secret du webhook Stripe (whsec_...)

---

## 🚀 ÉTAPE 1 : DÉPLOYER LA FONCTION EDGE

### Déployer la fonction

```bash
# Depuis la racine du projet
supabase functions deploy stripe-webhook --project-ref gvwpopahjuvuefdyuilx
```

### Vérifier le déploiement

```bash
supabase functions list --project-ref gvwpopahjuvuefdyuilx
```

---

## 🔐 ÉTAPE 2 : CONFIGURER LES SECRETS SUPABASE

### Ajouter STRIPE_SECRET_KEY

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_VOTRE_CLE_SECRETE_ICI --project-ref gvwpopahjuvuefdyuilx
```

⚠️ **IMPORTANT** : Remplace `sk_live_VOTRE_CLE_SECRETE_ICI` par ta vraie clé Stripe :
- **Test** : `sk_test_...`
- **Production** : `sk_live_...`

### Ajouter STRIPE_WEBHOOK_SECRET

1. Va sur le **Dashboard Stripe** : https://dashboard.stripe.com/webhooks
2. Clique sur ton endpoint webhook
3. Copie le **Signing secret** (commence par `whsec_...`)
4. Configure-le :

```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET_ICI --project-ref gvwpopahjuvuefdyuilx
```

### Vérifier les secrets configurés

```bash
supabase secrets list --project-ref gvwpopahjuvuefdyuilx
```

---

## 🌐 ÉTAPE 3 : CONFIGURER STRIPE

### URL du Webhook

```
https://gvwpopahjuvuefdyuilx.supabase.co/functions/v1/stripe-webhook
```

### Événements à écouter

Dans le Dashboard Stripe, active ces événements :

- ✅ `checkout.session.completed` - Quand un paiement est complété
- ✅ `customer.subscription.created` - Nouvel abonnement créé
- ✅ `customer.subscription.updated` - Abonnement modifié
- ✅ `customer.subscription.deleted` - Abonnement annulé
- ✅ `invoice.payment_succeeded` - Paiement réussi
- ✅ `invoice.payment_failed` - Paiement échoué

### Vérifier la configuration

1. Va sur https://dashboard.stripe.com/webhooks
2. Clique sur ton endpoint
3. Vérifie que l'URL est correcte
4. Vérifie que les événements sont activés
5. **Teste le webhook** avec le bouton "Send test webhook"

---

## 🧪 ÉTAPE 4 : TESTER LE WEBHOOK

### Test depuis Stripe Dashboard

1. Va sur https://dashboard.stripe.com/webhooks
2. Clique sur ton endpoint
3. Clic "Send test webhook"
4. Choisis un événement (ex: `checkout.session.completed`)
5. Clique "Send test webhook"

### Test avec Stripe CLI (local)

```bash
# Installer Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe

# Se connecter
stripe login

# Forward les webhooks vers Supabase
stripe listen --forward-to https://gvwpopahjuvuefdyuilx.supabase.co/functions/v1/stripe-webhook

# Dans un autre terminal, trigger un événement
stripe trigger checkout.session.completed
```

### Vérifier les logs Supabase

```bash
supabase functions logs stripe-webhook --project-ref gvwpopahjuvuefdyuilx
```

Ou via le Dashboard Supabase :
- Va sur https://supabase.com/dashboard/project/gvwpopahjuvuefdyuilx/functions/stripe-webhook
- Onglet "Logs"

---

## ✅ ÉTAPE 5 : VÉRIFIER QUE ÇA FONCTIONNE

### Indicateurs de succès

1. **Stripe Dashboard** :
   - Aucune erreur dans la section "Recent deliveries"
   - Status 200 pour les requêtes

2. **Supabase Logs** :
   ```
   ✅ Webhook signature verified: checkout.session.completed
   💰 Checkout completed: cs_test_...
   ```

3. **Test de paiement** :
   - Crée un paiement test dans Stripe
   - Vérifie que le webhook est reçu et traité

---

## 🔄 MISE À JOUR DE LA FONCTION

Si tu modifies `supabase/functions/stripe-webhook/index.ts`, redéploie :

```bash
supabase functions deploy stripe-webhook --project-ref gvwpopahjuvuefdyuilx
```

---

## 🐛 DÉPANNAGE

### Erreur : "No Stripe signature found"

**Cause** : Stripe n'envoie pas le header `stripe-signature`

**Solution** :
- Vérifie que l'URL du webhook est correcte dans Stripe
- Vérifie que tu utilises la bonne version de l'API Stripe

### Erreur : "Invalid signature"

**Cause** : Le `STRIPE_WEBHOOK_SECRET` est incorrect

**Solution** :
1. Va sur https://dashboard.stripe.com/webhooks
2. Clique sur ton endpoint
3. Copie le **Signing secret**
4. Reconfigure-le :
   ```bash
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_NOUVEAU_SECRET --project-ref gvwpopahjuvuefdyuilx
   ```

### Erreur : "Webhook secret not configured"

**Cause** : `STRIPE_WEBHOOK_SECRET` n'est pas défini dans Supabase

**Solution** :
```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET --project-ref gvwpopahjuvuefdyuilx
```

### Erreur : "Connection timeout"

**Cause** : La fonction Supabase met trop de temps à répondre

**Solution** :
- Simplifie le traitement dans le webhook
- Utilise une queue (ex: Supabase Queue) pour le traitement async
- Retourne 200 immédiatement et traite en arrière-plan

### Logs vides ou pas de logs

**Solution** :
```bash
# Vérifier que la fonction est déployée
supabase functions list --project-ref gvwpopahjuvuefdyuilx

# Vérifier les logs
supabase functions logs stripe-webhook --project-ref gvwpopahjuvuefdyuilx --tail
```

---

## 📚 RESSOURCES

- **Stripe Webhooks Documentation** : https://stripe.com/docs/webhooks
- **Supabase Edge Functions** : https://supabase.com/docs/guides/functions
- **Stripe CLI** : https://stripe.com/docs/stripe-cli

---

## ⚡ COMMANDES RAPIDES

```bash
# Déployer
supabase functions deploy stripe-webhook --project-ref gvwpopahjuvuefdyuilx

# Voir les logs
supabase functions logs stripe-webhook --project-ref gvwpopahjuvuefdyuilx --tail

# Configurer un secret
supabase secrets set NOM_SECRET=valeur --project-ref gvwpopahjuvuefdyuilx

# Lister les secrets
supabase secrets list --project-ref gvwpopahjuvuefdyuilx

# Lister les fonctions
supabase functions list --project-ref gvwpopahjuvuefdyuilx
```

---

## 🎯 CHECKLIST FINALE

- [ ] Fonction Edge déployée sur Supabase
- [ ] `STRIPE_SECRET_KEY` configuré dans Supabase secrets
- [ ] `STRIPE_WEBHOOK_SECRET` configuré dans Supabase secrets
- [ ] URL webhook configurée dans Stripe Dashboard
- [ ] Événements activés dans Stripe (checkout, subscription, invoice)
- [ ] Test webhook envoyé depuis Stripe Dashboard
- [ ] Logs Supabase montrent "✅ Webhook signature verified"
- [ ] Status 200 dans Stripe Dashboard "Recent deliveries"

---

**Une fois tout configuré, Stripe recommencera à envoyer les webhooks automatiquement !** 🎉

