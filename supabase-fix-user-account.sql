-- DIAGNOSTIC : Voir l'état actuel du compte
SELECT 
  u.id as user_id,
  u.email,
  uu.subscription_tier,
  uu.templates_generated,
  uu.stripe_customer_id,
  uu.stripe_subscription_id,
  uu.company_name
FROM user_usage uu
JOIN auth.users u ON uu.user_id = u.id
WHERE u.email = 'starten.contact@gmail.com';

-- CORRECTION : Mettre à jour le compte en Enterprise
UPDATE user_usage 
SET 
  subscription_tier = 'enterprise',
  templates_generated = 0,
  company_name = NULL  -- Ou mettre ton nom d'entreprise : 'Ma Super Entreprise'
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'starten.contact@gmail.com'
);

-- VÉRIFICATION : Confirmer que c'est bien mis à jour
SELECT 
  u.email,
  uu.subscription_tier,
  uu.templates_generated,
  uu.company_name
FROM user_usage uu
JOIN auth.users u ON uu.user_id = u.id
WHERE u.email = 'starten.contact@gmail.com';

-- RÉSULTAT ATTENDU :
-- email: starten.contact@gmail.com
-- subscription_tier: enterprise
-- templates_generated: 0
-- company_name: NULL (ou ton nom d'entreprise)







