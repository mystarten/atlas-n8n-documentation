-- ═══════════════════════════════════════════════════════════════════════════
-- SCRIPT COMPLET POUR CORRIGER TOUS LES BUGS D'ABONNEMENT
-- ═══════════════════════════════════════════════════════════════════════════
-- À exécuter sur Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────────────────────
-- ÉTAPE 1 : Corriger la contrainte pour accepter 'enterprise' (SANS accent)
-- ────────────────────────────────────────────────────────────────────────────

ALTER TABLE user_usage DROP CONSTRAINT IF EXISTS user_usage_subscription_tier_check;

ALTER TABLE user_usage 
ADD CONSTRAINT user_usage_subscription_tier_check 
CHECK (subscription_tier IN ('free', 'starter', 'pro', 'enterprise'));

-- ────────────────────────────────────────────────────────────────────────────
-- ÉTAPE 2 : Ajouter la colonne company_name si elle n'existe pas
-- ────────────────────────────────────────────────────────────────────────────

ALTER TABLE user_usage 
ADD COLUMN IF NOT EXISTS company_name TEXT;

-- ────────────────────────────────────────────────────────────────────────────
-- ÉTAPE 3 : Corriger les "entreprise" existants vers "enterprise"
-- ────────────────────────────────────────────────────────────────────────────

UPDATE user_usage 
SET subscription_tier = 'enterprise' 
WHERE subscription_tier = 'entreprise';

-- ────────────────────────────────────────────────────────────────────────────
-- ÉTAPE 4 : Mettre à jour la fonction check_usage_limit
-- ────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION check_usage_limit(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    usage_record RECORD;
    limits JSON;
    result JSON;
    user_limit INTEGER;
BEGIN
    -- Limites par tier
    limits := '{"free": 3, "starter": 15, "pro": 40, "enterprise": 999999}'::JSON;
    
    -- Récupérer les données
    SELECT templates_generated, subscription_tier
    INTO usage_record
    FROM user_usage
    WHERE user_id = user_uuid;
    
    -- Créer si n'existe pas
    IF NOT FOUND THEN
        INSERT INTO user_usage (user_id, templates_generated, subscription_tier)
        VALUES (user_uuid, 0, 'free')
        RETURNING templates_generated, subscription_tier INTO usage_record;
    END IF;
    
    user_limit := (limits->>usage_record.subscription_tier)::INTEGER;
    
    -- Pour Enterprise : toujours autoriser (illimité)
    IF usage_record.subscription_tier = 'enterprise' THEN
        result := json_build_object(
            'allowed', true,
            'current', usage_record.templates_generated,
            'limit', 999999,
            'tier', usage_record.subscription_tier
        );
    ELSE
        -- Autres plans : vérifier la limite
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

-- ────────────────────────────────────────────────────────────────────────────
-- ÉTAPE 5 : Mettre à jour la fonction increment_user_usage
-- ────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION increment_user_usage(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    new_count INTEGER;
    current_tier TEXT;
BEGIN
    -- Récupérer le tier actuel
    SELECT subscription_tier INTO current_tier
    FROM user_usage
    WHERE user_id = user_uuid;
    
    -- Si l'utilisateur n'existe pas, le créer
    IF current_tier IS NULL THEN
        INSERT INTO user_usage (user_id, templates_generated, last_generated_at, subscription_tier)
        VALUES (user_uuid, 1, NOW(), 'free')
        RETURNING templates_generated INTO new_count;
        RETURN new_count;
    END IF;
    
    -- Si Enterprise : NE PAS incrémenter (illimité)
    IF current_tier = 'enterprise' THEN
        UPDATE user_usage 
        SET last_generated_at = NOW()
        WHERE user_id = user_uuid
        RETURNING templates_generated INTO new_count;
        
        RETURN new_count;
    END IF;
    
    -- Autres plans : incrémenter normalement
    UPDATE user_usage 
    SET 
        templates_generated = templates_generated + 1,
        last_generated_at = NOW()
    WHERE user_id = user_uuid
    RETURNING templates_generated INTO new_count;
    
    RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ────────────────────────────────────────────────────────────────────────────
-- ÉTAPE 6 : Corriger TON compte utilisateur immédiatement
-- ────────────────────────────────────────────────────────────────────────────

-- Remplace 'starten.contact@gmail.com' par ton email si différent
UPDATE user_usage 
SET 
  subscription_tier = 'pro',  -- Change selon ton plan réel : 'free', 'starter', 'pro', 'enterprise'
  templates_generated = 0,
  company_name = NULL  -- Ou met ton nom : 'Ma Société'
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'starten.contact@gmail.com'
);

-- ────────────────────────────────────────────────────────────────────────────
-- VÉRIFICATIONS FINALES
-- ────────────────────────────────────────────────────────────────────────────

-- Vérifier ton compte
SELECT 
  u.email,
  uu.subscription_tier,
  uu.templates_generated,
  uu.company_name,
  uu.stripe_customer_id
FROM user_usage uu
JOIN auth.users u ON uu.user_id = u.id
WHERE u.email = 'starten.contact@gmail.com';

-- Vérifier la contrainte
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname = 'user_usage_subscription_tier_check';

-- Vérifier les colonnes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_usage' 
ORDER BY ordinal_position;

-- ────────────────────────────────────────────────────────────────────────────
-- RÉSULTAT ATTENDU
-- ────────────────────────────────────────────────────────────────────────────
-- email: starten.contact@gmail.com
-- subscription_tier: pro
-- templates_generated: 0
-- company_name: NULL
-- stripe_customer_id: cus_...
-- ════════════════════════════════════════════════════════════════════════════



