-- ════════════════════════════════════════════════════════════════════════════
-- MISE À JOUR DES LIMITES DE TEMPLATES (20, 40, 60)
-- ════════════════════════════════════════════════════════════════════════════

-- Nouvelles limites :
-- - Free : 3 templates
-- - Starter : 20 templates (changé de 15 à 20)
-- - Pro : 40 templates
-- - Enterprise : 60 templates (changé de 999999 à 60)

-- ════════════════════════════════════════════════════════════════════════════

-- Mettre à jour la fonction de calcul des limites
CREATE OR REPLACE FUNCTION public.get_templates_limit(tier TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN CASE tier
    WHEN 'free' THEN 3
    WHEN 'starter' THEN 20    -- Changé de 15 à 20
    WHEN 'pro' THEN 40
    WHEN 'enterprise' THEN 60  -- Changé de 999999 à 60
    ELSE 3
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ════════════════════════════════════════════════════════════════════════════

-- Mettre à jour tous les profils existants avec les nouvelles limites
UPDATE public.profiles
SET templates_limit = public.get_templates_limit(subscription_tier);

-- ════════════════════════════════════════════════════════════════════════════

-- Vérifier les résultats
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
