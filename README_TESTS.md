# 🚀 GUIDE RAPIDE - TESTER LE SYSTÈME D'ABONNEMENT

## ⚡ TEST EN 5 MINUTES

### 1️⃣ Vérifier l'API
```
http://localhost:3000/api/user/stats
→ Doit retourner : {"used":0,"limit":40,"tier":"pro"}
```

### 2️⃣ Vérifier les pages
```
http://localhost:3000         → "0 / 40"
http://localhost:3000/account → "PRO" + "0 / 40"
http://localhost:3000/admin   → "PRO" + "0 / 40"
```

### 3️⃣ Tester le bouton Stripe
```
/account → Cliquer "🔗 Gérer sur Stripe"
→ Doit rediriger vers Stripe
```

### 4️⃣ Tester un paiement
```
/pricing → S'abonner Pro → Carte 4242 4242 4242 4242
→ Après paiement : /admin doit afficher "PRO" sans sync manuelle
```

### 5️⃣ Vérifier Supabase
```
Table profiles → Ton user → tier:'pro', limit:40
```

---

## ✅ SI TOUS LES TESTS PASSENT

**Le système est 100% fonctionnel !** 🎉

---

## ❌ SI UN TEST ÉCHOUE

### Problème : API retourne limit:3
**Solution :**
```
http://localhost:3000/api/debug/fix-my-plan
```

### Problème : Page affiche 0/3
**Solution :**
1. Vider cache (Ctrl+Shift+Delete)
2. Redémarrer serveur
3. Vérifier logs console

### Problème : Bouton Stripe erreur
**Solution :**
1. Vérifier que tu as déjà payé une fois
2. Cliquer "🔄 Synchroniser mon abonnement" sur /admin
3. Réessayer

### Problème : Webhook 404
**Solution :**
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
Copier `whsec_...` dans `.env.local` et redémarrer

---

## 📋 CHECKLIST

- [ ] `.env.local` contient `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `.env.local` contient `STRIPE_WEBHOOK_SECRET`
- [ ] Serveur Next.js démarré (`npm run dev`)
- [ ] Stripe CLI démarré (optionnel, pour tests webhook)
- [ ] Cache navigateur vidé
- [ ] Tous les tests ci-dessus passent ✅

---

## 📖 DOCUMENTATION COMPLÈTE

Pour plus de détails, consulter :

- `TEST_FINAL_COMPLET.md` - Guide de test détaillé
- `VERIFICATION_FINALE_COMPLETE.md` - Checklist complète
- `RECAPITULATIF_FINAL_COMPLET.md` - Vue d'ensemble

---

**Bon test ! 🎉**

