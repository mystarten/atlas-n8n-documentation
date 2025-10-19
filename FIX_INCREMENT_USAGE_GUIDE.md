# FIX INCRÉMENTATION USAGE - GUIDE COMPLET

## 🔴 Problème Identifié

Quand on clique sur "Générer la template", le compteur `templates_used` ne passe pas de 0 à 1, il ne s'incrémente pas.

### Cause du bug
La fonction RPC `increment_user_templates_usage` utilisée par le code n'existe pas ou utilise une mauvaise table.

## ✅ Solution

### ÉTAPE 1 : Appliquer le script SQL dans Supabase

1. **Aller dans Supabase Dashboard** → SQL Editor
2. **Coller le contenu du fichier** `supabase-fix-increment-function.sql`
3. **Cliquer sur RUN** 

Ce script va :
- Créer la fonction `increment_user_templates_usage()` qui utilise la table `profiles`
- Créer/corriger la fonction `check_usage_limit()`
- S'assurer que les colonnes `templates_used` et `templates_limit` existent
- Mettre à jour les valeurs NULL

### ÉTAPE 2 : Vérifier que RLS est bien configuré

Si vous avez des problèmes de permissions, exécutez ceci dans SQL Editor :

```sql
-- Vérifier que RLS est activé
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- Si rowsecurity = false, activer RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Créer les policies si elles n'existent pas
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Pour les fonctions SECURITY DEFINER, donner accès service_role
GRANT EXECUTE ON FUNCTION increment_user_templates_usage(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION check_usage_limit(UUID) TO authenticated, service_role;
```

### ÉTAPE 3 : Tester la fonction manuellement

Dans SQL Editor, testez avec votre vrai user_id :

```sql
-- 1. Voir votre profil actuel
SELECT id, email, templates_used, templates_limit, subscription_tier 
FROM profiles 
LIMIT 5;

-- 2. Tester l'incrémentation (remplacer par votre UUID)
SELECT increment_user_templates_usage('VOTRE-USER-UUID-ICI'::UUID);

-- 3. Vérifier que ça a incrémenté
SELECT id, email, templates_used, templates_limit 
FROM profiles 
WHERE id = 'VOTRE-USER-UUID-ICI'::UUID;

-- 4. Tester check_usage_limit
SELECT check_usage_limit('VOTRE-USER-UUID-ICI'::UUID);
```

### ÉTAPE 4 : Redémarrer le serveur Next.js

Dans le terminal :

```bash
# Arrêter le serveur (Ctrl+C)
# Relancer
npm run dev
```

### ÉTAPE 5 : Tester dans l'application

1. **Aller sur** `/generate`
2. **Vérifier que le compteur affiche** `0 / 3` (ou votre limite)
3. **Uploader un fichier JSON** et cliquer sur "Générer"
4. **Après génération**, le compteur doit passer à `1 / 3`

### ÉTAPE 6 : Vérifier les logs

Ouvrir la **Console DevTools** (F12) et chercher :

✅ **Logs de succès attendus :**
```
🔄 Chargement des données utilisateur...
📊 Stats récupérées: {used: 0, limit: 3, tier: 'free'}
✅ Données usage chargées
🔄 Incrémentation de l'usage...
📊 Réponse incrémentation: 200 OK
✅ Usage incrémenté: {success: true, newCount: 1}
🔄 Rafraîchissement des stats...
📊 Nouvelles stats: {used: 1, limit: 3, tier: 'free'}
✅ Stats rafraîchies après génération
```

❌ **Erreurs à corriger :**
```
❌ Erreur incrémentation: 404
❌ Profil non trouvé
❌ Erreur serveur: fonction increment_user_templates_usage inexistante
```

## 🔍 Debug Avancé

Si ça ne marche toujours pas :

### Vérifier que la table profiles a les bonnes colonnes

```sql
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('templates_used', 'templates_limit', 'subscription_tier')
ORDER BY column_name;
```

### Vérifier que la fonction existe

```sql
SELECT 
    routine_name, 
    routine_type, 
    security_type
FROM information_schema.routines
WHERE routine_name IN ('increment_user_templates_usage', 'check_usage_limit');
```

### Vérifier les permissions

```sql
SELECT 
    grantee, 
    privilege_type
FROM information_schema.role_routine_grants
WHERE routine_name = 'increment_user_templates_usage';
```

## 📝 Résumé des Fichiers Modifiés

- ✅ **`supabase-fix-increment-function.sql`** : Script SQL à exécuter dans Supabase
- ✅ **`app/api/increment-usage/route.ts`** : Déjà corrigé, utilise `profiles`
- ✅ **`app/api/user/stats/route.ts`** : Déjà corrigé, lit depuis `profiles`
- ✅ **`app/generate/page.tsx`** : Déjà corrigé, appelle `/api/increment-usage`

## ✅ Checklist Finale

- [ ] Script SQL exécuté dans Supabase
- [ ] Fonction `increment_user_templates_usage` créée
- [ ] Colonnes `templates_used` et `templates_limit` existent dans `profiles`
- [ ] RLS activé et policies créées
- [ ] Serveur Next.js redémarré
- [ ] Test manuel : compteur passe de 0 à 1 après génération
- [ ] Logs dans DevTools confirment l'incrémentation

---

**Si tout est OK, le compteur doit maintenant s'incrémenter correctement ! 🎉**

