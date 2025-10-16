# 📊 ANALYSE COMPLÈTE - GESTION DES LIMITES DE TEMPLATES

## 🎯 FICHIERS CLÉS IDENTIFIÉS

### 1. ✅ FICHIER QUI GÈRE LES LIMITES DE TEMPLATES

**`lib/checkUsageLimit.ts`** - Fonction principale de vérification des limites

```typescript
const LIMITS = {
  free: 3,
  starter: 15,        // ⚠️ ANCIENNE LIMITE (doit être 20)
  pro: 40,
  enterprise: 999999
} as const

export async function checkUsageLimit(userId: string): Promise<UsageLimitResult> {
  // Utilise la fonction RPC Supabase 'check_usage_limit'
  const { data, error } = await supabase.rpc('check_usage_limit', {
    user_uuid: userId
  })
}
```

**Problème identifié :** La limite `starter: 15` ne correspond pas à la page pricing qui affiche 20 templates.

---

### 2. ✅ FICHIER DE L'API DE GÉNÉRATION

**`lib/api.ts`** - Fonction `generateDocumentation()`

```typescript
export async function generateDocumentation(file: File, notes: string, userId?: string, outputFormat: 'notes' | 'pdf' = 'notes', templateName?: string) {
  // Récupère le plan utilisateur depuis 'user_usage'
  const { data: userInfo, error } = await supabase
    .from('user_usage')
    .select('subscription_tier')
    .eq('user_id', userId)
    .single()

  userPlan = userInfo?.subscription_tier || 'free'
  
  // Envoie au webhook N8N avec les infos utilisateur
  const response = await axios.post(WEBHOOK_URL, {
    user_id: userId || null,
    user_plan: userPlan,
    output_format: outputFormat,
    // ... autres données
  })
}
```

**Problème identifié :** Utilise encore l'ancienne table `user_usage` au lieu de `profiles`.

---

### 3. ✅ FICHIER DU WEBHOOK STRIPE

**`app/api/webhooks/stripe/route.ts`** - Gestion des webhooks Stripe

```typescript
// Événement : checkout.session.completed
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // Mapper les price_id vers les tiers
  const priceTierMap: Record<string, string> = {
    [process.env.STRIPE_PRICE_STARTER!]: 'starter',
    [process.env.STRIPE_PRICE_PRO!]: 'pro',
    [process.env.STRIPE_PRICE_ENTERPRISE!]: 'enterprise'
  }

  // ✅ METTRE À JOUR LE PROFILE (table profiles)
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_tier: plan,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      updated_at: new Date().toISOString()
    })
    .eq('id', profile.id)
}
```

**✅ Correct :** Met à jour la table `profiles` et déclenche le trigger automatique.

---

## 🔍 ARCHITECTURE ACTUELLE

### Base de données Supabase :

**Table `profiles` (source de vérité) :**
```sql
- subscription_tier: 'free' | 'starter' | 'pro' | 'enterprise'
- templates_limit: calculé automatiquement par trigger
- templates_used: compteur d'usage
- stripe_customer_id: ID client Stripe
- stripe_subscription_id: ID abonnement Stripe
```

**Table `user_usage` (obsolète mais encore utilisée) :**
```sql
- subscription_tier: 'free' | 'starter' | 'pro' | 'enterprise'
- templates_generated: compteur d'usage
- last_generated_at: timestamp
```

---

### Fonctions RPC Supabase :

**1. `check_usage_limit(user_uuid)` :**
```sql
-- Limites définies dans la fonction
limits := '{"free": 3, "starter": 15, "pro": 40, "enterprise": 999999}'::JSON;

-- ⚠️ PROBLÈME : starter = 15 au lieu de 20
```

**2. `increment_user_usage(user_uuid)` :**
```sql
-- Incrémente templates_generated dans user_usage
-- ⚠️ PROBLÈME : Utilise encore l'ancienne table
```

**3. `get_templates_limit(tier)` :**
```sql
-- Fonction de calcul des limites (correcte)
CASE tier
  WHEN 'free' THEN 3
  WHEN 'starter' THEN 15    -- ⚠️ PROBLÈME : devrait être 20
  WHEN 'pro' THEN 40
  WHEN 'enterprise' THEN 999999
END
```

---

## ⚠️ PROBLÈMES IDENTIFIÉS

### 1. **Incohérence des limites Starter**

**Page pricing :** 20 templates/mois  
**Code :** 15 templates/mois

**Fichiers à corriger :**
- `lib/checkUsageLimit.ts` : `starter: 15` → `starter: 20`
- `supabase-update-check-usage-limit.sql` : `"starter": 15` → `"starter": 20`
- `supabase-fix-subscription-limits.sql` : `WHEN 'starter' THEN 15` → `WHEN 'starter' THEN 20`

---

### 2. **Double système de gestion des limites**

**Problème :** Le code utilise encore l'ancienne table `user_usage` au lieu de `profiles`.

**Fichiers à corriger :**
- `lib/api.ts` : Utilise `user_usage` au lieu de `profiles`
- `lib/checkUsageLimit.ts` : Fonction RPC utilise `user_usage`
- `lib/incrementUsage.ts` : Fonction RPC utilise `user_usage`

---

### 3. **API Stats utilise la bonne table**

**✅ Correct :** `app/api/user/stats/route.ts` utilise `profiles` avec service_role.

---

## 🔧 CORRECTIONS NÉCESSAIRES

### 1. Mettre à jour les limites Starter (15 → 20)

**Fichier :** `lib/checkUsageLimit.ts`
```typescript
const LIMITS = {
  free: 3,
  starter: 20,        // ✅ Corrigé
  pro: 40,
  enterprise: 999999
} as const
```

**Fichier :** `supabase-update-check-usage-limit.sql`
```sql
limits := '{"free": 3, "starter": 20, "pro": 40, "enterprise": 999999}'::JSON;
```

**Fichier :** `supabase-fix-subscription-limits.sql`
```sql
WHEN 'starter' THEN 20    -- ✅ Corrigé
```

---

### 2. Migrer vers la table `profiles`

**Fichier :** `lib/api.ts`
```typescript
// AVANT (obsolète)
const { data: userInfo, error } = await supabase
  .from('user_usage')
  .select('subscription_tier')
  .eq('user_id', userId)
  .single()

// APRÈS (correct)
const { data: userInfo, error } = await supabase
  .from('profiles')
  .select('subscription_tier')
  .eq('id', userId)
  .single()
```

---

### 3. Créer de nouvelles fonctions RPC pour `profiles`

**Nouveau fichier :** `supabase-migrate-to-profiles.sql`
```sql
-- Fonction pour vérifier les limites depuis profiles
CREATE OR REPLACE FUNCTION check_usage_limit_profiles(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    profile_record RECORD;
    result JSON;
BEGIN
    SELECT templates_used, subscription_tier, templates_limit
    INTO profile_record
    FROM profiles
    WHERE id = user_uuid;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'allowed', false,
            'current', 0,
            'limit', 3,
            'tier', 'free',
            'reason', 'Utilisateur non trouvé'
        );
    END IF;
    
    result := json_build_object(
        'allowed', profile_record.templates_used < profile_record.templates_limit,
        'current', profile_record.templates_used,
        'limit', profile_record.templates_limit,
        'tier', profile_record.subscription_tier
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour incrémenter l'usage depuis profiles
CREATE OR REPLACE FUNCTION increment_user_usage_profiles(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    new_count INTEGER;
BEGIN
    UPDATE profiles 
    SET 
        templates_used = templates_used + 1,
        updated_at = NOW()
    WHERE id = user_uuid
    RETURNING templates_used INTO new_count;
    
    RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 📋 PLAN D'ACTION

### Étape 1 : Corriger les limites Starter
1. ✅ `lib/checkUsageLimit.ts` : `starter: 15` → `starter: 20`
2. ✅ `supabase-update-check-usage-limit.sql` : `"starter": 15` → `"starter": 20`
3. ✅ `supabase-fix-subscription-limits.sql` : `WHEN 'starter' THEN 15` → `WHEN 'starter' THEN 20`

### Étape 2 : Migrer vers la table `profiles`
1. ✅ Créer `supabase-migrate-to-profiles.sql`
2. ✅ Modifier `lib/api.ts` pour utiliser `profiles`
3. ✅ Modifier `lib/checkUsageLimit.ts` pour utiliser `profiles`
4. ✅ Modifier `lib/incrementUsage.ts` pour utiliser `profiles`

### Étape 3 : Tester et valider
1. ✅ Vérifier que les limites s'affichent correctement (20 pour Starter)
2. ✅ Tester la génération de templates
3. ✅ Vérifier que les webhooks Stripe fonctionnent
4. ✅ Valider que l'incrémentation fonctionne

---

## 🎯 RÉSULTAT ATTENDU

**Après corrections :**
- ✅ Starter : 20 templates/mois (cohérent avec la page pricing)
- ✅ Pro : 40 templates/mois
- ✅ Enterprise : ∞ templates/mois
- ✅ Source unique de vérité : table `profiles`
- ✅ Trigger automatique : `templates_limit` calculé selon `subscription_tier`
- ✅ Webhooks Stripe : mettent à jour `profiles` → déclenchent le trigger

**Architecture finale :**
```
Stripe Webhook → profiles.subscription_tier → Trigger → profiles.templates_limit
                                                              ↓
API Stats ← profiles.templates_used + profiles.templates_limit
```

---

**La gestion des limites sera alors cohérente et centralisée !** 🎯
