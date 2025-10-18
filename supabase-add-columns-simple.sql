-- SCRIPT SIMPLIFIÉ : Ajouter les colonnes manquantes dans profiles
-- Ce script est plus simple et sûr que le précédent

-- 1. Ajouter les colonnes si elles n'existent pas
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS templates_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS templates_limit INTEGER DEFAULT 3;

-- 2. Mettre à jour les limites selon le tier existant
UPDATE profiles 
SET templates_limit = CASE 
    WHEN subscription_tier = 'free' THEN 3
    WHEN subscription_tier = 'starter' THEN 20
    WHEN subscription_tier = 'pro' THEN 40
    WHEN subscription_tier = 'enterprise' THEN 999999
    ELSE 3
END
WHERE templates_limit IS NULL OR templates_limit = 3;

-- 3. S'assurer que templates_used est à 0 pour tous les utilisateurs existants
UPDATE profiles 
SET templates_used = 0
WHERE templates_used IS NULL;

-- 4. Vérifier que les colonnes existent
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('templates_used', 'templates_limit');

-- 5. Test : Voir quelques profils
SELECT id, subscription_tier, templates_used, templates_limit 
FROM profiles 
LIMIT 5;
