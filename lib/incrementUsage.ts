import { createClient } from '@/lib/supabase/client'

export async function incrementUsage(userId: string) {
  const supabase = createClient()
  
  // Utiliser la fonction RPC pour incrémenter l'usage
  const { data, error } = await supabase.rpc('increment_user_templates_usage', {
    user_id_param: userId
  })

  if (error) {
    console.error('Erreur incrémentation usage:', error)
    return false
  }

  return true
}
