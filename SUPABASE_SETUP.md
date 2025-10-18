# Configuration Supabase pour l'authentification Google

## 1. Configuration Supabase

### Créer un projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre URL de projet et votre clé anonyme

### Configurer l'authentification Google
1. Dans le dashboard Supabase, allez dans **Authentication** > **Providers**
2. Activez **Google** comme provider
3. Configurez les credentials Google :
   - **Client ID** : Votre Google Client ID
   - **Client Secret** : Votre Google Client Secret

### Obtenir les credentials Google
1. Allez sur [Google Cloud Console](https://console.cloud.google.com)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google+ 
4. Allez dans **Credentials** > **Create Credentials** > **OAuth 2.0 Client IDs**
5. Configurez :
   - **Application type** : Web application
   - **Authorized redirect URIs** : `https://your-project-id.supabase.co/auth/v1/callback`
   - **Authorized JavaScript origins** : `http://localhost:3000` (pour le dev)

## 2. Configuration de l'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 3. Structure des fichiers créés

```
lib/
  supabase/
    client.ts          # Client Supabase pour le navigateur
    server.ts          # Client Supabase pour le serveur
app/
  auth/
    callback/
      route.ts         # Route de callback OAuth
  login/
    page.tsx           # Page de connexion
  error/
    page.tsx           # Page d'erreur d'authentification
components/
  Header.tsx           # Header avec authentification
middleware.ts          # Middleware pour la gestion des sessions
```

## 4. Fonctionnalités implémentées

- ✅ Authentification Google via Supabase
- ✅ Gestion des sessions côté client et serveur
- ✅ Page de connexion avec design Dark Luxury
- ✅ Header dynamique (connexion/déconnexion)
- ✅ Redirection automatique après connexion
- ✅ Gestion des erreurs d'authentification
- ✅ Middleware pour la protection des routes

## 5. Utilisation

1. Configurez vos variables d'environnement
2. Redémarrez le serveur : `npm run dev`
3. Allez sur `/login` pour vous connecter
4. Le header affichera l'état de connexion

## 6. Personnalisation

Le design utilise le thème "Dark Luxury" existant :
- Fond : `#0A0E27`
- Couleurs : Violet (`#7C3AED`) et Cyan (`#06B6D4`)
- Effets : Glassmorphism, glow, animations
- Responsive : Mobile-first design






