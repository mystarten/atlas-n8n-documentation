-- ════════════════════════════════════════════════════════════════════════════
-- SCHEMA COMPLET SUPABASE POUR ATLAS
-- ════════════════════════════════════════════════════════════════════════════
-- Ce script crée toutes les tables et fonctions nécessaires pour ATLAS
-- ════════════════════════════════════════════════════════════════════════════

-- 1. Créer la table profiles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'pro', 'enterprise')),
    templates_used INTEGER DEFAULT 0 NOT NULL,
    templates_limit INTEGER DEFAULT 3 NOT NULL,
    company_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    onboarding_completed BOOLEAN DEFAULT FALSE
);

-- 2. Créer la fonction pour obtenir la limite de templates selon le plan
CREATE OR REPLACE FUNCTION public.get_templates_limit(subscription_tier TEXT)
RETURNS INTEGER AS $$
BEGIN
    CASE subscription_tier
        WHEN 'free' THEN RETURN 3;
        WHEN 'starter' THEN RETURN 20;
        WHEN 'pro' THEN RETURN 40;
        WHEN 'enterprise' THEN RETURN 999999;
        ELSE RETURN 3;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- 3. Créer la fonction pour incrémenter l'usage des templates
CREATE OR REPLACE FUNCTION public.increment_user_templates_usage(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    new_count INTEGER;
    current_tier TEXT;
BEGIN
    -- Récupérer le tier actuel
    SELECT subscription_tier INTO current_tier
    FROM profiles
    WHERE id = user_uuid;
    
    -- Si l'utilisateur n'existe pas, créer un profil par défaut
    IF current_tier IS NULL THEN
        INSERT INTO profiles (id, email, templates_used, templates_limit, subscription_tier)
        VALUES (user_uuid, 'user@example.com', 1, 3, 'free')
        RETURNING templates_used INTO new_count;
        
        RAISE NOTICE 'Profil créé pour user %, usage: %', user_uuid, new_count;
        RETURN new_count;
    END IF;
    
    -- Si plan Enterprise, ne PAS incrémenter (illimité)
    IF current_tier = 'enterprise' THEN
        SELECT templates_used INTO new_count
        FROM profiles
        WHERE id = user_uuid;
        
        RAISE NOTICE 'Plan Enterprise - pas d''incrémentation pour user %, usage: %', user_uuid, new_count;
        RETURN new_count;
    END IF;
    
    -- Pour les autres plans, incrémenter normalement
    UPDATE profiles 
    SET 
        templates_used = COALESCE(templates_used, 0) + 1,
        updated_at = NOW()
    WHERE id = user_uuid
    RETURNING templates_used INTO new_count;
    
    RAISE NOTICE 'Usage incrémenté pour user %, nouveau count: %', user_uuid, new_count;
    RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Créer la fonction pour vérifier les limites d'usage
CREATE OR REPLACE FUNCTION public.check_usage_limit(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    profile_record RECORD;
    result JSON;
BEGIN
    -- Récupérer les données du profil
    SELECT 
        COALESCE(templates_used, 0) as templates_used, 
        COALESCE(templates_limit, 3) as templates_limit, 
        COALESCE(subscription_tier, 'free') as subscription_tier
    INTO profile_record
    FROM profiles
    WHERE id = user_uuid;
    
    -- Si le profil n'existe pas, créer un enregistrement par défaut
    IF NOT FOUND THEN
        INSERT INTO profiles (id, email, templates_used, templates_limit, subscription_tier)
        VALUES (user_uuid, 'user@example.com', 0, 3, 'free')
        RETURNING 
            COALESCE(templates_used, 0) as templates_used, 
            COALESCE(templates_limit, 3) as templates_limit, 
            COALESCE(subscription_tier, 'free') as subscription_tier 
        INTO profile_record;
        
        RAISE NOTICE 'Profil créé pour check_usage_limit user %', user_uuid;
    END IF;
    
    -- Construire la réponse
    result := json_build_object(
        'allowed', profile_record.templates_used < profile_record.templates_limit,
        'current', profile_record.templates_used,
        'limit', profile_record.templates_limit,
        'tier', profile_record.subscription_tier
    );
    
    RAISE NOTICE 'Check usage pour user %: %', user_uuid, result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Activer RLS sur la table profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 6. Créer les politiques RLS
CREATE POLICY "Enable read access for all users" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on email" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- 7. Créer un trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Créer un trigger pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, subscription_tier, templates_used, templates_limit)
    VALUES (
        NEW.id,
        NEW.email,
        'free',
        0,
        3
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 9. Donner les permissions nécessaires
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON TABLE profiles TO authenticated;
GRANT ALL ON TABLE profiles TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_user_templates_usage(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_user_templates_usage(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.check_usage_limit(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_usage_limit(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_templates_limit(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_templates_limit(TEXT) TO service_role;

-- 10. Vérification finale
SELECT 
    'Schema créé avec succès' as status,
    COUNT(*) as nb_fonctions,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'profiles') as nb_tables
FROM information_schema.routines 
WHERE routine_name IN ('increment_user_templates_usage', 'check_usage_limit', 'get_templates_limit');
