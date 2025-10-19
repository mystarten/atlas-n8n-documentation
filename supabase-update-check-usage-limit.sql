-- Mettre à jour la fonction RPC pour gérer correctement Enterprise (illimité)

CREATE OR REPLACE FUNCTION check_usage_limit(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    usage_record RECORD;
    limits JSON;
    result JSON;
    user_limit INTEGER;
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
    
    -- Récupérer la limite pour ce tier
    user_limit := (limits->>usage_record.subscription_tier)::INTEGER;
    
    -- Pour Enterprise, toujours autoriser (illimité)
    IF usage_record.subscription_tier = 'enterprise' THEN
        result := json_build_object(
            'allowed', true,
            'current', usage_record.templates_generated,
            'limit', 999999,
            'tier', usage_record.subscription_tier
        );
    ELSE
        -- Pour les autres plans, vérifier la limite
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

-- Tester la fonction
SELECT check_usage_limit((SELECT id FROM auth.users WHERE email = 'starten.contact@gmail.com'));







