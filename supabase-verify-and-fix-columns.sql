-- SCRIPT DE VÉRIFICATION ET CORRECTION DES COLONNES
-- Ce script vérifie et corrige les colonnes nécessaires

-- 1. Vérifier si les colonnes existent
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('templates_used', 'templates_limit')
ORDER BY column_name;

-- 2. Si les colonnes n'existent pas, les créer
DO $$
BEGIN
    -- Ajouter templates_used si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'templates_used'
    ) THEN
        ALTER TABLE profiles ADD COLUMN templates_used INTEGER DEFAULT 0;
        RAISE NOTICE 'Colonne templates_used ajoutée';
    ELSE
        RAISE NOTICE 'Colonne templates_used existe déjà';
    END IF;
    
    -- Ajouter templates_limit si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'templates_limit'
    ) THEN
        ALTER TABLE profiles ADD COLUMN templates_limit INTEGER DEFAULT 3;
        RAISE NOTICE 'Colonne templates_limit ajoutée';
    ELSE
        RAISE NOTICE 'Colonne templates_limit existe déjà';
    END IF;
END $$;

-- 3. Mettre à jour les limites selon le tier
UPDATE profiles 
SET templates_limit = CASE 
    WHEN subscription_tier = 'free' THEN 3
    WHEN subscription_tier = 'starter' THEN 20
    WHEN subscription_tier = 'pro' THEN 40
    WHEN subscription_tier = 'enterprise' THEN 999999
    ELSE 3
END
WHERE templates_limit IS NULL OR templates_limit = 3;

-- 4. S'assurer que templates_used est à 0 pour tous les utilisateurs existants
UPDATE profiles 
SET templates_used = 0
WHERE templates_used IS NULL;

-- 5. Vérification finale
SELECT 
    id,
    subscription_tier,
    templates_used,
    templates_limit,
    updated_at
FROM profiles 
ORDER BY updated_at DESC
LIMIT 10;
