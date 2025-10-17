# Configuration du Système de Limites d'Utilisation

## 🎯 Vue d'ensemble

Le système de limites d'utilisation permet de contrôler le nombre de templates générés par utilisateur selon leur plan d'abonnement :

- **Gratuit** : 3 templates/mois
- **Starter** : 15 templates/mois  
- **Pro** : 40 templates/mois
- **Enterprise** : Illimité (999,999 templates)

## 🗄️ Configuration de la Base de Données

### 1. Exécuter le schéma SQL

Dans votre dashboard Supabase, allez dans **SQL Editor** et exécutez le contenu du fichier `supabase-schema.sql` :

```sql
-- Le schéma crée :
-- - Table user_usage pour stocker l'utilisation
-- - Fonctions RPC pour vérifier et incrémenter l'usage
-- - RLS (Row Level Security) pour la sécurité
-- - Triggers pour updated_at automatique
```

### 2. Vérifier les Tables

Après exécution, vous devriez voir :
- Table `user_usage` avec les colonnes appropriées
- Fonctions `check_usage_limit()` et `increment_user_usage()`
- Politiques RLS activées

## 🔧 Configuration de l'Application

### 1. Variables d'Environnement

Assurez-vous que votre `.env.local` contient :

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2. Fonctionnalités Implémentées

#### ✅ Vérification des Limites
- Vérification automatique avant chaque génération
- Redirection vers `/login` si non connecté
- Alerte visuelle si limite atteinte

#### ✅ Compteur d'Utilisation
- Affichage dans le header : "X/Y templates"
- Couleurs dynamiques :
  - 🟢 Cyan : < 80% de la limite
  - 🟠 Orange : ≥ 80% de la limite  
  - 🔴 Rouge : = 100% de la limite

#### ✅ Incrémentation Automatique
- Compteur incrémenté après génération réussie
- Gestion d'erreurs robuste
- Mise à jour en temps réel

## 🎨 Interface Utilisateur

### Alerte de Limite Atteinte

Quand l'utilisateur atteint sa limite :

```tsx
// Affichage d'une alerte avec :
- Message personnalisé avec compteur actuel/limite
- Bouton "Voir les tarifs" → /pricing
- Bouton "Fermer" pour masquer l'alerte
- Design cohérent avec le thème Dark Luxury
```

### Compteur dans le Header

```tsx
// Badge coloré affiché sous l'email :
- Format : "X/Y templates"
- Couleur dynamique selon l'utilisation
- Mise à jour en temps réel
```

## 🔒 Sécurité

### Row Level Security (RLS)

- Les utilisateurs ne peuvent voir que leurs propres données
- Politiques RLS configurées pour `user_usage`
- Fonctions RPC sécurisées avec `SECURITY DEFINER`

### Gestion d'Erreurs

- Erreurs de base de données gérées gracieusement
- Fallback vers limites par défaut en cas d'erreur
- Logs détaillés pour le debugging

## 🧪 Test du Système

### 1. Test de Connexion
1. Se connecter avec Google
2. Vérifier que le compteur s'affiche dans le header
3. Générer un template et vérifier l'incrémentation

### 2. Test des Limites
1. Générer 3 templates (limite gratuite)
2. Vérifier que l'alerte s'affiche au 4ème
3. Tester la redirection vers `/pricing`

### 3. Test de Persistance
1. Se déconnecter et reconnecter
2. Vérifier que le compteur est conservé
3. Tester sur différents navigateurs

## 📊 Monitoring

### Logs à Surveiller

```javascript
// Dans la console du navigateur :
- "Erreur lors de la vérification des limites"
- "Erreur lors de l'incrémentation de l'usage"
- "Erreur lors de la récupération des limites"
```

### Métriques Importantes

- Nombre de générations par utilisateur
- Taux de conversion vers plans payants
- Erreurs de base de données

## 🚀 Prochaines Étapes

### Intégration Paiement
- Stripe pour les abonnements
- Webhook pour mettre à jour `subscription_tier`
- Gestion des annulations

### Analytics
- Dashboard admin pour voir l'utilisation
- Graphiques de conversion
- Alertes de limite approchante

### Fonctionnalités Avancées
- Reset mensuel automatique
- Notifications email
- Limites personnalisées par utilisateur

## 🛠️ Dépannage

### Problèmes Courants

1. **"Function check_usage_limit does not exist"**
   - Vérifier que le schéma SQL a été exécuté
   - Redémarrer l'application

2. **Compteur ne s'affiche pas**
   - Vérifier les variables d'environnement
   - Contrôler les logs de la console

3. **Limites non respectées**
   - Vérifier les politiques RLS
   - Contrôler les permissions Supabase

### Support

En cas de problème, vérifier :
1. Les logs de la console navigateur
2. Les logs Supabase dans le dashboard
3. La configuration des variables d'environnement




