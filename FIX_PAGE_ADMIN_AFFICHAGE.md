# ✅ CORRECTION PAGE /admin - Affichage "FREE" au lieu de "PRO"

## 🔴 PROBLÈME IDENTIFIÉ

La page `/admin` affichait **"Plan : FREE"** et **"Templates : 0 / 3"** alors que :
- ✅ Supabase avait bien `subscription_tier:'pro'` et `templates_limit:40`
- ✅ L'API `/api/user/stats` retournait bien `{"used":0,"limit":40}`
- ✅ La synchronisation disait "Plan avant : pro, Plan après : pro"

**Cause :** Le `UserContext` lisait depuis la table `user_usage` au lieu de `profiles` !

---

## 📝 CORRECTIONS APPLIQUÉES

### ✅ 1. **`app/api/user/stats/route.ts`** (AMÉLIORÉ)

**Ajout du `tier` dans la réponse API :**

```typescript
return NextResponse.json({
  used: profile.templates_used || 0,
  limit: profile.templates_limit || 3,
  tier: profile.subscription_tier || 'free'  // ✅ AJOUTÉ
})
```

**Résultat :** L'API retourne maintenant `{"used":0,"limit":40,"tier":"pro"}`

---

### ✅ 2. **`app/contexts/UserContext.tsx`** (CORRIGÉ)

**AVANT (bug) :**
```typescript
const { data: userData, error } = await supabase
  .from('user_usage')  // ❌ Mauvaise table !
  .select('subscription_tier, templates_generated, company_name')
  .eq('user_id', authUser.id)
  .single()
```

**APRÈS (corrigé) :**
```typescript
// ✅ UTILISER L'API /api/user/stats au lieu de lire directement la BDD
const res = await fetch('/api/user/stats')
const statsData = await res.json()

console.log('📊 Stats récupérées depuis API:', statsData)

setSubscriptionTier(statsData.tier || 'free')
setTemplatesGenerated(statsData.used || 0)

// Gérer l'infini correctement
const limit = statsData.limit >= 999999 ? Infinity : statsData.limit
setTemplatesLimit(limit)
```

**Avantages :**
- 🎯 Source de vérité unique (l'API)
- ✅ Bypass RLS via service_role_key
- 🔄 Données toujours synchronisées
- 📊 Logs détaillés pour debug

---

### ✅ 3. **`app/admin/page.tsx`** (AMÉLIORÉ)

**Fonction `handleSyncSubscription` corrigée :**

**AVANT :**
```typescript
if (data.success) {
  alert(...)
  window.location.reload()  // ❌ Recharge toute la page
}
```

**APRÈS :**
```typescript
if (data.success) {
  alert(`${data.message}\n\nPlan avant : ${data.before}\nPlan après : ${data.after}`)
  // ✅ Rafraîchir les données du UserContext (plus rapide que reload)
  await refreshUserData()
}
```

**Avantage :** Pas besoin de recharger toute la page, juste les données !

---

## 🧪 TESTER LES CORRECTIONS

### **Test 1 : Vider le cache et redémarrer**

```bash
# 1. Arrêter le serveur
Ctrl+C

# 2. Redémarrer
npm run dev
```

**Dans le navigateur :**
1. Appuyer sur **`Ctrl+Shift+Delete`**
2. Cocher **"Cookies"** et **"Cache"**
3. Cliquer sur **"Effacer les données"**
4. **Fermer COMPLÈTEMENT** le navigateur
5. **Rouvrir** et aller sur `http://localhost:3000/admin`

---

### **Test 2 : Vérifier l'affichage**

Sur la page `/admin`, tu devrais maintenant voir :

✅ **Plan :** PRO (en vert)  
✅ **Templates :** 0 / 40

**Logs attendus dans la console :**
```
🔄 Rafraîchissement des données utilisateur...
📊 Stats récupérées depuis API: { used: 0, limit: 40, tier: 'pro' }
✅ Données mises à jour: { tier: 'pro', used: 0, limit: 40 }
```

---

### **Test 3 : Bouton "Synchroniser mon abonnement"**

1. Cliquer sur **"🔄 Synchroniser mon abonnement"**
2. Vérifier le message :
   ```
   ✅ Abonnement synchronisé avec succès !
   
   Plan avant : pro
   Plan après : pro
   ```
3. **La page NE recharge PAS** (juste les données se mettent à jour)

---

## 📊 FLUX DE DONNÉES CORRIGÉ

```
┌─────────────────────────┐
│   Page /admin charge    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  UserContext s'init     │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Appel /api/user/stats  │  ◄── Source unique de vérité
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  API lit profiles avec  │
│  service_role (bypass   │
│  RLS)                   │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Retourne:              │
│  { used: 0,             │
│    limit: 40,           │
│    tier: 'pro' }        │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  UserContext met à jour │
│  les states             │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Page affiche:          │
│  Plan: PRO              │
│  Templates: 0 / 40      │
└─────────────────────────┘
```

---

## 🔍 VÉRIFICATIONS

### Vérifier les logs de l'API

Dans la console du serveur Next.js, tu devrais voir :

```
📊 Stats pour user@email.com : {
  subscription_tier: 'pro',
  templates_used: 0,
  templates_limit: 40
}
```

---

### Vérifier les logs du UserContext

Dans la console du navigateur (F12), tu devrais voir :

```
🔄 Rafraîchissement des données utilisateur...
📊 Stats récupérées depuis API: { used: 0, limit: 40, tier: 'pro' }
✅ Données mises à jour: { tier: 'pro', used: 0, limit: 40 }
```

---

### Vérifier dans Supabase Dashboard

1. Aller sur **Supabase Dashboard** → **Table Editor** → **profiles**
2. Chercher ton utilisateur
3. Vérifier :
   - `subscription_tier` = `pro` ✅
   - `templates_limit` = `40` ✅
   - `templates_used` = `0` ✅

---

## ⚠️ SI ÇA NE MARCHE TOUJOURS PAS

### Problème : La page affiche toujours "FREE"

**Solutions :**

1. **Vérifier que la SERVICE_ROLE_KEY est bien configurée**
   ```bash
   # Dans .env.local
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Vider COMPLÈTEMENT le cache**
   - Chrome : `chrome://settings/clearBrowserData`
   - Cocher TOUT
   - Sélectionner "Depuis toujours"
   - Effacer

3. **Vérifier que le serveur a bien redémarré**
   ```bash
   # Tuer TOUS les processus Node
   taskkill /F /IM node.exe
   
   # Relancer
   npm run dev
   ```

4. **Tester l'API directement**
   ```
   http://localhost:3000/api/user/stats
   ```
   
   Résultat attendu :
   ```json
   {
     "used": 0,
     "limit": 40,
     "tier": "pro"
   }
   ```

5. **Forcer un refresh du UserContext**
   
   Sur la page `/admin`, cliquer sur **"🔄 Rafraîchir"**

---

### Problème : L'API retourne toujours limit:3

**Solution :** Vérifier que le SQL de migration a bien été exécuté dans Supabase

```sql
-- Vérifier dans Supabase SQL Editor
SELECT id, email, subscription_tier, templates_limit 
FROM profiles 
WHERE email = 'votre@email.com';
```

Si `templates_limit` = `3` alors que `subscription_tier` = `pro` :

```sql
-- Forcer la mise à jour
UPDATE profiles 
SET templates_limit = 40 
WHERE subscription_tier = 'pro';
```

---

## 📋 CHECKLIST FINALE

- [ ] `SUPABASE_SERVICE_ROLE_KEY` dans `.env.local`
- [ ] Serveur redémarré (`Ctrl+C` puis `npm run dev`)
- [ ] Cache navigateur vidé (Ctrl+Shift+Delete)
- [ ] Navigateur fermé puis rouvert
- [ ] Page `/admin` affiche "Plan : PRO"
- [ ] Page `/admin` affiche "Templates : 0 / 40"
- [ ] Logs dans console : `tier: 'pro', limit: 40`

---

## 🎯 RÉSULTAT FINAL

**AVANT :**
```
Page /admin :
- Plan : FREE 😞
- Templates : 0 / 3
```

**APRÈS :**
```
Page /admin :
- Plan : PRO 😊
- Templates : 0 / 40
```

---

**🎉 La page /admin affiche maintenant les vraies données depuis l'API avec bypass RLS !**

