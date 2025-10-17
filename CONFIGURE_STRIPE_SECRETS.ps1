# Script de configuration rapide des secrets Stripe
# Usage: .\CONFIGURE_STRIPE_SECRETS.ps1

Write-Host ""
Write-Host "🔐 CONFIGURATION DES SECRETS STRIPE" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Variables
$PROJECT_REF = "gntsgiwqvqaxqxvxzqas"

Write-Host "📍 Project ID: $PROJECT_REF" -ForegroundColor Yellow
Write-Host ""

# Vérifier que Supabase CLI est installé
Write-Host "🔍 Vérification de Supabase CLI..." -ForegroundColor Yellow
if (!(Get-Command npx -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm/npx n'est pas installé" -ForegroundColor Red
    Write-Host "Installe Node.js depuis https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ npm/npx trouvé" -ForegroundColor Green
Write-Host ""

# STRIPE_SECRET_KEY
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "1️⃣  STRIPE_SECRET_KEY" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Où la trouver :" -ForegroundColor Yellow
Write-Host "   1. Va sur https://dashboard.stripe.com/apikeys" -ForegroundColor White
Write-Host "   2. Section 'Secret key'" -ForegroundColor White
Write-Host "   3. Copie la clé (commence par sk_live_ ou sk_test_)" -ForegroundColor White
Write-Host ""

$stripeKey = Read-Host "Entre ta STRIPE_SECRET_KEY"

if ($stripeKey) {
    Write-Host ""
    Write-Host "⏳ Configuration de STRIPE_SECRET_KEY..." -ForegroundColor Yellow
    
    $result = npx supabase secrets set STRIPE_SECRET_KEY=$stripeKey 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ STRIPE_SECRET_KEY configuré avec succès !" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreur lors de la configuration de STRIPE_SECRET_KEY" -ForegroundColor Red
        Write-Host $result -ForegroundColor Red
    }
} else {
    Write-Host "⏭️  STRIPE_SECRET_KEY ignoré" -ForegroundColor Yellow
}

Write-Host ""
Write-Host ""

# STRIPE_WEBHOOK_SECRET
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "2️⃣  STRIPE_WEBHOOK_SECRET" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Où le trouver :" -ForegroundColor Yellow
Write-Host "   1. Va sur https://dashboard.stripe.com/webhooks" -ForegroundColor White
Write-Host "   2. Clique sur ton endpoint webhook" -ForegroundColor White
Write-Host "   3. Section 'Signing secret' → Clique 'Reveal'" -ForegroundColor White
Write-Host "   4. Copie le secret (commence par whsec_)" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Si tu n'as pas encore créé d'endpoint, crée-le avec cette URL :" -ForegroundColor Yellow
Write-Host "   https://gntsgiwqvqaxqxvxzqas.supabase.co/functions/v1/stripe-webhook" -ForegroundColor Cyan
Write-Host ""

$webhookSecret = Read-Host "Entre ton STRIPE_WEBHOOK_SECRET"

if ($webhookSecret) {
    Write-Host ""
    Write-Host "⏳ Configuration de STRIPE_WEBHOOK_SECRET..." -ForegroundColor Yellow
    
    $result = npx supabase secrets set STRIPE_WEBHOOK_SECRET=$webhookSecret 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ STRIPE_WEBHOOK_SECRET configuré avec succès !" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreur lors de la configuration de STRIPE_WEBHOOK_SECRET" -ForegroundColor Red
        Write-Host $result -ForegroundColor Red
    }
} else {
    Write-Host "⏭️  STRIPE_WEBHOOK_SECRET ignoré" -ForegroundColor Yellow
}

Write-Host ""
Write-Host ""

# Vérifier les secrets configurés
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ VÉRIFICATION DES SECRETS" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Secrets configurés :" -ForegroundColor Yellow
Write-Host ""

npx supabase secrets list

Write-Host ""
Write-Host ""

# Instructions finales
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎯 PROCHAINES ÉTAPES" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Configure l'URL du webhook dans Stripe Dashboard" -ForegroundColor White
Write-Host "   👉 https://dashboard.stripe.com/webhooks" -ForegroundColor Cyan
Write-Host ""
Write-Host "   URL à configurer :" -ForegroundColor Yellow
Write-Host "   https://gntsgiwqvqaxqxvxzqas.supabase.co/functions/v1/stripe-webhook" -ForegroundColor Green
Write-Host ""

Write-Host "2. Active ces événements dans Stripe :" -ForegroundColor White
Write-Host "   ✅ checkout.session.completed" -ForegroundColor Green
Write-Host "   ✅ customer.subscription.created" -ForegroundColor Green
Write-Host "   ✅ customer.subscription.updated" -ForegroundColor Green
Write-Host "   ✅ customer.subscription.deleted" -ForegroundColor Green
Write-Host "   ✅ invoice.payment_succeeded" -ForegroundColor Green
Write-Host "   ✅ invoice.payment_failed" -ForegroundColor Green
Write-Host ""

Write-Host "3. Teste le webhook" -ForegroundColor White
Write-Host "   - Va sur ton endpoint dans Stripe Dashboard" -ForegroundColor Yellow
Write-Host "   - Clique 'Send test webhook'" -ForegroundColor Yellow
Write-Host "   - Choisis 'checkout.session.completed'" -ForegroundColor Yellow
Write-Host "   - Vérifie Status 200 ✅" -ForegroundColor Yellow
Write-Host ""

Write-Host "4. Vérifie les logs" -ForegroundColor White
Write-Host "   npx supabase functions logs stripe-webhook --tail" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Ou via le Dashboard :" -ForegroundColor Yellow
Write-Host "   https://supabase.com/dashboard/project/gntsgiwqvqaxqxvxzqas/functions/stripe-webhook" -ForegroundColor Cyan
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎉 CONFIGURATION TERMINÉE !" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Write-Host "📚 Documentation :" -ForegroundColor Yellow
Write-Host "   - STRIPE_WEBHOOK_DEPLOYED_SUCCESS.md" -ForegroundColor White
Write-Host "   - QUICK_FIX_STRIPE_WEBHOOK.md" -ForegroundColor White
Write-Host "   - STRIPE_WEBHOOK_DEPLOYMENT_GUIDE.md" -ForegroundColor White
Write-Host ""

Write-Host "Appuie sur une touche pour fermer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

