# 🚀 START HERE - GUIDE ULTRA RAPIDE

## ⚡ 3 ÉTAPES POUR TESTER

### 1️⃣ Ajouter la clé service_role dans `.env.local`

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Où la trouver ?**
→ Supabase Dashboard → Settings → API → Copier "service_role"

---

### 2️⃣ Redémarrer le serveur

```bash
Ctrl+C
npm run dev
```

---

### 3️⃣ Tester

```
http://localhost:3000/api/user/stats
→ Doit retourner : {"used":0,"limit":40,"tier":"pro"}

http://localhost:3000/account
→ Doit afficher : "PRO" + "0 / 40"
```

---

## ✅ SI ÇA MARCHE

**Tu devrais voir "40" partout (pas "3") !** 🎉

**Tout est prêt !** Le système fonctionne.

---

## ❌ SI ÇA NE MARCHE PAS

### Forcer la mise à jour :

```
http://localhost:3000/api/debug/fix-my-plan
```

**Puis rafraîchir les pages.**

---

## 📖 POUR ALLER PLUS LOIN

- `README_TESTS.md` - Tests en 5 minutes
- `TEST_FINAL_COMPLET.md` - Tests complets
- `RESUME_FINAL_ULTRA_COMPLET.md` - Vue d'ensemble complète

---

## 🎯 C'EST TOUT !

**Si l'API retourne `limit:40` → Tout fonctionne ! 🎉**

**Bonne chance ! 🚀**

