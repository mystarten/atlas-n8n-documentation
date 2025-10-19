-- ════════════════════════════════════════════════════════════════════════════
-- CORRECTION DE LA FONCTION D'INCRÉMENTATION - TABLE PROFILES
-- ════════════════════════════════════════════════════════════════════════════
-- Ce script corrige la fonction RPC pour qu'elle utilise la table profiles
-- avec les colonnes templates_used et templates_limit
-- ════════════════════════════════════════════════════════════════════════════

-- 1. Supprimer l'ancienne fonction si elle existe
DROP FUNCTION IF EXISTS public.increment_user_templates_usage(UUID);

-- 2. Créer la nouvelle fonction qui utilise profiles
CREATE OR REPLACE FUNCTION public.increment_user_templates_usage(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    new_count INTEGER;
    current_tier TEXT;
BEGIN
    -- Récupérer le tier actuel
    SELECT subscription_tier INTO current_tier
    FROM profiles
    WHERE id = user_uuid;
    
    -- Si l'utilisateur n'existe pas, créer un profil par défaut
    IF current_tier IS NULL THEN
        INSERT INTO profiles (id, templates_used, templates_limit, subscription_tier)
        VALUES (user_uuid, 1, 3, 'free')
        RETURNING templates_used INTO new_count;
        
        RAISE NOTICE 'Profil créé pour user %, usage: %', user_uuid, new_count;
        RETURN new_count;
    END IF;
    
    -- Si plan Enterprise, ne PAS incrémenter (illimité)
    IF current_tier = 'enterprise' THEN
        SELECT templates_used INTO new_count
        FROM profiles
        WHERE id = user_uuid;
        
        RAISE NOTICE 'Plan Enterprise - pas d''incrémentation pour user %, usage: %', user_uuid, new_count;
        RETURN new_count;
    END IF;
    
    -- Pour les autres plans, incrémenter normalement
    UPDATE profiles 
    SET 
        templates_used = COALESCE(templates_used, 0) + 1,
        updated_at = NOW()
    WHERE id = user_uuid
    RETURNING templates_used INTO new_count;
    
    RAISE NOTICE 'Usage incrémenté pour user %, nouveau count: %', user_uuid, new_count;
    RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Vérifier que check_usage_limit utilise aussi profiles
CREATE OR REPLACE FUNCTION public.check_usage_limit(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    profile_record RECORD;
    result JSON;
BEGIN
    -- Récupérer les données du profil
    SELECT 
        COALESCE(templates_used, 0) as templates_used, 
        COALESCE(templates_limit, 3) as templates_limit, 
        COALESCE(subscription_tier, 'free') as subscription_tier
    INTO profile_record
    FROM profiles
    WHERE id = user_uuid;
    
    -- Si le profil n'existe pas, créer un enregistrement par défaut
    IF NOT FOUND THEN
        INSERT INTO profiles (id, templates_used, templates_limit, subscription_tier)
        VALUES (user_uuid, 0, 3, 'free')
        RETURNING 
            COALESCE(templates_used, 0) as templates_used, 
            COALESCE(templates_limit, 3) as templates_limit, 
            COALESCE(subscription_tier, 'free') as subscription_tier 
        INTO profile_record;
        
        RAISE NOTICE 'Profil créé pour check_usage_limit user %', user_uuid;
    END IF;
    
    -- Construire la réponse
    result := json_build_object(
        'allowed', profile_record.templates_used < profile_record.templates_limit,
        'current', profile_record.templates_used,
        'limit', profile_record.templates_limit,
        'tier', profile_record.subscription_tier
    );
    
    RAISE NOTICE 'Check usage pour user %: %', user_uuid, result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. S'assurer que les colonnes existent et ont les bonnes valeurs par défaut
DO $$
BEGIN
    -- Vérifier templates_used
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'templates_used'
    ) THEN
        ALTER TABLE profiles ADD COLUMN templates_used INTEGER DEFAULT 0 NOT NULL;
        RAISE NOTICE 'Colonne templates_used créée';
    END IF;
    
    -- Vérifier templates_limit
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'templates_limit'
    ) THEN
        ALTER TABLE profiles ADD COLUMN templates_limit INTEGER DEFAULT 3 NOT NULL;
        RAISE NOTICE 'Colonne templates_limit créée';
    END IF;
END $$;

-- 5. Mettre à jour les valeurs NULL si elles existent
UPDATE profiles 
SET templates_used = 0 
WHERE templates_used IS NULL;

UPDATE profiles 
SET templates_limit = CASE 
    WHEN subscription_tier = 'free' THEN 3
    WHEN subscription_tier = 'starter' THEN 20
    WHEN subscription_tier = 'pro' THEN 40
    WHEN subscription_tier = 'enterprise' THEN 999999
    ELSE 3
END
WHERE templates_limit IS NULL OR templates_limit = 0;

-- 6. Vérification finale
SELECT 
    'Fonction increment_user_templates_usage créée' as status,
    COUNT(*) as nb_profiles_avec_usage
FROM profiles
WHERE templates_used IS NOT NULL;

-- 7. Test de la fonction (à décommenter si vous voulez tester)
-- SELECT increment_user_templates_usage('00000000-0000-0000-0000-000000000000'::UUID);
-- SELECT check_usage_limit('00000000-0000-0000-0000-000000000000'::UUID);

