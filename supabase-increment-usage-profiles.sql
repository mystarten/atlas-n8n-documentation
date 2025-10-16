-- ════════════════════════════════════════════════════════════════════════════
-- FONCTION POUR INCRÉMENTER L'USAGE DANS LA TABLE PROFILES
-- ════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.increment_templates_used()
RETURNS INTEGER AS $$
BEGIN
  -- Cette fonction sera appelée dans un contexte UPDATE
  -- Elle retourne templates_used + 1
  RETURN templates_used + 1;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ════════════════════════════════════════════════════════════════════════════
-- ALTERNATIVE : Fonction RPC pour incrémenter l'usage d'un utilisateur
-- ════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.increment_user_templates_usage(user_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
    new_count INTEGER;
BEGIN
    UPDATE profiles 
    SET 
        templates_used = templates_used + 1,
        updated_at = NOW()
    WHERE id = user_id_param
    RETURNING templates_used INTO new_count;
    
    RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
