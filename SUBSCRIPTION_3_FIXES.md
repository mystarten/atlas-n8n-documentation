# 🔧 CORRECTIONS DE LA GESTION DES ABONNEMENTS

## ✅ 3 problèmes corrigés : 16 octobre 2025

---

## 🐛 PROBLÈME 1 : Version incorrecte de Claude dans la modal

### **Diagnostic**
La modal affichait "Claude 4" pour le plan Starter, ce qui est incomplet.

### **Correction**
**Fichier :** `components/SubscriptionModal.tsx` (ligne 28)

**AVANT :**
```typescript
features: ['15 templates/mois', 'Format PDF', 'Support email', 'Claude 4']
```

**APRÈS :**
```typescript
features: ['15 templates/mois', 'Format PDF', 'Support email', 'Claude Sonnet 3.5 Haiku']
```

### **Modèles IA par plan (version finale)**

| Plan | Modèle IA |
|------|-----------|
| **Free** | Claude 3.5 Haiku |
| **Starter** | Claude Sonnet 3.5 Haiku |
| **Pro** | Claude Opus 4.1 |
| **Enterprise** | Claude Sonnet 4.5 |

**Status :** ✅ Corrigé

---

## 🔘 PROBLÈME 2 : Deux boutons "Gérer mon abonnement"

### **Diagnostic**
Deux boutons identiques apparaissaient :
1. Dans `SubscriptionStatus` (composant en haut)
2. Dans la section "Votre Abonnement" (section en bas)

### **Correction**

#### **1. SubscriptionStatus.tsx**
**Action :** Bouton et modal **supprimés**

**AVANT :**
```tsx
<button onClick={() => setModalOpen(true)}>
  Gérer mon abonnement
</button>

<SubscriptionModal ... />
```

**APRÈS :**
```tsx
// ✅ Bouton et modal supprimés
// Le composant affiche uniquement les infos
```

#### **2. app/account/page.tsx**
**Action :** Bouton **conservé** et **modifié** pour ouvrir la modal

**AVANT :**
```tsx
<button onClick={handleManageSubscription}>
  {isLoadingPortal ? 'Chargement...' : 'Gérer mon abonnement'}
</button>
```

**APRÈS :**
```tsx
<button onClick={() => setModalOpen(true)}>
  Gérer mon abonnement
</button>

{/* Modal intégrée en fin de page */}
<SubscriptionModal
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  currentPlan={tier}
  cancelAtPeriodEnd={cancelAtPeriodEnd}
/>
```

### **Modifications app/account/page.tsx**
- ✅ Import de `SubscriptionModal` ajouté (ligne 8)
- ✅ État `modalOpen` ajouté (ligne 20)
- ✅ État `cancelAtPeriodEnd` ajouté (ligne 21)
- ✅ Chargement de `cancelAtPeriodEnd` depuis l'API (lignes 72-81)
- ✅ Bouton modifié pour ouvrir la modal (ligne 230)
- ✅ Modal intégrée en fin de page (lignes 387-392)

**Status :** ✅ Corrigé

---

## ⚖️ PROBLÈME 3 : Logique upgrade/downgrade incorrecte

### **Diagnostic**
Tous les changements de plan utilisaient Stripe Checkout, même pour les downgrades.

**AVANT (incorrect) :**
- Upgrade (Starter → Pro) : Checkout ✅
- Downgrade (Enterprise → Pro) : Checkout ❌ (paiement immédiat incorrect)

**APRÈS (correct) :**
- Upgrade (Starter → Pro) : Checkout avec prorata ✅
- Downgrade (Enterprise → Pro) : Schedule pour prochaine période ✅

### **Correction**

#### **Nouveau fichier créé :** `app/api/stripe/change-plan/route.ts`

**Fonctionnement :**

```typescript
// 1. Récupération de l'utilisateur et son abonnement actuel

// 2. Détermination upgrade vs downgrade
const planHierarchy = { free: 0, starter: 1, pro: 2, enterprise: 3 }
const isUpgrade = newLevel > currentLevel

// 3. Logique différenciée
if (isUpgrade) {
  // ✅ UPGRADE : Stripe Checkout avec prorata
  return createCheckoutSession(customerId, newPlan, true)
} else {
  // ✅ DOWNGRADE : Subscription Schedule
  return scheduleDowngrade(subscriptionId, newPlan)
}
```

#### **Fonction `createCheckoutSession()`**
- Créer une session Stripe Checkout
- Paramètre `proration_behavior: 'always_invoice'` pour les upgrades
- Redirection vers success_url après paiement

#### **Fonction `scheduleDowngrade()`**
- Créer un Subscription Schedule
- Phase 1 : Plan actuel jusqu'à `current_period_end`
- Phase 2 : Nouveau plan à partir de `current_period_end`
- Retourne la date d'effet

### **Modification handleChangePlan dans SubscriptionModal.tsx**

**AVANT :**
```tsx
const handleChangePlan = async (newPlan: string) => {
  window.location.href = `/pricing?plan=${newPlan}`
}
```

**APRÈS :**
```tsx
const handleChangePlan = async (newPlan: string) => {
  const res = await fetch('/api/stripe/change-plan', {
    method: 'POST',
    body: JSON.stringify({ new_plan: newPlan })
  })
  
  const data = await res.json()
  
  if (data.checkout_url) {
    // ✅ UPGRADE → Redirection Stripe Checkout
    window.location.href = data.checkout_url
  } else {
    // ✅ DOWNGRADE → Alert + Reload
    alert(`✅ Changement programmé pour le ${date} !`)
    window.location.reload()
  }
}
```

**Status :** ✅ Corrigé

---

## 📊 COMPORTEMENTS ATTENDUS

### **Scénario 1 : Upgrade (Starter → Pro)**
```
1. Utilisateur clique "Choisir ce plan" (Pro)
2. API détecte : upgrade (niveau 1 → 2)
3. → Création Stripe Checkout avec prorata
4. → Redirection vers Stripe
5. → Utilisateur paie la différence (prorata)
6. → Accès immédiat au plan Pro
```

### **Scénario 2 : Downgrade (Enterprise → Pro)**
```
1. Utilisateur clique "Choisir ce plan" (Pro)
2. API détecte : downgrade (niveau 3 → 2)
3. → Création Subscription Schedule
4. → Alert : "Changement programmé pour le 1 novembre 2025"
5. → Pas de paiement immédiat
6. → Changement effectif à la prochaine période
7. → Utilisateur garde Enterprise jusqu'à la fin
```

### **Scénario 3 : Annulation**
```
1. Utilisateur clique "Annuler mon abonnement"
2. Écran de confirmation (😢)
3. Utilisateur clique "Oui, annuler"
4. → API Call POST /api/cancel-subscription
5. → subscription.update({ cancel_at_period_end: true })
6. → Alert : "Abonnement annulé. Accès jusqu'à la fin de période."
7. → Reload page
8. → Badge "Annulation prévue" visible
```

---

## 🧪 TESTS À EFFECTUER

### **Test 1 : Vérifier versions Claude**
```bash
1. Aller sur /account
2. Cliquer "Gérer mon abonnement"
3. Vérifier la modal :
   ✅ Starter : "Claude Sonnet 3.5 Haiku"
   ✅ Pro : "Claude Opus 4.1"
   ✅ Enterprise : "Claude Sonnet 4.5"
```

### **Test 2 : Vérifier bouton unique**
```bash
1. Aller sur /account
2. Compter les boutons "Gérer mon abonnement"
   ✅ Doit y en avoir UN SEUL (dans "Votre Abonnement")
   ❌ Ne doit PAS y en avoir dans "Informations d'abonnement"
```

### **Test 3 : Tester upgrade (Starter → Pro)**
```bash
1. Compte Starter
2. Cliquer "Gérer mon abonnement"
3. Cliquer "Choisir ce plan" (Pro)
   ✅ Redirection vers Stripe Checkout
   ✅ Montant affiché : différence avec prorata
   ✅ Après paiement : Accès immédiat au plan Pro
```

### **Test 4 : Tester downgrade (Enterprise → Pro)**
```bash
1. Compte Enterprise
2. Cliquer "Gérer mon abonnement"
3. Cliquer "Choisir ce plan" (Pro)
   ✅ Alert : "Changement vers Pro programmé pour le [date]"
   ✅ PAS de redirection Stripe
   ✅ Reload de la page
   ✅ Alerte jaune "Changement prévu" visible dans SubscriptionStatus
```

### **Test 5 : Tester annulation**
```bash
1. Compte Starter/Pro/Enterprise
2. Cliquer "Gérer mon abonnement"
3. Scroll en bas, cliquer "Annuler mon abonnement"
   ✅ Écran de confirmation (😢)
4. Cliquer "Oui, annuler"
   ✅ Alert : "Abonnement annulé. Accès jusqu'à la fin de période."
   ✅ Reload de la page
   ✅ Badge "Annulation prévue" visible
```

---

## 📁 FICHIERS CRÉÉS/MODIFIÉS

| Fichier | Action | Lignes |
|---------|--------|--------|
| `app/api/stripe/change-plan/route.ts` | ✅ Créé | ~140 |
| `components/SubscriptionModal.tsx` | ✅ Modifié | 3 |
| `components/SubscriptionStatus.tsx` | ✅ Modifié | -15 |
| `app/account/page.tsx` | ✅ Modifié | +15 |

---

## 🔧 LOGIQUE TECHNIQUE

### **Détection upgrade/downgrade**

```typescript
const planHierarchy = { 
  free: 0, 
  starter: 1, 
  pro: 2, 
  enterprise: 3 
}

const currentLevel = planHierarchy[currentPlan]
const newLevel = planHierarchy[newPlan]

const isUpgrade = newLevel > currentLevel
```

### **Upgrade → Stripe Checkout**

```typescript
const session = await stripe.checkout.sessions.create({
  customer: customerId,
  mode: 'subscription',
  line_items: [{ price: priceIds[newPlan], quantity: 1 }],
  subscription_data: {
    proration_behavior: 'always_invoice'  // ✅ Prorata immédiat
  },
  success_url: '/account?upgrade=success',
  cancel_url: '/account'
})

return { checkout_url: session.url }
```

### **Downgrade → Subscription Schedule**

```typescript
const schedule = await stripe.subscriptionSchedules.create({
  from_subscription: subscriptionId
})

await stripe.subscriptionSchedules.update(schedule.id, {
  phases: [
    {
      // Phase actuelle jusqu'à current_period_end
      items: currentItems,
      start_date: current_period_start,
      end_date: current_period_end
    },
    {
      // Nouvelle phase à partir de current_period_end
      items: [{ price: priceIds[newPlan], quantity: 1 }],
      start_date: current_period_end
    }
  ]
})

return { 
  success: true, 
  effective_date: current_period_end 
}
```

---

## 📊 TABLEAU RÉCAPITULATIF

| Changement | Type | Méthode | Paiement immédiat | Accès immédiat |
|------------|------|---------|-------------------|----------------|
| Free → Starter | Upgrade | Checkout | ✅ Oui | ✅ Oui |
| Starter → Pro | Upgrade | Checkout | ✅ Oui (prorata) | ✅ Oui |
| Pro → Enterprise | Upgrade | Checkout | ✅ Oui (prorata) | ✅ Oui |
| Enterprise → Pro | Downgrade | Schedule | ❌ Non | ❌ Fin de période |
| Pro → Starter | Downgrade | Schedule | ❌ Non | ❌ Fin de période |
| Starter → Free | Downgrade | Schedule | ❌ Non | ❌ Fin de période |

---

## 🎯 RÉSUMÉ DES CORRECTIONS

### **1. Modèle Claude dans la modal**
- ✅ Starter : "Claude Sonnet 3.5 Haiku" (modèle léger et rapide)
- ✅ Pro : "Claude Opus 4.1" (déjà correct)
- ✅ Enterprise : "Claude Sonnet 4.5" (top modèle)

### **2. Bouton doublon**
- ✅ Supprimé de `SubscriptionStatus` (en haut)
- ✅ Conservé dans "Votre Abonnement" (en bas)
- ✅ Modal intégrée dans `app/account/page.tsx`

### **3. Logique upgrade/downgrade**
- ✅ Route API `/api/stripe/change-plan` créée
- ✅ Upgrade → Stripe Checkout avec prorata
- ✅ Downgrade → Subscription Schedule (prochaine période)
- ✅ `handleChangePlan` mis à jour dans la modal

---

## 🔍 VARIABLES D'ENVIRONNEMENT NÉCESSAIRES

Vérifier que ces variables sont définies dans `.env.local` :

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_ENTERPRISE=price_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 📝 CHECKLIST DE VALIDATION

- [x] Problème 1 : Versions Claude corrigées
- [x] Problème 2 : Bouton doublon supprimé
- [x] Problème 3 : API upgrade/downgrade créée
- [x] Linting : Aucune erreur
- [x] TypeScript : Aucune erreur de typage
- [x] Documentation : Ce fichier créé

---

## 🚀 PROCHAINES ÉTAPES

1. **Tester les 5 scénarios** décrits ci-dessus
2. **Vérifier les webhooks Stripe** pour la synchronisation
3. **Configurer les Price IDs** dans les variables d'environnement
4. **Tester en production** avec de vrais paiements

---

## 💡 AMÉLIORATIONS FUTURES

- [ ] Afficher le montant du prorata avant redirection Checkout
- [ ] Ajouter un loader pendant l'appel API
- [ ] Envoyer un email de confirmation lors du downgrade
- [ ] Analytics pour tracker les conversions

---

**Date :** 16 octobre 2025  
**Fichiers modifiés :** 4  
**Lignes changées :** ~150  
**Status :** ✅ Prêt pour tests

