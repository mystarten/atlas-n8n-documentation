import { createClient } from '@/lib/supabase/client'

const LIMITS = {
  free: 3,
  starter: 20,
  pro: 40,
  enterprise: 999999
} as const

export async function checkUsageLimit(userId: string) {
  const supabase = createClient()
  
  // Utiliser la fonction RPC qui utilise la table profiles
  const { data, error } = await supabase.rpc('check_usage_limit', {
    user_uuid: userId
  })

  if (error || !data) {
    return {
      canGenerate: false,
      templatesUsed: 0,
      templatesLimit: LIMITS.free,
      subscriptionTier: 'free',
      message: 'Erreur lors de la vérification des limites'
    }
  }

  return {
    canGenerate: data.allowed,
    templatesUsed: data.current,
    templatesLimit: data.limit,
    subscriptionTier: data.tier,
    message: data.allowed 
      ? 'OK' 
      : `Limite atteinte (${data.current}/${data.limit})`
  }
}
