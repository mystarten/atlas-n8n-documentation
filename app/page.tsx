'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Zap, FileText, Download, Sparkles, CheckCircle, Star, BookOpen, Settings, Rocket, Quote, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactCompareImage = dynamic(() => import('react-compare-image'), { ssr: false });

const comparisons = [
  {
    title: 'Workflow Comptabilité',
    before: '/images/comptableavant.png',
    after: '/images/comptableapres.png',
  },
  {
    title: 'Workflow Concurrence',
    before: '/images/concurenceavant.png',
    after: '/images/concurenceapres.png',
  },
  {
    title: 'Workflow Soraa (Vidéo IA)',
    before: '/images/soraavant.png',
    after: '/images/soraapres.png',
  },
];

const vipTestimonials = [
  {
    name: 'Zahir Aftab',
    role: 'Entrepreneur & Expert N8N',
    followers: '300K abonnés',
    image: '/images/zahir.jpg',
    text: "ATLAS a révolutionné ma façon de documenter mes workflows. Ce qui me prenait des heures se fait maintenant en quelques secondes. Indispensable !",
    verified: true,
    gradient: 'from-blue-500 via-cyan-500 to-purple-500',
  },
  {
    name: 'Mats Automation',
    role: 'CEO @ Mats Automation',
    followers: '50K abonnés',
    image: '/images/logo.mats.jpg',
    text: "Un outil incroyable pour nos équipes. La qualité de la documentation générée est impressionnante. Nos clients adorent !",
    verified: true,
    gradient: 'from-purple-500 via-pink-500 to-orange-500',
  },
];

const customerReviews = [
  {
    name: 'Sophie Martin',
    role: 'Product Manager',
    company: 'TechCorp',
    image: 'https://i.pravatar.cc/150?img=5',
    rating: 5,
    text: "Interface intuitive et résultats impressionnants. Gain de temps considérable pour notre équipe.",
  },
  {
    name: 'Thomas Dubois',
    role: 'CTO',
    company: 'StartupLab',
    image: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    text: "La meilleure solution pour documenter nos workflows. Le branding personnalisé est un vrai plus.",
  },
  {
    name: 'Emma Rousseau',
    role: 'Automation Lead',
    company: 'Digital Pro',
    image: 'https://i.pravatar.cc/150?img=9',
    rating: 5,
    text: "Simple, efficace et professionnel. Exactement ce dont on avait besoin pour nos clients.",
  },
  {
    name: 'Alexandre Chen',
    role: 'Founder',
    company: 'AutoFlow',
    image: 'https://i.pravatar.cc/150?img=33',
    rating: 5,
    text: "ROI immédiat. Nos processus d'onboarding sont 10x plus rapides maintenant.",
  },
  {
    name: 'Julie Bernard',
    role: 'Operations Manager',
    company: 'FlowTech',
    image: 'https://i.pravatar.cc/150?img=20',
    rating: 5,
    text: "Documentation de qualité professionnelle en quelques clics. Incroyable !",
  },
  {
    name: 'Marc Laurent',
    role: 'Tech Lead',
    company: 'InnovateCo',
    image: 'https://i.pravatar.cc/150?img=15',
    rating: 5,
    text: "L'outil qu'il nous manquait. Nos workflows sont enfin compréhensibles par tous.",
  },
];

export default function HomePage() {
  const [activeComparison, setActiveComparison] = useState(0);
  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % customerReviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1A1F3A] to-[#0A0E27] font-inter relative overflow-hidden -mt-px">
      {/* Logo background géant ultra-transparent/flou */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none select-none">
        <Image
          src="/images/logo.png"
          alt="ATLAS Logo background"
          width={800}
          height={800}
          className="opacity-30 blur-lg"
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>

      {/* Effets lumineux globaux */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-blue-500/10 via-cyan-500/5 to-transparent blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-blue-500/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-2 md:px-4 z-10">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="mb-8 flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500" />
              <Image 
                src="/images/logo.png" 
                alt="ATLAS Logo" 
                width={90} 
                height={90} 
                className="relative drop-shadow-2xl animate-float" 
                priority
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 mb-7 px-8 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-full backdrop-blur-xl shadow-lg shadow-blue-500/10">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 text-base font-semibold">Propulsé par IA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-7 leading-tight">
            <span>Documentation N8N</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent block">
              automatique en 60s
            </span>
          </h1>

          <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            ATLAS transforme vos workflows bruts en documentation 
            <br />
          <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            professionnelle avec IA.
          </p>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/generate" 
              className="group inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 transition px-8 py-3 rounded-xl font-semibold text-white text-base shadow-xl shadow-blue-800/20 hover:scale-105"
            >
              Essayer gratuitement
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/pricing" 
              className="inline-flex items-center justify-center gap-2 bg-white/5 backdrop-blur-xl text-white font-semibold px-8 py-3 rounded-xl border border-white/10 hover:bg-white/10 transition"
            >
              Voir les tarifs
            </Link>
          </div>
        </div>
      </section>


      {/* Section Visualisation Avant/Après */}
      <section className="relative py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-blue-400 font-semibold mb-2 uppercase tracking-wider text-xs">Visualisation en temps réel</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">De template brut à workflow documenté</h2>
            <p className="text-gray-400 text-base">Voyez la transformation instantanée</p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-3xl blur-xl" />
            <div className="relative bg-[#0f172a]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ReactCompareImage
                  leftImage={comparisons[activeComparison].before}
                  rightImage={comparisons[activeComparison].after}
                  sliderLineColor="#3b82f6"
                  sliderLineWidth={3}
                  handleSize={50}
                  hover={true}
                />
              </div>

              <div className="flex gap-3 mt-5 justify-center flex-wrap">
                {comparisons.map((comp, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveComparison(index)}
                    className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${
                      activeComparison === index
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {comp.title}
                  </button>
                ))}
              </div>

              <p className="text-center text-gray-500 text-xs mt-4">← Glissez pour comparer le avant/après →</p>
            </div>
          </div>
        </div>
      </section>

     {/* Section 3 Niveaux */}
<section className="relative py-16 px-4">
  <div className="max-w-5xl mx-auto">
    <div className="text-center mb-12">
      <p className="text-blue-400 font-semibold mb-2 uppercase tracking-wider text-xs">Comment ça marche</p>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
        ATLAS documente votre template en 3 niveaux
      </h2>
      <p className="text-gray-400 text-base">
        Une documentation complète pour comprendre et lancer votre workflow en quelques minutes
      </p>
    </div>

    <div className="space-y-6">
      {/* Niveau 1 */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500" />
        <div className="relative bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-blue-500/30 transition-all duration-300">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <span className="text-blue-400 text-xs font-bold mb-1 block">NIVEAU 1</span>
              <h3 className="text-2xl font-bold text-white mb-2">Post-its explicatifs</h3>
              <p className="text-gray-300 text-base leading-relaxed">
                Des post-its colorés guident le démarrage rapide de chaque nœud.
              </p>
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden border-2 border-blue-500/20 mt-4">
            <Image src="/images/concurenceapres.png" alt="Exemple post-its" width={1000} height={600} className="w-full h-auto" />
          </div>
          <p className="text-xs text-gray-500 mt-2 italic text-center">↑ Chaque nœud a son post-it explicatif</p>
        </div>
      </div>

      {/* Niveau 2 - VERSION MODERNE */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500" />
        <div className="relative bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-purple-500/30 transition-all duration-300">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <span className="text-blue-400 text-xs font-bold mb-1 block">NIVEAU 2</span>
              <h3 className="text-2xl font-bold text-white mb-2">Notes dans les nœuds</h3>
              <p className="text-gray-300 text-base leading-relaxed">
                L&apos;IA ajoute des notes détaillées directement dans les paramètres de chaque nœud.
              </p>
            </div>
          </div>
          
          {/* Comparaison moderne côte à côte */}
          <div className="relative">
            {/* Labels Avant/Après au-dessus */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full text-xs font-medium text-gray-400 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                  Avant
                </span>
              </div>
              <div className="text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 rounded-full text-xs font-medium text-blue-400 border border-purple-500/30">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                  Après (IA)
                </span>
              </div>
            </div>

            {/* Images côte à côte avec animations */}
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {/* Image AVANT */}
              <div className="relative group/img">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#1a1f3a] hover:border-white/20 transition-all duration-300 transform hover:scale-[1.02]">
                  <Image 
                    src="/images/avantnotes.png" 
                    alt="Paramètres sans notes" 
                    width={350} 
                    height={450} 
                    className="w-full h-auto object-contain" 
                  />
                </div>
              </div>

              {/* Image APRÈS */}
              <div className="relative group/img">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
                <div className="relative rounded-xl overflow-hidden border border-purple-500/20 bg-[#1a1f3a] hover:border-purple-500/40 transition-all duration-300 transform hover:scale-[1.02]">
                  <Image 
                    src="/images/aprèsnotes.png" 
                    alt="Paramètres avec notes IA" 
                    width={350} 
                    height={450} 
                    className="w-full h-auto object-contain" 
                  />
                  {/* Badge "IA" flottant */}
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-blue-900 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                    ✨ IA
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4 italic text-center">
              L&apos;IA enrichit automatiquement les paramètres avec des explications détaillées
            </p>
          </div>
        </div>
      </div>

      {/* Niveau 3 */}
<div className="relative group">
  <div className="absolute inset-0 bg-blue-500/5 rounded-3xl blur-xl group-hover:bg-blue-500/10 transition-all duration-500" />
  <div className="relative bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
    <div className="flex items-start gap-4 mb-4">
      <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30 group-hover:bg-blue-500/30 transition-all duration-300">
        <Rocket className="w-6 h-6 text-blue-400 group-hover:-translate-y-1 transition-transform duration-300" />
      </div>
      <div className="flex-1">
        <span className="text-blue-400 text-xs font-bold mb-1 block">NIVEAU 3</span>
        <h3 className="text-2xl font-bold text-white mb-2">Guide de démarrage rapide</h3>
        <p className="text-gray-300 text-base leading-relaxed mb-4">
          Un guide complet pour lancer l&apos;automatisation en 5 minutes :
        </p>
      </div>
    </div>
    <div className="grid md:grid-cols-2 gap-3 mt-4">
      {[
        { icon: CheckCircle, title: 'APIs à connecter', desc: 'Liste de toutes les connexions' },
        { icon: CheckCircle, title: 'Variables à configurer', desc: 'Tous les paramètres à renseigner' },
        { icon: CheckCircle, title: 'Ordre de configuration', desc: 'Étape par étape' },
        { icon: CheckCircle, title: 'Tests recommandés', desc: 'Vérifier le fonctionnement' },
      ].map((item, index) => (
        <div 
          key={index} 
          className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-blue-500/5 hover:border-blue-500/20 transition-all duration-300 transform hover:translate-x-1"
          style={{ transitionDelay: `${index * 50}ms` }}
        >
          <p className="text-white font-semibold mb-1 flex items-center gap-2 text-sm">
            <item.icon className="w-4 h-4 text-blue-400" />
            {item.title}
          </p>
          <p className="text-gray-400 text-xs">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</div>
</div>
</div>
</section>


      {/* Section Fonctionnalités */}
      <section className="relative py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-400 font-semibold mb-2 uppercase tracking-wider text-xs">Fonctionnalités</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Export et personnalisation</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {[
              { icon: FileText, title: 'Export N8N JSON', desc: 'Récupérez votre template avec toutes les notes et post-its intégrés.', gradient: 'from-blue-500 to-cyan-500' },
              { icon: Download, title: 'Export PDF Pro', desc: 'Documentation PDF avec branding personnalisé pour vos clients.', gradient: 'from-purple-500 to-pink-500' },
              { icon: Sparkles, title: 'Analyse IA intelligente', desc: 'Détection automatique des bonnes pratiques et recommandations.', gradient: 'from-yellow-500 to-orange-500', badge: '⚡ IA' },
            ].map((feature, index) => (
              <div key={index} className="relative group h-full flex flex-col">
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient}/10 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500`} />
                <div className="relative bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-white/15 transition-all duration-300 flex flex-col h-full">
                  {feature.badge && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      {feature.badge}
                    </div>
                  )}
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed flex-grow">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Témoignages VIP */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-5 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full backdrop-blur-xl">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-xs font-semibold uppercase tracking-wider">Témoignages</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">Ils recommandent </span>
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                ATLAS
              </span>
            </h2>
            <p className="text-base text-gray-400 max-w-2xl mx-auto">
              Approuvé par les leaders de l'automatisation N8N
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {vipTestimonials.map((testimonial, index) => (
              <div key={index} className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient}/8 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500`} />
                <div className="relative bg-gradient-to-br from-[#0f172a]/90 to-[#1e293b]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-white/15 transition-all duration-300 shadow-xl">
                  <Quote className="w-12 h-12 text-white/5 mb-4" />
                  <p className="text-gray-200 text-base leading-relaxed mb-6 font-light">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} rounded-xl blur-md opacity-30`} />
                      <Image 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        width={60} 
                        height={60} 
                        className="relative rounded-xl border border-white/20 shadow-lg object-cover" 
                      />
                      {testimonial.verified && (
                        <div className={`absolute -bottom-1 -right-1 bg-gradient-to-br ${testimonial.gradient} rounded-full p-1 shadow-md`}>
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-0.5">{testimonial.name}</h4>
                      <p className={`bg-gradient-to-r ${testimonial.gradient} bg-clip-text text-transparent text-sm font-semibold mb-0.5`}>
                        {testimonial.role}
                      </p>
                      <p className="text-gray-500 text-xs">{testimonial.followers}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel automatique */}
          <div className="relative">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Ce que disent nos utilisateurs</h3>
              <p className="text-gray-400 text-sm">Plus de 1000 workflows documentés</p>
            </div>

            <div className="relative overflow-hidden rounded-3xl">
              <div 
                className="flex transition-transform duration-700 ease-in-out" 
                style={{ transform: `translateX(-${currentReview * 100}%)` }}
              >
                {customerReviews.map((review, index) => (
                  <div key={index} className="min-w-full px-4">
                    <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#0f172a]/90 to-[#1e293b]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-20" />
                          <Image 
                            src={review.image} 
                            alt={review.name} 
                            width={56} 
                            height={56} 
                            className="relative rounded-full border-2 border-blue-500 shadow-lg" 
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white">{review.name}</h4>
                          <p className="text-blue-400 text-sm">{review.role} @ {review.company}</p>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 text-base leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-2 mt-6">
                {customerReviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentReview(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentReview === index ? 'bg-blue-500 w-8' : 'bg-gray-600 w-1.5 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl blur-xl" />
            <div className="relative bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-purple-500/10 border border-blue-500/20 rounded-3xl p-8 text-center backdrop-blur-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Prêt à documenter vos templates ?</h2>
              <p className="text-gray-400 text-base mb-6">Commencez gratuitement avec 3 documentations par mois</p>
              <Link 
                href="/generate" 
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold px-8 py-3 rounded-xl hover:shadow-xl hover:shadow-blue-500/30 transition-all transform hover:scale-105"
              >
                <Zap className="w-5 h-5" />
                Documenter mon premier template
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
