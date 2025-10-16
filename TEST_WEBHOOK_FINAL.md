# 🚀 TEST FINAL DU WEBHOOK - GUIDE ÉTAPE PAR ÉTAPE

## ✅ FICHIER CRÉÉ

Le webhook Stripe est maintenant au **BON EMPLACEMENT** :

```
app/api/stripe/webhook/route.ts ✅
```

**URL du webhook :**
```
http://localhost:3000/api/stripe/webhook
```

---

## 📋 ÉTAPES DE TEST - À SUIVRE DANS L'ORDRE

### ✅ ÉTAPE 1 : Vérifier les variables d'environnement

Ouvrir `.env.local` et vérifier que tu as **TOUTES** ces variables :

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ibikrttopnusseutvzvb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # (sera mis à jour à l'étape 3)
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Price IDs
STRIPE_PRICE_STARTER=price_1SIPjARy2u5FNwIA8BWqWi9g
STRIPE_PRICE_PRO=price_1SIPjqRy2u5FNwIAKvxx3C79
STRIPE_PRICE_ENTERPRISE=price_1SIPkQRy2u5FNwIAwPpCKgWU

# Site URL
NEXT_PUBLIC_URL=http://localhost:3000
```

⚠️ **Important :** Si `SUPABASE_SERVICE_ROLE_KEY` manque :
1. Aller sur Supabase Dashboard → Settings → API
2. Copier la clé "service_role"
3. L'ajouter dans `.env.local`

---

### ✅ ÉTAPE 2 : Redémarrer Next.js

```bash
# Dans le terminal du serveur Next.js
Ctrl+C

# Redémarrer
npm run dev
```

Attendre que le serveur soit prêt :
```
✓ Ready in 2.5s
○ Local:        http://localhost:3000
```

---

### ✅ ÉTAPE 3 : Lancer Stripe CLI (dans un NOUVEAU terminal)

**Ouvrir un DEUXIÈME terminal** (PowerShell) et lancer :

```bash
cd C:\Users\admin\Desktop\ATLAS

stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**Tu devrais voir :**
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (^C to quit)
```

**Copier le secret** `whsec_...`

---

### ✅ ÉTAPE 4 : Mettre à jour le webhook secret

**Dans `.env.local`, remplacer :**

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Par le secret que tu viens de copier !**

---

### ✅ ÉTAPE 5 : Redémarrer Next.js (ENCORE)

```bash
# Dans le terminal Next.js
Ctrl+C

# Redémarrer
npm run dev
```

⚠️ **C'est crucial !** Next.js doit redémarrer pour charger le nouveau webhook secret.

---

### ✅ ÉTAPE 6 : Créer un compte de test (ou utiliser le tien)

**Option A : Utiliser ton compte actuel**

Juste te connecter sur `/login`

**Option B : Créer un nouveau compte de test**

1. Aller sur `/login`
2. S'inscrire avec un email de test (ex: `test@example.com`)
3. Se connecter

---

### ✅ ÉTAPE 7 : Tester un paiement COMPLET

1. **Aller sur :**
   ```
   http://localhost:3000/pricing
   ```

2. **Cliquer sur "S'abonner"** pour le plan **Pro (19€)**

3. **Sur la page Stripe Checkout, entrer :**
   - **Numéro de carte :** `4242 4242 4242 4242`
   - **Date d'expiration :** `12/34` (n'importe quelle date future)
   - **CVC :** `123`
   - **Code postal :** `12345`
   - **Nom :** `Test User`

4. **Cliquer sur "Payer"**

---

## 🔍 VÉRIFIER LES LOGS EN TEMPS RÉEL

### Terminal 1 : Next.js

Tu devrais voir **ces logs dans l'ordre** :

```
🛒 Création checkout: { user_id: 'xxx', email: 'user@email.com', priceId: 'price_1SIPjqRy2u5FNwIAKvxx3C79' }
✅ Customer existant trouvé: cus_TFLX6Sa9eJqliw
   (ou)
✅ Nouveau customer créé: cus_xxxxxxxxxxxxx
✅ Profile mis à jour avec customer_id: cus_xxxxxxxxxxxxx
✅ Session Stripe créée: cs_test_xxxxxxxxxxxxx

... quelques secondes après le paiement ...

✅ Webhook reçu: checkout.session.completed evt_xxxxxxxxxxxxx
💳 Checkout complété: { customerId: 'cus_xxx', subscriptionId: 'sub_xxx' }
📊 Plan détecté: pro
✅ Profile trouvé: user@email.com
✅✅✅ PROFILE MIS À JOUR: pro ✅✅✅
```

---

### Terminal 2 : Stripe CLI

Tu devrais voir :

```
2025-01-14 12:00:00   --> checkout.session.completed [evt_1xxxxxxxxxxxxxx]
2025-01-14 12:00:01  <--  [200] POST http://localhost:3000/api/stripe/webhook [evt_1xxxxxxxxxxxxxx]
```

**✅ Code 200 = Succès !**  
**❌ Code 404 = Le webhook n'existe pas (problème d'URL)**  
**❌ Code 400 = Signature invalide (mauvais webhook secret)**

---

## 🎯 VÉRIFICATIONS FINALES

### 1. Vérifier dans Supabase

**Supabase Dashboard → Table Editor → profiles**

Chercher ton utilisateur et vérifier :

| Colonne | Valeur attendue | Status |
|---------|-----------------|--------|
| `email` | `user@email.com` | ℹ️ |
| `subscription_tier` | `pro` | ✅ |
| `templates_limit` | `40` | ✅ |
| `templates_used` | `0` | ✅ |
| `stripe_customer_id` | `cus_TFLX6Sa9eJqliw` | ✅ |
| `stripe_subscription_id` | `sub_xxxxxxxxxxxxx` | ✅ |
| `updated_at` | Date récente | ✅ |

---

### 2. Vérifier sur la page /admin

**Aller sur :**
```
http://localhost:3000/admin
```

**Tu devrais voir AUTOMATIQUEMENT (sans cliquer sur "Synchroniser") :**

```
┌─────────────────────────────────┐
│ Informations actuelles          │
├─────────────────────────────────┤
│ User ID: xxx-xxx-xxx            │
│ Email: user@email.com           │
│ Plan: PRO ✅ (en vert/bleu)     │
│ Templates: 0 / 40 ✅            │
│ Nom entreprise: (aucun)         │
└─────────────────────────────────┘
```

**Si tu vois "Plan : PRO" et "0 / 40" → C'EST RÉPARÉ !** 🎉

---

### 3. Vérifier l'API stats

Dans le navigateur, aller sur :
```
http://localhost:3000/api/user/stats
```

**Résultat attendu :**
```json
{
  "used": 0,
  "limit": 40,
  "tier": "pro"
}
```

---

### 4. Vérifier dans les logs de la console navigateur (F12)

**Console navigateur :**
```
🔄 Rafraîchissement des données utilisateur...
📊 Stats récupérées depuis API: { used: 0, limit: 40, tier: 'pro' }
✅ Données mises à jour: { tier: 'pro', used: 0, limit: 40 }
```

---

## 🆘 TROUBLESHOOTING

### Problème : Code 404 dans Stripe CLI

```
2025-01-14 12:00:00  <--  [404] POST http://localhost:3000/api/stripe/webhook
```

**Solution :**
- Vérifier que le fichier `app/api/stripe/webhook/route.ts` existe
- Redémarrer Next.js
- Vérifier l'URL : doit être `/api/stripe/webhook` (pas `/api/webhooks/stripe`)

---

### Problème : Code 400 "Invalid signature"

```
❌ Signature invalide: No signatures found matching the expected signature for payload
```

**Solution :**
1. Vérifier que `STRIPE_WEBHOOK_SECRET` dans `.env.local` correspond au secret affiché par Stripe CLI
2. Redémarrer Next.js après avoir modifié `.env.local`

---

### Problème : Le plan reste "FREE" après paiement

**Diagnostic :**

1. **Vérifier les logs Next.js :**
   - Si tu ne vois PAS `✅ Webhook reçu:` → Le webhook n'arrive pas
   - Si tu vois `❌ Profile non trouvé` → Le profile n'existe pas dans Supabase
   - Si tu vois `❌ Erreur update:` → Problème RLS ou service_role_key

2. **Vérifier Supabase :**
   - Table Editor → profiles
   - Chercher ton email
   - Vérifier que le profile existe

3. **Forcer la sync :**
   - Sur `/admin`, cliquer sur "🔄 Synchroniser mon abonnement"

---

### Problème : "Profile non trouvé"

**Logs :**
```
🔍 Recherche par user_id
🔍 Recherche par email: user@email.com
❌ Profile non trouvé
```

**Solution :**
1. Vérifier que le profile existe dans Supabase
2. Vérifier que l'email correspond exactement
3. Créer le profile manuellement si besoin :

```sql
INSERT INTO profiles (id, email, subscription_tier, templates_limit, templates_used)
VALUES (
  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',  -- User ID de auth.users
  'user@email.com',
  'free',
  3,
  0
);
```

---

## 📊 ARCHITECTURE FINALE

```
┌──────────────────┐
│   User paie      │
│   sur Stripe     │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────┐
│  Stripe envoie webhook           │
│  checkout.session.completed      │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  Next.js reçoit sur              │
│  /api/stripe/webhook             │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  Webhook cherche profile :       │
│  1. Par stripe_customer_id       │
│  2. Par client_reference_id      │
│  3. Par email                    │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  Update avec service_role_key :  │
│  subscription_tier = 'pro'       │
│  stripe_customer_id = 'cus_...'  │
│  stripe_subscription_id = 'sub'  │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  Trigger Supabase automatique :  │
│  templates_limit = 40            │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  UserContext récupère via API    │
│  /api/user/stats                 │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  Page /admin affiche :           │
│  Plan: PRO                       │
│  Templates: 0 / 40               │
│  AUTOMATIQUEMENT !               │
└──────────────────────────────────┘
```

---

## 🎯 COMMANDES COMPLÈTES

### Terminal 1 : Serveur Next.js

```powershell
cd C:\Users\admin\Desktop\ATLAS
npm run dev
```

---

### Terminal 2 : Stripe CLI

```powershell
cd C:\Users\admin\Desktop\ATLAS
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**Copier le `whsec_...` dans `.env.local`**

**Redémarrer Next.js dans Terminal 1 !**

---

### Test : Paiement

```
1. http://localhost:3000/pricing
2. Cliquer "S'abonner" sur PRO
3. Carte: 4242 4242 4242 4242
4. Date: 12/34
5. CVC: 123
6. Payer
```

---

## ✅ RÉSULTAT ATTENDU

### Logs Terminal 1 (Next.js) :

```
🛒 Création checkout: { user_id: 'xxx', email: 'user@email.com' }
✅ Customer existant trouvé: cus_TFLX6Sa9eJqliw
✅ Profile mis à jour avec customer_id: cus_TFLX6Sa9eJqliw
✅ Session Stripe créée: cs_test_xxxxxxxxxxxxx

... après paiement ...

✅ Webhook reçu: checkout.session.completed evt_xxxxxxxxxxxxx
💳 Checkout complété: { customerId: 'cus_xxx', subscriptionId: 'sub_xxx' }
📊 Plan détecté: pro
✅ Profile trouvé: user@email.com
✅✅✅ PROFILE MIS À JOUR: pro ✅✅✅
```

---

### Logs Terminal 2 (Stripe CLI) :

```
2025-10-16 16:35:00   --> checkout.session.completed [evt_1xxxxxxxxxxxxxx]
2025-10-16 16:35:01  <--  [200] POST http://localhost:3000/api/stripe/webhook [evt_1xxxxxxxxxxxxxx]
```

**✅ [200] = SUCCÈS !**

---

### Page /admin :

**Aller sur** `http://localhost:3000/admin`

**Tu dois voir :**
- **Plan : PRO** ✅
- **Templates : 0 / 40** ✅

**SANS avoir cliqué sur "Synchroniser" !**

---

## 🔥 SI ÇA NE MARCHE PAS

### Check 1 : Le webhook est-il actif ?

**Dans Terminal 2 (Stripe CLI), tu devrais voir :**
```
> Ready! Your webhook signing secret is whsec_xxx (^C to quit)
```

**Si tu ne vois rien ou une erreur :**
```bash
# Réinstaller Stripe CLI
scoop uninstall stripe
scoop install stripe

# Reconnecter
stripe login

# Relancer
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

### Check 2 : Le webhook reçoit-il les événements ?

**Faire un test simple :**

```bash
# Dans un 3ème terminal
stripe trigger checkout.session.completed
```

**Dans Terminal 2 (Stripe CLI), tu devrais voir :**
```
--> checkout.session.completed [evt_test_xxx]
<-- [200] POST http://localhost:3000/api/stripe/webhook
```

**Si code 404 :**
- Le fichier n'existe pas ou Next.js n'a pas redémarré
- Vérifier : `app/api/stripe/webhook/route.ts`

**Si code 400 :**
- Mauvais webhook secret dans `.env.local`

---

### Check 3 : Le profile existe-t-il dans Supabase ?

**Supabase Dashboard → Table Editor → profiles**

Chercher ton email. Si le profile n'existe pas, créer un trigger pour le créer automatiquement :

```sql
-- Trigger pour créer un profile automatiquement quand un user s'inscrit
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, subscription_tier, templates_limit, templates_used)
  VALUES (
    NEW.id,
    NEW.email,
    'free',
    3,
    0
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

## 📋 CHECKLIST COMPLÈTE

### Avant le test :
- [ ] `.env.local` contient `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `.env.local` contient `STRIPE_WEBHOOK_SECRET`
- [ ] Fichier `app/api/stripe/webhook/route.ts` existe
- [ ] Terminal 1 : Next.js en cours (`npm run dev`)
- [ ] Terminal 2 : Stripe CLI en cours (`stripe listen --forward-to localhost:3000/api/stripe/webhook`)

### Pendant le test :
- [ ] Paiement effectué avec carte `4242 4242 4242 4242`
- [ ] Terminal 2 affiche `[200]` (pas 404 ou 400)
- [ ] Terminal 1 affiche `✅✅✅ PROFILE MIS À JOUR: pro`

### Après le test :
- [ ] Supabase : `subscription_tier = 'pro'` ✅
- [ ] Supabase : `templates_limit = 40` ✅
- [ ] `/admin` : Affiche "Plan : PRO" ✅
- [ ] `/admin` : Affiche "0 / 40" ✅
- [ ] `/api/user/stats` : Retourne `{"used":0,"limit":40,"tier":"pro"}` ✅

---

## 🎉 SUCCÈS FINAL

Si tous les checks sont verts, tu devrais voir :

```
┌──────────────────────────────────────┐
│  🎉 WEBHOOK STRIPE FONCTIONNEL !     │
├──────────────────────────────────────┤
│  ✅ Paiement → Plan PRO automatique  │
│  ✅ Plus besoin de synchroniser      │
│  ✅ Mise à jour en temps réel        │
└──────────────────────────────────────┘
```

---

**Teste maintenant et dis-moi ce que tu vois dans les logs !** 🚀

