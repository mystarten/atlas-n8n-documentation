-- ════════════════════════════════════════════════════════════════════════════
-- CORRECTION DE LA TABLE PROFILES
-- ════════════════════════════════════════════════════════════════════════════
-- Ce script vérifie et corrige la table profiles pour éviter les erreurs 403/400
-- ════════════════════════════════════════════════════════════════════════════

-- 1. Vérifier que la table profiles existe
SELECT 'Table profiles exists' as status, COUNT(*) as count FROM profiles;

-- 2. Vérifier les colonnes de la table profiles
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 3. Ajouter la colonne company_name si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'company_name'
    ) THEN
        ALTER TABLE profiles ADD COLUMN company_name TEXT;
        RAISE NOTICE 'Colonne company_name ajoutée';
    ELSE
        RAISE NOTICE 'Colonne company_name existe déjà';
    END IF;
END $$;

-- 4. Vérifier les politiques RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 5. S'assurer que RLS est activé
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 6. Créer une politique pour permettre aux utilisateurs de lire leur propre profil
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- 7. Créer une politique pour permettre aux utilisateurs de modifier leur propre profil
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- 8. Créer une politique pour permettre aux utilisateurs d'insérer leur propre profil
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 9. Vérifier que l'utilisateur test a un profil
SELECT 
    'User profile check' as status,
    id,
    subscription_tier,
    templates_used,
    templates_limit,
    company_name
FROM profiles 
WHERE id = 'dcaba08f-e421-4f6c-b5b7-4d2dd47ced3c';

-- 10. Créer un profil par défaut pour l'utilisateur test si il n'en a pas
INSERT INTO profiles (id, subscription_tier, templates_used, templates_limit, company_name)
VALUES (
    'dcaba08f-e421-4f6c-b5b7-4d2dd47ced3c',
    'free',
    0,
    3,
    NULL
) ON CONFLICT (id) DO UPDATE SET
    subscription_tier = EXCLUDED.subscription_tier,
    templates_used = COALESCE(profiles.templates_used, 0),
    templates_limit = COALESCE(profiles.templates_limit, 3),
    company_name = COALESCE(profiles.company_name, EXCLUDED.company_name);

-- 11. Vérification finale
SELECT 
    'Final check' as status,
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN id = 'dcaba08f-e421-4f6c-b5b7-4d2dd47ced3c' THEN 1 END) as test_user_exists
FROM profiles;
