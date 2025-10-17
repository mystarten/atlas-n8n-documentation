# 🚀 Actions Immédiates pour Corriger Ton Compte

## ✅ ÉTAPE 1 : Corriger la contrainte Supabase (2 minutes)

### Exécuter le SQL sur Supabase

1. **Ouvrir Supabase Dashboard**
   - URL : https://supabase.com/dashboard
   - Projet : `ibikrttopnusseutvzvb`

2. **Aller dans SQL Editor**
   - Menu de gauche → SQL Editor
   - New Query

3. **Copier-coller ce SQL et RUN :**

```sql
-- 1. Corriger la contrainte pour accepter 'enterprise'
ALTER TABLE user_usage DROP CONSTRAINT IF EXISTS user_usage_subscription_tier_check;

ALTER TABLE user_usage 
ADD CONSTRAINT user_usage_subscription_tier_check 
CHECK (subscription_tier IN ('free', 'starter', 'pro', 'enterprise'));

-- 2. Ajouter colonne company_name
ALTER TABLE user_usage 
ADD COLUMN IF NOT EXISTS company_name TEXT;

-- 3. Corriger ton compte immédiatement
UPDATE user_usage 
SET 
  subscription_tier = 'pro',  -- Change selon ton plan réel sur Stripe
  templates_generated = 0
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'starten.contact@gmail.com'
);

-- 4. Mettre à jour les fonctions RPC
CREATE OR REPLACE FUNCTION check_usage_limit(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    usage_record RECORD;
    limits JSON;
    result JSON;
    user_limit INTEGER;
BEGIN
    limits := '{"free": 3, "starter": 15, "pro": 40, "enterprise": 999999}'::JSON;
    
    SELECT templates_generated, subscription_tier
    INTO usage_record
    FROM user_usage
    WHERE user_id = user_uuid;
    
    IF NOT FOUND THEN
        INSERT INTO user_usage (user_id, templates_generated, subscription_tier)
        VALUES (user_uuid, 0, 'free')
        RETURNING templates_generated, subscription_tier INTO usage_record;
    END IF;
    
    user_limit := (limits->>usage_record.subscription_tier)::INTEGER;
    
    -- Pour Enterprise, toujours autoriser
    IF usage_record.subscription_tier = 'enterprise' THEN
        result := json_build_object(
            'allowed', true,
            'current', usage_record.templates_generated,
            'limit', 999999,
            'tier', usage_record.subscription_tier
        );
    ELSE
        result := json_build_object(
            'allowed', usage_record.templates_generated < user_limit,
            'current', usage_record.templates_generated,
            'limit', user_limit,
            'tier', usage_record.subscription_tier
        );
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Mettre à jour increment_user_usage
CREATE OR REPLACE FUNCTION increment_user_usage(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    new_count INTEGER;
    current_tier TEXT;
BEGIN
    SELECT subscription_tier INTO current_tier
    FROM user_usage
    WHERE user_id = user_uuid;
    
    IF current_tier IS NULL THEN
        INSERT INTO user_usage (user_id, templates_generated, last_generated_at, subscription_tier)
        VALUES (user_uuid, 1, NOW(), 'free')
        RETURNING templates_generated INTO new_count;
        RETURN new_count;
    END IF;
    
    -- Si Enterprise, ne PAS incrémenter
    IF current_tier = 'enterprise' THEN
        UPDATE user_usage 
        SET last_generated_at = NOW()
        WHERE user_id = user_uuid
        RETURNING templates_generated INTO new_count;
        RETURN new_count;
    END IF;
    
    -- Autres plans : incrémenter
    UPDATE user_usage 
    SET 
        templates_generated = templates_generated + 1,
        last_generated_at = NOW()
    WHERE user_id = user_uuid
    RETURNING templates_generated INTO new_count;
    
    RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

4. **Cliquer sur "RUN" (ou Ctrl+Enter)**

5. **Vérifier qu'il n'y a pas d'erreur**
   - Si succès : ✅ "Success. No rows returned"
   - Si erreur : Copier l'erreur et me la donner

---

## ✅ ÉTAPE 2 : Redémarrer le serveur (30 secondes)

1. **Arrêter le serveur actuel**
   - Dans le terminal : `Ctrl+C`

2. **Redémarrer**
   ```bash
   npm run dev
   ```

3. **Attendre que ce soit prêt**
   ```
   ✓ Ready in 2.5s
   ```

---

## ✅ ÉTAPE 3 : Tester sur /admin (1 minute)

1. **Ouvrir le navigateur**
   ```
   http://localhost:3000/admin
   ```

2. **Vérifier les infos affichées**
   - Plan : PRO (ou ENTERPRISE selon ce que tu as mis)
   - Templates : 0 / 40 (ou ∞ si Enterprise)
   - Nom entreprise : (aucun)

3. **Cliquer sur "🔄 Rafraîchir"**
   - Vérifier que ça recharge bien

4. **Tester "Synchroniser avec Stripe"**
   - Cliquer sur le bouton bleu
   - Vérifier dans les logs du terminal
   - Voir si le plan correspond à ton abonnement Stripe réel

---

## ✅ ÉTAPE 4 : Tester une génération (2 minutes)

1. **Aller sur la page d'accueil**
   ```
   http://localhost:3000
   ```

2. **Uploader un fichier JSON**

3. **Vérifier le sélecteur de format**
   - Si plan = Starter/Pro/Enterprise → Sélecteur visible
   - Si plan = Free → Pas de sélecteur

4. **Générer une documentation**

5. **Vérifier dans /admin que le compteur a augmenté**
   - Si Free/Starter/Pro : +1
   - Si Enterprise : Reste à 0 (illimité)

---

## 🐛 SI ÇA NE MARCHE PAS

### Erreur "violates check constraint"
- ✅ Tu n'as pas exécuté le SQL de l'étape 1
- ✅ Va sur Supabase et exécute le script complet

### Le plan ne s'affiche pas
- ✅ Vérifie que tu as redémarré le serveur
- ✅ Vide le cache du navigateur (Ctrl+Shift+R)
- ✅ Vérifie les logs dans le terminal

### La limite affiche toujours 15
- ✅ Va sur /admin
- ✅ Clique "Rafraîchir"
- ✅ Vérifie dans Supabase que subscription_tier = 'pro' ou 'enterprise'

### Le compteur augmente même en Enterprise
- ✅ Exécute le SQL de mise à jour de increment_user_usage
- ✅ Redémarre le serveur
- ✅ Teste une nouvelle génération

---

## 📊 VÉRIFICATIONS FINALES

### Sur Supabase (Table Editor)

1. Aller dans Table Editor → user_usage
2. Trouver ta ligne (email: starten.contact@gmail.com)
3. Vérifier :
   - ✅ subscription_tier = 'pro' ou 'enterprise'
   - ✅ templates_generated = 0
   - ✅ stripe_customer_id présent
   - ✅ company_name = NULL (ou ton nom)

### Sur /admin

1. Plan : PRO ou ENTERPRISE
2. Templates : 0 / 40 ou 0 / ∞
3. Rafraîchir fonctionne
4. Sync Stripe fonctionne

### Sur la page d'accueil

1. Sélecteur PDF/Notes visible (si pas Free)
2. Génération fonctionne
3. Compteur s'incrémente (sauf Enterprise)

---

## 🎯 ORDRE DES ACTIONS

1. ⏰ **2 minutes** : Exécuter le SQL sur Supabase (ÉTAPE 1)
2. ⏰ **30 secondes** : Redémarrer le serveur (ÉTAPE 2)
3. ⏰ **1 minute** : Tester /admin (ÉTAPE 3)
4. ⏰ **2 minutes** : Tester génération (ÉTAPE 4)

**TOTAL : ~6 minutes pour tout corriger**

---

## 📝 RÉSULTAT ATTENDU

Après ces corrections :

✅ **Plan Enterprise** : Limite affichée "∞"  
✅ **Génération illimitée** : Compteur ne monte pas  
✅ **Annulation** : Downgrade immédiat en Free  
✅ **Upgrade** : Mise à jour immédiate  
✅ **UI synchronisée** : Toutes les pages à jour  
✅ **Sélecteur format** : Visible pour tous sauf Free  

Tout devrait fonctionner parfaitement ! 🚀



