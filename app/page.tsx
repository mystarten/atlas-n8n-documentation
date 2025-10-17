'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { FileText, Settings, Download, Palette, Zap, Users } from 'lucide-react'
import Image from 'next/image'

// Composant FeatureCard avec animations avancées - BORDURES ULTRA-SUBTILES
function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
      className="group relative"
    >
      {/* Card avec bordure ultra-subtile */}
      <div className="relative p-8 bg-[#1e293b]/30 backdrop-blur-md rounded-2xl border border-[#334155]/20 hover:border-[#3b82f6]/40 transition-all duration-700 h-full">
        
        {/* Glow bleu au hover - très subtil */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/0 via-[#3b82f6]/0 to-[#2563eb]/0 group-hover:from-[#3b82f6]/5 group-hover:to-[#2563eb]/5 rounded-2xl transition-all duration-700 -z-10"></div>
        
        {/* Reflet bleu en haut - ultra-subtil */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#3b82f6]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        {/* Icon avec rotation au hover */}
        <motion.div 
          className="w-16 h-16 bg-[#3b82f6]/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#3b82f6]/10 transition-colors duration-500"
          whileHover={{ scale: 1.05, rotate: 3 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {icon}
        </motion.div>
        
        {/* Titre */}
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#3b82f6] transition-colors duration-500 font-poppins">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-[#cbd5e1] leading-relaxed font-inter font-light">
          {description}
        </p>
        
      </div>
    </motion.div>
  )
}

export default function Home() {
  return (
    <div className="w-full overflow-hidden">
      
      {/* HERO SECTION AVEC ANIMATIONS - STYLE BHINDI */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        
        {/* Orbs bleus animés en background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#3b82f6] rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#2563eb] rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Logo avec mask gradient - STYLE BHINDI */}
        <div className="absolute inset-0 flex items-start justify-center pt-0">
          <div className="relative w-[1000px] h-[1000px]">
            <img 
              src="/logo.png" 
              alt="" 
              className="w-full h-full object-contain select-none pointer-events-none"
              style={{
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0) 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0) 100%)'
              }}
            />
          </div>
        </div>
        
        {/* Lueurs bleues subtiles flottantes - NOUVEAU */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Lueur 1 - Haut gauche */}
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#3b82f6] rounded-full opacity-10 blur-[80px] animate-float"></div>
          
          {/* Lueur 2 - Bas droite */}
          <div className="absolute bottom-1/3 right-1/4 w-[250px] h-[250px] bg-[#2563eb] rounded-full opacity-15 blur-[70px] animate-float-delayed"></div>
          
          {/* Lueur 3 - Centre */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-[#3b82f6] rounded-full opacity-5 blur-[100px]"></div>
          
          {/* Particules bleues */}
          <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-[#3b82f6] rounded-full opacity-40 animate-pulse"></div>
          <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-[#60a5fa] rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-[#3b82f6] rounded-full opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
        
        {/* Overlay dégradé */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/80 via-transparent to-[#0f172a]"></div>
        
        {/* Contenu (texte, CTA) au-dessus */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          
          {/* Badge animé - SANS emoji fusée */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 bg-[#1e293b] rounded-full border border-[#334155] mb-8"
          >
            <span className="text-sm text-[#cbd5e1]">Propulsé par IA</span>
          </motion.div>
          
          {/* Titre animé */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-7xl font-bold text-white mb-8 leading-tight"
          >
            Documentation N8N{' '}
            <span className="text-[#3b82f6]">automatique</span>
            {' '}en 60s
          </motion.h1>
          
          {/* Sous-titre animé - NOUVELLE POLICE + STYLE */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-[#e2e8f0] mb-12 leading-relaxed font-light tracking-wide"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            ATLAS transforme vos workflows bruts en documentation professionnelle avec IA.
          </motion.p>
          
          {/* CTA animé */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center"
          >
            <a 
              href="/generate" 
              className="px-10 py-4 bg-[#3b82f6] text-white text-lg font-semibold rounded-xl hover:bg-[#2563eb] transition-all hover:scale-105 shadow-lg shadow-[#3b82f6]/50"
            >
              Essayer gratuitement →
            </a>
          </motion.div>
          
        </div>
        
        {/* Dégradé bleu en bas du Hero pour transition smooth */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#0f172a] z-10"></div>
        
      </section>

      {/* Section Slider Workflow - GRADIENT SMOOTH */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-24 px-6 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] relative"
      >
        <div className="max-w-6xl mx-auto">
          
          {/* Titre */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#3b82f6] font-semibold mb-3 tracking-wider uppercase text-sm font-inter">
              Visualisation en temps réel
            </p>
            <h2 className="text-4xl font-bold text-white mb-4 font-poppins">
              De workflow brut à structure claire
            </h2>
            <p className="text-lg text-[#cbd5e1] font-inter font-light">
              Voyez comment ATLAS transforme visuellement vos workflows N8N
            </p>
          </motion.div>
          
          {/* Container avec hauteur fixe - EMPÊCHE DÉBORDEMENT */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative max-w-5xl mx-auto h-[500px] rounded-2xl overflow-hidden border border-[#3b82f6]/20 shadow-2xl shadow-black/30 bg-[#0f172a]"
          >
            <ReactCompareSlider
              itemOne={
                <ReactCompareSliderImage 
                  src="/avant.png" 
                  alt="Workflow N8N brut" 
                  className="w-full h-full object-contain"
                />
              }
              itemTwo={
                <ReactCompareSliderImage 
                  src="/apres.png" 
                  alt="Workflow N8N structuré par ATLAS" 
                  className="w-full h-full object-contain"
                />
              }
              position={50}
            />
          </motion.div>
          
          {/* Instruction */}
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center text-[#64748b] mt-6 text-sm font-inter"
          >
            ← Glissez pour comparer le avant/après →
          </motion.p>
          
        </div>
      </motion.section>

      {/* SECTION FEATURES - GRADIENT SMOOTH */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-24 px-6 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] relative overflow-hidden"
      >
        
        {/* Background animé flou - très subtil */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#3b82f6] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#2563eb] rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          
          {/* Titre animé */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[#3b82f6] font-semibold mb-3 tracking-wider uppercase text-sm font-inter">
              Fonctionnalités
            </p>
            <h2 className="text-4xl font-bold text-white mb-4 font-poppins">
              Ce qu'ATLAS fait pour vous
            </h2>
            <p className="text-lg text-[#cbd5e1] font-inter font-light">
              Documentation intelligente en quelques secondes
            </p>
          </motion.div>

          {/* Grid avec animations stagger */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <FeatureCard
              icon={<FileText className="w-8 h-8 text-[#3b82f6]" />}
              title="Post-its explicatifs"
              description="Annotations automatiques sur chaque nœud pour expliquer son rôle."
              delay={0.1}
            />
            
            <FeatureCard
              icon={<Settings className="w-8 h-8 text-[#3b82f6]" />}
              title="Documentation paramètres"
              description="Notes détaillées pour comprendre chaque configuration."
              delay={0.2}
            />
            
            <FeatureCard
              icon={<Download className="w-8 h-8 text-[#3b82f6]" />}
              title="Export PDF & JSON"
              description="Exportez en N8N JSON ou PDF avec branding personnalisé."
              delay={0.3}
            />
            
            <FeatureCard
              icon={<Palette className="w-8 h-8 text-[#3b82f6]" />}
              title="Branding personnalisé"
              description="Logo et couleurs d'entreprise sur vos exports (plan Entreprise)."
              delay={0.4}
            />
            
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-[#3b82f6]" />}
              title="Bonnes pratiques IA"
              description="Recommandations d'optimisation et warnings automatiques."
              delay={0.5}
            />
            
            <FeatureCard
              icon={<Users className="w-8 h-8 text-[#3b82f6]" />}
              title="Onboarding simplifié"
              description="Équipe comprend le workflow en minutes au lieu d'heures."
              delay={0.6}
            />
            
                </div>
              </div>
      </motion.section>

      {/* Section Annotations automatiques - HOMEPAGE */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        viewport={{ once: true }}
        className="py-24 px-6 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] relative"
      >
        <div className="max-w-7xl mx-auto">
          
          {/* Titre */}
          <div className="text-center mb-16">
            <p className="text-[#3b82f6] font-semibold mb-3 tracking-wider uppercase text-sm font-inter">
              Documentation professionnelle
            </p>
            <h2 className="text-4xl font-bold text-white mb-4 font-poppins">
              Annotations automatiques sur vos workflows
            </h2>
            <p className="text-lg text-[#cbd5e1] font-inter font-light">
              ATLAS ajoute des notes explicatives sur chaque nœud
            </p>
          </div>

          {/* Grid Avant/Après - TAILLE FIXE */}
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16">
            
            {/* AVANT - Sans notes */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/* Badge AVANT */}
              <div className="absolute -top-4 left-6 px-4 py-1.5 bg-[#64748b] text-white text-xs font-semibold rounded-full z-10 shadow-lg font-inter">
                AVANT
                </div>

              {/* Container image fixe */}
              <div className="relative h-[450px] rounded-2xl overflow-hidden border border-[#334155]/30 bg-[#1e293b]/30 hover:border-[#475569]/50 transition-all duration-500 backdrop-blur-sm">
                <img 
                  src="/avantnotes.png" 
                  alt="Workflow sans documentation" 
                  className="w-full h-full object-contain p-4"
                  loading="lazy"
                />
                      </div>
              
              <p className="text-center text-[#94a3b8] mt-4 text-sm font-inter font-light">
                Workflow sans documentation
              </p>
            </motion.div>
            
            {/* APRÈS - Avec notes */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/* Glow bleu derrière */}
              <div className="absolute -inset-6 bg-gradient-to-r from-[#3b82f6]/10 to-[#2563eb]/10 blur-2xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              {/* Badge APRÈS */}
              <div className="absolute -top-4 left-6 px-4 py-1.5 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white text-xs font-semibold rounded-full z-10 shadow-lg shadow-[#3b82f6]/50 font-inter">
                APRÈS
                    </div>
                    
              {/* Container image fixe */}
              <div className="relative h-[450px] rounded-2xl overflow-hidden border border-[#3b82f6]/40 bg-[#1e293b]/30 hover:border-[#3b82f6]/70 transition-all duration-500 shadow-lg shadow-[#3b82f6]/10 backdrop-blur-sm">
                <img 
                  src="/apresnotes.png" 
                  alt="Workflow avec documentation ATLAS" 
                  className="w-full h-full object-contain p-4"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback si l'image n'existe pas
                    console.error('apresnotes.png non trouvée');
                    e.currentTarget.src = '/apres.png';
                  }}
                />
                {/* Overlay bleu très subtil */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/5 to-transparent pointer-events-none"></div>
              </div>
              
              <p className="text-center text-[#e2e8f0] mt-4 text-sm font-inter font-light">
                Documentation complète par ATLAS
              </p>
            </motion.div>
            
                  </div>

          {/* Stats - EN DESSOUS DES IMAGES */}
          <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-5xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#2563eb] bg-clip-text text-transparent mb-2 font-poppins">
                40s
              </p>
              <p className="text-[#cbd5e1] font-inter font-light">
                Génération moyenne
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-5xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#2563eb] bg-clip-text text-transparent mb-2 font-poppins">
                100%
              </p>
              <p className="text-[#cbd5e1] font-inter font-light">
                Automatique
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-4xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#2563eb] bg-clip-text text-transparent mb-2 font-mono">
                JSON & PDF
              </p>
              <p className="text-[#cbd5e1] font-inter font-light">
                Formats d'export
              </p>
            </motion.div>
            
                      </div>
                    </div>
      </motion.section>

      {/* SECTION EXPERTS - GRADIENT SMOOTH */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-24 px-6 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] relative"
      >
        <div className="max-w-7xl mx-auto">
          
          {/* Titre - Espacement réduit */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#3b82f6] font-semibold mb-3 tracking-wider uppercase text-sm">
              Utilisé par les meilleurs
            </p>
            <h2 className="text-4xl font-bold text-white mb-4">
              Recommandé par les experts N8N
            </h2>
            <p className="text-lg text-[#cbd5e1]">
              Les leaders de l'automatisation N8N nous font confiance
            </p>
          </motion.div>

          {/* Avatars des experts - Espacement réduit */}
          <div className="flex justify-center items-center gap-12">
            
            {/* Expert 1 - Mats */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="group text-center"
            >
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-[#3b82f6] rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <img 
                  src="/img/logo mats.jpg" 
                  alt="Mats Automation" 
                  className="relative w-28 h-28 rounded-full border-4 border-[#3b82f6] mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300"
                />
                          </div>
              <h3 className="text-xl font-bold text-white mb-1">
                Mats Automation
              </h3>
              <p className="text-[#cbd5e1] mb-1">
                Expert N8N
              </p>
              <p className="text-[#3b82f6] font-semibold">
                50K+ abonnés
              </p>
            </motion.div>
            
            {/* Expert 2 - Zahir */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="group text-center"
            >
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-[#3b82f6] rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <img 
                  src="/img/Zahir Aftab.jpg" 
                  alt="Zahir Aftab" 
                  className="relative w-28 h-28 rounded-full border-4 border-[#3b82f6] mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300"
                />
                          </div>
              <h3 className="text-xl font-bold text-white mb-1">
                Zahir Aftab
              </h3>
              <p className="text-[#cbd5e1] mb-1">
                N8N Automation Expert
              </p>
              <p className="text-[#3b82f6] font-semibold">
                300+ abonnés
              </p>
            </motion.div>
            
                    </div>
                    </div>
      </motion.section>

      {/* SECTION EXEMPLES DE RÉALISATIONS */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-24 px-6 bg-gradient-to-b from-[#0f172a] to-[#1e293b]"
      >
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[#3b82f6] font-semibold mb-3 tracking-wider uppercase text-sm font-inter">
              Exemples Concrets
            </p>
            <h2 className="text-5xl font-bold text-white mb-6 font-poppins">
              Workflows Documentés par ATLAS
            </h2>
            <p className="text-xl text-[#cbd5e1] max-w-3xl mx-auto font-inter font-light">
              Découvrez comment ATLAS transforme des workflows bruts en documentation professionnelle
            </p>
          </motion.div>

          {/* Exemple 1 : Comptable */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-white mb-3 font-poppins">
                Automatisation Comptable
              </h3>
              <p className="text-[#cbd5e1] font-inter">
                Workflow automatisant la saisie de tickets de caisse dans un CRM comptable
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              {/* Avant */}
              <div className="group">
                <div className="mb-4">
                  <p className="text-white font-semibold font-inter mb-1">Avant ATLAS</p>
                  <p className="text-[#64748b] text-sm font-inter">Workflow brut sans documentation</p>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-[#334155]/30 group-hover:border-[#3b82f6]/50 transition-colors">
                  <img 
                    src="/img/comptableavant.png" 
                    alt="Workflow comptable avant ATLAS"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Après */}
              <div className="group">
                <div className="mb-4">
                  <p className="text-white font-semibold font-inter mb-1">Après ATLAS</p>
                  <p className="text-[#64748b] text-sm font-inter">Documentation générée automatiquement</p>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-[#334155]/30 group-hover:border-[#3b82f6]/50 transition-colors">
                  <img 
                    src="/img/comptableapres.png" 
                    alt="Workflow comptable après ATLAS"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Notes détaillées - PLUS PETITE */}
            <div className="bg-[#1e293b]/30 backdrop-blur-sm rounded-xl border border-[#334155]/20 p-4">
              <p className="text-white font-semibold mb-2 text-sm font-inter">Annotations Détaillées</p>
              <p className="text-[#cbd5e1] text-xs mb-3 font-inter">
                ATLAS ajoute automatiquement des notes explicatives sur chaque nœud du workflow
              </p>
              <div className="rounded-lg overflow-hidden border border-[#334155]/20">
                <img 
                  src="/img/comptablenotes.png" 
                  alt="Annotations détaillées du workflow comptable"
                  className="w-full h-auto opacity-90"
                />
              </div>
            </div>
          </motion.div>

          {/* Exemple 2 : Veille Concurrentielle */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-white mb-3 font-poppins">
                Veille Concurrentielle Automatisée
              </h3>
              <p className="text-[#cbd5e1] font-inter">
                Workflow analysant les produits concurrents et générant des rapports stratégiques
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Avant */}
              <div className="group">
                <div className="mb-4">
                  <p className="text-white font-semibold font-inter mb-1">Avant ATLAS</p>
                  <p className="text-[#64748b] text-sm font-inter">Workflow complexe et opaque</p>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-[#334155]/30 group-hover:border-[#3b82f6]/50 transition-colors">
                  <img 
                    src="/img/concurrenceavant.png" 
                    alt="Workflow veille concurrentielle avant ATLAS"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Après */}
              <div className="group">
                <div className="mb-4">
                  <p className="text-white font-semibold font-inter mb-1">Après ATLAS</p>
                  <p className="text-[#64748b] text-sm font-inter">Workflow documenté et compréhensible</p>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-[#334155]/30 group-hover:border-[#3b82f6]/50 transition-colors">
                  <img 
                    src="/img/concurrenceapres.png" 
                    alt="Workflow veille concurrentielle après ATLAS"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Exemple 3 : Génération Vidéo */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-white mb-3 font-poppins">
                Génération Vidéo Automatique
              </h3>
              <p className="text-[#cbd5e1] font-inter">
                Workflow automatisant la création de vidéos avec IA générative (Sora)
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Avant */}
              <div className="group">
                <div className="mb-4">
                  <p className="text-white font-semibold font-inter mb-1">Avant ATLAS</p>
                  <p className="text-[#64748b] text-sm font-inter">Process non documenté</p>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-[#334155]/30 group-hover:border-[#3b82f6]/50 transition-colors">
                  <img 
                    src="/img/soraavant.png" 
                    alt="Workflow Sora avant ATLAS"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Après */}
              <div className="group">
                <div className="mb-4">
                  <p className="text-white font-semibold font-inter mb-1">Après ATLAS</p>
                  <p className="text-[#64748b] text-sm font-inter">Documentation claire et précise</p>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-[#334155]/30 group-hover:border-[#3b82f6]/50 transition-colors">
                  <img 
                    src="/img/soraapres.png" 
                    alt="Workflow Sora après ATLAS"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.section>

      {/* SECTION TESTIMONIALS - GRADIENT SMOOTH */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-24 px-6 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          
          {/* Header avec stat live */}
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-white mb-6"
            >
              Ce que disent nos utilisateurs
            </motion.h2>
            
            {/* Stat animée - NOUVEAU */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-[#1e293b] border border-[#3b82f6]/30 rounded-full"
            >
              <div className="flex items-center gap-1">
                <span className="text-2xl">⭐</span>
                <span className="text-2xl">⭐</span>
                <span className="text-2xl">⭐</span>
                <span className="text-2xl">⭐</span>
                <span className="text-2xl">⭐</span>
              </div>
              <div className="w-px h-6 bg-[#334155]"></div>
              <p className="text-[#cbd5e1] text-sm">
                <span className="text-[#3b82f6] font-bold text-lg font-mono">2,478</span> templates générés cette semaine
              </p>
            </motion.div>
            </div>
          
          {/* Container avec scroll automatique */}
                <div className="relative">
            <div className="flex gap-6 animate-scroll-horizontal">
              
              {/* Testimonial 1 - Zahir */}
              <div className="min-w-[450px] p-8 bg-[#1e293b]/80 backdrop-blur-sm rounded-2xl border border-[#334155]/30 hover:border-[#3b82f6]/30 transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
                    alt="Zahir Aftab" 
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0 ring-2 ring-[#3b82f6]/50"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-white text-lg">Zahir Aftab</p>
                    <p className="text-sm text-[#cbd5e1] font-light">N8N Automation Expert</p>
                </div>
                </div>

                {/* Étoiles - NOUVEAU */}
                <div className="flex gap-1 mb-4">
                  <span className="text-[#fbbf24] text-lg">⭐</span>
                  <span className="text-[#fbbf24] text-lg">⭐</span>
                  <span className="text-[#fbbf24] text-lg">⭐</span>
                  <span className="text-[#fbbf24] text-lg">⭐</span>
                  <span className="text-[#fbbf24] text-lg">⭐</span>
              </div>

                <p className="text-[#cbd5e1] leading-relaxed font-light">
                  "Mes clients comprennent enfin mes workflows. Plus besoin de passer des heures à expliquer."
            </p>
          </div>
          
              {/* Testimonial 2 - Alexandre */}
              <div className="min-w-[450px] p-8 bg-[#1e293b]/80 backdrop-blur-sm rounded-2xl border border-[#334155]/30 hover:border-[#3b82f6]/30 transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
                    alt="Alexandre D." 
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0 ring-2 ring-[#3b82f6]/50"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-white text-lg">Alexandre D.</p>
                    <p className="text-sm text-[#cbd5e1] font-light">N8N Workflow Specialist</p>
                  </div>
            </div>

                {/* Étoiles */}
                <div className="flex gap-1 mb-4">
                  <span className="text-[#fbbf24] text-lg">⭐</span>
                  <span className="text-[#fbbf24] text-lg">⭐</span>
                  <span className="text-[#fbbf24] text-lg">⭐</span>
                  <span className="text-[#fbbf24] text-lg">⭐</span>
                  <span className="text-[#fbbf24] text-lg">⭐</span>
              </div>

                <p className="text-[#cbd5e1] leading-relaxed font-light">
                  "Onboarding client divisé par 3. Atlas génère exactement la doc qu'il faut."
                </p>
                  </div>

              {/* Testimonial 3 - Mats */}
              <div className="min-w-[450px] p-8 bg-[#1e293b]/80 backdrop-blur-sm rounded-2xl border border-[#334155]/30 hover:border-[#3b82f6]/30 transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
                    alt="Mats Automation" 
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0 ring-2 ring-[#3b82f6]/50"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-white text-lg">Mats Automation</p>
                    <p className="text-sm text-[#cbd5e1] font-light">Expert N8N | 50K+ abonnés</p>
                </div>
                    </div>

                {/* Étoiles */}
                <div className="flex gap-1 mb-4">
                  <span className="text-[#fbbf24] text-lg">⭐</span>
                  <span className="text-[#fbbf24] text-lg">⭐</span>
                  <span className="text-[#fbbf24] text-lg">⭐</span>
                  <span className="text-[#fbbf24] text-lg">⭐</span>
                  <span className="text-[#fbbf24] text-lg">⭐</span>
                    </div>

                <p className="text-[#cbd5e1] leading-relaxed font-light">
                  "La documentation automatique me fait gagner des heures chaque semaine."
            </p>
                  </div>

              {/* Testimonial 4 - Sophie */}
              <div className="min-w-[450px] p-8 bg-[#1e293b]/80 backdrop-blur-sm rounded-2xl border border-[#334155]/30 hover:border-[#3b82f6]/30 transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
                    alt="Sophie Martin" 
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0 ring-2 ring-[#3b82f6]/50"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-white text-lg">Sophie Martin</p>
                    <p className="text-sm text-[#cbd5e1] font-light">Consultante Automation</p>
                </div>
            </div>

                {/* Étoiles */}
                <div className="flex gap-1 mb-4">
                  <span className="text-[#fbbf24] text-lg">⭐</span>
                  <span className="text-[#fbbf24] text-lg">⭐</span>
                  <span className="text-[#fbbf24] text-lg">⭐</span>
                  <span className="text-[#fbbf24] text-lg">⭐</span>
                  <span className="text-[#fbbf24] text-lg">⭐</span>
              </div>
                
                <p className="text-[#cbd5e1] leading-relaxed font-light">
                  "Idéal pour partager mes templates avec ma communauté. Documentation claire et pro."
            </p>
                  </div>

              {/* Testimonial 5 - Lucas */}
              <div className="min-w-[450px] p-8 bg-[#1e293b]/80 backdrop-blur-sm rounded-2xl border border-[#334155]/30 hover:border-[#3b82f6]/30 transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
                    alt="Lucas Durand" 
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0 ring-2 ring-[#3b82f6]/50"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-white text-lg">Lucas Durand</p>
                    <p className="text-sm text-[#cbd5e1] font-light">Tech Lead</p>
                </div>
              </div>
                
                {/* Étoiles */}
                <div className="flex gap-1 mb-4">
                  <span className="text-[#fbbf24] text-lg">⭐</span>
                  <span className="text-[#fbbf24] text-lg">⭐</span>
                  <span className="text-[#fbbf24] text-lg">⭐</span>
                  <span className="text-[#fbbf24] text-lg">⭐</span>
                  <span className="text-[#fbbf24] text-lg">⭐</span>
            </div>

                <p className="text-[#cbd5e1] leading-relaxed font-light">
                  "Maintenance simplifiée. L'équipe comprend les workflows même 6 mois après leur création."
            </p>
          </div>

              {/* Testimonial 6 - Emma */}
              <div className="min-w-[450px] p-8 bg-[#1e293b]/80 backdrop-blur-sm rounded-2xl border border-[#334155]/30 hover:border-[#3b82f6]/30 transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
                    alt="Emma Rousseau" 
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0 ring-2 ring-[#3b82f6]/50"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-white text-lg">Emma Rousseau</p>
                    <p className="text-sm text-[#cbd5e1] font-light">Freelance N8N</p>
            </div>
          </div>

                {/* Étoiles */}
                <div className="flex gap-1 mb-4">
                  <span className="text-[#fbbf24] text-lg">⭐</span>
                  <span className="text-[#fbbf24] text-lg">⭐</span>
                  <span className="text-[#fbbf24] text-lg">⭐</span>
                  <span className="text-[#fbbf24] text-lg">⭐</span>
                  <span className="text-[#fbbf24] text-lg">⭐</span>
            </div>

                <p className="text-[#cbd5e1] leading-relaxed font-light">
                  "Gain de temps colossal pour mes livrables clients. La qualité de la doc est impressionnante."
                </p>
              </div>

              {/* Duplicate pour loop infini - Répète les 6 testimonials */}
              <div className="min-w-[450px] p-8 bg-[#1e293b]/80 backdrop-blur-sm rounded-2xl border border-[#334155]/30">
                <div className="flex items-start gap-4 mb-6">
                  <img 
                    src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
                    alt="Zahir Aftab" 
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0 ring-2 ring-[#3b82f6]/50"
                  />
                  <div>
                    <p className="font-semibold text-white text-lg">Zahir Aftab</p>
                    <p className="text-sm text-[#cbd5e1]">N8N Automation Expert</p>
              </div>
            </div>
                <p className="text-[#cbd5e1] leading-relaxed">
                  "Mes clients comprennent enfin mes workflows. Plus besoin de passer des heures à expliquer."
                </p>
          </div>

              <div className="min-w-[450px] p-8 bg-[#1e293b]/80 backdrop-blur-sm rounded-2xl border border-[#334155]/30">
                <div className="flex items-start gap-4 mb-6">
                  <img 
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
                    alt="Alexandre D." 
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0 ring-2 ring-[#3b82f6]/50"
                  />
                  <div>
                    <p className="font-semibold text-white text-lg">Alexandre D.</p>
                    <p className="text-sm text-[#cbd5e1]">N8N Workflow Specialist</p>
                  </div>
                </div>
                <p className="text-[#cbd5e1] leading-relaxed">
                  "Onboarding client divisé par 3. Atlas génère exactement la doc qu'il faut."
                </p>
              </div>

              <div className="min-w-[450px] p-8 bg-[#1e293b]/80 backdrop-blur-sm rounded-2xl border border-[#334155]/30">
                <div className="flex items-start gap-4 mb-6">
                  <img 
                    src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
                    alt="Mats Automation" 
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0 ring-2 ring-[#3b82f6]/50"
                  />
                  <div>
                    <p className="font-semibold text-white text-lg">Mats Automation</p>
                    <p className="text-sm text-[#cbd5e1]">Expert N8N | 50K+ abonnés</p>
                  </div>
                </div>
                <p className="text-[#cbd5e1] leading-relaxed">
                  "La documentation automatique me fait gagner des heures chaque semaine."
                </p>
              </div>
          
              <div className="min-w-[450px] p-8 bg-[#1e293b]/80 backdrop-blur-sm rounded-2xl border border-[#334155]/30">
                <div className="flex items-start gap-4 mb-6">
                  <img 
                    src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
                    alt="Sophie Martin" 
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0 ring-2 ring-[#3b82f6]/50"
                  />
                  <div>
                    <p className="font-semibold text-white text-lg">Sophie Martin</p>
                    <p className="text-sm text-[#cbd5e1]">Consultante Automation</p>
            </div>
          </div>
                <p className="text-[#cbd5e1] leading-relaxed">
                  "Idéal pour partager mes templates avec ma communauté. Documentation claire et pro."
            </p>
          </div>
          
              <div className="min-w-[450px] p-8 bg-[#1e293b]/80 backdrop-blur-sm rounded-2xl border border-[#334155]/30">
                <div className="flex items-start gap-4 mb-6">
                  <img 
                    src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
                    alt="Lucas Durand" 
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0 ring-2 ring-[#3b82f6]/50"
                  />
                  <div>
                    <p className="font-semibold text-white text-lg">Lucas Durand</p>
                    <p className="text-sm text-[#cbd5e1]">Tech Lead</p>
              </div>
            </div>
                <p className="text-[#cbd5e1] leading-relaxed">
                  "Maintenance simplifiée. L'équipe comprend les workflows même 6 mois après leur création."
            </p>
          </div>

              <div className="min-w-[450px] p-8 bg-[#1e293b]/80 backdrop-blur-sm rounded-2xl border border-[#334155]/30">
                <div className="flex items-start gap-4 mb-6">
                  <img 
                    src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
                    alt="Emma Rousseau" 
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0 ring-2 ring-[#3b82f6]/50"
                  />
                  <div>
                    <p className="font-semibold text-white text-lg">Emma Rousseau</p>
                    <p className="text-sm text-[#cbd5e1]">Freelance N8N</p>
                    </div>
                    </div>
                <p className="text-[#cbd5e1] leading-relaxed">
                  "Gain de temps colossal pour mes livrables clients. La qualité de la doc est impressionnante."
                    </p>
                  </div>
              
              </div>
            </div>
          </div>
      </motion.section>

      {/* CTA FINAL - GRADIENT SMOOTH */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-24 px-6 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] relative"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Prêt à documenter comme un pro ?
              </h2>
          <p className="text-xl text-[#cbd5e1] mb-12">
            Rejoignez les experts N8N qui font confiance à ATLAS
          </p>
          <a 
            href="/generate"
            className="inline-block px-12 py-5 bg-[#3b82f6] text-white text-lg font-semibold rounded-lg hover:bg-[#2563eb] transition-colors hover:scale-105"
          >
            Commencer gratuitement →
          </a>
          <p className="text-sm text-[#cbd5e1] mt-6">
            Sans carte bancaire • 3 générations offertes
                </p>
              </div>
      </motion.section>
    </div>
  )
}
