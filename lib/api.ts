import axios from 'axios'
import { createClient } from '@/lib/supabase/client'

const WEBHOOK_URL = 'https://matsserreecom.app.n8n.cloud/webhook/93a2c6cb-25ce-45ed-a872-0b4c7590e69d'

export async function generateDocumentation(file: File, notes: string, userId?: string, outputFormat: 'notes' | 'pdf' = 'notes', templateName?: string) {
  console.log('🚀 Début de la génération...')
  
  // Récupérer le plan utilisateur
  let userPlan = 'free'
  
  if (userId) {
    try {
      console.log('👤 Récupération du plan pour user:', userId)
      const supabase = createClient()
      
      const { data: userInfo, error } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('❌ Erreur récupération plan:', error)
      } else {
        userPlan = userInfo?.subscription_tier || 'free'
        console.log('📊 Plan utilisateur:', userPlan)
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du plan:', error)
    }
  }
  
  const reader = new FileReader()
  
  return new Promise((resolve, reject) => {
    reader.onload = async (e) => {
      try {
        const fileContent = e.target?.result as string
        console.log('📄 Fichier lu, envoi au webhook...')
        
        // ✅ LOGIQUE SIMPLIFIÉE : Un seul champ branding
        const customBrandName = (userPlan === 'enterprise' && templateName && templateName.trim() !== '') 
          ? templateName.trim() 
          : null
        
        const hasCustomBranding = customBrandName !== null
        
        console.log('📤 Envoi au webhook n8n :')
        console.log('  User ID:', userId || 'non connecté')
        console.log('  User Plan:', userPlan)
        console.log('  Output Format:', outputFormat)
        console.log('  🏢 Custom Brand Name:', customBrandName || 'Aucun (neutre)')
        console.log('  ✨ Has Custom Branding:', hasCustomBranding)
        console.log('  Webhook URL:', WEBHOOK_URL)
        
        const response = await axios.post(WEBHOOK_URL, {
          workflowJson: fileContent,
          notes: notes || '',
          webhookUrl: WEBHOOK_URL,
          executionMode: 'production',
          
          // DONNÉES UTILISATEUR ET FORMAT
          user_id: userId || null,
          user_plan: userPlan,
          output_format: outputFormat,
          
          // ✅ BRANDING SIMPLIFIÉ (2 champs clairs)
          custom_brand_name: customBrandName,      // "MATS" ou null
          has_custom_branding: hasCustomBranding,  // true ou false
          
          generated_at: new Date().toISOString()
        }, {
          timeout: 180000, // 3 minutes
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        console.log('✅ Réponse reçue du webhook:', response.status)
        console.log('📦 Données reçues:', response.data)
        
        // Vérifier si la réponse contient des données
        if (!response.data) {
          console.error('❌ Pas de données dans la réponse')
          reject(new Error('Le webhook n\'a pas retourné de données'))
          return
        }
        
        console.log('🎉 Documentation générée avec succès !')
        
        resolve(response.data)
        
      } catch (error: any) {
        console.error('❌ Erreur:', error)
        
        if (error.code === 'ECONNABORTED') {
          console.error('⏱️ Timeout - Le traitement a pris trop de temps')
          reject(new Error('Le traitement a pris trop de temps. Veuillez réessayer.'))
        } else if (error.response) {
          console.error('📛 Erreur serveur:', error.response.status, error.response.data)
          reject(new Error(`Erreur serveur: ${error.response.status}`))
        } else if (error.request) {
          console.error('🔌 Pas de réponse du serveur')
          reject(new Error('Pas de réponse du serveur. Vérifiez votre connexion.'))
        } else {
          console.error('💥 Erreur inconnue:', error.message)
          reject(new Error('Erreur lors de la génération de la documentation'))
        }
      }
    }
    
    reader.onerror = () => {
      console.error('❌ Erreur lecture fichier')
      reject(new Error('Erreur lors de la lecture du fichier'))
    }
    
    reader.readAsText(file)
  })
}
