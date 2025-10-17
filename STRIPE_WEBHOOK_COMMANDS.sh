#!/bin/bash
# Script de déploiement rapide du webhook Stripe
# Usage: bash STRIPE_WEBHOOK_COMMANDS.sh

echo "🚀 Déploiement du Webhook Stripe pour ATLAS"
echo "============================================="
echo ""

# Variables
PROJECT_REF="gvwpopahjuvuefdyuilx"
FUNCTION_NAME="stripe-webhook"

echo "📋 Étape 1: Vérification de Supabase CLI"
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI n'est pas installé"
    echo "📦 Installation : npm install -g supabase"
    exit 1
else
    echo "✅ Supabase CLI trouvé"
fi

echo ""
echo "🔐 Étape 2: Connexion à Supabase"
echo "Exécutez : supabase login"
echo ""

echo "📤 Étape 3: Déploiement de la fonction"
echo "Exécutez :"
echo "  supabase functions deploy $FUNCTION_NAME --project-ref $PROJECT_REF"
echo ""

echo "🔑 Étape 4: Configuration des secrets"
echo ""
echo "A. STRIPE_SECRET_KEY"
echo "   1. Va sur https://dashboard.stripe.com/apikeys"
echo "   2. Copie ta clé secrète (sk_test_... ou sk_live_...)"
echo "   3. Exécute :"
echo "      supabase secrets set STRIPE_SECRET_KEY=sk_test_VOTRE_CLE --project-ref $PROJECT_REF"
echo ""

echo "B. STRIPE_WEBHOOK_SECRET"
echo "   1. Va sur https://dashboard.stripe.com/webhooks"
echo "   2. Clique sur ton endpoint webhook"
echo "   3. Révèle le signing secret (whsec_...)"
echo "   4. Exécute :"
echo "      supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET --project-ref $PROJECT_REF"
echo ""

echo "✅ Étape 5: Vérification"
echo "Exécutez :"
echo "  supabase secrets list --project-ref $PROJECT_REF"
echo ""

echo "🧪 Étape 6: Test"
echo "  1. Va sur https://dashboard.stripe.com/webhooks"
echo "  2. Clique 'Send test webhook'"
echo "  3. Choisis 'checkout.session.completed'"
echo "  4. Vérifie Status 200"
echo ""

echo "📊 Étape 7: Voir les logs"
echo "Exécutez :"
echo "  supabase functions logs $FUNCTION_NAME --project-ref $PROJECT_REF --tail"
echo ""

echo "🎯 URL du webhook Stripe :"
echo "  https://$PROJECT_REF.supabase.co/functions/v1/$FUNCTION_NAME"
echo ""

echo "✅ Configuration terminée !"
echo "⏰ Deadline Stripe : 23 octobre 2025"
echo ""
echo "📚 Pour plus d'informations :"
echo "  - Guide complet : STRIPE_WEBHOOK_DEPLOYMENT_GUIDE.md"
echo "  - Fix rapide : QUICK_FIX_STRIPE_WEBHOOK.md"

