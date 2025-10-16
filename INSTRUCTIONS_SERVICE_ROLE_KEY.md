# 🔑 CONFIGURATION DE LA SERVICE_ROLE_KEY

## ⚠️ PROBLÈME ACTUEL

L'API `/api/user/stats` retourne toujours `{"used":0,"limit":3}` au lieu de `{"used":0,"limit":40}` 

**Cause :** Les Row Level Security (RLS) policies de Supabase bloquent la lecture du profile.

**Solution :** Utiliser la `SUPABASE_SERVICE_ROLE_KEY` pour bypass RLS dans les API routes.

---

## 📋 ÉTAPE 1 : RÉCUPÉRER LA SERVICE_ROLE_KEY

### 1. Aller sur Supabase Dashboard

```
https://supabase.com/dashboard
```

### 2. Sélectionner votre projet

Cliquer sur le projet **ATLAS**

### 3. Aller dans Settings → API

```
Settings (icône en bas à gauche) → API
```

### 4. Copier la clé "service_role"

Dans la section **"Project API keys"**, vous verrez :

- ✅ **anon / public** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (clé publique)
- 🔑 **service_role** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (clé secrète)

**Copier la clé `service_role`** (la deuxième, celle qui est cachée par défaut)

⚠️ **ATTENTION :** Cette clé donne un accès complet à la base de données, ne JAMAIS la commit dans Git !

---

## 📋 ÉTAPE 2 : AJOUTER LA CLÉ DANS .env.local

### 1. Ouvrir le fichier `.env.local`

Si le fichier n'existe pas, le créer à la racine du projet.

### 2. Ajouter cette ligne

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliaWtydHRvcG51c3NldXR2enZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ2OTgxMCwiZXhwIjoyMDc2MDQ1ODEwfQ.TVGXCgUUfXhXF5Utsqlyq2JBATeaquqWpyZ7TNMTT9I
```

**Remplacer** la valeur par la clé que vous venez de copier sur Supabase Dashboard.

### 3. Vérifier que .env.local contient TOUTES ces variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ibikrttopnusseutvzvb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # ← NOUVELLE

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_1SIPjARy2u5FNwIA8BWqWi9g
STRIPE_PRICE_PRO=price_1SIPjqRy2u5FNwIAKvxx3C79
STRIPE_PRICE_ENTERPRISE=price_1SIPkQRy2u5FNwIAwPpCKgWU

# Site URL
NEXT_PUBLIC_URL=http://localhost:3000
```

### 4. Vérifier que .env.local est dans .gitignore

```bash
# Vérifier que cette ligne existe dans .gitignore
.env.local
```

⚠️ **CRUCIAL :** Ne JAMAIS commit le fichier `.env.local` !

---

## 📋 ÉTAPE 3 : REDÉMARRER LE SERVEUR

```bash
# Arrêter le serveur Next.js (Ctrl+C dans le terminal)

# Redémarrer
npm run dev
```

**Important :** Next.js ne recharge pas automatiquement les variables d'environnement, il FAUT redémarrer !

---

## 📋 ÉTAPE 4 : TESTER L'ENDPOINT DE DEBUG

### 1. Dans le navigateur, aller sur :

```
http://localhost:3000/api/debug/fix-my-plan
```

### 2. Résultat attendu :

```json
{
  "success": true,
  "user_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "user_email": "votre@email.com",
  "before": {
    "subscription_tier": "free",
    "templates_limit": 3
  },
  "after": {
    "subscription_tier": "pro",
    "templates_limit": 40
  }
}
```

✅ Si vous voyez ça → La clé fonctionne et votre profil est mis à jour !

❌ Si erreur → Vérifier que :
- La clé `SUPABASE_SERVICE_ROLE_KEY` est bien dans `.env.local`
- Le serveur a bien été redémarré
- La clé est correcte (recopier depuis Supabase Dashboard)

---

## 📋 ÉTAPE 5 : VÉRIFIER L'API STATS

### Dans le navigateur, aller sur :

```
http://localhost:3000/api/user/stats
```

### Résultat attendu :

```json
{
  "used": 0,
  "limit": 40
}
```

✅ **40 au lieu de 3 → C'est réparé !**

---

## 📋 ÉTAPE 6 : VÉRIFIER LA PAGE ADMIN

### Aller sur :

```
http://localhost:3000/admin
```

### Tu devrais voir :

- **Plan :** Pro ✅
- **Templates :** 0 / 40 ✅

---

## 🔍 LOGS À VÉRIFIER

Dans la console du serveur Next.js, tu devrais voir :

```
📊 Stats pour votre@email.com : {
  subscription_tier: 'pro',
  templates_used: 0,
  templates_limit: 40
}
```

---

## ⚠️ SÉCURITÉ

### ❌ NE JAMAIS :

- Commit `.env.local` dans Git
- Partager la `service_role_key` publiquement
- Utiliser la `service_role_key` côté client (seulement dans les API routes)

### ✅ TOUJOURS :

- Garder `.env.local` local uniquement
- Utiliser `service_role_key` uniquement dans les API routes (`/api/*`)
- Vérifier que `.gitignore` contient `.env.local`

---

## 🆘 EN CAS DE PROBLÈME

### Problème : "Error: Invalid JWT"

**Solution :** La clé est incorrecte ou mal copiée
1. Retourner sur Supabase Dashboard → Settings → API
2. Re-copier la clé `service_role` (attention aux espaces)
3. Remplacer dans `.env.local`
4. Redémarrer le serveur

### Problème : L'API retourne toujours limit:3

**Solution :** Le serveur n'a pas redémarré ou la variable n'est pas chargée
1. Vérifier que `.env.local` contient bien `SUPABASE_SERVICE_ROLE_KEY=...`
2. Arrêter complètement le serveur (Ctrl+C)
3. Redémarrer avec `npm run dev`
4. Vider le cache du navigateur (Ctrl+F5)

### Problème : "Profile non trouvé"

**Solution :** L'email ne correspond pas
1. Aller sur `/api/debug/fix-my-plan`
2. Noter l'email retourné
3. Vérifier dans Supabase Dashboard → Table Editor → profiles que cet email existe
4. Si non, créer le profil manuellement dans Supabase

---

## ✅ CHECKLIST FINALE

- [ ] Clé `service_role` copiée depuis Supabase Dashboard
- [ ] `.env.local` contient `SUPABASE_SERVICE_ROLE_KEY=...`
- [ ] `.env.local` est dans `.gitignore`
- [ ] Serveur redémarré (`Ctrl+C` puis `npm run dev`)
- [ ] `/api/debug/fix-my-plan` retourne `success: true`
- [ ] `/api/user/stats` retourne `limit: 40`
- [ ] Page `/admin` affiche "0 / 40"

---

**🎉 Une fois ces étapes complétées, l'API stats fonctionnera correctement avec les vraies limites !**

