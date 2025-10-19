'use client'
import { useState, useEffect } from 'react'
import FileUploader from '@/components/FileUploader'
import Button from '@/components/Button'
import LoadingProgress from '@/components/LoadingProgress'
import { generateDocumentation } from '@/lib/api'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import Image from 'next/image'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { createClient } from '@/lib/supabase/client'
import { checkUsageLimit } from '@/lib/checkUsageLimit'
import { incrementUsage } from '@/lib/incrementUsage'
import { useRouter } from 'next/navigation'
import FAQSection from '@/components/FAQSection'

export default function Generate() {
  // Fonction helper pour formater les tiers
  const formatTier = (tier: string) => {
    const tiers: { [key: string]: string } = {
      'free': 'Gratuit',
      'starter': 'Starter',
      'pro': 'Pro',
      'enterprise': 'Enterprise'
    }
    return tiers[tier?.toLowerCase()] || 'Gratuit'
  }

  const [file, setFile] = useState<File | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string>('template')
  const [notes, setNotes] = useState('')
  const [templateName, setTemplateName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [documentedFile, setDocumentedFile] = useState<any>(null)
  const [error, setError] = useState('')
  const [usageLimit, setUsageLimit] = useState<{ current: number; limit: number } | null>(null)
  const [showLimitAlert, setShowLimitAlert] = useState(false)
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [usageLimitInfo, setUsageLimitInfo] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [usageData, setUsageData] = useState<any>(null)
  const [outputFormat, setOutputFormat] = useState<'notes' | 'pdf'>('notes')
  const [userPlan, setUserPlan] = useState('free')
  
  const supabase = createClient()
  const router = useRouter()

  // ✅ Charger les données depuis l'API (comme UserContext)
  useEffect(() => {
    const loadUsageData = async () => {
      // ✅ Vérifier la session AVANT de charger les données
      const { data: { session } } = await supabase.auth.getSession()
      console.log('🔍 Session check:', session?.user?.email || 'No session')
      
      if (!session?.user?.id) {
        console.log('❌ Pas de session, redirection vers login')
        router.push('/login')
        return
      }
      
      setSession(session)
      
      try {
        console.log('🔄 Chargement des données utilisateur...')
        
        // ✅ Utiliser l'API stats au lieu de checkUsageLimit
        const res = await fetch('/api/user/stats')
        console.log('📡 Réponse API stats:', res.status, res.statusText)
        
        const statsData = await res.json()
        console.log('📊 Stats récupérées:', statsData)
        
        setUsageData({
          current: statsData.used || 0,
          limit: statsData.limit || 3,
          tier: statsData.tier || 'free'
        })
        
        // Garder usageLimit pour compatibilité avec le code existant
        setUsageLimit({ 
          current: statsData.used || 0, 
          limit: statsData.limit || 3 
        })
        setUserPlan(statsData.tier || 'free')
        
        console.log('✅ Données usage chargées:', statsData)
      } catch (err) {
        console.error('❌ Erreur chargement usage:', err)
        // ✅ Fallback en cas d'erreur
        setUsageData({
          current: 0,
          limit: 3,
          tier: 'free'
        })
        setUsageLimit({ 
          current: 0, 
          limit: 3 
        })
        setUserPlan('free')
      }
    }
    
    loadUsageData()
    
    // ✅ Écouter les changements de session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state change:', event, session?.user?.email || 'No session')
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/login')
      } else if (event === 'SIGNED_IN') {
        setSession(session)
        loadUsageData()
      }
    })
    
    return () => subscription.unsubscribe()
  }, [supabase.auth, router])

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile)
    if (selectedFile) {
      // Extraire le nom sans extension
      const fileNameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, '')
      setUploadedFileName(fileNameWithoutExt)
    } else {
      setUploadedFileName('template')
    }
  }

  const handleGenerate = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier JSON')
      return
    }
    
    // ✅ Vérifier la session plus robustement
    const { data: { session: currentSession } } = await supabase.auth.getSession()
    if (!currentSession?.user?.id) {
      console.log('❌ Pas de session dans handleGenerate, redirection')
      router.push('/login')
      return
    }
    
    setSession(currentSession)

    // Scroll vers le haut pour voir le loader
    window.scrollTo({ top: 0, behavior: 'smooth' })

    setIsLoading(true)
    setError('')
    setShowLimitAlert(false)

    try {
      // ✅ Vérifier la limite depuis les données actuelles
      console.log('🔍 Vérification limite:', usageData)
      
      if (usageData && usageData.current >= usageData.limit && usageData.limit < 999999) {
        console.log('❌ Limite atteinte, affichage du popup')
        setUsageLimitInfo(usageData)
        setShowLimitModal(true)
        setIsLoading(false)
        return
      }

      console.log('✅ Limite OK, lancement de la génération...')
      
      // Lancer la génération
      setError('')
      const result = await generateDocumentation(file, notes, session.user.id, outputFormat, templateName)
      console.log('✅ Résultat reçu:', result)

      setIsLoading(false)
      setDocumentedFile(result)
      setIsSuccess(true)

      // ✅ Incrémenter l'usage après génération réussie
      try {
        console.log('🔄 Incrémentation de l\'usage...')
        const incrementResponse = await fetch('/api/increment-usage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        console.log('📊 Réponse incrémentation:', incrementResponse.status, incrementResponse.statusText)
        
        if (incrementResponse.ok) {
          const incrementData = await incrementResponse.json()
          console.log('✅ Usage incrémenté:', incrementData)
        } else {
          const errorText = await incrementResponse.text()
          console.error('⚠️ Erreur incrémentation:', errorText)
        }
      } catch (incrementError) {
        console.error('⚠️ Erreur lors de l\'incrémentation:', incrementError)
      }

      // ✅ Rafraîchir les stats après génération réussie
      try {
        console.log('🔄 Rafraîchissement des stats...')
        const statsResponse = await fetch('/api/user/stats')
        const newStats = await statsResponse.json()
        console.log('📊 Nouvelles stats:', newStats)
        
        setUsageData({ current: newStats.used, limit: newStats.limit, tier: newStats.tier })
        setUsageLimit({ current: newStats.used, limit: newStats.limit })
        console.log('✅ Stats rafraîchies après génération:', newStats)
      } catch (statsError) {
        console.error('⚠️ Erreur rafraîchissement stats:', statsError)
      }

      // TÉLÉCHARGEMENT AUTOMATIQUE IMMÉDIAT
      setTimeout(() => {
        const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        // Utiliser uploadedFileName pour le nom du fichier
        a.download = `${uploadedFileName}_atlas.json`
        a.click()
        URL.revokeObjectURL(url)
        console.log('📥 Template téléchargée automatiquement:', `${uploadedFileName}_atlas.json`)
        
        // RESET AUTO APRÈS 2 SECONDES
        setTimeout(() => {
          setFile(null)
          setUploadedFileName('template')
          setNotes('')
          setTemplateName('')
          setIsSuccess(false)
          setDocumentedFile(null)
          setError('')
          console.log('🔄 Formulaire réinitialisé - Prêt pour nouvelle génération')
        }, 2000)
      }, 500)
      
    } catch (err: any) {
      console.error('❌ Erreur dans handleGenerate:', err)
      setIsLoading(false) // Important aussi en cas d'erreur
      setError(err.message || 'Une erreur est survenue')
    }
  }


  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section avec Upload */}
      <section className="section-padding relative min-h-screen flex items-center">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0E27] via-[#1A1F3A] to-[#0A0E27] opacity-90"></div>
        
        {/* Logo décoratif géant en arrière-plan */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
          <img
            src="/img/logo.png"
            alt="Atlas"
            className="w-[800px] h-[800px] opacity-5 blur-3xl"
            style={{ objectFit: 'contain', background: 'transparent' }}
          />
        </div>
        
        {/* Particules décoratives */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#7C3AED] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#06B6D4] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="container-custom relative z-10 w-full">
          <div className="text-center max-w-5xl mx-auto mb-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8">
              Documentez vos workflows{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                N8N
              </span>{' '}
              en quelques secondes
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-6 leading-relaxed">
              Glissez votre fichier JSON, ajoutez des notes et obtenez une documentation professionnelle instantanément
            </p>
            
            {/* Affichage du compteur d'usage */}
            {session && (
              <div className="text-center mb-4">
                {usageData ? (
                  <span className="text-gray-400">
                    Vous avez utilisé <strong className="text-blue-400 font-semibold">{usageData.current} / {usageData.limit}</strong> templates
                  </span>
                ) : (
                  <span className="text-gray-400">
                    Chargement de vos statistiques...
                  </span>
                )}
                <div className="mt-2">
                  <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-sm">
                    <span className="text-gray-400">Plan : </span>
                    <span className="text-blue-400 font-semibold capitalize">
                      {usageData ? formatTier(usageData.tier) : 'Gratuit'}
                    </span>
                  </span>
                </div>
                
                {/* Badge discret pour upgrade pro */}
                {usageData && usageData.tier === 'free' && (
                  <div className="mt-3">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full text-sm hover:border-purple-500/40 transition-all duration-300 cursor-pointer group"
                         onClick={() => router.push('/pricing')}>
                      <span className="text-purple-300 group-hover:text-purple-200">✨</span>
                      <span className="text-gray-300 group-hover:text-white">
                        Génération illimitée + PDF avec le plan Pro
                      </span>
                      <span className="text-purple-400 group-hover:text-purple-300 text-xs">→</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {!isLoading && !isSuccess && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 md:p-12 hover:border-slate-700 transition-colors shadow-lg shadow-black/10">
                <FileUploader onFileSelect={handleFileSelect} />
                
                <div className="mt-8">
                  <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">
                    Notes complémentaires (optionnel)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ajoutez des informations contextuelles sur votre workflow..."
                    rows={4}
                    maxLength={500}
                    className="w-full px-6 py-4 bg-[#0A0E27] border-2 border-[#7C3AED]/30 rounded-2xl focus:ring-4 focus:ring-[#7C3AED]/50 focus:border-[#7C3AED] resize-none transition-all duration-300 text-white placeholder-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-right font-mono">{notes.length}/500</p>
                </div>

                {/* Personnalisation de marque (Enterprise uniquement) */}
                {file && userPlan === 'enterprise' && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-2xl border-2 border-blue-500/30">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <label className="block text-base font-bold text-white mb-1">
                          Personnalisation de marque (Enterprise)
                        </label>
                        <p className="text-xs text-blue-200/70">
                          Indiquez le nom de votre entreprise pour personnaliser vos documents
                        </p>
                      </div>
                    </div>
                    
                    <input
                      type="text"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="Nom de votre entreprise"
                      maxLength={100}
                      className="w-full px-4 py-3 bg-[#0A0E27] border-2 border-blue-400/30 rounded-xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-white placeholder-gray-500"
                    />
                    
                    <p className="text-xs text-blue-200/70 mt-2">
                      Par défaut, aucun nom ne sera mentionné. Ce nom apparaîtra dans tous vos documents générés.
                    </p>
                  </div>
                )}

                {/* Sélecteur de format de sortie */}
                {file && userPlan !== 'free' && (
                  <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">
                          Choisissez votre format de sortie
                        </h3>
                        <p className="text-blue-200/70 text-sm">
                          Sélectionnez le format dans lequel vous souhaitez recevoir votre documentation
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Option Notes n8n */}
                      <label className={`relative flex items-start gap-4 p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        outputFormat === 'notes' 
                          ? 'bg-blue-500/10 border-blue-400' 
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}>
                        <input
                          type="radio"
                          name="outputFormat"
                          value="notes"
                          checked={outputFormat === 'notes'}
                          onChange={(e) => setOutputFormat(e.target.value as any)}
                          className="mt-1 w-5 h-5 text-blue-500 border-white/20 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            <h4 className="text-lg font-semibold text-white">Notes n8n</h4>
                          </div>
                          <p className="text-white/70 text-sm">
                            Documentation sous forme de notes et post-it directement dans votre workflow n8n
                          </p>
                          <div className="mt-3 flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                              Intégré au workflow
                            </span>
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                              Visuel
                            </span>
                            {(userPlan === 'pro' || userPlan === 'enterprise') && (
                              <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">
                                ✓ Sans watermark
                              </span>
                            )}
                          </div>
                          {userPlan === 'starter' && (
                            <p className="mt-2 text-orange-300 text-xs">
                              ⚠️ Avec watermark "Généré par ATLAS"
                            </p>
                          )}
                        </div>
                      </label>

                      {/* Option Export PDF */}
                      <label className={`relative flex items-start gap-4 p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        outputFormat === 'pdf' 
                          ? 'bg-blue-500/10 border-blue-400' 
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}>
                        <input
                          type="radio"
                          name="outputFormat"
                          value="pdf"
                          checked={outputFormat === 'pdf'}
                          onChange={(e) => setOutputFormat(e.target.value as any)}
                          className="mt-1 w-5 h-5 text-blue-500 border-white/20 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <h4 className="text-lg font-semibold text-white">Export PDF</h4>
                            {session && usageData && usageData.tier === 'free' && (
                              <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold rounded-full">
                                PRO
                              </span>
                            )}
                          </div>
                          <p className="text-white/70 text-sm">
                            Document PDF professionnel, prêt à imprimer ou à partager
                          </p>
                          <div className="mt-3 flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                              Téléchargeable
                            </span>
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                              Portable
                            </span>
                            {(userPlan === 'pro' || userPlan === 'enterprise') && (
                              <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">
                                ✓ Sans watermark
                              </span>
                            )}
                          </div>
                          {userPlan === 'starter' && (
                            <p className="mt-2 text-orange-300 text-xs">
                              ⚠️ Avec watermark "Généré par ATLAS"
                            </p>
                          )}
                          {session && usageData && usageData.tier === 'free' && (
                            <div className="mt-3 p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg">
                              <p className="text-purple-300 text-xs text-center">
                                💎 <strong>Upgradez vers Pro</strong> pour débloquer l'export PDF et la génération illimitée
                              </p>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Compteur de documentations - EN BAS */}
                {session && usageData && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl">
                    <div className="text-center">
                      <span className="text-gray-300">
                        Documentations générées : <strong className="text-cyan-400">{usageData.current}</strong> / <strong className="text-blue-400">{usageData.limit}</strong>
                      </span>
                    </div>
                    <div className="text-center mt-2">
                      <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-sm">
                        <span className="text-gray-400">Plan : </span>
                        <span className="text-blue-400 font-semibold capitalize">
                          {formatTier(usageData.tier)}
                        </span>
                      </span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mt-6 p-5 bg-red-500/10 border-2 border-red-500/30 rounded-2xl text-red-400 font-semibold">
                    {error}
                  </div>
                )}

                <Button 
                  onClick={handleGenerate}
                  disabled={!file}
                  className="w-full mt-10"
                  size="large"
                >
                  Générer la Documentation
                </Button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="max-w-4xl mx-auto">
              <LoadingProgress />
            </div>
          )}

          {isSuccess && documentedFile && (
            <div className="max-w-4xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-12 text-center shadow-lg shadow-black/10">
              <div className="relative mb-8 flex justify-center">
                <div className="relative">
                  <img src="/logo.png" alt="ATLAS Logo" className="h-24 w-24 object-contain animate-bounce" />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-blue-500/30 rounded-full blur-2xl animate-pulse"></div>
                </div>
                <div className="absolute top-0 right-1/3 w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center glow-cyan">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                Documentation générée avec succès !
              </h2>
              <p className="text-lg text-gray-300 mb-12">
                ✅ Template générée et téléchargée avec succès ! Préparation pour une nouvelle génération...
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Comment ça marche - Timeline verticale animée */}
      <section className="section-padding relative bg-[#1A1F3A]/50">
        <div className="container-custom">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
              Comment ça marche
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
              De votre JSON brut à une documentation professionnelle en 4 étapes automatiques
            </p>
          </div>
          
          {/* Timeline verticale */}
          <div className="max-w-4xl mx-auto relative">
            {/* Ligne verticale centrale */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 via-cyan-500 to-blue-500"></div>

            {/* Étape 1 - Gauche */}
            <div className="flex items-center mb-24">
              <div className="w-1/2 pr-12 text-right">
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-colors">
                  <h3 className="text-3xl font-bold text-white mb-4">Upload votre workflow</h3>
                  <p className="text-gray-300 text-lg mb-6">
                    Glissez votre fichier JSON N8N directement dans l'interface
                  </p>
                  <div className="flex justify-end gap-3">
                    <span className="px-4 py-2 bg-blue-600/30 text-blue-300 rounded-xl text-sm font-semibold border border-blue-500/30">
                      JSON
                    </span>
                    <span className="px-4 py-2 bg-blue-600/30 text-blue-300 rounded-xl text-sm font-semibold border border-blue-500/30">
                      Drag & Drop
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-full flex items-center justify-center text-3xl font-bold text-white z-10 shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:scale-125 transition-transform duration-300 cursor-pointer">
                1
              </div>
              <div className="w-1/2 pl-12"></div>
            </div>

            {/* Étape 2 - Droite */}
            <div className="flex items-center mb-24">
              <div className="w-1/2 pr-12"></div>
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-600 to-cyan-400 rounded-full flex items-center justify-center text-3xl font-bold text-white z-10 shadow-[0_0_30px_rgba(6,182,212,0.6)] relative hover:scale-125 transition-transform duration-300 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-shimmer"></div>
                2
              </div>
              <div className="w-1/2 pl-12">
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-colors overflow-hidden">
                  <h3 className="text-3xl font-bold text-white mb-4">IA analyse votre workflow</h3>
                  <p className="text-gray-300 text-lg mb-6">
                    L'intelligence artificielle décortique chaque nœud et comprend la logique
                  </p>
                  <div className="flex gap-3">
                    <span className="px-4 py-2 bg-cyan-600/30 text-cyan-300 rounded-xl text-sm font-semibold border border-cyan-500/30">
                      Claude Sonnet 4
                    </span>
                    <span className="px-4 py-2 bg-cyan-600/30 text-cyan-300 rounded-xl text-sm font-semibold border border-cyan-500/30">
                      Analyse automatique
                    </span>
                  </div>
                </div>
                    </div>
                    </div>

            {/* Étape 3 - Gauche */}
            <div className="flex items-center mb-24">
              <div className="w-1/2 pr-12 text-right">
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-colors">
                  <h3 className="text-3xl font-bold text-white mb-4">Documentation générée</h3>
                  <p className="text-gray-300 text-lg mb-6">
                    Création automatique d'une documentation complète et professionnelle
                  </p>
                  <div className="flex justify-end gap-3">
                    <span className="px-4 py-2 bg-blue-600/30 text-blue-300 rounded-xl text-sm font-semibold border border-blue-500/30">
                      Markdown
                    </span>
                    <span className="px-4 py-2 bg-blue-600/30 text-blue-300 rounded-xl text-sm font-semibold border border-blue-500/30">
                      Instructions
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-3xl font-bold text-white z-10 shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:scale-125 transition-transform duration-300 cursor-pointer">
                3
              </div>
              <div className="w-1/2 pl-12"></div>
            </div>

            {/* Étape 4 - Droite */}
            <div className="flex items-center">
              <div className="w-1/2 pr-12"></div>
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-3xl font-bold text-white z-10 shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-125 transition-transform duration-300 cursor-pointer">
                4
              </div>
              <div className="w-1/2 pl-12">
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-colors">
                  <h3 className="text-3xl font-bold text-white mb-4">Téléchargement automatique</h3>
                  <p className="text-gray-300 text-lg mb-6">
                    Votre template documenté est prêt à être partagé ou utilisé
                  </p>
                  <div className="flex gap-3">
                    <span className="px-4 py-2 bg-cyan-600/30 text-cyan-300 rounded-xl text-sm font-semibold border border-cyan-500/30">
                      Prêt à l'emploi
                    </span>
                    <span className="px-4 py-2 bg-cyan-600/30 text-cyan-300 rounded-xl text-sm font-semibold border border-cyan-500/30">
                      Instantané
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voyez la différence - Slider Avant/Après */}
      <section className="section-padding relative">
        <div className="container-custom">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
              Voyez la différence
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              40 secondes pour passer de chaos à clarté
            </p>
          </div>

          {/* Slider Avant/Après FONCTIONNEL */}
          <div className="max-w-6xl mx-auto mb-20">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-lg shadow-black/10">
              <p className="text-center text-gray-300 mb-6 font-semibold text-lg">
                Passez votre souris sur l'image pour voir la transformation
              </p>
              <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ height: '600px' }}>
                <ReactCompareSlider
                  itemOne={
                    <ReactCompareSliderImage
                      src="/img/avant.png"
                      alt="Avant documentation"
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  }
                  itemTwo={
                    <ReactCompareSliderImage
                      src="/img/apres.png"
                      alt="Après documentation"
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  }
                  style={{ width: '100%', height: '100%' }}
                  position={50}
                />
              </div>
            </div>
          </div>

          {/* Comparaison Notes Avant/Après */}
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mb-20">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">SANS ATLAS</h3>
                <span className="text-4xl text-red-500">✕</span>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-2xl mb-6">
                <Image 
                  src="/img/avantnotes.png" 
                  alt="Notes basiques" 
                  width={600} 
                  height={400} 
                  className="w-full h-auto object-cover"
                />
              </div>
              <p className="text-gray-400 text-lg">Notes basiques ou inexistantes</p>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-blue-500/50 rounded-2xl p-8 hover:border-blue-500 transition-colors shadow-lg shadow-blue-500/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">AVEC ATLAS</h3>
                <span className="text-4xl text-green-400">✓</span>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-2xl mb-6">
                <Image 
                  src="/img/apresnotes.png" 
                  alt="Notes détaillées" 
                  width={600} 
                  height={400} 
                  className="w-full h-auto object-cover"
                />
              </div>
              <p className="text-white text-lg font-bold">Instructions complètes et pratiques</p>
            </div>
          </div>

          {/* Témoignages Mats + Zahir */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
                Approuvé par les <span className="text-gradient-violet">experts reconnus</span>
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Témoignage Mats */}
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-10 hover:border-slate-700 transition-colors relative shadow-lg shadow-black/10">
                <div className="absolute top-6 right-6">
                  <span className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white px-5 py-2 rounded-full font-black text-sm">
                    +50K abonnés
                  </span>
                </div>
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
          <Image
                      src="/img/logo mats.jpg" 
                      alt="Mats" 
                      width={120} 
                      height={120} 
                      className="rounded-full border-4 border-[#7C3AED] glow-violet"
                    />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-4xl">Mats Automation</h3>
                    <p className="text-lg text-gray-400">Expert N8N | Créateur de contenu</p>
                  </div>
                </div>
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-7 h-7 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-lg text-gray-300 italic leading-relaxed">
                  "Atlas a complètement transformé ma façon de partager mes workflows. Mes abonnés comprennent enfin mes automations complexes sans que j'aie à tout expliquer. Un gain de temps incroyable !"
                </p>
              </div>

              {/* Témoignage Zahir */}
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-10 hover:border-slate-700 transition-colors relative shadow-lg shadow-black/10">
                <div className="absolute top-6 right-6">
                  <span className="bg-gradient-to-r from-[#06B6D4] to-[#10B981] text-white px-5 py-2 rounded-full font-black text-sm">
                    +300K abonnés
                  </span>
                </div>
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
          <Image
                      src="/img/Zahir Aftab.jpg" 
                      alt="Zahir" 
                      width={120} 
                      height={120} 
                      className="rounded-full border-4 border-[#06B6D4] glow-cyan"
                    />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-4xl">Zahir Aftab</h3>
                    <p className="text-lg text-gray-400">N8N Automation Expert | Consultant</p>
                  </div>
                </div>
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-7 h-7 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-lg text-gray-300 italic leading-relaxed">
                  "En tant que consultant, la documentation est cruciale. Atlas génère exactement ce dont mes clients ont besoin. Plus de confusion, juste de la clarté. C'est devenu indispensable dans mon workflow."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compteur de templates générés */}
      <section className="section-padding relative bg-[#1A1F3A]/50">
        <div className="container-custom">
          <div className="text-center">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-16 shadow-lg shadow-black/10">
              <h3 className="text-3xl md:text-5xl font-black text-white mb-8">
                <span className="text-gradient-violet">2 478</span> templates générés cette semaine
              </h3>
              <p className="text-lg text-gray-300">
                Rejoignez des centaines de professionnels qui font confiance à Atlas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Type de documentation générée */}
      <section className="section-padding relative">
        <div className="container-custom">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
              Le type de documentation que vous obtenez
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Templates enrichis avec annotations professionnelles
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-10 hover:border-slate-700 transition-colors shadow-lg shadow-black/10">
              <div className="text-center mb-8">
                <h3 className="text-4xl font-bold text-white mb-4">
                  Le type de documentation que vous obtenez
                </h3>
                <p className="text-gray-300 text-lg">
                  Templates enrichis avec annotations professionnelles
                </p>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/30 shadow-2xl">
          <Image
                  src="/apres.png" 
                  alt="Template documenté" 
                  width={1000} 
                height={600} 
                  className="w-full h-auto object-contain"
                  priority
              />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carrousel de témoignages clients */}
      <section className="section-padding relative bg-[#1A1F3A]/50">
        <div className="container-custom">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Rejoignez des centaines de professionnels satisfaits
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Slider
              dots={true}
              infinite={true}
              speed={500}
              slidesToShow={3}
              slidesToScroll={1}
              autoplay={true}
              autoplaySpeed={4000}
              pauseOnHover={true}
              responsive={[
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                  }
                },
                {
                  breakpoint: 600,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                  }
                }
              ]}
              className="testimonial-slider"
            >
              {[
                {
                  name: "Thomas Dubois",
                  role: "Workflow Architect",
                  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
                  quote: "Documentation claire en un clic. Mes équipes adorent !"
                },
                {
                  name: "Sophie Martin",
                  role: "No-Code Specialist",
                  image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
                  quote: "Fini les workflows incompréhensibles. Atlas est magique."
                },
                {
                  name: "Alexandre Petit",
                  role: "Automation Consultant",
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
                  quote: "Mes clients sont impressionnés par la qualité de la documentation."
                },
                {
                  name: "Marie Laurent",
                  role: "Digital Ops Manager",
                  image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
                  quote: "Onboarding divisé par 3. Un must-have pour toute équipe."
                },
                {
                  name: "Lucas Bernard",
                  role: "N8N Developer",
                  image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
                  quote: "Je ne partage plus jamais un workflow sans Atlas."
                }
              ].map((testimonial, idx) => (
                <div key={idx} className="px-4">
                  <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 text-center hover:border-slate-700 transition-colors shadow-lg shadow-black/10">
                    <div className="flex justify-center mb-6">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={80}
                        height={80}
                        className="rounded-full border-4 border-[#7C3AED] glow-violet"
                      />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">{testimonial.name}</h4>
                    <p className="text-gray-400 mb-4">{testimonial.role}</p>
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-300 italic text-sm leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* Compatible avec */}
      <section className="section-padding relative bg-[#1A1F3A]/50">
        <div className="container-custom">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-16 text-center shadow-lg shadow-black/10">
            <h3 className="text-4xl font-black text-white mb-12">Compatible avec</h3>
            <div className="flex justify-center items-center gap-16 flex-wrap">
              <div className="glass-light px-12 py-8 rounded-3xl hover:scale-110 transition-all duration-500 glow-violet flex items-center gap-4">
                <Image src="/N8N.png" alt="N8N Logo" width={60} height={20} className="opacity-80 hover:opacity-100 transition" />
                <span className="text-4xl font-black text-white">N8N</span>
                <span className="ml-5 text-xs bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow-xl">DISPONIBLE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Modal Limite Atteinte */}
      {showLimitModal && usageLimitInfo && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setShowLimitModal(false)}
        >
          <div 
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-blue-500/40 rounded-3xl p-10 max-w-lg w-full shadow-[0_0_50px_rgba(59,130,246,0.4)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-6">
              {/* Titre principal */}
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Limite atteinte
              </h2>
              
              {/* Message principal */}
              <div className="space-y-3">
                <p className="text-lg text-gray-200">
                  Vous avez utilisé <span className="font-bold text-blue-400">{usageLimitInfo.current} / {usageLimitInfo.limit}</span> documentations
                </p>
                <p className="text-gray-400">
                  Plan actuel : <span className="font-semibold text-blue-400 capitalize">
                    {formatTier(usageLimitInfo.tier)}
                  </span>
                </p>
              </div>
              
              {/* Message secondaire */}
              <p className="text-gray-400 text-sm leading-relaxed">
                Passez à un plan supérieur pour continuer à générer des documentations professionnelles et débloquer plus de fonctionnalités.
              </p>
              
              {/* Séparateur */}
              <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
              
              {/* Boutons */}
              <div className="flex gap-4 justify-center pt-2">
                <button
                  onClick={() => window.location.href = '/pricing'}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200"
                >
                  Voir les plans
                </button>
                <button
                  onClick={() => setShowLimitModal(false)}
                  className="px-8 py-3 border-2 border-gray-600 text-gray-300 rounded-xl font-semibold hover:bg-gray-800 hover:border-gray-500 transition-all duration-200"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
