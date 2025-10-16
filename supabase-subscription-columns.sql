-- Ajouter les colonnes pour gérer les abonnements annulés
ALTER TABLE user_usage 
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active';

