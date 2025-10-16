'use client'

import { useState } from 'react'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "Comment fonctionne ATLAS ?",
      answer: "ATLAS analyse automatiquement votre workflow N8N grâce à l'IA Claude Sonnet 4.5. Il décortique chaque nœud, comprend la logique, et génère une documentation complète en moins de 2 minutes. Vous recevez soit un PDF professionnel, soit des notes intégrées directement dans votre workflow."
    },
    {
      question: "Quels modèles IA utilisez-vous ?",
      answer: "Nous utilisons les derniers modèles Claude d'Anthropic adaptés à chaque plan : Claude 3.5 Haiku (Free), Claude 4 (Starter), Claude Opus 4.1 (Pro), et Claude Sonnet 4.5 (Enterprise). Tous garantissent une qualité professionnelle, les modèles supérieurs apportant plus de nuances et de profondeur d'analyse."
    },
    {
      question: "Puis-je essayer gratuitement ?",
      answer: "Oui ! Le plan Free vous offre 3 générations de documentation par mois avec Claude 3.5 Haiku. C'est idéal pour tester la qualité et voir si ATLAS répond à vos besoins. Aucune carte bancaire requise."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Absolument. Vos workflows ne sont jamais stockés après la génération. Nous utilisons un chiffrement SSL de bout en bout et les données transitent uniquement entre votre navigateur et l'API Claude (certifiée SOC 2). Vos templates générés sont stockés de manière sécurisée sur Supabase."
    },
    {
      question: "Quelle est la différence entre PDF et Notes N8N ?",
      answer: "Le PDF est un document complet et professionnel, idéal pour partager ou archiver. Les notes N8N sont des post-it intégrés directement dans votre workflow, parfaits pour une utilisation quotidienne. Vous choisissez le format à chaque génération."
    },
    {
      question: "Puis-je personnaliser la documentation ?",
      answer: "Oui ! Vous pouvez ajouter des notes contextuelles avant la génération pour guider l'IA. Les utilisateurs Enterprise peuvent également personnaliser le branding avec leur nom d'entreprise à la place d'ATLAS."
    },
    {
      question: "Que se passe-t-il si j'atteins ma limite ?",
      answer: "Vous recevez une notification quand vous approchez de la limite. Une fois atteinte, vous pouvez soit attendre le mois prochain (les limites se réinitialisent), soit upgrader vers un plan supérieur. Le plan Enterprise offre des générations illimitées."
    },
    {
      question: "Puis-je annuler à tout moment ?",
      answer: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre compte. Il reste actif jusqu'à la fin de la période payée, puis repasse automatiquement en plan Free. Aucun engagement, aucune question posée."
    },
    {
      question: "Supportez-vous d'autres outils que N8N ?",
      answer: "Actuellement, ATLAS est spécialisé dans N8N pour offrir la meilleure qualité possible. Nous étudions l'ajout de Make.com et Zapier selon la demande. Rejoignez notre communauté Discord pour voter pour les prochaines intégrations !"
    },
    {
      question: "Comment contacter le support ?",
      answer: "Vous pouvez nous contacter via support@atlasbuilder.app ou rejoindre notre Discord pour une réponse rapide. Les utilisateurs Pro et Enterprise bénéficient d'un support prioritaire avec réponse sous 24h."
    }
  ]

  return (
    <section className="section-padding relative bg-[#1A1F3A]/50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full border border-blue-500/30 mb-6">
            <span className="text-blue-400 text-sm font-medium">💬 Questions fréquentes</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Questions fréquentes
            </span>
          </h2>
          
          <p className="text-xl text-gray-400">
            Tout ce que vous devez savoir sur ATLAS
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50 overflow-hidden hover:border-blue-500/50 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors"
              >
                <span className="text-lg font-semibold text-white pr-8">
                  {faq.question}
                </span>
                <svg
                  className={`w-6 h-6 text-blue-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5 text-gray-300 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-6">
            Vous avez une autre question ?
          </p>
          <a
            href="mailto:support@atlasbuilder.app"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contactez-nous
          </a>
        </div>
      </div>
    </section>
  )
}

