import { createClient } from '@/lib/supabase/client'

const LIMITS = {
  free: 3,
  starter: 20,
  pro: 40,
  enterprise: 60
} as const

export async function checkUsageLimit(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('subscription_tier, templates_used, templates_limit')
    .eq('id', userId)
    .single()

  if (error || !data) {
    return {
      canGenerate: false,
      templatesUsed: 0,
      templatesLimit: LIMITS.free,
      subscriptionTier: 'free',
      message: 'Erreur lors de la vérification des limites'
    }
  }

  const canGenerate = data.templates_used < data.templates_limit

  return {
    canGenerate,
    templatesUsed: data.templates_used,
    templatesLimit: data.templates_limit,
    subscriptionTier: data.subscription_tier,
    message: canGenerate 
      ? 'OK' 
      : `Limite atteinte (${data.templates_used}/${data.templates_limit})`
  }
}
