-- Schéma de base de données pour le système de limites d'utilisation Atlas

-- Table pour stocker l'utilisation des utilisateurs
CREATE TABLE IF NOT EXISTS user_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  templates_generated INTEGER DEFAULT 0 NOT NULL,
  subscription_tier TEXT DEFAULT 'free' NOT NULL CHECK (subscription_tier IN ('free', 'starter', 'pro', 'enterprise')),
  last_generated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_user_usage_user_id ON user_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_user_usage_tier ON user_usage(subscription_tier);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour updated_at
CREATE TRIGGER update_user_usage_updated_at 
    BEFORE UPDATE ON user_usage 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - Les utilisateurs ne peuvent voir que leurs propres données
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

-- Politique RLS pour user_usage
CREATE POLICY "Users can view their own usage" ON user_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage" ON user_usage
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" ON user_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fonction pour incrémenter l'usage d'un utilisateur
CREATE OR REPLACE FUNCTION increment_user_usage(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    new_count INTEGER;
BEGIN
    -- Incrémenter le compteur et retourner la nouvelle valeur
    UPDATE user_usage 
    SET 
        templates_generated = templates_generated + 1,
        last_generated_at = NOW()
    WHERE user_id = user_uuid
    RETURNING templates_generated INTO new_count;
    
    -- Si l'utilisateur n'existe pas, le créer
    IF new_count IS NULL THEN
        INSERT INTO user_usage (user_id, templates_generated, last_generated_at)
        VALUES (user_uuid, 1, NOW())
        RETURNING templates_generated INTO new_count;
    END IF;
    
    RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier les limites d'utilisation
CREATE OR REPLACE FUNCTION check_usage_limit(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    usage_record RECORD;
    limits JSON;
    result JSON;
BEGIN
    -- Définir les limites par tier
    limits := '{"free": 3, "starter": 15, "pro": 40, "enterprise": 999999}'::JSON;
    
    -- Récupérer les données de l'utilisateur
    SELECT templates_generated, subscription_tier
    INTO usage_record
    FROM user_usage
    WHERE user_id = user_uuid;
    
    -- Si l'utilisateur n'existe pas, créer un enregistrement
    IF NOT FOUND THEN
        INSERT INTO user_usage (user_id, templates_generated, subscription_tier)
        VALUES (user_uuid, 0, 'free')
        RETURNING templates_generated, subscription_tier INTO usage_record;
    END IF;
    
    -- Construire la réponse
    result := json_build_object(
        'allowed', usage_record.templates_generated < (limits->>usage_record.subscription_tier)::INTEGER,
        'current', usage_record.templates_generated,
        'limit', (limits->>usage_record.subscription_tier)::INTEGER,
        'tier', usage_record.subscription_tier
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Données de test (optionnel)
-- INSERT INTO user_usage (user_id, templates_generated, subscription_tier) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 0, 'free')
-- ON CONFLICT (user_id) DO NOTHING;





