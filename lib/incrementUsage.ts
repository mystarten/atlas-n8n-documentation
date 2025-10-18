import { createClient } from '@/lib/supabase/client'

export async function incrementUsage(userId: string) {
  const supabase = createClient()
  
  // Utiliser la fonction RPC corrigée qui utilise la table profiles
  const { data, error } = await supabase.rpc('increment_user_templates_usage', {
    user_uuid: userId
  })

  if (error) {
    console.error('Erreur incrémentation usage:', error)
    return false
  }

  console.log('✅ Usage incrémenté:', data)
  return true
}
