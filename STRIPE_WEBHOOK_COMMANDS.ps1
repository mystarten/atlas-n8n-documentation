# Script PowerShell de déploiement rapide du webhook Stripe
# Usage: .\STRIPE_WEBHOOK_COMMANDS.ps1

Write-Host "🚀 Déploiement du Webhook Stripe pour ATLAS" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Variables
$PROJECT_REF = "gvwpopahjuvuefdyuilx"
$FUNCTION_NAME = "stripe-webhook"

Write-Host "📋 Étape 1: Vérification de Supabase CLI" -ForegroundColor Yellow
if (!(Get-Command supabase -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Supabase CLI n'est pas installé" -ForegroundColor Red
    Write-Host "📦 Installation : npm install -g supabase" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "✅ Supabase CLI trouvé" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔐 Étape 2: Connexion à Supabase" -ForegroundColor Yellow
Write-Host "Exécutez : supabase login" -ForegroundColor White
Write-Host ""

Write-Host "📤 Étape 3: Déploiement de la fonction" -ForegroundColor Yellow
Write-Host "Exécutez :" -ForegroundColor White
Write-Host "  supabase functions deploy $FUNCTION_NAME --project-ref $PROJECT_REF" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔑 Étape 4: Configuration des secrets" -ForegroundColor Yellow
Write-Host ""
Write-Host "A. STRIPE_SECRET_KEY" -ForegroundColor Magenta
Write-Host "   1. Va sur https://dashboard.stripe.com/apikeys" -ForegroundColor White
Write-Host "   2. Copie ta clé secrète (sk_test_... ou sk_live_...)" -ForegroundColor White
Write-Host "   3. Exécute :" -ForegroundColor White
Write-Host "      supabase secrets set STRIPE_SECRET_KEY=sk_test_VOTRE_CLE --project-ref $PROJECT_REF" -ForegroundColor Cyan
Write-Host ""

Write-Host "B. STRIPE_WEBHOOK_SECRET" -ForegroundColor Magenta
Write-Host "   1. Va sur https://dashboard.stripe.com/webhooks" -ForegroundColor White
Write-Host "   2. Clique sur ton endpoint webhook" -ForegroundColor White
Write-Host "   3. Révèle le signing secret (whsec_...)" -ForegroundColor White
Write-Host "   4. Exécute :" -ForegroundColor White
Write-Host "      supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET --project-ref $PROJECT_REF" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Étape 5: Vérification" -ForegroundColor Yellow
Write-Host "Exécutez :" -ForegroundColor White
Write-Host "  supabase secrets list --project-ref $PROJECT_REF" -ForegroundColor Cyan
Write-Host ""

Write-Host "🧪 Étape 6: Test" -ForegroundColor Yellow
Write-Host "  1. Va sur https://dashboard.stripe.com/webhooks" -ForegroundColor White
Write-Host "  2. Clique 'Send test webhook'" -ForegroundColor White
Write-Host "  3. Choisis 'checkout.session.completed'" -ForegroundColor White
Write-Host "  4. Vérifie Status 200" -ForegroundColor White
Write-Host ""

Write-Host "📊 Étape 7: Voir les logs" -ForegroundColor Yellow
Write-Host "Exécutez :" -ForegroundColor White
Write-Host "  supabase functions logs $FUNCTION_NAME --project-ref $PROJECT_REF --tail" -ForegroundColor Cyan
Write-Host ""

Write-Host "🎯 URL du webhook Stripe :" -ForegroundColor Green
Write-Host "  https://$PROJECT_REF.supabase.co/functions/v1/$FUNCTION_NAME" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Configuration terminée !" -ForegroundColor Green
Write-Host "⏰ Deadline Stripe : 23 octobre 2025" -ForegroundColor Red
Write-Host ""
Write-Host "📚 Pour plus d'informations :" -ForegroundColor Yellow
Write-Host "  - Guide complet : STRIPE_WEBHOOK_DEPLOYMENT_GUIDE.md" -ForegroundColor White
Write-Host "  - Fix rapide : QUICK_FIX_STRIPE_WEBHOOK.md" -ForegroundColor White
Write-Host ""

# Demander si l'utilisateur veut continuer
$continue = Read-Host "Voulez-vous exécuter le déploiement maintenant ? (O/N)"

if ($continue -eq "O" -or $continue -eq "o") {
    Write-Host ""
    Write-Host "🚀 Démarrage du déploiement..." -ForegroundColor Cyan
    
    # Déployer la fonction
    Write-Host "📤 Déploiement de la fonction..." -ForegroundColor Yellow
    supabase functions deploy $FUNCTION_NAME --project-ref $PROJECT_REF
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Fonction déployée avec succès !" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔑 Maintenant, configure les secrets :" -ForegroundColor Yellow
        Write-Host ""
        
        # Demander STRIPE_SECRET_KEY
        $stripeKey = Read-Host "Entre ta STRIPE_SECRET_KEY (sk_test_... ou sk_live_...)"
        if ($stripeKey) {
            supabase secrets set STRIPE_SECRET_KEY=$stripeKey --project-ref $PROJECT_REF
            Write-Host "✅ STRIPE_SECRET_KEY configuré" -ForegroundColor Green
        }
        
        Write-Host ""
        
        # Demander STRIPE_WEBHOOK_SECRET
        $webhookSecret = Read-Host "Entre ton STRIPE_WEBHOOK_SECRET (whsec_...)"
        if ($webhookSecret) {
            supabase secrets set STRIPE_WEBHOOK_SECRET=$webhookSecret --project-ref $PROJECT_REF
            Write-Host "✅ STRIPE_WEBHOOK_SECRET configuré" -ForegroundColor Green
        }
        
        Write-Host ""
        Write-Host "📋 Secrets configurés :" -ForegroundColor Yellow
        supabase secrets list --project-ref $PROJECT_REF
        
        Write-Host ""
        Write-Host "🎉 Configuration terminée !" -ForegroundColor Green
        Write-Host "Teste maintenant ton webhook sur https://dashboard.stripe.com/webhooks" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Erreur lors du déploiement" -ForegroundColor Red
        Write-Host "Vérifie que tu es bien connecté avec : supabase login" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "⏸️  Déploiement annulé. Exécute les commandes manuellement." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Appuie sur une touche pour fermer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

