# Configuration à faire - Atlas

## ✅ ÉTAPE 1 : Corriger la contrainte Supabase (CRITIQUE)

**Fichier :** `supabase-fix-enterprise-constraint.sql`

**Actions :**
1. Ouvrir Supabase Dashboard
2. Aller dans SQL Editor
3. Copier-coller le contenu de `supabase-fix-enterprise-constraint.sql`
4. Exécuter le script
5. Vérifier qu'il n'y a pas d'erreur

**SQL à exécuter :**
```sql
ALTER TABLE user_usage DROP CONSTRAINT IF EXISTS user_usage_subscription_tier_check;
ALTER TABLE user_usage ADD CONSTRAINT user_usage_subscription_tier_check 
CHECK (subscription_tier IN ('free', 'starter', 'pro', 'enterprise'));
ALTER TABLE user_usage ADD COLUMN IF NOT EXISTS company_name TEXT;
```

## ✅ ÉTAPE 2 : Configurer les variables d'environnement

**Créer `.env.local` avec :**

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe Price IDs
STRIPE_PRICE_STARTER=price_1SIPjARy2u5FNwIA8BWqWi9g
STRIPE_PRICE_PRO=price_1SIPjqRy2u5FNwIAKvxx3C79
STRIPE_PRICE_ENTERPRISE=price_1SIPkQRy2u5FNwIAwPpCKgWU

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ibikrttopnusseutvzvb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
SUPABASE_SERVICE_ROLE_KEY=eyJh...

# App URLs
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## ✅ ÉTAPE 3 : Configurer le webhook Stripe (Développement)

**Option A : Stripe CLI (Recommandée)**

1. Installer Stripe CLI : https://stripe.com/docs/stripe-cli
2. Se connecter :
   ```bash
   stripe login
   ```
3. Forwarder les webhooks :
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Copier le webhook secret affiché (`whsec_...`)
5. L'ajouter dans `.env.local` : `STRIPE_WEBHOOK_SECRET=whsec_...`
6. Redémarrer le serveur Next.js

**Option B : Stripe Dashboard (Production)**

1. Aller sur https://dashboard.stripe.com/webhooks
2. Cliquer "Add endpoint"
3. URL : `https://votre-domaine.com/api/webhooks/stripe`
4. Événements : 
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copier le "Signing secret"
6. L'ajouter dans les variables d'environnement de production

## ✅ ÉTAPE 4 : Tester le système

### Test 1 : Page Admin

1. Démarrer le serveur : `npm run dev`
2. Aller sur `http://localhost:3000/admin`
3. Vérifier les informations affichées
4. Tester "Changer de plan" vers "Enterprise"
5. Vérifier que l'UI se met à jour instantanément

### Test 2 : Synchronisation Stripe

1. Sur `/admin`, cliquer "🔄 Synchroniser avec Stripe"
2. Vérifier les logs dans le terminal
3. Vérifier que le plan est récupéré depuis Stripe
4. Vérifier que Supabase est mis à jour

### Test 3 : Sélecteur de format

1. Aller sur la page d'accueil `/`
2. Se connecter avec un compte Starter/Pro/Enterprise
3. Uploader un fichier JSON
4. Vérifier que le sélecteur "Notes n8n" / "PDF" s'affiche
5. Sélectionner un format et générer

### Test 4 : Paiement réel

1. Aller sur `/pricing`
2. Cliquer sur "S'abonner" pour Starter
3. Utiliser carte test : `4242 4242 4242 4242`
4. Compléter le paiement
5. Vérifier que :
   - Le webhook Stripe est déclenché (logs dans terminal)
   - Supabase est mis à jour automatiquement
   - L'UI affiche le nouveau plan

## 📋 Pages créées

| Page | URL | Description |
|------|-----|-------------|
| Admin | `/admin` | Gestion et test du compte |
| Templates | `/templates` | Liste des templates générés |
| Account | `/account` | Tableau de bord utilisateur |
| Pricing | `/pricing` | Plans et abonnements |

## 🔗 APIs créées

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/webhooks/stripe` | POST | Webhook Stripe (sync auto) |
| `/api/sync-stripe` | POST | Synchronisation manuelle |
| `/api/calculate-upgrade-cost` | POST | Calcul différence de prix |
| `/api/upgrade-subscription-immediate` | POST | Upgrade avec paiement différentiel |
| `/api/create-checkout-session` | POST | Création session paiement |
| `/api/customer-portal` | POST | Portail client Stripe |
| `/api/webhook` | POST | Webhook paiements (existant) |

## 🎯 Fonctionnalités principales

### 1. Upgrade immédiat
- Paiement de la différence de prix
- Accès instantané au nouveau plan
- Reset du compteur de templates

### 2. Synchronisation automatique
- Webhook Stripe → Supabase
- Mise à jour en temps réel
- Gestion des annulations

### 3. Sélecteur de format
- Notes n8n (post-it dans workflow)
- Export PDF
- Envoyé au webhook n8n

### 4. UserContext global
- État partagé dans toute l'app
- Rafraîchissement automatique
- Performance optimisée

## 🐛 Dépannage

### Le plan ne se met pas à jour après paiement

1. Vérifier les logs du webhook Stripe :
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

2. Aller sur `/admin` et cliquer "Synchroniser avec Stripe"

3. Vérifier les variables d'environnement :
   - `STRIPE_PRICE_STARTER`
   - `STRIPE_PRICE_PRO`
   - `STRIPE_PRICE_ENTERPRISE`

### Erreur "violates check constraint"

C'est que le SQL de l'étape 1 n'a pas été exécuté.
Aller sur Supabase et exécuter `supabase-fix-enterprise-constraint.sql`.

### Le sélecteur PDF/Notes ne s'affiche pas

Vérifier que :
1. L'utilisateur est connecté
2. Le plan n'est pas "free"
3. Un fichier a été uploadé
4. Le `userPlan` state est bien récupéré

## 📝 Notes importantes

- Le webhook `/api/webhook` (existant) gère les nouveaux paiements
- Le webhook `/api/webhooks/stripe` (nouveau) gère les changements d'abonnement
- Les deux peuvent coexister
- En cas de doute, utiliser le bouton "Synchroniser avec Stripe" sur `/admin`

## 🚀 Déploiement

1. Pousser le code sur GitHub
2. Déployer sur Vercel
3. Configurer les variables d'environnement sur Vercel
4. Créer le webhook Stripe en mode Live avec l'URL de production
5. Tester avec une vraie carte




