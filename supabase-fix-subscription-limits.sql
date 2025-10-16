-- ════════════════════════════════════════════════════════════════════════════
-- CORRECTION COMPLÈTE DES LIMITES D'ABONNEMENT
-- ════════════════════════════════════════════════════════════════════════════
-- 
-- Nouvelles limites :
-- - Free : 3 templates
-- - Starter (9.99€) : 15 templates  
-- - Pro (19.99€) : 40 templates
-- - Enterprise (49.99€) : ∞ (999999)
--
-- ════════════════════════════════════════════════════════════════════════════

-- Supprimer l'ancienne contrainte si elle existe
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;

-- Ajouter la nouvelle contrainte avec les bons plans
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_subscription_tier_check
CHECK (subscription_tier IN ('free', 'starter', 'pro', 'enterprise'));

-- Mettre à jour la limite par défaut pour Free
ALTER TABLE public.profiles
ALTER COLUMN templates_limit SET DEFAULT 3;

-- ════════════════════════════════════════════════════════════════════════════
-- FONCTION : Calculer automatiquement la limite selon le tier
-- ════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.get_templates_limit(tier TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN CASE tier
    WHEN 'free' THEN 3
    WHEN 'starter' THEN 15
    WHEN 'pro' THEN 40
    WHEN 'enterprise' THEN 999999
    ELSE 3
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ════════════════════════════════════════════════════════════════════════════
-- TRIGGER : Mettre à jour automatiquement templates_limit quand tier change
-- ════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.update_templates_limit()
RETURNS TRIGGER AS $$
BEGIN
  NEW.templates_limit := public.get_templates_limit(NEW.subscription_tier);
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_templates_limit ON public.profiles;

CREATE TRIGGER trigger_update_templates_limit
  BEFORE INSERT OR UPDATE OF subscription_tier
  ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_templates_limit();

-- ════════════════════════════════════════════════════════════════════════════
-- MISE À JOUR : Corriger tous les profils existants avec les bonnes limites
-- ════════════════════════════════════════════════════════════════════════════

UPDATE public.profiles
SET templates_limit = public.get_templates_limit(subscription_tier);

-- ════════════════════════════════════════════════════════════════════════════
-- VÉRIFICATION : Afficher les résultats
-- ════════════════════════════════════════════════════════════════════════════

SELECT 
  subscription_tier,
  COUNT(*) as nb_users,
  get_templates_limit(subscription_tier) as limite_correcte
FROM public.profiles
GROUP BY subscription_tier
ORDER BY 
  CASE subscription_tier
    WHEN 'free' THEN 1
    WHEN 'starter' THEN 2
    WHEN 'pro' THEN 3
    WHEN 'enterprise' THEN 4
  END;

-- ════════════════════════════════════════════════════════════════════════════
-- ✅ MIGRATION TERMINÉE
-- ════════════════════════════════════════════════════════════════════════════

