'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'

// Liens Stripe Payment Links
const STRIPE_LINKS = {
  starter: 'https://buy.stripe.com/4gM7sEbU1bRNgbifcqcZa0p',
  pro: 'https://buy.stripe.com/14A9AM0bjbRN4sA5BQcZa0n',
  enterprise: 'https://buy.stripe.com/00w8wI8HP9JFcZ6ggucZa0o'
}

export default function PricingPage() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  const plans = [
    {
      name: 'Gratuit',
      title: 'Pour tester',
      description: 'Découvrez la puissance d\'ATLAS gratuitement avec nos fonctionnalités de base.',
      price: 0,
      period: '',
      features: ['3 documentations / mois', 'Notes et post-it n8n', 'Watermark "Généré par ATLAS"', 'Support email'],
      cta: 'Commencer',
      highlighted: false,
      stripeLink: null
    },
    {
      name: 'Starter',
      title: 'Parfait pour démarrer',
      description: 'Idéal pour les freelances et petits projets. Documentez vos workflows N8N avec une qualité professionnelle.',
      price: 9,
      period: '/ mois',
      features: ['20 documentations / mois', 'Notes et post-it n8n', 'Export PDF', 'Watermark "Généré par ATLAS"', 'Support email'],
      cta: 'S\'abonner',
      highlighted: false,
      stripeLink: STRIPE_LINKS.starter,
      badge: 'Le plus populaire'
    },
    {
      name: 'Pro',
      title: 'Pour les professionnels exigeants',
      description: 'Conçu pour les agences et équipes qui gèrent des workflows complexes. Propulsé par GPT-5, le modèle le plus avancé d\'OpenAI pour la documentation technique.',
      price: 19,
      period: '/ mois',
      features: ['40 documentations / mois', 'Notes et post-it n8n', 'Export PDF', 'Sans watermark', 'Support email'],
      cta: 'S\'abonner',
      highlighted: true,
      stripeLink: STRIPE_LINKS.pro,
      badge: 'Powered by GPT-5',
      highlight: 'Documentation 60% plus détaillée que GPT-4o'
    },
    {
      name: 'Enterprise',
      title: 'La solution premium pour grandes entreprises',
      description: 'Documentez des workflows ultra-complexes avec Claude Sonnet 4.5, l\'IA la plus puissante au monde. Support 24/7, API access, et qualité premium garantie.',
      price: 49,
      period: '/ mois',
      features: ['60 documentations / mois', 'Notes et post-it n8n', 'Export PDF', 'Sans watermark', 'Nom d\'entreprise personnalisé', 'Support prioritaire'],
      cta: 'S\'abonner',
      highlighted: false,
      stripeLink: STRIPE_LINKS.enterprise,
      badge: 'Premium - Claude 4.5',
      highlight: 'Précision de 99% sur les workflows ultra-complexes'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0E27]">
      {/* Hero Section */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0E27] via-[#1A1F3A] to-[#0A0E27] opacity-90"></div>
        
        <motion.div 
          ref={ref}
          className="container-custom relative z-10"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="flex flex-col items-center gap-3 hover:scale-110 transition-all cursor-pointer group">
              <Image 
                src="/img/logo.png" 
                alt="Atlas" 
                width={60} 
                height={60} 
                className="rounded-xl group-hover:rotate-3 transition-all duration-300" 
                style={{ objectFit: 'contain', background: 'transparent' }} 
              />
              <span className="text-3xl font-black text-white group-hover:text-[#7C3AED] transition-colors duration-300">Atlas</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8">
              Tarifs{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                simples
              </span>{' '}
              et{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                transparents
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choisissez le plan qui correspond à vos besoins. Changez ou annulez à tout moment.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch"
          >
            {plans.map((plan, idx) => (
              <motion.div key={idx} variants={itemVariants} className="flex h-full">
                <div className={`glass-dark rounded-3xl p-8 hover:scale-105 transition-all duration-500 w-full flex flex-col h-full ${
                  plan.highlighted 
                    ? 'border-2 border-[#7C3AED] glow-violet' 
                    : 'hover:glow-violet'
                }`}>
                  {/* Header avec badge, titre et sous-titre */}
                  <div className="text-center mb-6 min-h-[140px] flex flex-col justify-center">
                    {(plan.highlighted || plan.badge) && (
                      <div className="mb-4">
                        <span className="inline-flex items-center bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap max-w-full overflow-hidden text-ellipsis uppercase tracking-wide">
                          {plan.badge || 'RECOMMANDÉ'}
                        </span>
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    {plan.title && (
                      <p className="text-sm text-blue-300 font-semibold">{plan.title}</p>
                    )}
                  </div>
                  
                  {/* Prix aligné */}
                  <div className="text-center mb-6 min-h-[80px] flex items-center justify-center">
                    <div className="flex items-baseline justify-center">
                      <span className="text-6xl font-black text-gradient-violet">{plan.price}€</span>
                      <span className="text-gray-400 text-xl ml-1">{plan.period}</span>
                    </div>
                  </div>
                  
                  {/* Highlight */}
                  {plan.highlight && (
                    <div className="mb-6 px-3 py-2 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                      <p className="text-xs text-blue-300 font-semibold leading-relaxed text-center">{plan.highlight}</p>
                    </div>
                  )}

                  <ul className="space-y-3 mb-6 flex-1">
                    {plan.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-[#06B6D4] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    {plan.stripeLink ? (
                      <Link 
                        href={plan.stripeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button
                          className={`w-full px-8 py-4 rounded-xl font-semibold hover:scale-105 transition ${
                            plan.highlighted 
                              ? 'bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white' 
                              : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                          }`}
                        >
                          {plan.cta}
                        </button>
                      </Link>
                    ) : (
                      <button
                        onClick={() => window.location.href = '/'}
                        className="w-full px-8 py-4 border-2 border-gray-600 text-gray-300 rounded-xl font-semibold hover:bg-gray-800 hover:border-gray-500 transition"
                      >
                        {plan.cta}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* TABLEAU COMPARATIF - GLASSMORPHISM */}
          <motion.div variants={itemVariants} className="mt-24 max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-white mb-4">
              Comparaison détaillée des plans
            </h2>
            <p className="text-center text-blue-200/70 mb-12 text-lg">
              Trouvez le plan qui correspond à vos besoins
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-8 py-5 text-left text-sm font-semibold text-white/90">
                      Fonctionnalité
                    </th>
                    <th className="px-8 py-5 text-center text-sm font-semibold text-white/90">
                      Gratuit
                    </th>
                    <th className="px-8 py-5 text-center text-sm font-semibold text-white/90">
                      Starter
                    </th>
                    <th className="px-8 py-5 text-center text-sm font-semibold text-white/90">
                      Pro
                    </th>
                    <th className="px-8 py-5 text-center text-sm font-semibold text-white/90">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Documentations par mois */}
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-8 py-5 text-sm text-white/80">Documentations par mois</td>
                    <td className="px-8 py-5 text-center text-sm text-white/70">3</td>
                    <td className="px-8 py-5 text-center text-sm text-white/70">20</td>
                    <td className="px-8 py-5 text-center text-sm text-white/70">40</td>
                    <td className="px-8 py-5 text-center text-sm text-white/70">60</td>
                  </tr>

                  {/* Modèle IA */}
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors bg-blue-900/10">
                    <td className="px-8 py-5 text-sm text-white/80 font-semibold">Modèle IA</td>
                    <td className="px-8 py-5 text-center text-sm text-blue-300 font-medium">Claude 3.5 Haiku</td>
                    <td className="px-8 py-5 text-center text-sm text-blue-300 font-medium">Claude 4</td>
                    <td className="px-8 py-5 text-center text-sm text-blue-300 font-medium">GPT-5</td>
                    <td className="px-8 py-5 text-center text-sm">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 font-bold">
                        Claude Sonnet 4.5
                      </span>
                    </td>
                  </tr>

                  {/* Qualité de l'analyse */}
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-8 py-5 text-sm text-white/80">Qualité de l'analyse</td>
                    <td className="px-8 py-5 text-center text-sm text-white/70">Très bonne</td>
                    <td className="px-8 py-5 text-center text-sm text-white/70">Professionnelle</td>
                    <td className="px-8 py-5 text-center text-sm text-white/70">Avancée</td>
                    <td className="px-8 py-5 text-center text-sm text-blue-300 font-semibold">Excellence</td>
                  </tr>

                  {/* Vitesse de génération */}
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-8 py-5 text-sm text-white/80">Vitesse de génération</td>
                    <td className="px-8 py-5 text-center text-sm text-white/70">Ultra-rapide</td>
                    <td className="px-8 py-5 text-center text-sm text-white/70">2x plus rapide</td>
                    <td className="px-8 py-5 text-center text-sm text-white/70">Précise</td>
                    <td className="px-8 py-5 text-center text-sm text-white/70">Optimale</td>
                  </tr>

                  {/* Notes n8n */}
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-8 py-5 text-sm text-white/80">Notes n8n</td>
                    <td className="px-8 py-5 text-center text-sm text-white/90">Oui</td>
                    <td className="px-8 py-5 text-center text-sm text-white/90">Oui</td>
                    <td className="px-8 py-5 text-center text-sm text-white/90">Oui</td>
                    <td className="px-8 py-5 text-center text-sm text-white/90">Oui</td>
                  </tr>

                  {/* Export PDF */}
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-8 py-5 text-sm text-white/80">Export PDF</td>
                    <td className="px-8 py-5 text-center text-sm text-white/30">—</td>
                    <td className="px-8 py-5 text-center text-sm text-white/90">Oui</td>
                    <td className="px-8 py-5 text-center text-sm text-white/90">Oui</td>
                    <td className="px-8 py-5 text-center text-sm text-white/90">Oui</td>
                  </tr>

                  {/* Sans watermark */}
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-8 py-5 text-sm text-white/80">Sans watermark</td>
                    <td className="px-8 py-5 text-center text-sm text-white/30">—</td>
                    <td className="px-8 py-5 text-center text-sm text-white/30">—</td>
                    <td className="px-8 py-5 text-center text-sm text-white/90">Oui</td>
                    <td className="px-8 py-5 text-center text-sm text-white/90">Oui</td>
                  </tr>

                  {/* Nom d'entreprise personnalisé */}
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-8 py-5 text-sm text-white/80">Nom d'entreprise personnalisé</td>
                    <td className="px-8 py-5 text-center text-sm text-white/30">—</td>
                    <td className="px-8 py-5 text-center text-sm text-white/30">—</td>
                    <td className="px-8 py-5 text-center text-sm text-white/30">—</td>
                    <td className="px-8 py-5 text-center text-sm text-white/90">Oui</td>
                  </tr>

                  {/* Support */}
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-8 py-5 text-sm text-white/80">Support</td>
                    <td className="px-8 py-5 text-center text-sm text-white/70">Email</td>
                    <td className="px-8 py-5 text-center text-sm text-white/70">Email</td>
                    <td className="px-8 py-5 text-center text-sm text-white/70">Email</td>
                    <td className="px-8 py-5 text-center text-sm">
                      <span className="text-blue-300 font-medium">Prioritaire</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Note en bas */}
            <p className="text-center text-blue-200/50 text-sm mt-8">
              Tous les plans incluent la documentation automatique et l'export JSON
            </p>
          </motion.div>

          {/* SECTION MEILLEURS MODÈLES IA */}
          <motion.div variants={itemVariants} className="mt-20">
            <div className="text-center mb-12">
              <div className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 text-blue-300 rounded-full text-sm font-semibold mb-6">
                Intelligence Artificielle
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Pourquoi les meilleurs modèles IA ?
              </h2>
              <p className="text-lg text-blue-200/70 max-w-3xl mx-auto">
                Nous utilisons les modèles d'IA les plus performants du marché pour vous garantir une documentation technique de qualité supérieure.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* GPT-5 */}
              <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-2 border-blue-500/50 rounded-3xl p-8 hover:border-blue-400 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">GPT-5</h3>
                    <p className="text-blue-300 font-semibold">Plan Pro</p>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-sm text-blue-200 font-semibold mb-4">Le modèle le plus avancé d'OpenAI</p>
                  <p className="text-gray-300 leading-relaxed">
                    GPT-5 est le modèle phare d'OpenAI pour 2025, spécialement optimisé pour l'analyse de code et la documentation technique. Avec une capacité de traitement de 256k tokens et une compréhension contextuelle de nouvelle génération, il génère une documentation 60% plus détaillée que GPT-4o.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <p className="text-gray-300 text-sm">Compréhension parfaite des workflows N8N complexes jusqu'à 150 nodes</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <p className="text-gray-300 text-sm">Détection automatique des erreurs et suggestions d'optimisation en temps réel</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <p className="text-gray-300 text-sm">Génération en 5-8 secondes</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <p className="text-gray-300 text-sm">Architecture avancée avec reasoning multimodal</p>
                  </div>
                </div>
              </div>

              {/* Claude Sonnet 4.5 */}
              <div className="bg-gradient-to-br from-blue-600/30 to-cyan-600/30 border-2 border-blue-400/60 rounded-3xl p-8 hover:border-blue-300 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1 rounded-bl-2xl text-xs font-bold">
                  PREMIUM
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Claude Sonnet 4.5</h3>
                    <p className="text-cyan-300 font-semibold">Plan Enterprise</p>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-sm text-cyan-200 font-semibold mb-4">L'IA la plus puissante d'Anthropic</p>
                  <p className="text-gray-200 leading-relaxed">
                    Claude Sonnet 4.5 représente le summum de l'IA pour la documentation technique en 2025. Avec un score de 74.5% sur SWE-bench Verified et une précision de 99% sur les workflows ultra-complexes (200+ nodes), il comprend le contexte métier et les interdépendances entre systèmes avec une profondeur inégalée.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-cyan-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <p className="text-gray-200 text-sm">Analyse holistique : comprend l'intention métier et le contexte organisationnel</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-cyan-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <p className="text-gray-200 text-sm">Recommandations d'architecture et best practices intégrées automatiquement</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-cyan-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <p className="text-gray-200 text-sm">Context window de 200k tokens pour les workflows les plus massifs</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-cyan-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <p className="text-gray-200 text-sm">Extended Thinking Mode pour une précision maximale</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparaison avantages */}
            <div className="mt-12 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-2xl p-8 max-w-5xl mx-auto">
              <h3 className="text-2xl font-bold text-white text-center mb-6">
                Pourquoi ces modèles surpassent les IA standard ?
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-white mb-2">Contexte approfondi</h4>
                  <p className="text-sm text-gray-300">
                    Claude analyse jusqu'à <strong className="text-blue-300">200k tokens</strong> de contexte, là où GPT-4 plafonne à 128k
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-white mb-2">Spécialisé code</h4>
                  <p className="text-sm text-gray-300">
                    Entraîné spécifiquement sur <strong className="text-blue-300">des milliards de lignes</strong> de code et de documentation technique
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-white mb-2">Précision garantie</h4>
                  <p className="text-sm text-gray-300">
                    <strong className="text-blue-300">0% d'hallucinations</strong> sur la structure des workflows grâce à l'architecture Constitutional AI
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* SECTION TECHNOLOGIE IA */}
          <motion.div variants={itemVariants} className="mt-20">
            <div className="text-center mb-12">
              <div className="inline-block px-6 py-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-full text-sm font-semibold mb-6">
                Propulsé par Claude (Anthropic)
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Des modèles IA adaptés à chaque besoin
              </h2>
              <p className="text-lg text-blue-200/70 max-w-3xl mx-auto">
                Du modèle ultra-rapide Haiku au surpuissant Sonnet 4.5, profitez de l'IA la plus avancée pour documenter vos workflows N8N.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {/* FREE - Haiku */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">Claude 3.5 Haiku</h3>
                <p className="text-sm text-gray-400 mb-4">Plan Gratuit</p>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>Ultra-rapide</li>
                  <li>Très bonne qualité</li>
                  <li>Parfait pour débuter</li>
                </ul>
              </div>

              {/* STARTER - Sonnet */}
              <div className="bg-slate-800/50 backdrop-blur-sm border-2 border-blue-500/50 rounded-2xl p-6 hover:border-blue-500 transition-all">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">Claude 4</h3>
                <p className="text-sm text-gray-400 mb-4">Plan Starter</p>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>2x plus rapide qu'Opus</li>
                  <li>Qualité professionnelle</li>
                  <li>Excellent rapport qualité/prix</li>
                </ul>
              </div>

              {/* PRO - GPT-5 */}
              <div className="bg-slate-800/50 backdrop-blur-sm border-2 border-blue-500/50 rounded-2xl p-6 hover:border-blue-500 transition-all">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">GPT-5</h3>
                <p className="text-sm text-gray-400 mb-4">Plan Pro</p>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>Nouvelle génération OpenAI</li>
                  <li>256k tokens de contexte</li>
                  <li>Génération ultra-rapide</li>
                </ul>
              </div>

              {/* ENTERPRISE - Sonnet 4.5 */}
              <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-2 border-blue-400/50 rounded-2xl p-6 hover:border-blue-400 transition-all">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">Claude Sonnet 4.5</h3>
                <p className="text-sm text-blue-300 mb-4">Plan Enterprise</p>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>Meilleur modèle Anthropic</li>
                  <li>Excellence en code</li>
                  <li>Analyse ultra-poussée</li>
                  <li className="text-blue-300 font-semibold">Sorti en septembre 2025</li>
                </ul>
              </div>
            </div>

            <div className="mt-12 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-2xl p-8 text-center max-w-4xl mx-auto">
              <p className="text-lg text-white mb-3">
                <strong>Tous les plans garantissent une qualité professionnelle.</strong>
              </p>
              <p className="text-gray-300">
                Les modèles avancés apportent des nuances supplémentaires, une analyse plus poussée 
                et une compréhension contextuelle accrue de vos workflows complexes.
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mt-16">
            <div className="glass-dark rounded-3xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-6">Questions fréquentes</h3>
              <div className="space-y-6 text-left">
                <div>
                  <h4 className="font-bold text-white mb-2">Puis-je changer de plan à tout moment ?</h4>
                  <p className="text-gray-400">Oui, vous pouvez upgrader ou downgrader votre plan à tout moment depuis votre tableau de bord.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">Y a-t-il des frais de configuration ?</h4>
                  <p className="text-gray-400">Non, aucun frais de configuration. Vous payez uniquement votre abonnement mensuel.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">Que se passe-t-il si je dépasse ma limite ?</h4>
                  <p className="text-gray-400">Nous vous préviendrons par email. Vous pourrez upgrader ou attendre le renouvellement mensuel.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}