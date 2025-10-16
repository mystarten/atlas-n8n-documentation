# ✅ CORRECTION DOUBLONS D'ABONNEMENTS

## 🔴 PROBLÈME CORRIGÉ

Quand un utilisateur changeait de plan, le système créait un **NOUVEL abonnement** au lieu de **modifier l'existant**, résultant en **2 abonnements actifs** en même temps.

**Exemple du bug :**
```
User a : Pro (19.99€/mois) - Abonnement #1
User upgrade vers Enterprise
→ Système crée un NOUVEL abonnement (49.99€/mois) - Abonnement #2
→ L'user a maintenant 2 abonnements actifs ! ❌
→ Il sera facturé 19.99€ + 49.99€ = 68.98€/mois ❌
```

---

## 📝 CORRECTION APPLIQUÉE

### ✅ **`app/api/create-checkout-session/route.ts`** (CORRIGÉ)

**Nouvelle logique :**

```typescript
// 1. Récupérer le profile (avec stripe_subscription_id)
const { data: profile } = await supabaseAdmin
  .from('profiles')
  .select('stripe_customer_id, stripe_subscription_id')  // ✅ Ajouté subscription_id
  .eq('id', user.id)
  .single()

// 2. Créer/trouver le customer
// ... code existant ...

// 3. ✅ VÉRIFIER SI UN ABONNEMENT EXISTE DÉJÀ
if (profile?.stripe_subscription_id) {
  const subscription = await stripe.subscriptions.retrieve(profile.stripe_subscription_id)
  
  if (subscription.status === 'active' || subscription.status === 'trialing') {
    // ✅ MODIFIER L'ABONNEMENT EXISTANT
    const updated = await stripe.subscriptions.update(subscription.id, {
      items: [{
        id: subscription.items.data[0].id,
        price: priceId  // Nouveau prix
      }],
      proration_behavior: 'create_prorations',  // Créer des prorata
      billing_cycle_anchor: 'unchanged'  // Garder la date de facturation
    })
    
    // Mettre à jour Supabase immédiatement
    await supabaseAdmin
      .from('profiles')
      .update({ subscription_tier: newPlan })
      .eq('id', user.id)
    
    // Rediriger vers /account (pas vers checkout)
    return NextResponse.json({
      url: `/account?upgraded=true`
    })
  }
}

// 4. Si pas d'abonnement actif, créer un nouveau checkout
const session = await stripe.checkout.sessions.create({...})
```

**Résultat :** Plus de doublons d'abonnements ! ✅

---

## 🔄 FLUX DE CHANGEMENT DE PLAN

### AVANT (bug - doublons) :

```
User sur plan Pro (19.99€)
    ↓
Clique "Upgrade vers Enterprise"
    ↓
Checkout crée UN NOUVEL abonnement Enterprise (49.99€)
    ↓
User a maintenant 2 abonnements :
  - Pro : 19.99€/mois ❌
  - Enterprise : 49.99€/mois ❌
    ↓
Facturé 68.98€/mois au total ❌
```

### APRÈS (corrigé - modification) :

```
User sur plan Pro (19.99€)
    ↓
Clique "Upgrade vers Enterprise"
    ↓
Système DÉTECTE l'abonnement existant
    ↓
MODIFIE l'abonnement Pro → Enterprise
    ↓
Calcul du prorata :
  - Remboursement partiel de Pro
  - Facturation partielle d'Enterprise
    ↓
User a 1 seul abonnement :
  - Enterprise : 49.99€/mois ✅
    ↓
Facturé 49.99€/mois (+ ajustement prorata une fois) ✅
```

---

## 💰 GESTION DES PRORATA

Stripe gère automatiquement les prorata avec `proration_behavior: 'create_prorations'` :

### Exemple concret :

**Situation :**
- User sur Pro (19.99€/mois)
- 15 jours écoulés sur une période de 30 jours
- Upgrade vers Enterprise (49.99€/mois)

**Calcul du prorata :**
```
Remboursement Pro :
  - Payé : 19.99€
  - Utilisé : 15 jours sur 30 = 9.99€
  - Crédit : 19.99€ - 9.99€ = 10.00€

Facturation Enterprise :
  - Prix : 49.99€
  - Reste : 15 jours sur 30 = 24.99€
  - Crédit appliqué : -10.00€
  
Montant à payer maintenant : 24.99€ - 10.00€ = 14.99€
```

**Prochaine facturation (dans 15 jours) : 49.99€ complet**

---

## 🧪 TESTER LA CORRECTION

### Test 1 : Upgrade (Pro → Enterprise)

1. **Avoir un abonnement Pro actif**
   ```
   /account → Doit afficher "Plan : Pro"
   ```

2. **Aller sur `/pricing`**

3. **Cliquer "S'abonner" sur Enterprise**

4. **Logs attendus :**
   ```
   🛒 Création checkout: { priceId: 'price_1SIPkQRy2u5FNwIAwPpCKgWU' }
   ⚠️ Abonnement existant détecté: sub_xxxxxxxxxxxxx
   🔄 Modification de l'abonnement existant au lieu d'en créer un nouveau
   ✅ Abonnement modifié avec succès: sub_xxxxxxxxxxxxx
   ✅ Profile mis à jour avec nouveau plan: enterprise
   ```

5. **Redirection vers `/account?upgraded=true`**

6. **Vérifier sur Stripe Dashboard :**
   - 1 seul abonnement actif (Enterprise) ✅
   - Pas de 2ème abonnement Pro ✅
   - Invoice avec prorata créée ✅

---

### Test 2 : Downgrade (Enterprise → Starter)

1. **Avoir un abonnement Enterprise actif**

2. **Aller sur `/pricing`**

3. **Cliquer "S'abonner" sur Starter**

4. **Logs attendus :**
   ```
   ⚠️ Abonnement existant détecté
   🔄 Modification de l'abonnement existant
   ✅ Abonnement modifié avec succès
   ✅ Profile mis à jour avec nouveau plan: starter
   ```

5. **Le changement est IMMÉDIAT**

6. **Stripe calcule le prorata :**
   - Crédit pour la partie non utilisée d'Enterprise
   - Appliqué à la prochaine facture Starter

---

### Test 3 : Nouveau user (pas d'abonnement)

1. **Créer un nouveau compte**

2. **Aller sur `/pricing`**

3. **Cliquer "S'abonner" sur Pro**

4. **Logs attendus :**
   ```
   ✅ Nouveau customer créé
   ✅ Profile mis à jour avec customer_id
   ✅ Session Stripe créée
   ```

5. **Redirection vers Stripe Checkout** (paiement requis)

6. **Après paiement → Webhook crée l'abonnement**

---

## 📊 COMPARAISON AVANT/APRÈS

### AVANT (doublons) :

```sql
-- Dans Stripe Dashboard → Customers → [User] → Subscriptions

Subscription #1
  Product: Pro
  Price: $19.99/month
  Status: Active ❌

Subscription #2
  Product: Enterprise
  Price: $49.99/month
  Status: Active ❌

Total: $68.98/month ❌❌❌
```

### APRÈS (modification) :

```sql
-- Dans Stripe Dashboard → Customers → [User] → Subscriptions

Subscription #1
  Product: Enterprise
  Price: $49.99/month
  Status: Active ✅

Total: $49.99/month ✅
```

**Un seul abonnement, comme prévu !**

---

## 🔍 VÉRIFICATION DANS STRIPE DASHBOARD

**Pour vérifier qu'il n'y a pas de doublons :**

1. **Aller sur Stripe Dashboard**
2. **Customers → Chercher par email**
3. **Onglet "Subscriptions"**
4. **Vérifier qu'il y a UN SEUL abonnement "Active"**

**Si tu vois plusieurs abonnements actifs :**
- ❌ C'est un doublon (bug)
- ✅ Annuler manuellement les anciens abonnements sur Stripe
- ✅ Utiliser la nouvelle version du code (corrigée)

---

## ⚙️ OPTIONS DE MODIFICATION

### `proration_behavior` :

| Option | Comportement |
|--------|--------------|
| `create_prorations` ✅ | Crée des prorata (recommandé) |
| `none` | Pas de prorata (changement gratuit) |
| `always_invoice` | Facture immédiatement |

**On utilise `create_prorations` pour être équitable avec l'utilisateur.**

### `billing_cycle_anchor` :

| Option | Comportement |
|--------|--------------|
| `unchanged` ✅ | Garde la date de facturation actuelle |
| `now` | Change la date à aujourd'hui |

**On utilise `unchanged` pour ne pas perturber le cycle de facturation.**

---

## 🎯 RÉSULTAT FINAL

### Changement de plan maintenant :

✅ **Modification instantanée** (pas de checkout)  
✅ **Un seul abonnement** (pas de doublon)  
✅ **Prorata équitable** (calculé automatiquement)  
✅ **Même cycle de facturation** (pas de changement de date)  
✅ **Mise à jour immédiate** dans Supabase  
✅ **Redirection vers /account** (pas de paiement requis)  

---

### Premier abonnement (nouveau user) :

✅ **Checkout classique** (paiement requis)  
✅ **Customer créé** et lié au profile  
✅ **Webhook met à jour** Supabase après paiement  
✅ **Un seul abonnement** créé  

---

## 📋 CHECKLIST

- [ ] Code mis à jour dans `create-checkout-session/route.ts`
- [ ] Serveur Next.js redémarré
- [ ] Test upgrade : Pas de doublon dans Stripe
- [ ] Test downgrade : Modification instantanée
- [ ] Test nouveau user : Checkout fonctionne
- [ ] Vérification Stripe : 1 seul abonnement actif

---

## 🆘 NETTOYER LES DOUBLONS EXISTANTS

**Si tu as déjà des doublons d'abonnements sur Stripe :**

1. **Aller sur Stripe Dashboard → Customers**
2. **Chercher ton email**
3. **Onglet "Subscriptions"**
4. **Pour chaque abonnement en trop :**
   - Cliquer sur l'abonnement
   - "Cancel subscription"
   - "Cancel immediately" (pas "at period end")
5. **Garder UN SEUL abonnement actif** (le plus récent ou celui souhaité)

---

**Teste maintenant un changement de plan et vérifie qu'il n'y a pas de doublon !** 🚀

