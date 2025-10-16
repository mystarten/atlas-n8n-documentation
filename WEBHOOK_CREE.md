# ✅ WEBHOOK CRÉÉ AU BON EMPLACEMENT

## 🎯 FICHIER CRÉÉ

Le webhook Stripe a été créé à l'emplacement **EXACT** requis :

```
app/api/stripe/webhook/route.ts
```

**URL du webhook :**
```
http://localhost:3000/api/stripe/webhook
```

---

## ⚠️ ATTENTION : DEUX WEBHOOKS EXISTENT MAINTENANT

### 1. `app/api/webhooks/stripe/route.ts` (ancien emplacement)

URL : `http://localhost:3000/api/webhooks/stripe`

### 2. `app/api/stripe/webhook/route.ts` (nouveau - CORRECT)

URL : `http://localhost:3000/api/stripe/webhook`

**→ Utiliser le NOUVEAU (`/api/stripe/webhook`) pour les tests et la production !**

---

## 🧪 TESTER MAINTENANT

### **ÉTAPE 1 : Redémarrer Next.js**

```bash
# Arrêter le serveur
Ctrl+C

# Redémarrer
npm run dev
```

---

### **ÉTAPE 2 : Configurer Stripe CLI avec la bonne URL**

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**Note le changement :** `/api/stripe/webhook` (pas `/api/webhooks/stripe`)

**Tu verras :**
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxxx
```

**Copier** le `whsec_...` dans `.env.local` :

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxx
```

---

### **ÉTAPE 3 : Redémarrer Next.js (encore)**

```bash
Ctrl+C
npm run dev
```

---

### **ÉTAPE 4 : Tester un paiement**

1. Aller sur `http://localhost:3000/pricing`
2. Cliquer sur "S'abonner" pour **Pro**
3. Carte de test : `4242 4242 4242 4242`, `12/34`, `123`
4. Compléter le paiement

---

## 🔍 LOGS ATTENDUS

### Dans le terminal Stripe CLI :

```
2025-01-14 12:00:00   --> checkout.session.completed [evt_xxx]
2025-01-14 12:00:00  <--  [200] POST http://localhost:3000/api/stripe/webhook [evt_xxx]
```

**✅ Code 200 = Le webhook fonctionne !**  
**❌ Code 404 = Le webhook n'existe pas (mauvaise URL)**

---

### Dans le terminal Next.js :

```
✅ Webhook reçu: checkout.session.completed evt_xxxxxxxxxxxxx
💳 Checkout complété: { customerId: 'cus_xxx', subscriptionId: 'sub_xxx' }
📊 Plan détecté: pro
✅ Profile trouvé: user@email.com
✅✅✅ PROFILE MIS À JOUR: pro ✅✅✅
```

**Si tu vois ces logs → Le webhook fonctionne parfaitement !** 🎉

---

## 🎯 VÉRIFICATION

### 1. Vérifier dans Supabase

**Supabase Dashboard → Table Editor → profiles**

Ton utilisateur doit avoir :
- `subscription_tier` = `pro` ✅
- `templates_limit` = `40` ✅
- `stripe_customer_id` = `cus_xxx...` ✅
- `stripe_subscription_id` = `sub_xxx...` ✅

---

### 2. Vérifier sur /admin

**Aller sur :**
```
http://localhost:3000/admin
```

**Tu devrais voir IMMÉDIATEMENT (sans cliquer sur Synchroniser) :**

- **Plan :** PRO ✅
- **Templates :** 0 / 40 ✅

---

### 3. Vérifier l'API stats

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

## 📋 URL CORRECTE POUR STRIPE

### Développement local :

```
http://localhost:3000/api/stripe/webhook
```

**Stripe CLI :**
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Production :

```
https://votre-domaine.com/api/stripe/webhook
```

**Stripe Dashboard → Webhooks → Add endpoint :**
```
URL: https://votre-domaine.com/api/stripe/webhook
```

---

## 🗑️ NETTOYER L'ANCIEN WEBHOOK (optionnel)

Si tu veux, tu peux supprimer l'ancien fichier pour éviter la confusion :

```
app/api/webhooks/stripe/route.ts  ← Ancien (peut être supprimé)
app/api/stripe/webhook/route.ts   ← Nouveau (à utiliser)
```

---

## ✅ CHECKLIST

- [ ] Fichier créé à `app/api/stripe/webhook/route.ts`
- [ ] Serveur Next.js redémarré
- [ ] Stripe CLI lancé avec `--forward-to localhost:3000/api/stripe/webhook`
- [ ] Webhook secret copié dans `.env.local`
- [ ] Serveur Next.js redémarré (encore)
- [ ] Paiement de test effectué
- [ ] Logs montrent "✅✅✅ PROFILE MIS À JOUR: pro"
- [ ] Page `/admin` affiche "PRO" sans sync manuelle

---

**Le webhook est maintenant au BON emplacement et devrait fonctionner !** 🎉

**Teste maintenant avec Stripe CLI !** 🚀

