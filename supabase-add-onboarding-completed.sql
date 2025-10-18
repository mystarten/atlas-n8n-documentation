-- Ajouter la colonne onboarding_completed si elle n'existe pas déjà
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Mettre à jour les profils existants pour marquer l'onboarding comme terminé
UPDATE user_profiles 
SET onboarding_completed = true 
WHERE onboarding_completed IS NULL;

