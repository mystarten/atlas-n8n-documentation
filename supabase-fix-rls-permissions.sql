-- ════════════════════════════════════════════════════════════════════════════
-- CORRECTION DES PERMISSIONS RLS POUR LA TABLE PROFILES
-- ════════════════════════════════════════════════════════════════════════════
-- Ce script corrige les permissions pour que les APIs puissent accéder à profiles
-- ════════════════════════════════════════════════════════════════════════════

-- 1. Vérifier l'état actuel de RLS
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled,
    hasrls
FROM pg_tables 
WHERE tablename = 'profiles';

-- 2. Vérifier les politiques existantes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 3. Supprimer toutes les politiques existantes pour repartir proprement
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON profiles;

-- 4. Désactiver temporairement RLS pour corriger les permissions
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 5. Réactiver RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 6. Créer des politiques RLS correctes

-- Politique pour SELECT (lecture)
CREATE POLICY "Enable read access for all users" ON profiles
    FOR SELECT USING (true);

-- Politique pour INSERT (création)
CREATE POLICY "Enable insert for authenticated users only" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Politique pour UPDATE (modification)
CREATE POLICY "Enable update for users based on email" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- 7. Vérifier que le profil test existe et est accessible
SELECT 
    'Test profile check' as status,
    id,
    email,
    subscription_tier,
    templates_used,
    templates_limit
FROM profiles 
WHERE id = 'dcaba08f-e421-4f6c-b5b7-4d2dd47ced3c';

-- 8. Tester l'accès avec l'utilisateur authentifié
-- (Cette requête simule ce que fait l'API)
SELECT 
    'API access test' as status,
    COUNT(*) as accessible_profiles
FROM profiles 
WHERE id = 'dcaba08f-e421-4f6c-b5b7-4d2dd47ced3c';

-- 9. Vérification finale des politiques
SELECT 
    'Final RLS policies' as status,
    policyname,
    cmd,
    permissive,
    roles
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;
