'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

interface UserData {
  user: User | null
  subscription_tier: string
  templates_generated: number
  templates_limit: number
  company_name: string | null
  loading: boolean
  refreshUserData: () => Promise<void>
  userData: {
    used: number
    limit: number
    tier: string
  }
}

const UserContext = createContext<UserData | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [subscription_tier, setSubscriptionTier] = useState('free')
  const [templates_generated, setTemplatesGenerated] = useState(0)
  const [templates_limit, setTemplatesLimit] = useState(3)
  const [company_name, setCompanyName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  const refreshUserData = async () => {
    try {
      console.log('🔄 Rafraîchissement des données utilisateur...')
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        setUser(null)
        setSubscriptionTier('free')
        setTemplatesGenerated(0)
        setTemplatesLimit(3)
        setCompanyName(null)
        setLoading(false)
        console.log('❌ Pas d\'utilisateur connecté')
        return
      }

      setUser(authUser)

      // ✅ UTILISER L'API /api/user/stats au lieu de lire directement la BDD
      try {
        const res = await fetch('/api/user/stats')
        const statsData = await res.json()
        
        console.log('📊 Stats récupérées depuis API:', statsData)
        
        setSubscriptionTier(statsData.tier || 'free')
        setTemplatesGenerated(statsData.used || 0)
        
        // Utiliser la vraie limite depuis Supabase (pas d'infini)
        setTemplatesLimit(statsData.limit)
        
        console.log('✅ Données mises à jour:', {
          tier: statsData.tier,
          used: statsData.used,
          limit: statsData.limit
        })
      } catch (error) {
        console.error('❌ Erreur récupération stats:', error)
      }

      // Récupérer company_name depuis profiles
      const { data: profileData } = await supabase
        .from('profiles')
        .select('company_name')
        .eq('id', authUser.id)
        .single()

      if (profileData) {
        setCompanyName(profileData.company_name || null)
      }

      setLoading(false)
    } catch (error) {
      console.error('❌ Erreur refresh user data:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUserData()

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔔 Changement d\'authentification détecté:', event)
      
      // ✅ IMPORTANT : Ignorer les erreurs PKCE pour éviter le double échange de code
      if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        refreshUserData()
      } else if (event === 'USER_UPDATED') {
        refreshUserData()
      }
      // Ignorer explicitement INITIAL_SESSION et PKCE_ERROR
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        subscription_tier,
        templates_generated,
        templates_limit,
        company_name,
        loading,
        refreshUserData,
        userData: {
          used: templates_generated,
          limit: templates_limit,
          tier: subscription_tier
        }
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}


