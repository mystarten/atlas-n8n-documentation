-- CORRECTION 1 : Ajouter 'enterprise' aux valeurs autorisées
-- Supprimer l'ancienne contrainte
ALTER TABLE user_usage DROP CONSTRAINT IF EXISTS user_usage_subscription_tier_check;

-- Recréer la contrainte avec 'enterprise'
ALTER TABLE user_usage 
ADD CONSTRAINT user_usage_subscription_tier_check 
CHECK (subscription_tier IN ('free', 'starter', 'pro', 'enterprise'));

-- CORRECTION 2 : Ajouter la colonne company_name pour le plan Enterprise
ALTER TABLE user_usage 
ADD COLUMN IF NOT EXISTS company_name TEXT;

-- VÉRIFICATION : Afficher les colonnes de la table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_usage'
ORDER BY ordinal_position;

-- TEST : Mettre à jour un utilisateur en enterprise (remplacer [USER_ID] par un vrai ID)
-- UPDATE user_usage 
-- SET subscription_tier = 'enterprise', company_name = 'Mon Entreprise Test' 
-- WHERE user_id = '[USER_ID]';





