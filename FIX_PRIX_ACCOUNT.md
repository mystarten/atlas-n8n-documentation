# ✅ CORRECTION DES PRIX SUR LA PAGE /account

## 🔴 PROBLÈME CORRIGÉ

La page `/account` affichait des prix **incorrects** dans la modal "Gérer mon abonnement" :

| Plan | Prix affiché (incorrect) | Prix réel (corrigé) |
|------|-------------------------|---------------------|
| **Starter** | 14.99€/mois ❌ | **9.99€/mois** ✅ |
| **Pro** | 39.99€/mois ❌ | **19.99€/mois** ✅ |
| **Enterprise** | 99.99€/mois ❌ | **49.99€/mois** ✅ |

---

## 📝 CORRECTIONS APPLIQUÉES

### ✅ 1. **`components/SubscriptionModal.tsx`** (CORRIGÉ)

**Lignes 23-42 :**

**AVANT (prix incorrects) :**
```typescript
const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '14.99€',  // ❌ INCORRECT
    ...
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '39.99€',  // ❌ INCORRECT
    ...
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '99.99€',  // ❌ INCORRECT
    ...
  }
]
```

**APRÈS (prix corrigés) :**
```typescript
const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '9.99€',  // ✅ CORRIGÉ
    features: ['15 templates/mois', 'Format PDF', 'Support email', 'Claude Sonnet 4']
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '19.99€',  // ✅ CORRIGÉ
    features: ['40 templates/mois', 'PDF + Notes N8N', 'Sans watermark', 'Support prioritaire', 'Claude Sonnet 4']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '49.99€',  // ✅ CORRIGÉ
    features: ['Templates illimités', 'Branding personnalisé', 'Sans watermark', 'Support 24/7', 'Claude Sonnet 4.5']
  }
]
```

**Bonus :** Mise à jour des modèles IA mentionnés (Claude Sonnet 4 au lieu de 3.5 Haiku)

---

### ✅ 2. **`app/api/stripe/portal/route.ts`** (CRÉÉ)

**Nouveau endpoint pour gérer l'abonnement via Stripe Billing Portal :**

**Fonctionnalités :**
- Récupère le `stripe_customer_id` du profile
- Crée une session du portail de facturation Stripe
- Redirige l'utilisateur vers le portail Stripe officiel

**Utilisation :**
```typescript
const handleManageSubscription = async () => {
  const res = await fetch('/api/stripe/portal', { method: 'POST' })
  const data = await res.json()
  if (data.url) {
    window.location.href = data.url  // Redirige vers Stripe
  }
}
```

**Sur le portail Stripe, l'utilisateur peut :**
- ✅ Voir son abonnement actuel
- ✅ Changer de plan
- ✅ Mettre à jour sa carte de paiement
- ✅ Annuler son abonnement
- ✅ Voir l'historique des factures

---

## 🧪 TESTER LES CORRECTIONS

### **Test 1 : Vérifier les prix dans la modal**

1. **Aller sur :**
   ```
   http://localhost:3000/account
   ```

2. **Cliquer sur le bouton "Gérer mon abonnement"**

3. **Vérifier les prix affichés dans la modal :**

   | Plan | Prix affiché |
   |------|--------------|
   | **Starter** | **9.99€**/mois ✅ |
   | **Pro** | **19.99€**/mois ✅ |
   | **Enterprise** | **49.99€**/mois ✅ |

**✅ Si tu vois les bons prix → Modal corrigée !**

---

### **Test 2 : Tester le bouton "Gérer mon abonnement"**

**Note :** Ce test nécessite un abonnement Stripe actif.

1. **Sur `/account`, cliquer "Gérer mon abonnement"**

2. **Tu seras redirigé vers le Stripe Billing Portal**

3. **Tu devrais voir :**
   - Ton plan actuel (Starter/Pro/Enterprise)
   - Tes factures
   - Options pour mettre à jour la carte
   - Option pour annuler

4. **Après modification sur Stripe, cliquer "Retour au site"**

5. **Tu reviens sur `/account` avec les données mises à jour**

---

## 📊 TABLEAU RÉCAPITULATIF DES PRIX

### Prix corrigés PARTOUT :

| Plan | Prix mensuel | Templates | Disponible sur |
|------|--------------|-----------|----------------|
| **Free** | 0€ | 3/mois | Toutes les pages |
| **Starter** | **9.99€** ✅ | 15/mois | `/pricing`, `/account` modal |
| **Pro** | **19.99€** ✅ | 40/mois | `/pricing`, `/account` modal |
| **Enterprise** | **49.99€** ✅ | Illimité | `/pricing`, `/account` modal |

---

## 🔗 STRIPE BILLING PORTAL

### Avantages du portail Stripe :

✅ **Interface officielle Stripe** (sécurisée et conforme)  
✅ **Gestion complète** (changement plan, paiement, annulation)  
✅ **Historique des factures** téléchargeables  
✅ **Mise à jour des informations** de paiement  
✅ **Retour automatique** vers votre site après action  

### Configuration requise :

**Stripe Dashboard → Settings → Billing → Customer Portal**

Activer les options :
- ✅ Invoice history
- ✅ Update payment method
- ✅ Cancel subscription
- ✅ Update subscription (changement de plan)

**Return URL par défaut :**
```
http://localhost:3000/account  (local)
https://votre-domaine.com/account  (production)
```

---

## 🎯 FLOW COMPLET

```
User clique "Gérer mon abonnement" sur /account
              ↓
    POST /api/stripe/portal
              ↓
    Récupère stripe_customer_id depuis profiles
              ↓
    Crée session billing portal Stripe
              ↓
    Redirige vers https://billing.stripe.com/p/session/...
              ↓
    User modifie son abonnement sur Stripe
              ↓
    Webhook checkout.session.completed envoyé
              ↓
    Profile mis à jour dans Supabase
              ↓
    User clique "Retour au site"
              ↓
    Retourne sur /account avec nouvelles données ✅
```

---

## 📋 VÉRIFICATIONS

### Check 1 : Prix dans la modal

**Sur `/account` → "Gérer mon abonnement" → Vérifier :**

- Starter : **9.99€** ✅ (pas 14.99€)
- Pro : **19.99€** ✅ (pas 39.99€)
- Enterprise : **49.99€** ✅ (pas 99.99€)

---

### Check 2 : Prix sur la page /pricing

**Aller sur `/pricing` et vérifier que les prix correspondent :**

```
Starter : 9.99€/mois ✅
Pro : 19.99€/mois ✅
Enterprise : 49.99€/mois ✅
```

**Si les prix sont différents entre `/pricing` et `/account` → Il y a une incohérence !**

---

### Check 3 : Prix dans Stripe Dashboard

**Stripe Dashboard → Products → Vérifier :**

| Produit | Price ID | Prix |
|---------|----------|------|
| **Starter** | `price_1SIPjARy2u5FNwIA8BWqWi9g` | **$9.99** USD ou **9.99€** EUR |
| **Pro** | `price_1SIPjqRy2u5FNwIAKvxx3C79` | **$19.99** USD ou **19.99€** EUR |
| **Enterprise** | `price_1SIPkQRy2u5FNwIAwPpCKgWU` | **$49.99** USD ou **49.99€** EUR |

**⚠️ Si les prix sur Stripe ne correspondent pas :**
1. Créer de nouveaux "Prices" dans Stripe Dashboard
2. Mettre à jour les `STRIPE_PRICE_XXX` dans `.env.local`

---

## ⚠️ ATTENTION : COHÉRENCE DES PRIX

Assure-toi que les prix sont **IDENTIQUES** partout :

| Emplacement | Starter | Pro | Enterprise |
|-------------|---------|-----|------------|
| `app/pricing/page.tsx` | 9.99€ | 19.99€ | 49.99€ |
| `components/SubscriptionModal.tsx` | 9.99€ ✅ | 19.99€ ✅ | 49.99€ ✅ |
| Stripe Dashboard Products | 9.99€ | 19.99€ | 49.99€ |
| `.env.local` Price IDs | Correspond | Correspond | Correspond |

**Toute incohérence causera des problèmes de paiement !**

---

## 🆘 SI LES PRIX SONT INCORRECTS SUR STRIPE

### Créer de nouveaux "Prices" :

1. **Stripe Dashboard → Products**
2. **Pour chaque produit (Starter, Pro, Enterprise) :**
   - Cliquer sur le produit
   - Section "Pricing" → Cliquer "Add another price"
   - Prix : `9.99` EUR (ou USD)
   - Récurrence : `Monthly`
   - Cliquer "Add price"
3. **Copier le nouveau Price ID** (commence par `price_`)
4. **Mettre à jour `.env.local` :**
   ```bash
   STRIPE_PRICE_STARTER=price_NOUVEAU_ID
   STRIPE_PRICE_PRO=price_NOUVEAU_ID
   STRIPE_PRICE_ENTERPRISE=price_NOUVEAU_ID
   ```
5. **Redémarrer Next.js**

---

## 📋 CHECKLIST

- [ ] Prix corrigés dans `components/SubscriptionModal.tsx`
- [ ] API `/api/stripe/portal` créée
- [ ] Serveur Next.js redémarré
- [ ] Page `/account` → "Gérer mon abonnement" affiche prix corrects
- [ ] Prix cohérents avec `/pricing`
- [ ] Prix cohérents avec Stripe Dashboard

---

## 🎯 RÉSULTAT FINAL

### AVANT (prix incorrects) :

```
Page /account → "Gérer mon abonnement" :
- Starter : 14.99€/mois ❌
- Pro : 39.99€/mois ❌
- Enterprise : 99.99€/mois ❌
```

### APRÈS (prix corrigés) :

```
Page /account → "Gérer mon abonnement" :
- Starter : 9.99€/mois ✅
- Pro : 19.99€/mois ✅
- Enterprise : 49.99€/mois ✅
```

---

**Redémarre le serveur et vérifie que les prix sont corrects dans la modal !** 🚀

**Bonus :** L'API `/api/stripe/portal` est créée pour rediriger vers le portail Stripe officiel ! 🎉

