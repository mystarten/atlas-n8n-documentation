'use client';

import { useState } from 'react';
import { Check, Zap, Sparkles, Code, Shield, TrendingUp, HelpCircle, Brain, Rocket, Layers, Star } from 'lucide-react';

const plans = [
  {
    name: 'Gratuit',
    subtitle: 'Pour tester',
    price: '0€',
    period: '/mois',
    badge: null,
    features: [
      '3 documentations / mois',
      'Notes et post-it n8n',
      'Watermark "Généré par ATLAS"',
      'Support email',
    ],
    cta: 'Commencer',
    priceId: null,
    popular: false,
    color: 'gray',
    icon: Layers,
  },
  {
    name: 'Starter',
    subtitle: 'Parfait pour démarrer',
    price: '9€',
    period: '/mois',
    badge: null,
    features: [
      '15 documentations / mois',
      'Notes et post-it n8n',
      'Export PDF',
      'Watermark "Généré par ATLAS"',
      'Support email',
    ],
    cta: "S'abonner",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER,
    popular: false,
    color: 'cyan',
    icon: Rocket,
  },
  {
    name: 'Pro',
    subtitle: 'Pour les professionnels exigeants',
    price: '19€',
    period: '/mois',
    badge: 'RECOMMANDÉ',
    features: [
      '40 documentations / mois',
      'Notes et post-it n8n',
      'Export PDF',
      'Sans watermark',
      'Support email',
    ],
    cta: "S'abonner",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
    popular: true,
    color: 'purple',
    icon: Brain,
  },
  {
    name: 'Enterprise',
    subtitle: 'La solution premium pour grandes entreprises',
    price: '49€',
    period: '/mois',
    badge: null,
    features: [
      '65 documentations / mois',
      'Notes et post-it n8n',
      'Export PDF',
      'Sans watermark',
      "Nom d'entreprise personnalisé",
      'Support prioritaire',
      '⚡ Propulsé par Claude Sonnet 4.5',
    ],
    cta: "S'abonner",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE,
    popular: false,
    color: 'gradient',
    icon: Sparkles,
  },
];

const comparisonFeatures = [
  { label: 'Documentations par mois', values: ['3', '15', '40', '65'] },
  { label: 'Modèle IA', values: ['Claude 3.5 Haiku', 'Claude 4', 'GPT-5', 'Claude Sonnet 4.5'] },
  { label: "Qualité de l'analyse", values: ['Très bonne', 'Professionnelle', 'Avancée', 'Excellence'] },
  { label: 'Vitesse de génération', values: ['Ultra-rapide', '2x plus rapide', 'Précise', 'Optimale'] },
  { label: 'Notes n8n', values: ['✓', '✓', '✓', '✓'] },
  { label: 'Export PDF', values: ['—', '✓', '✓', '✓'] },
  { label: 'Sans watermark', values: ['—', '—', '✓', '✓'] },
  { label: "Nom d'entreprise personnalisé", values: ['—', '—', '—', '✓'] },
  { label: 'Support', values: ['Email', 'Email', 'Email', 'Prioritaire'] },
];

const aiModels = [
  {
    icon: Layers,
    name: 'Claude 3.5 Haiku',
    tag: 'Gratuit',
    gradient: 'from-gray-400 via-slate-500 to-gray-600',
    title: 'Ultra-rapide',
    features: [
      'Très bonne qualité',
      'Parfait pour débuter',
    ],
  },
  {
    icon: Rocket,
    name: 'Claude 4',
    tag: 'Plan Starter',
    gradient: 'from-cyan-400 via-blue-500 to-cyan-600',
    title: '2x plus rapide sur Opus',
    features: [
      'Qualité professionnelle',
      'Excellent qualité/prix',
    ],
  },
  {
    icon: Brain,
    name: 'GPT-5',
    tag: 'Plan Pro',
    gradient: 'from-purple-400 via-pink-500 to-purple-600',
    title: 'Le modèle le plus avancé OpenAI',
    features: [
      'Compréhension parfaite des workflows ultra-complexes (1000+ nœuds)',
      'Génération la plus fiable du marché',
      'Gestion avancée des prompts',
      'Génération détaillée et ultra-précise',
      'Architecture optimisée pour code complexe',
    ],
  },
  {
    icon: Sparkles,
    name: 'Claude Sonnet 4.5',
    tag: 'Plan Enterprise',
    gradient: 'from-blue-400 via-cyan-500 to-blue-600',
    title: 'IA qui comprend le mieux le contexte Anthropic',
    features: [
      'Analyse technique - comprend intention derrière le code',
      'Gestion parfaite des workflows ultra-longs (2000+ lignes JSON)',
      'Recommandations architecture et best practices intégrées',
      'Documentation dense parfaite',
      'Excellent Thinking Mode pour prédiction maximale',
    ],
  },
];

const whyBestModels = [
  {
    icon: Shield,
    title: 'Connaissance approfondie',
    desc: 'Claude a appris des centaines exemples dans sa base - GPT a appris des centaines de milliers. Leurs prédictions sont 3-5x plus performantes.',
  },
  {
    icon: Code,
    title: 'Spécialisés code',
    desc: 'Contrairement aux autres IA standard, GPT-5 et Claude Sonnet spécialissent 70% de leur capacité sur le code, rends les logs erreurs plus faciles.',
  },
  {
    icon: TrendingUp,
    title: 'Précision garantie',
    desc: 'On a mesuré : les modèles standards se trompent 40% du temps. Claude et GPT se trompent moins de 5%. Une différence critique sur des architectures N8N.',
  },
];

const faqs = [
  {
    question: 'Puis-je changer de plan à tout moment ?',
    answer: 'Oui, vous pouvez upgrader ou downgrader votre plan à tout moment depuis votre espace client. Les changements prennent effet immédiatement.',
  },
  {
    question: "Y a-t-il des frais de configuration ?",
    answer: 'Non, aucun frais de configuration. Vous payez simplement votre abonnement mensuel.',
  },
  {
    question: "Que se passe-t-il si je dépasse ma limite mensuelle ?",
    answer: 'Vous pouvez upgrader votre plan à tout moment pour obtenir plus de documentations. Sinon, vous pourrez reprendre le mois suivant.',
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string | null, planName: string) => {
    if (!priceId) {
      window.location.href = '/login';
      return;
    }

    setLoading(planName);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Erreur:', data);
        alert('Erreur lors de la création de la session de paiement');
        setLoading(null);
      }
    } catch (error) {
      console.error('Erreur Stripe:', error);
      alert('Une erreur est survenue lors de la connexion au système de paiement');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1A1F3A] to-[#0A0E27] relative overflow-hidden">
      {/* Effets de lumière animés identiques à /generate */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-500/30 via-cyan-500/20 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/3 left-1/2 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1.5s' }} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header avec même style que /generate */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="block text-white mb-2">Choisissez votre plan</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Des tarifs simples et transparents pour tous les besoins
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative backdrop-blur-2xl rounded-3xl p-8 transition-all duration-300 hover:scale-105 flex flex-col ${
                  plan.popular
                    ? 'bg-gradient-to-br from-[#8b5cf6]/20 to-[#ec4899]/20 border-2 border-[#8b5cf6]/50 shadow-2xl shadow-purple-500/30'
                    : 'bg-[#0f172a]/80 border border-[#334155]'
                }`}
                style={{ minHeight: '580px' }}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg">
                    {plan.badge}
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    plan.color === 'gradient' ? 'bg-gradient-to-br from-[#8b5cf6] to-[#06b6d4]' :
                    plan.color === 'purple' ? 'bg-gradient-to-br from-[#8b5cf6] to-[#ec4899]' :
                    plan.color === 'cyan' ? 'bg-gradient-to-br from-[#06b6d4] to-[#3b82f6]' :
                    'bg-gradient-to-br from-[#64748b] to-[#475569]'
                  } shadow-lg`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-gray-400">{plan.subtitle}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 text-lg">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-auto">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className={`text-sm ${feature.includes('⚡') ? 'text-cyan-400 font-semibold' : 'text-gray-300'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.priceId || null, plan.name)}
                  disabled={loading === plan.name}
                  className={`w-full mt-6 py-3 px-6 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105'
                      : plan.color === 'gradient'
                      ? 'bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] text-white hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105'
                      : 'bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-white/20'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading === plan.name ? (
                    <span className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4 animate-spin" />
                      Chargement...
                    </span>
                  ) : (
                    plan.cta
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="bg-gradient-to-br from-[#0f172a]/80 to-[#1e293b]/80 backdrop-blur-2xl border border-[#334155] rounded-3xl p-8 mb-20 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Comparaison détaillée des plans
          </h2>
          <p className="text-gray-400 text-center mb-10">
            Trouvez le plan qui correspond à vos besoins
          </p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#334155]">
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">
                    Fonctionnalité
                  </th>
                  {plans.map((plan) => (
                    <th
                      key={plan.name}
                      className={`py-4 px-6 text-center font-bold ${
                        plan.popular ? 'text-[#8b5cf6]' : 'text-white'
                      }`}
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr
                    key={index}
                    className="border-b border-[#334155]/50 hover:bg-white/5 transition-all duration-200"
                  >
                    <td className="py-4 px-6 text-gray-300">{feature.label}</td>
                    {feature.values.map((value, i) => (
                      <td
                        key={i}
                        className={`py-4 px-6 text-center ${
                          value === '—' ? 'text-gray-600' : 'text-gray-300'
                        }`}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section AI Models */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <p className="text-blue-400 font-semibold mb-3 uppercase tracking-wider text-sm">
              Intelligence Artificielle
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Pourquoi les meilleurs modèles IA ?
            </h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Nous utilisons les modèles IA les plus performants du marché pour vous garantir une documentation technique de qualité supérieure
            </p>
          </div>

          {/* AI Models Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {aiModels.map((model, index) => {
              const IconComponent = model.icon;
              return (
                <div
                  key={index}
                  className="group relative"
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${model.gradient} rounded-3xl blur opacity-20 group-hover:opacity-40 transition-all duration-500`} />
                  
                  <div className="relative bg-[#0f172a]/90 backdrop-blur-2xl rounded-3xl p-8 border border-[#334155] group-hover:border-[#475569] transition-all duration-300 hover:transform hover:scale-[1.02]">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${model.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">
                            {model.name}
                          </h3>
                          <span className={`text-sm font-semibold bg-gradient-to-r ${model.gradient} bg-clip-text text-transparent`}>
                            {model.tag}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 font-semibold mb-4 text-lg">{model.title}</p>
                    <ul className="space-y-2">
                      {model.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                          <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Why Best Models */}
          <div className="bg-gradient-to-br from-[#0f172a]/80 to-[#1e293b]/80 backdrop-blur-2xl border border-[#334155] rounded-3xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              Pourquoi ces modèles surpassent les IA standard ?
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {whyBestModels.map((item, index) => (
                <div key={index} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-2xl group-hover:shadow-cyan-500/30 transition-all duration-300">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Note */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6 text-center backdrop-blur-xl">
            <p className="text-white font-semibold text-lg flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Tous les plans garantissent une qualité professionnelle.
            </p>
            <p className="text-gray-400">
              Les modèles supérieurs permettent une compréhension contextuelle accrue de vos workflows complexes.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Questions fréquentes</h2>
          </div>
          <div className="space-y-4 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="group bg-[#0f172a]/80 backdrop-blur-2xl border border-[#334155] rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-[1.02]"
              >
                <div className="flex items-start gap-4">
                  <HelpCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1 group-hover:text-cyan-400 transition-colors" />
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">{faq.question}</h4>
                    <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-400 flex items-center justify-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Toutes les offres incluent une garantie satisfait ou remboursé de 14 jours
          </p>
        </div>
      </div>
    </div>
  );
}
