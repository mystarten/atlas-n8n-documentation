-- Ajouter les colonnes Stripe dans la table user_usage
ALTER TABLE user_usage 
ADD COLUMN stripe_customer_id TEXT,
ADD COLUMN stripe_subscription_id TEXT;

-- Commentaires pour documenter les colonnes
COMMENT ON COLUMN user_usage.stripe_customer_id IS 'ID du client Stripe pour les paiements';
COMMENT ON COLUMN user_usage.stripe_subscription_id IS 'ID de l\'abonnement Stripe actif';



