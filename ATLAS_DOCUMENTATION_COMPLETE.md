# 🚀 ATLAS - DOCUMENTATION COMPLÈTE

## 📋 TABLE DES MATIÈRES

1. [Vue d'ensemble du projet](#vue-densemble-du-projet)
2. [Architecture technique](#architecture-technique)
3. [Structure des pages](#structure-des-pages)
4. [Design et UI/UX](#design-et-uiux)
5. [Base de données Supabase](#base-de-données-supabase)
6. [Authentification](#authentification)
7. [API Routes](#api-routes)
8. [Intégrations externes](#intégrations-externes)
9. [Déploiement](#déploiement)
10. [Instructions de reconstruction](#instructions-de-reconstruction)

---

## 🎯 VUE D'ENSEMBLE DU PROJET

**ATLAS** est une plateforme SaaS qui automatise la documentation des workflows N8N. Elle permet aux utilisateurs d'uploader des fichiers JSON de workflows N8N et de générer automatiquement une documentation professionnelle.

### **Fonctionnalités principales :**
- 📄 Documentation automatique de workflows N8N
- 🔐 Authentification complète (email/password + Google OAuth)
- 💳 Système de paiement Stripe intégré
- 📊 Suivi d'usage des templates
- 🎨 Interface moderne et responsive
- 📱 Optimisé mobile-first

---

## 🏗️ ARCHITECTURE TECHNIQUE

### **Stack technologique :**
- **Frontend :** Next.js 14 (App Router), React, TypeScript
- **Styling :** Tailwind CSS
- **Animations :** Framer Motion
- **Backend :** Next.js API Routes
- **Base de données :** Supabase (PostgreSQL)
- **Authentification :** Supabase Auth
- **Paiements :** Stripe
- **Déploiement :** Vercel
- **Monitoring :** Sentry

### **Structure du projet :**
```
ATLAS/
├── app/                    # App Router Next.js
│   ├── (auth)/            # Routes d'authentification
│   ├── api/               # API Routes
│   ├── blog/              # Pages blog
│   ├── documentation/     # Page documentation
│   ├── generate/          # Page principale de génération
│   ├── login/             # Page de connexion
│   ├── pricing/           # Page tarifs
│   ├── reset-password/    # Reset password
│   ├── update-password/   # Update password
│   └── layout.tsx         # Layout global
├── components/            # Composants réutilisables
├── lib/                   # Utilitaires et configurations
├── public/               # Assets statiques
└── supabase-*.sql        # Scripts SQL Supabase
```

---

## 📄 STRUCTURE DES PAGES

### **1. Page d'accueil (`app/page.tsx`)**

**Design :** Landing page moderne avec gradient sombre
**Couleurs principales :**
- Background : `bg-gradient-to-br from-[#0A0E27] via-[#1A1F3A] to-[#0A0E27]`
- Accent bleu : `from-blue-400 to-cyan-400`
- Accent violet : `from-purple-500 to-pink-500`

**Sections :**
1. **Hero Section**
   - Titre principal : "Documentez vos workflows N8N en quelques secondes"
   - CTA principal : "Convaincre" → `/generate`
   - CTA secondaire : "Voir les exemples" → `/documentation`

2. **Features Section**
   - 6 cartes avec icônes SVG
   - Animations hover avec Framer Motion
   - Responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop)

3. **Exemples de Réalisations**
   - 3 cas d'usage avec images avant/après
   - Accordéon pour les notes détaillées
   - Effets visuels spéciaux sur les images "Après ATLAS"

4. **Testimonials**
   - 3 témoignages avec photos
   - Design en cartes avec avatars

5. **Pricing Preview**
   - 3 plans (Gratuit, Starter, Pro)
   - CTA vers page tarifs complète

6. **CTA Final**
   - Bouton "Générer ma première documentation"
   - Background avec particules animées

### **2. Page Documentation (`app/documentation/page.tsx`)**

**Design :** Page d'explication détaillée
**Sections :**
1. **Hero** - "Comment ça marche ?"
2. **Processus en 3 étapes** avec illustrations
3. **Exemples de documentation générée** avec images
4. **Avantages** - Liste avec icônes
5. **Export PDF inclus** - Callout spécial
6. **CTA final**

### **3. Page Blog (`app/blog/page.tsx`)**

**Design :** Listing d'articles avec grid responsive
**Fonctionnalités :**
- Grid responsive (1 col mobile, 2 cols tablet, 3 cols desktop)
- Images hero pour chaque article
- Métadonnées (date, catégorie, temps de lecture)
- Pagination (si nécessaire)

**Articles disponibles :**
1. **"Automatisation Comptable avec N8N"**
   - Image : `/img/blog-comptabilite.jpg`
   - Catégorie : Automatisation
   - Temps : 5 min

2. **"Veille Concurrentielle Automatisée"**
   - Image : `/img/blog-veille.jpg`
   - Catégorie : Business Intelligence
   - Temps : 7 min

3. **"Génération Vidéo IA avec N8N"**
   - Image : `/img/blog-video-ia.jpg`
   - Catégorie : IA & Création
   - Temps : 6 min

### **4. Page Article Blog (`app/blog/[slug]/page.tsx`)**

**Design :** Article complet avec layout typographique
**Fonctionnalités :**
- Hero image responsive
- Contenu structuré avec headings
- Navigation breadcrumb
- Temps de lecture estimé
- Boutons de partage

### **5. Page Tarifs (`app/pricing/page.tsx`)**

**Design :** Pricing cards avec comparaison
**Plans :**
1. **Gratuit** - 3 templates/mois
2. **Starter** - 20 templates/mois - 19€/mois
3. **Pro** - 40 templates/mois - 39€/mois
4. **Enterprise** - Illimité - Sur devis

**Fonctionnalités :**
- Comparaison des features
- Boutons CTA Stripe
- FAQ intégrée
- Badge "Plus populaire" sur Starter

### **6. Page Login (`app/login/page.tsx`)**

**Design :** Split-screen moderne
**Layout :**
- **Gauche (1/3) :** Formulaire de connexion
- **Droite (2/3) :** Visual avec exemple de workflow

**Fonctionnalités :**
- Toggle Sign In / Sign Up
- Champ "Confirmer mot de passe" (Sign Up uniquement)
- Validation des mots de passe identiques
- Google OAuth
- Lien "Mot de passe oublié"
- Redirection automatique vers `/generate`

**Couleurs :**
- Background : `bg-gradient-to-br from-[#3b82f6] via-[#8b5cf6] to-[#ec4899]`
- Form : `bg-[#0f172a]/95 backdrop-blur-xl`
- Inputs : `bg-[#1e293b]/80 border border-[#334155]`

### **7. Page Generate (`app/generate/page.tsx`)**

**Design :** Interface de génération avec upload
**Fonctionnalités principales :**
1. **Upload de fichier JSON** avec drag & drop
2. **Champ notes complémentaires** (optionnel)
3. **Sélecteur de format** (Notes N8N ou PDF)
4. **Personnalisation marque** (Enterprise uniquement)
5. **Compteur d'usage** (X / Y templates)
6. **Bouton génération** avec loading state

**États de l'interface :**
- **État initial :** Upload + formulaire
- **État loading :** Progress bar avec animation
- **État succès :** Téléchargement du fichier généré
- **État erreur :** Message d'erreur avec retry

**Composants spéciaux :**
- `FileUploader` - Upload avec drag & drop
- `LoadingProgress` - Animation de progression
- `CancelSubscriptionModal` - Modal d'annulation

### **8. Pages Reset/Update Password**

**Design :** Formulaires simples et centrés
**Fonctionnalités :**
- Reset : Envoi d'email de réinitialisation
- Update : Formulaire pour nouveau mot de passe
- Validation et confirmation
- Redirection vers `/generate`

---

## 🎨 DESIGN ET UI/UX

### **Palette de couleurs :**

**Couleurs principales :**
```css
--primary-blue: #3b82f6
--primary-cyan: #06b6d4
--primary-purple: #8b5cf6
--primary-pink: #ec4899
```

**Couleurs de fond :**
```css
--bg-dark: #0A0E27
--bg-medium: #1A1F3A
--bg-card: #1e293b
--bg-input: #1e293b/80
```

**Couleurs de texte :**
```css
--text-white: #ffffff
--text-gray-light: #cbd5e1
--text-gray-medium: #94a3b8
--text-gray-dark: #64748b
```

### **Typographie :**
- **Police principale :** Inter (font-inter)
- **Police secondaire :** Poppins (font-poppins)
- **Tailles :** Responsive (text-sm à text-6xl)

### **Animations :**
- **Hover effects :** Scale, shadow, color transitions
- **Page transitions :** Framer Motion
- **Loading states :** Spinners, progress bars
- **Micro-interactions :** Button states, form validation

### **Responsive Design :**
- **Mobile-first :** 320px+
- **Breakpoints :** sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid systems :** CSS Grid et Flexbox
- **Images :** Responsive avec `next/image`

---

## 🗄️ BASE DE DONNÉES SUPABASE

### **Tables principales :**

#### **1. Table `profiles`**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  subscription_tier TEXT DEFAULT 'free',
  templates_used INTEGER DEFAULT 0,
  templates_limit INTEGER DEFAULT 3,
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Politiques RLS :**
- `Enable read access for all users` - SELECT
- `Enable insert for authenticated users only` - INSERT
- `Enable update for users based on email` - UPDATE

#### **2. Table `subscriptions` (Stripe)**
```sql
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  status TEXT,
  price_id TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Fonctions RPC :**

#### **1. `increment_user_templates_usage(user_uuid UUID)`**
```sql
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
    
    -- Si plan Enterprise, ne PAS incrémenter (illimité)
    IF current_tier = 'enterprise' THEN
        SELECT templates_used INTO new_count
        FROM profiles
        WHERE id = user_uuid;
        RETURN new_count;
    END IF;
    
    -- Pour les autres plans, incrémenter normalement
    UPDATE profiles 
    SET 
        templates_used = COALESCE(templates_used, 0) + 1,
        updated_at = NOW()
    WHERE id = user_uuid
    RETURNING templates_used INTO new_count;
    
    RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### **2. `check_usage_limit(user_uuid UUID)`**
```sql
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
    
    -- Construire la réponse
    result := json_build_object(
        'allowed', profile_record.templates_used < profile_record.templates_limit,
        'current', profile_record.templates_used,
        'limit', profile_record.templates_limit,
        'tier', profile_record.subscription_tier
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### **Variables d'environnement Supabase :**
```env
NEXT_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

## 🔐 AUTHENTIFICATION

### **Configuration Supabase Auth :**

**URLs de redirection :**
- Site URL : `https://ton-domaine.com`
- Redirect URLs :
  - `https://ton-domaine.com/auth/callback`
  - `https://ton-domaine.com/auth/callback?next=/generate`
  - `https://ton-domaine.com/generate`
  - `https://ton-domaine.com/account`

**Providers configurés :**
- Email/Password
- Google OAuth

### **Middleware de protection :**
```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  const supabase = createServerClient(/* ... */);
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session && req.nextUrl.pathname.startsWith('/generate')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}
```

### **Flux d'authentification :**
1. **Login/Signup** → `app/login/page.tsx`
2. **Callback** → `app/auth/callback/route.ts`
3. **Redirection** → `/generate` ou page demandée
4. **Protection** → Middleware vérifie la session

---

## 🔌 API ROUTES

### **API d'authentification :**
- `GET /api/user/stats` - Statistiques utilisateur
- `POST /api/increment-usage` - Incrémenter usage templates
- `GET /api/user/check-limit` - Vérifier limite utilisateur

### **API Stripe :**
- `POST /api/create-checkout-session` - Créer session Stripe
- `POST /api/cancel-subscription` - Annuler abonnement
- `POST /api/webhooks/stripe` - Webhook Stripe
- `POST /api/create-portal-session` - Portal client Stripe

### **Configuration API :**
Toutes les APIs utilisent `export const dynamic = 'force-dynamic'` pour éviter les erreurs de rendu statique.

---

## 🔗 INTÉGRATIONS EXTERNES

### **1. Stripe**
**Configuration :**
```env
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

**Plans configurés :**
- Starter : 19€/mois - 20 templates
- Pro : 39€/mois - 40 templates
- Enterprise : Sur devis - Illimité

**Webhooks :**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### **2. N8N Webhook**
**URL webhook :** `https://matsserreecom.app.n8n.cloud/webhook/93a2c6cb-25ce-45ed-a872-0b4c7590e69d`

**Payload envoyé :**
```json
{
  "user_email": "user@example.com",
  "template_name": "workflow_name",
  "generation_date": "2025-01-19T10:30:00Z"
}
```

### **3. Sentry (Monitoring)**
**Configuration :**
```env
SENTRY_DSN=https://...
SENTRY_ORG=ton-org
SENTRY_PROJECT=atlas
```

---

## 🚀 DÉPLOIEMENT

### **Vercel Configuration :**
**Variables d'environnement :**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Sentry
SENTRY_DSN=https://...
SENTRY_ORG=ton-org
SENTRY_PROJECT=atlas
SENTRY_AUTH_TOKEN=ton-token
```

**Domaines configurés :**
- Production : `www.atlasbuilder.app`
- Preview : `atlas-n8n-documentation-*.vercel.app`

### **Déploiement automatique :**
- **Trigger :** Push sur branche `master`
- **Build :** `npm run build`
- **Output :** `.next` directory

---

## 🔄 INSTRUCTIONS DE RECONSTRUCTION

### **⚠️ IMPORTANT : NETTOYAGE COMPLET REQUIS**

Pour reconstruire l'application proprement, il faut **SUPPRIMER TOUTES LES TABLES EXISTANTES** dans Supabase et tout refaire au propre.

### **Étape 1 : Nettoyage Supabase**

**🚨 COMMANDE DE NETTOYAGE COMPLET :**
```sql
-- ════════════════════════════════════════════════════════════════════════════
-- NETTOYAGE COMPLET SUPABASE - ATTENTION : SUPPRIME TOUT !
-- ════════════════════════════════════════════════════════════════════════════
-- ⚠️  EXÉCUTER CETTE COMMANDE DANS SUPABASE SQL EDITOR
-- ⚠️  CETTE COMMANDE VA SUPPRIMER TOUTES LES TABLES ET DONNÉES
-- ════════════════════════════════════════════════════════════════════════════

-- 1. Supprimer toutes les politiques RLS
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- 2. Supprimer toutes les fonctions RPC
DROP FUNCTION IF EXISTS public.increment_user_templates_usage(UUID);
DROP FUNCTION IF EXISTS public.check_usage_limit(UUID);
DROP FUNCTION IF EXISTS public.get_templates_limit(TEXT);

-- 3. Supprimer toutes les tables
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 4. Vérifier que tout est supprimé
SELECT 'Tables restantes:' as status, table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

SELECT 'Fonctions restantes:' as status, routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public';

SELECT 'Politiques restantes:' as status, policyname 
FROM pg_policies 
WHERE schemaname = 'public';

-- ⚠️  APRÈS CETTE COMMANDE, TOUTES LES DONNÉES SERONT SUPPRIMÉES
-- ⚠️  PROCÉDER À L'ÉTAPE 2 POUR RECONSTRUIRE PROPREMENT
```

### **Étape 2 : Reconstruction propre**

**Exécuter dans l'ordre :**

1. **`supabase-schema-complete.sql`** - Schema de base
2. **`supabase-stripe-schema.sql`** - Tables Stripe
3. **`supabase-fix-increment-function.sql`** - Fonctions RPC
4. **`supabase-fix-profiles-table.sql`** - Permissions RLS

### **Étape 3 : Configuration**

1. **Supabase Auth :**
   - Configurer les URLs de redirection
   - Activer Google OAuth
   - Configurer les providers

2. **Stripe :**
   - Créer les produits et prix
   - Configurer les webhooks
   - Tester les paiements

3. **Vercel :**
   - Configurer les variables d'environnement
   - Déployer depuis GitHub
   - Configurer les domaines

### **Étape 4 : Tests**

1. **Authentification :** Login/Signup/Reset
2. **Génération :** Upload JSON + génération
3. **Paiements :** Abonnements Stripe
4. **Limites :** Vérification usage templates

---

## 📚 FICHIERS IMPORTANTS À RECONSTRUIRE

### **Scripts SQL essentiels :**
1. `supabase-schema-complete.sql` - Schema complet
2. `supabase-stripe-schema.sql` - Intégration Stripe
3. `supabase-fix-increment-function.sql` - Fonctions RPC
4. `supabase-fix-profiles-table.sql` - Permissions
5. `supabase-fix-rls-permissions.sql` - RLS correct

### **Composants clés :**
1. `components/Navbar.tsx` - Navigation globale
2. `components/FileUploader.tsx` - Upload de fichiers
3. `components/LoadingProgress.tsx` - Animation loading
4. `components/CancelSubscriptionModal.tsx` - Modal annulation

### **Pages principales :**
1. `app/page.tsx` - Landing page
2. `app/login/page.tsx` - Authentification
3. `app/generate/page.tsx` - Génération
4. `app/pricing/page.tsx` - Tarifs
5. `app/blog/page.tsx` - Blog

### **API Routes critiques :**
1. `app/api/increment-usage/route.ts` - Incrémentation usage
2. `app/api/user/stats/route.ts` - Statistiques
3. `app/api/create-checkout-session/route.ts` - Stripe
4. `app/api/webhooks/stripe/route.ts` - Webhooks

---

## 🎯 FONCTIONNALITÉS CLÉS À RECRÉER

### **1. Système de génération :**
- Upload drag & drop
- Validation JSON
- Génération documentation
- Téléchargement fichier

### **2. Système d'authentification :**
- Login/Signup avec validation
- Google OAuth
- Reset password
- Protection routes

### **3. Système de paiement :**
- Abonnements Stripe
- Gestion des limites
- Portal client
- Webhooks

### **4. Système de suivi :**
- Compteur templates utilisés
- Vérification limites
- Incrémentation automatique
- Statistiques utilisateur

### **5. Interface utilisateur :**
- Design responsive
- Animations fluides
- États de chargement
- Gestion d'erreurs

---

## 🔧 CONFIGURATION FINALE

### **Variables d'environnement complètes :**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Sentry
SENTRY_DSN=https://...
SENTRY_ORG=ton-org
SENTRY_PROJECT=atlas
SENTRY_AUTH_TOKEN=ton-token

# N8N
N8N_WEBHOOK_URL=https://matsserreecom.app.n8n.cloud/webhook/93a2c6cb-25ce-45ed-a872-0b4c7590e69d
```

### **URLs de redirection Supabase :**
```
https://ton-domaine.com/auth/callback
https://ton-domaine.com/auth/callback?next=/generate
https://ton-domaine.com/generate
https://ton-domaine.com/account
```

---

## ✅ CHECKLIST DE VALIDATION

### **Fonctionnalités :**
- [ ] Landing page responsive
- [ ] Authentification complète
- [ ] Upload et génération de templates
- [ ] Système de paiement Stripe
- [ ] Compteur d'usage fonctionnel
- [ ] Blog avec articles
- [ ] Documentation complète
- [ ] Webhooks N8N

### **Technique :**
- [ ] Base de données Supabase configurée
- [ ] APIs fonctionnelles
- [ ] Déploiement Vercel réussi
- [ ] Variables d'environnement configurées
- [ ] Domaines configurés
- [ ] Monitoring Sentry actif

---

## 🎉 CONCLUSION

Cette documentation complète décrit l'ensemble de l'application ATLAS avec tous les détails techniques, fonctionnels et de design nécessaires pour la reconstruire entièrement.

**Points clés à retenir :**
1. **Nettoyage complet requis** - Supprimer toutes les tables existantes
2. **Ordre d'exécution important** - Scripts SQL dans l'ordre spécifié
3. **Configuration multiple** - Supabase, Stripe, Vercel, Sentry
4. **Design cohérent** - Palette de couleurs et animations définies
5. **Architecture robuste** - Next.js, Supabase, Stripe intégrés

**Cette documentation permet de reconstruire l'application ATLAS de A à Z avec une autre IA en suivant exactement la même architecture et les mêmes fonctionnalités.**
