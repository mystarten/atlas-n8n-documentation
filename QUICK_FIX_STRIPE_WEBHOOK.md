# ⚡ FIX RAPIDE : WEBHOOK STRIPE EN 5 MINUTES

## 🚨 PROBLÈME
Stripe ne peut pas envoyer les webhooks à ton serveur Supabase.
**Deadline : 23 octobre 2025**

---

## ✅ SOLUTION EN 5 ÉTAPES

### 1️⃣ INSTALLER SUPABASE CLI (si pas déjà fait)

```bash
npm install -g supabase
```

### 2️⃣ SE CONNECTER À SUPABASE

```bash
supabase login
```

### 3️⃣ DÉPLOYER LA FONCTION WEBHOOK

```bash
cd C:\Users\admin\Desktop\ATLAS
supabase functions deploy stripe-webhook --project-ref gvwpopahjuvuefdyuilx
```

### 4️⃣ CONFIGURER LES SECRETS

#### A. STRIPE_SECRET_KEY

Va chercher ta clé secrète Stripe :
- Dashboard Stripe : https://dashboard.stripe.com/apikeys
- Copie la clé **secrète** (commence par `sk_test_` ou `sk_live_`)

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_ICI --project-ref gvwpopahjuvuefdyuilx
```

#### B. STRIPE_WEBHOOK_SECRET

Va chercher le secret de ton webhook :
- Dashboard Stripe : https://dashboard.stripe.com/webhooks
- Clique sur ton endpoint webhook
- Section "Signing secret" → Clique "Reveal"
- Copie le secret (commence par `whsec_`)

```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET_ICI --project-ref gvwpopahjuvuefdyuilx
```

### 5️⃣ TESTER LE WEBHOOK

1. Va sur https://dashboard.stripe.com/webhooks
2. Clique sur ton endpoint
3. Clique "Send test webhook"
4. Choisis `checkout.session.completed`
5. Clique "Send test webhook"

**Si tu vois Status 200 ✅ → C'est bon !**

---

## 🔍 VÉRIFIER QUE ÇA FONCTIONNE

### Voir les logs

```bash
supabase functions logs stripe-webhook --project-ref gvwpopahjuvuefdyuilx
```

### Vérifier les secrets configurés

```bash
supabase secrets list --project-ref gvwpopahjuvuefdyuilx
```

Tu devrais voir :
```
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

---

## 🐛 SI ÇA NE FONCTIONNE PAS

### Erreur "Invalid signature"

1. Va sur https://dashboard.stripe.com/webhooks
2. Clique sur ton endpoint
3. Clique "Signing secret" → "Roll secret"
4. Copie le NOUVEAU secret
5. Reconfigure-le :

```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_NOUVEAU_SECRET --project-ref gvwpopahjuvuefdyuilx
```

### Erreur "Connection timeout"

Vérifie que l'URL dans Stripe est exactement :
```
https://gvwpopahjuvuefdyuilx.supabase.co/functions/v1/stripe-webhook
```

### Aucun log

1. Redéploie la fonction :
```bash
supabase functions deploy stripe-webhook --project-ref gvwpopahjuvuefdyuilx
```

2. Vérifie qu'elle est bien déployée :
```bash
supabase functions list --project-ref gvwpopahjuvuefdyuilx
```

---

## 📱 AIDE VISUELLE

### Dashboard Supabase
https://supabase.com/dashboard/project/gvwpopahjuvuefdyuilx/functions/stripe-webhook

### Dashboard Stripe
https://dashboard.stripe.com/webhooks

---

## ✅ CHECKLIST

- [ ] Supabase CLI installé
- [ ] Connecté à Supabase avec `supabase login`
- [ ] Fonction déployée
- [ ] `STRIPE_SECRET_KEY` configuré
- [ ] `STRIPE_WEBHOOK_SECRET` configuré
- [ ] Test webhook envoyé depuis Stripe
- [ ] Status 200 dans Stripe Dashboard

---

**Après ces 5 étapes, Stripe recommencera à envoyer les webhooks automatiquement !** 🎉

**Besoin d'aide ?** Lis le guide complet : `STRIPE_WEBHOOK_DEPLOYMENT_GUIDE.md`

