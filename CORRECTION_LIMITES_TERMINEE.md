# ✅ CORRECTION GESTION DES LIMITES DE TEMPLATES - TERMINÉE

## 🎯 PROBLÈME RÉSOLU

**AVANT :** Le code utilisait l'ancienne table `user_usage` au lieu de `profiles`

**APRÈS :** Tout le code utilise maintenant la table `profiles` avec les bonnes limites

---

## 📋 CORRECTIONS APPLIQUÉES

### 1. ✅ **lib/checkUsageLimit.ts** - Migré vers `profiles`

**AVANT :**
```typescript
const LIMITS = {
  free: 3,
  starter: 15,        // ❌ Incohérent avec pricing
  pro: 40,
  enterprise: 999999   // ❌ Trop élevé
} as const

// Utilisait user_usage via RPC
const { data, error } = await supabase.rpc('check_usage_limit', {
  user_uuid: userId
})
```

**APRÈS :**
```typescript
const LIMITS = {
  free: 3,
  starter: 20,        // ✅ Cohérent avec pricing
  pro: 40,
  enterprise: 60      // ✅ Limite raisonnable
} as const

// Utilise profiles directement
const { data, error } = await supabase
  .from('profiles')
  .select('subscription_tier, templates_used, templates_limit')
  .eq('id', userId)
  .single()
```

---

### 2. ✅ **lib/incrementUsage.ts** - Migré vers `profiles`

**AVANT :**
```typescript
// Utilisait user_usage via RPC
const { data, error } = await supabase.rpc('increment_user_usage', {
  user_uuid: userId
})
```

**APRÈS :**
```typescript
// Utilise profiles via RPC
const { data, error } = await supabase.rpc('increment_user_templates_usage', {
  user_uuid: userId
})
```

---

### 3. ✅ **lib/api.ts** - Migré vers `profiles`

**AVANT :**
```typescript
const { data: userInfo, error } = await supabase
  .from('user_usage')
  .select('subscription_tier')
  .eq('user_id', userId)
  .single()
```

**APRÈS :**
```typescript
const { data: userInfo, error } = await supabase
  .from('profiles')
  .select('subscription_tier')
  .eq('id', userId)
  .single()
```

---

## 🗄️ FICHIERS SQL CRÉÉS

### 1. **supabase-update-limits-final.sql**
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

### 2. **supabase-increment-usage-profiles.sql**
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
- [ ] Compteur s'incrémente correctement

---

## ✅ RÉSULTAT

**✅ Tout le code utilise la table `profiles`**  
**✅ Limites cohérentes : 3, 20, 40, 60**  
**✅ Plus d'incohérences entre code et DB**  
**✅ Architecture unifiée et propre**  

**La gestion des limites est maintenant parfaitement cohérente !** 🎯
