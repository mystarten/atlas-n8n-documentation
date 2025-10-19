-- Mettre à jour la fonction RPC pour NE PAS incrémenter si plan Enterprise

CREATE OR REPLACE FUNCTION increment_user_usage(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    new_count INTEGER;
    current_tier TEXT;
BEGIN
    -- Récupérer le tier actuel
    SELECT subscription_tier INTO current_tier
    FROM user_usage
    WHERE user_id = user_uuid;
    
    -- Si l'utilisateur n'existe pas, le créer
    IF current_tier IS NULL THEN
        INSERT INTO user_usage (user_id, templates_generated, last_generated_at, subscription_tier)
        VALUES (user_uuid, 1, NOW(), 'free')
        RETURNING templates_generated INTO new_count;
        RETURN new_count;
    END IF;
    
    -- Si plan Enterprise, ne PAS incrémenter (illimité)
    IF current_tier = 'enterprise' THEN
        -- Mettre à jour seulement last_generated_at
        UPDATE user_usage 
        SET last_generated_at = NOW()
        WHERE user_id = user_uuid
        RETURNING templates_generated INTO new_count;
        
        RETURN new_count;
    END IF;
    
    -- Pour les autres plans, incrémenter normalement
    UPDATE user_usage 
    SET 
        templates_generated = templates_generated + 1,
        last_generated_at = NOW()
    WHERE user_id = user_uuid
    RETURNING templates_generated INTO new_count;
    
    RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tester la fonction
SELECT increment_user_usage((SELECT id FROM auth.users WHERE email = 'starten.contact@gmail.com'));







