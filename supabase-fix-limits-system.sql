-- CORRECTION DU SYSTÈME DE LIMITES - UNIFICATION SUR LA TABLE PROFILES
-- Ce script corrige l'incohérence entre user_usage et profiles

-- 1. Ajouter les colonnes manquantes dans profiles si elles n'existent pas
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS templates_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS templates_limit INTEGER DEFAULT 3;

-- 2. Mettre à jour templates_limit selon le tier
UPDATE profiles 
SET templates_limit = CASE 
    WHEN subscription_tier = 'free' THEN 3
    WHEN subscription_tier = 'starter' THEN 20
    WHEN subscription_tier = 'pro' THEN 40
    WHEN subscription_tier = 'enterprise' THEN 999999
    ELSE 3
END
WHERE templates_limit IS NULL OR templates_limit = 3;

-- 3. Créer la fonction RPC pour vérifier les limites (utilise profiles)
CREATE OR REPLACE FUNCTION check_usage_limit(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    profile_record RECORD;
    result JSON;
BEGIN
    -- Récupérer les données du profil
    SELECT templates_used, templates_limit, subscription_tier
    INTO profile_record
    FROM profiles
    WHERE id = user_uuid;
    
    -- Si le profil n'existe pas, créer un enregistrement par défaut
    IF NOT FOUND THEN
        INSERT INTO profiles (id, templates_used, templates_limit, subscription_tier)
        VALUES (user_uuid, 0, 3, 'free')
        RETURNING templates_used, templates_limit, subscription_tier INTO profile_record;
    END IF;
    
    -- Construire la réponse
    result := json_build_object(
        'allowed', profile_record.templates_used < profile_record.templates_limit,
        'current', profile_record.templates_used,
        'limit', profile_record.templates_limit,
        'tier', profile_record.subscription_tier
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Créer la fonction RPC pour incrémenter l'usage (utilise profiles)
CREATE OR REPLACE FUNCTION increment_user_templates_usage(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    new_count INTEGER;
    current_tier TEXT;
BEGIN
    -- Récupérer le tier actuel
    SELECT subscription_tier INTO current_tier
    FROM profiles
    WHERE id = user_uuid;
    
    -- Si l'utilisateur n'existe pas, le créer
    IF current_tier IS NULL THEN
        INSERT INTO profiles (id, templates_used, templates_limit, subscription_tier)
        VALUES (user_uuid, 1, 3, 'free')
        RETURNING templates_used INTO new_count;
        RETURN new_count;
    END IF;
    
    -- Si plan Enterprise, ne PAS incrémenter (illimité)
    IF current_tier = 'enterprise' THEN
        -- Mettre à jour seulement updated_at
        UPDATE profiles 
        SET updated_at = NOW()
        WHERE id = user_uuid
        RETURNING templates_used INTO new_count;
        
        RETURN new_count;
    END IF;
    
    -- Pour les autres plans, incrémenter normalement
    UPDATE profiles 
    SET 
        templates_used = templates_used + 1,
        updated_at = NOW()
    WHERE id = user_uuid
    RETURNING templates_used INTO new_count;
    
    RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Créer une fonction pour mettre à jour les limites selon le tier
CREATE OR REPLACE FUNCTION update_user_tier_limits(user_uuid UUID, new_tier TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    new_limit INTEGER;
BEGIN
    -- Définir la limite selon le tier
    new_limit := CASE 
        WHEN new_tier = 'free' THEN 3
        WHEN new_tier = 'starter' THEN 20
        WHEN new_tier = 'pro' THEN 40
        WHEN new_tier = 'enterprise' THEN 999999
        ELSE 3
    END;
    
    -- Mettre à jour le profil
    UPDATE profiles 
    SET 
        subscription_tier = new_tier,
        templates_limit = new_limit,
        updated_at = NOW()
    WHERE id = user_uuid;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Créer une fonction pour reset le compteur (après upgrade)
CREATE OR REPLACE FUNCTION reset_user_usage(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE profiles 
    SET 
        templates_used = 0,
        updated_at = NOW()
    WHERE id = user_uuid;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Politiques RLS pour profiles (si pas déjà définies)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Politique pour SELECT
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Politique pour UPDATE
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Politique pour INSERT
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 8. Test des fonctions
SELECT 'Test check_usage_limit:' as test_name;
SELECT check_usage_limit((SELECT id FROM auth.users LIMIT 1));

SELECT 'Test increment_user_templates_usage:' as test_name;
SELECT increment_user_templates_usage((SELECT id FROM auth.users LIMIT 1));

-- 9. Commentaires pour documentation
COMMENT ON FUNCTION check_usage_limit(UUID) IS 'Vérifie si un utilisateur peut générer un template selon ses limites';
COMMENT ON FUNCTION increment_user_templates_usage(UUID) IS 'Incrémente le compteur de templates générés pour un utilisateur';
COMMENT ON FUNCTION update_user_tier_limits(UUID, TEXT) IS 'Met à jour le tier et les limites d''un utilisateur';
COMMENT ON FUNCTION reset_user_usage(UUID) IS 'Reset le compteur de templates générés (après upgrade)';
