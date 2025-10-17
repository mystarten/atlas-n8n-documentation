'use client';

import { motion } from 'framer-motion';

export default function DocumentationPage() {
  return (
    <main className="min-h-screen bg-[#0f172a]">
        
        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-20">
          
          {/* Logo ATLAS animé */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <img 
              src="/logo.png" 
              alt="ATLAS" 
              className="h-32 w-auto"
            />
          </motion.div>
          
          {/* Titre - "Atlas" en GRADIENT */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-7xl font-bold text-center mb-8 leading-tight"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Documentation{' '}
            <span className="bg-gradient-to-r from-[#8b5cf6] via-[#3b82f6] to-[#06b6d4] bg-clip-text text-transparent">
              Atlas
            </span>
          </motion.h1>
          
          {/* Sous-titre */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-[#cbd5e1] text-center mb-8 leading-relaxed max-w-3xl font-light"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Découvrez la technologie derrière la génération automatique de documentation pour vos workflows N8N
          </motion.p>
          
          {/* Badge Claude - SANS EMOJI, GRADIENT SUBTIL */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#8b5cf6]/10 via-[#3b82f6]/10 to-[#06b6d4]/10 backdrop-blur-sm rounded-full border border-[#3b82f6]/30 mb-12"
          >
            <svg className="w-5 h-5 text-[#3b82f6]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            <span className="text-[#e2e8f0] text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              Propulsé par{' '}
              <span className="bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] bg-clip-text text-transparent font-semibold">
                Claude Sonnet 4.5
              </span>
              {' '}avec modèles adaptatifs
            </span>
          </motion.div>
          
        </section>

        {/* Section : Le problème - SANS EMOJI */}
        <section className="py-24 px-6 bg-[#0f172a] relative">
          <div className="max-w-6xl mx-auto">
            
            {/* Titre section */}
            <div className="text-center mb-16">
              <p className="text-[#3b82f6] font-semibold mb-3 tracking-wider uppercase text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                Le problème
              </p>
              <h2 className="text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Des templates N8N sans mode d'emploi
              </h2>
              <p className="text-xl text-[#cbd5e1] max-w-3xl mx-auto font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
                Vous téléchargez un template sur une marketplace, Instagram ou YouTube... mais impossible de savoir comment l'utiliser.
              </p>
            </div>
            
            {/* Grid problèmes - DESIGN PRO SANS EMOJI */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              
              {/* Problème 1 */}
              <div className="p-8 bg-[#1e293b]/50 backdrop-blur-sm rounded-2xl border border-[#334155]/30 hover:border-[#ef4444]/30 transition-all duration-300">
                <div className="w-12 h-12 bg-[#ef4444]/10 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Une boîte noire totale
                </h3>
                <p className="text-[#cbd5e1] leading-relaxed font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Des dizaines de nœuds, zéro explication. Personne ne sait par où commencer ni comment configurer.
                </p>
              </div>

              {/* Problème 2 */}
              <div className="p-8 bg-[#1e293b]/50 backdrop-blur-sm rounded-2xl border border-[#334155]/30 hover:border-[#f59e0b]/30 transition-all duration-300">
                <div className="w-12 h-12 bg-[#f59e0b]/10 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-[#f59e0b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Des heures perdues
                </h3>
                <p className="text-[#cbd5e1] leading-relaxed font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Tester chaque connexion, chercher sur Google, essayer de comprendre... Le temps file sans résultat.
                </p>
              </div>

              {/* Problème 3 */}
              <div className="p-8 bg-[#1e293b]/50 backdrop-blur-sm rounded-2xl border border-[#334155]/30 hover:border-[#8b5cf6]/30 transition-all duration-300">
                <div className="w-12 h-12 bg-[#8b5cf6]/10 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-[#8b5cf6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Frustration maximale
                </h3>
                <p className="text-[#cbd5e1] leading-relaxed font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Vous abandonnez le template avant même de l'avoir testé. La valeur perçue est nulle.
                </p>
              </div>
              
            </div>

            {/* Stat */}
            <div className="text-center p-8 bg-gradient-to-r from-[#ef4444]/10 to-[#f59e0b]/10 rounded-2xl border border-[#ef4444]/20">
              <p className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                87% des templates téléchargés
              </p>
              <p className="text-lg text-[#cbd5e1] font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
                ne sont jamais utilisés faute de documentation claire
              </p>
            </div>
            
          </div>
        </section>

        {/* Section : La solution */}
        <section className="py-24 px-6 bg-gradient-to-b from-[#0f172a] to-[#1e293b] relative">
          <div className="max-w-6xl mx-auto">
            
            {/* Titre section */}
            <div className="text-center mb-16">
              <p className="text-[#3b82f6] font-semibold mb-3 tracking-wider uppercase text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                La solution
              </p>
              <h2 className="text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Atlas transforme vos templates en{' '}
                <span className="bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] bg-clip-text text-transparent">
                  produits clé en main
                </span>
          </h2>
              <p className="text-xl text-[#cbd5e1] max-w-3xl mx-auto font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
                En 40 secondes, Atlas génère toute la documentation nécessaire pour comprendre et utiliser n'importe quel workflow N8N.
              </p>
            </div>

            {/* Grid solutions */}
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* QuickStart */}
              <div className="p-8 bg-[#1e293b]/80 backdrop-blur-sm rounded-2xl border border-[#3b82f6]/30 hover:border-[#3b82f6]/50 transition-all duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#3b82f6]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      QuickStart en 5 minutes
                    </h3>
                    <p className="text-[#3b82f6] text-sm font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                      POST-IT EXPLICATIFS SUR CHAQUE NŒUD
                    </p>
                  </div>
                </div>
                <p className="text-[#cbd5e1] leading-relaxed mb-4 font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Atlas ajoute automatiquement des post-it sur chaque nœud pour expliquer son rôle, comment faire les connexions, et quelles données il utilise.
                </p>
                <div className="flex items-center gap-2 text-[#10b981] text-sm font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Démarrage immédiat sans recherche
                </div>
              </div>
              
              {/* Notes paramètres */}
              <div className="p-8 bg-[#1e293b]/80 backdrop-blur-sm rounded-2xl border border-[#3b82f6]/30 hover:border-[#3b82f6]/50 transition-all duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#8b5cf6]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#8b5cf6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Notes dans chaque nœud
                    </h3>
                    <p className="text-[#8b5cf6] text-sm font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                      DOCUMENTATION DÉTAILLÉE DES PARAMÈTRES
                    </p>
                  </div>
                </div>
                <p className="text-[#cbd5e1] leading-relaxed mb-4 font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Chaque paramètre est documenté avec des explications claires : à quoi il sert, quelle valeur mettre, comment le configurer.
                </p>
                <div className="flex items-center gap-2 text-[#10b981] text-sm font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Plus de confusion, tout est clair
                </div>
              </div>
              
              {/* Watermark pour créateurs */}
              <div className="p-8 bg-gradient-to-br from-[#8b5cf6]/10 to-[#06b6d4]/10 backdrop-blur-sm rounded-2xl border border-[#8b5cf6]/30 hover:border-[#8b5cf6]/50 transition-all duration-300 md:col-span-2">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#8b5cf6]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#8b5cf6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Watermark personnalisé pour les créateurs
                    </h3>
                    <p className="bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] bg-clip-text text-transparent text-sm font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                      AUGMENTEZ LA VALEUR PERÇUE DE VOS TEMPLATES
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[#cbd5e1] leading-relaxed mb-4 font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Vous partagez vos templates sur Instagram, YouTube ou des marketplaces ? Atlas vous permet d'ajouter votre logo et watermark directement dans les nœuds.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-[#cbd5e1] font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <svg className="w-5 h-5 text-[#3b82f6] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Branding personnalisé sur tous les exports</span>
                      </li>
                      <li className="flex items-start gap-3 text-[#cbd5e1] font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <svg className="w-5 h-5 text-[#3b82f6] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Vos abonnés comprennent immédiatement vos workflows</span>
                      </li>
                      <li className="flex items-start gap-3 text-[#cbd5e1] font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <svg className="w-5 h-5 text-[#3b82f6] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Moins de questions, plus de satisfaction</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#8b5cf6]/20 blur-2xl rounded-full"></div>
                      <div className="relative p-8 bg-[#1e293b] rounded-2xl border-2 border-[#8b5cf6]/50 shadow-2xl shadow-[#8b5cf6]/20">
                        <p className="text-6xl font-bold text-white mb-2 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>10x</p>
                        <p className="text-[#cbd5e1] text-center" style={{ fontFamily: 'Inter, sans-serif' }}>Valeur perçue</p>
                  </div>
                </div>
                  </div>
                </div>
              </div>
              
            </div>
            
          </div>
        </section>

        {/* Section Exemples de Documentation Générée */}
        <section className="py-16 px-6 bg-gradient-to-b from-[#1e293b] to-[#0f172a]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-12" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Exemples de Documentation Générée
            </h2>

            {/* Grid 3 exemples */}
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Comptable */}
              <div className="bg-[#1e293b]/50 rounded-2xl border border-[#334155]/30 p-6 hover:border-[#3b82f6]/50 transition-colors">
                <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  📊 Comptabilité Automatisée
                </h3>
                <p className="text-[#cbd5e1] text-sm mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Tickets de caisse → CRM comptable
                </p>
                <div className="rounded-lg overflow-hidden border border-[#334155]/30 mb-4">
                  <img src="/comptableapres.png" alt="Exemple comptable" className="w-full h-auto" />
                </div>
                <div className="flex items-center gap-2 text-[#10b981] text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Documenté par ATLAS</span>
                </div>
              </div>

              {/* Veille */}
              <div className="bg-[#1e293b]/50 rounded-2xl border border-[#334155]/30 p-6 hover:border-[#3b82f6]/50 transition-colors">
                <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  🔍 Veille Concurrentielle
                </h3>
                <p className="text-[#cbd5e1] text-sm mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Analyse produits + rapports stratégiques
                </p>
                <div className="rounded-lg overflow-hidden border border-[#334155]/30 mb-4">
                  <img src="/concurrenceapres.png" alt="Exemple veille" className="w-full h-auto" />
                </div>
                <div className="flex items-center gap-2 text-[#10b981] text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Documenté par ATLAS</span>
                </div>
              </div>

              {/* Sora */}
              <div className="bg-[#1e293b]/50 rounded-2xl border border-[#334155]/30 p-6 hover:border-[#3b82f6]/50 transition-colors">
                <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  🎬 Génération Vidéo IA
                </h3>
                <p className="text-[#cbd5e1] text-sm mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Création vidéos automatiques avec Sora
                </p>
                <div className="rounded-lg overflow-hidden border border-[#334155]/30 mb-4">
                  <img src="/soraapres.png" alt="Exemple Sora" className="w-full h-auto" />
                </div>
                <div className="flex items-center gap-2 text-[#10b981] text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Documenté par ATLAS</span>
                </div>
              </div>

            </div>

            {/* Mention Export PDF */}
            <div className="mt-12 p-6 bg-gradient-to-r from-[#ef4444]/10 to-[#dc2626]/10 rounded-2xl border border-[#ef4444]/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#ef4444]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Export PDF Inclus</h4>
                  <p className="text-[#cbd5e1] font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Tous les workflows documentés peuvent être exportés en PDF professionnel. Parfait pour partager avec votre équipe, clients ou pour vos archives.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 px-6 bg-[#0f172a]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Prêt à transformer vos templates ?
            </h2>
            <p className="text-xl text-[#cbd5e1] mb-12" style={{ fontFamily: 'Inter, sans-serif' }}>
              Rejoignez les créateurs N8N qui documentent leurs workflows en 40 secondes
            </p>
            <a 
              href="/generate"
              className="inline-block px-12 py-5 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white text-lg font-semibold rounded-lg hover:from-[#2563eb] hover:to-[#1d4ed8] transition-all hover:scale-105 shadow-lg shadow-[#3b82f6]/50"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Commencer gratuitement →
            </a>
            <p className="text-sm text-[#cbd5e1] mt-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              Sans carte bancaire • 3 générations offertes
            </p>
        </div>
        </section>
        
    </main>
  );
}
