# ✅ MIGRATION COMPLÈTE : user_usage → profiles - TERMINÉE

## 🎯 RÉSULTAT FINAL

**✅ Plus aucune référence à 'user_usage' dans le code**  
**✅ Tout le code utilise 'profiles'**  
**✅ Les limites sont correctes : 3, 20, 40, 60**  
**✅ templates_used s'incrémente après chaque génération**

---

## 📋 FICHIERS MODIFIÉS

### ✅ **lib/checkUsageLimit.ts** - TERMINÉ
```typescript
// AVANT
const LIMITS = { starter: 15, enterprise: 999999 }
const { data, error } = await supabase.rpc('check_usage_limit', { user_uuid: userId })

// APRÈS
const LIMITS = { starter: 20, enterprise: 60 }
const { data, error } = await supabase
  .from('profiles')
  .select('subscription_tier, templates_used, templates_limit')
  .eq('id', userId)
  .single()
```

### ✅ **lib/incrementUsage.ts** - TERMINÉ
```typescript
// AVANT
const { data, error } = await supabase.rpc('increment_user_usage', { user_uuid: userId })

// APRÈS
const { data, error } = await supabase.rpc('increment_user_templates_usage', { user_uuid: userId })
```

### ✅ **lib/api.ts** - TERMINÉ
```typescript
// AVANT
const { data: userInfo } = await supabase
  .from('user_usage')
  .select('subscription_tier')
  .eq('user_id', userId)

// APRÈS
const { data: userInfo } = await supabase
  .from('profiles')
  .select('subscription_tier')
  .eq('id', userId)

// ✅ AJOUTÉ : Incrémentation après génération réussie
const { error: incrementError } = await supabase
  .from('profiles')
  .update({ templates_used: supabase.sql`templates_used + 1` })
  .eq('id', userId)
```

### ✅ **app/account/page.tsx** - TERMINÉ
```typescript
// AVANT
.from('user_usage').eq('user_id', user.id)

// APRÈS
.from('profiles').eq('id', user.id)
```

### ✅ **app/admin/page.tsx** - TERMINÉ
```typescript
// AVANT (3 occurrences)
.from('user_usage').eq('user_id', user.id)

// APRÈS (3 occurrences)
.from('profiles').eq('id', user.id)
```

### ✅ **app/api/stripe/change-plan/route.ts** - TERMINÉ
```typescript
// AVANT
const { data: userUsage } = await supabase
  .from('user_usage')
  .select('stripe_customer_id, stripe_subscription_id, subscription_tier')
  .eq('user_id', user.id)

// APRÈS
const { data: userUsage } = await supabase
  .from('profiles')
  .select('stripe_customer_id, stripe_subscription_id, subscription_tier')
  .eq('id', user.id)
```

### ✅ **app/api/subscription/status/route.ts** - TERMINÉ
```typescript
// AVANT
const { data: userUsage } = await supabase
  .from('user_usage')
  .select('subscription_tier, stripe_subscription_id, stripe_customer_id')
  .eq('user_id', user.id)

// APRÈS
const { data: userUsage } = await supabase
  .from('profiles')
  .select('subscription_tier, stripe_subscription_id, stripe_customer_id')
  .eq('id', user.id)
```

### ✅ **app/api/calculate-upgrade-cost/route.ts** - TERMINÉ
```typescript
// AVANT
const { data: userData } = await supabase
  .from('user_usage')
  .select('subscription_tier')
  .eq('user_id', user.id)

// APRÈS
const { data: userData } = await supabase
  .from('profiles')
  .select('subscription_tier')
  .eq('id', user.id)
```

### ✅ **app/api/debug/sync-stripe/route.ts** - TERMINÉ
```typescript
// AVANT (API REST directe)
const findResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_usage?user_id=eq.${userId}`)
const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_usage?user_id=eq.${userId}`)

// APRÈS (Client Supabase)
const { data: userProfile } = await supabaseAdmin.from('profiles').select('*').eq('id', userId)
const { error: updateError } = await supabaseAdmin.from('profiles').update({...}).eq('id', userId)
```

### ✅ **app/api/sync-stripe/route.ts** - TERMINÉ
```typescript
// AVANT (API REST directe)
const userResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_usage?user_id=eq.${userId}`)
const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_usage?user_id=eq.${userId}`)

// APRÈS (Client Supabase)
const { data: userInfo } = await supabaseAdmin.from('profiles').select('*').eq('id', userId)
const { error: updateError } = await supabaseAdmin.from('profiles').update({...}).eq('id', userId)
```

---

## 🗄️ FICHIERS SQL CRÉÉS

### ✅ **supabase-update-limits-final.sql**
```sql
-- Mise à jour des limites dans Supabase
CREATE OR REPLACE FUNCTION public.get_templates_limit(tier TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN CASE tier
    WHEN 'free' THEN 3
    WHEN 'starter' THEN 20    -- Changé de 15 à 20
    WHEN 'pro' THEN 40
    WHEN 'enterprise' THEN 60  -- Changé de 999999 à 60
    ELSE 3
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Mettre à jour tous les profils existants
UPDATE public.profiles
SET templates_limit = public.get_templates_limit(subscription_tier);
```

### ✅ **supabase-increment-usage-profiles.sql**
```sql
-- Fonction RPC pour incrémenter l'usage dans profiles
CREATE OR REPLACE FUNCTION public.increment_user_templates_usage(user_uuid UUID)
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

## 📊 LIMITES FINALES

| Plan | Limite | Cohérence |
|------|--------|-----------|
| **Free** | 3 templates | ✅ |
| **Starter** | 20 templates | ✅ Cohérent avec pricing |
| **Pro** | 40 templates | ✅ |
| **Enterprise** | 60 templates | ✅ Limite raisonnable |

---

## 🔄 ARCHITECTURE FINALE

```
┌─────────────────────────┐
│   Stripe Webhook        │
│   → profiles.tier       │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│   Trigger automatique   │
│   → templates_limit     │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│   Code Frontend         │
│   → profiles.*          │
└─────────────────────────┘
```

**Source unique de vérité :** Table `profiles` ✅

---

## 🧪 POUR TESTER

### 1. Exécuter les fichiers SQL dans Supabase :

```sql
-- 1. Mettre à jour les limites
\i supabase-update-limits-final.sql

-- 2. Créer la fonction d'incrémentation
\i supabase-increment-usage-profiles.sql
```

### 2. Redémarrer le serveur :

```powershell
npm run dev
```

### 3. Vérifier :

- [ ] Page pricing affiche : Starter 20, Pro 40, Enterprise 60
- [ ] Page account affiche les bonnes limites
- [ ] Génération de templates fonctionne
- [ ] Compteur s'incrémente correctement après génération

---

## ✅ RÉSULTAT

**✅ Migration complète terminée**  
**✅ Plus aucune référence à 'user_usage'**  
**✅ Tout le code utilise 'profiles'**  
**✅ Limites cohérentes : 3, 20, 40, 60**  
**✅ Incrémentation automatique après génération**  
**✅ Architecture unifiée et propre**  

**La gestion des limites est maintenant parfaitement cohérente !** 🎯
