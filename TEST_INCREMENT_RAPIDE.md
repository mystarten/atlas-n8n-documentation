# TEST RAPIDE - Vérifier que l'incrémentation fonctionne

## ⚡ Test en 2 minutes

### 1️⃣ Appliquer le script SQL (OBLIGATOIRE)

**Aller dans Supabase Dashboard :**
```
https://supabase.com/dashboard/project/VOTRE-PROJECT-ID/sql/new
```

**Copier-coller le contenu de** `supabase-fix-increment-function.sql`

**Cliquer sur RUN** ✅

Vous devriez voir :
```
Fonction increment_user_templates_usage créée
SUCCESS (temps d'exécution: ~200ms)
```

### 2️⃣ Tester la fonction manuellement

Dans le même SQL Editor, exécuter :

```sql
-- Voir vos profils actuels
SELECT id, email, templates_used, templates_limit, subscription_tier 
FROM profiles 
LIMIT 5;
```

**Copier votre UUID** (première colonne `id`)

Ensuite tester l'incrémentation :

```sql
-- Remplacer XXX-XXX-XXX par votre vrai UUID
SELECT increment_user_templates_usage('XXX-XXX-XXX'::UUID);
```

✅ **Résultat attendu :** `1` (ou le nombre actuel + 1)

Vérifier :

```sql
-- Remplacer XXX-XXX-XXX par votre vrai UUID
SELECT templates_used FROM profiles WHERE id = 'XXX-XXX-XXX'::UUID;
```

✅ **Résultat attendu :** Le nombre a augmenté de 1

### 3️⃣ Tester dans l'app

1. **Ouvrir** `http://localhost:3000/generate`
2. **Regarder le compteur** en haut à droite : `0 / 3` (ou autre)
3. **Uploader un fichier JSON** (n'importe lequel)
4. **Cliquer sur "Générer"**
5. **Attendre la fin de génération**
6. **Vérifier que le compteur a changé** : `1 / 3` 🎉

### 4️⃣ Vérifier les logs

**Ouvrir DevTools** (F12) → Console

Chercher ces logs :

```
🔄 Incrémentation de l'usage...
📊 Réponse incrémentation: 200 OK
✅ Usage incrémenté: {success: true, newCount: 1}
📊 Nouvelles stats: {used: 1, limit: 3, tier: 'free'}
```

## ❌ Si ça ne marche pas

### Erreur : "fonction increment_user_templates_usage inexistante"

➡️ **Solution :** Vous n'avez pas exécuté le script SQL dans Supabase
Retourner à l'étape 1️⃣

### Erreur : "permission denied for function increment_user_templates_usage"

➡️ **Solution :** Problème de RLS, exécuter dans SQL Editor :

```sql
GRANT EXECUTE ON FUNCTION increment_user_templates_usage(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION check_usage_limit(UUID) TO authenticated, service_role;
```

### Le compteur reste à 0 / 3

➡️ **Solution :** Vérifier dans Supabase → Table Editor → profiles

1. Chercher votre user (par email)
2. Regarder la colonne `templates_used`
3. Si elle est NULL ou n'existe pas → Relancer le script SQL

### L'API retourne 404

➡️ **Solution :** Le profil n'existe pas dans `profiles`

Exécuter dans SQL Editor :

```sql
-- Voir tous vos users
SELECT u.id, u.email, p.templates_used, p.templates_limit
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
ORDER BY u.created_at DESC
LIMIT 10;
```

Si vous voyez des users sans profil (NULL), créer manuellement :

```sql
-- Remplacer XXX-XXX-XXX par l'UUID du user sans profil
INSERT INTO profiles (id, templates_used, templates_limit, subscription_tier)
VALUES ('XXX-XXX-XXX'::UUID, 0, 3, 'free')
ON CONFLICT (id) DO UPDATE SET
  templates_used = 0,
  templates_limit = 3,
  subscription_tier = 'free';
```

## ✅ Résumé Ultra-Rapide

1. **Exécuter** `supabase-fix-increment-function.sql` dans Supabase SQL Editor
2. **Tester** dans l'app `/generate`
3. **Vérifier** que le compteur passe de `0 / 3` à `1 / 3`

**C'est tout ! 🚀**

