-- ════════════════════════════════════════════════════════════════════════════
-- NETTOYAGE COMPLET SUPABASE - ATTENTION : SUPPRIME TOUT !
-- ════════════════════════════════════════════════════════════════════════════
-- ⚠️  EXÉCUTER CETTE COMMANDE DANS SUPABASE SQL EDITOR
-- ⚠️  CETTE COMMANDE VA SUPPRIMER TOUTES LES TABLES ET DONNÉES
-- ⚠️  UTILISER SEULEMENT POUR RECONSTRUIRE PROPREMENT
-- ════════════════════════════════════════════════════════════════════════════

-- 1. Supprimer tous les triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- 2. Supprimer toutes les fonctions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.increment_user_templates_usage(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.check_usage_limit(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.get_templates_limit(TEXT) CASCADE;

-- 3. Supprimer toutes les politiques RLS
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- 4. Supprimer toutes les tables (dans l'ordre pour éviter les contraintes)
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- 5. Vérifier que tout est supprimé
SELECT 
    'Tables restantes dans public:' as status, 
    table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

SELECT 
    'Fonctions restantes dans public:' as status, 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;

SELECT 
    'Politiques restantes:' as status, 
    schemaname,
    tablename,
    policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 6. Message de confirmation
SELECT 
    'NETTOYAGE TERMINÉ' as status,
    'Toutes les tables et fonctions ont été supprimées' as message,
    'Vous pouvez maintenant exécuter les scripts de reconstruction' as next_step;

-- ⚠️  APRÈS CETTE COMMANDE, TOUTES LES DONNÉES SERONT SUPPRIMÉES
-- ⚠️  PROCÉDER À LA RECONSTRUCTION AVEC LES SCRIPTS :
-- ⚠️  1. supabase-schema-complete.sql
-- ⚠️  2. supabase-stripe-schema.sql  
-- ⚠️  3. supabase-fix-increment-function.sql
-- ⚠️  4. supabase-fix-profiles-table.sql
-- ⚠️  5. supabase-fix-rls-permissions.sql
